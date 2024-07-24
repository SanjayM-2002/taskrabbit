const z = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { mongoose } = require('mongoose');
const { User } = require('../models/userModel');
const {
  generateTokenAndSetCookie,
} = require('../utils/generateTokenAndSetCookie');

const signupSchema = z.object({
  fullname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const saltRounds = parseInt(process.env.SALTROUNDS);
const jwtSecret = process.env.JWT_SECRET;

const signUpUser = async (req, res) => {
  try {
    const inputData = req.body;
    const zodResponse = signupSchema.safeParse(inputData);
    const dataResponse = zodResponse.data;
    if (!zodResponse.success) {
      res.status(401).json({ error: zodResponse.error });
      return;
    }
    const email = dataResponse.email;

    const user = await User.findOne({ email });

    if (user) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dataResponse.password, salt);
    const newUser = new User({
      fullname: dataResponse.fullname,
      email: dataResponse.email,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        message: 'Signed up successfully',
        userDetails: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          bio: newUser.bio || '',
          profilePic: newUser.profilePic || '',
        },
      });
      console.log('Successfully signed up');
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in signup user ', err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const inputData = req.body;
    const zodResponse = loginSchema.safeParse(inputData);
    const dataResponse = zodResponse.data;
    if (!zodResponse.success) {
      res.status(401).json({ error: zodResponse.error });
      return;
    }
    const email = dataResponse.email;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email');
      return res.status(400).json({ error: 'Invalid email' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      dataResponse.password,
      user.password
    );

    if (!isPasswordCorrect) {
      console.log('Invalid password');
      return res.status(400).json({ error: 'Invalid password' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      message: 'Logged in successfully',
      userDetails: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        bio: user.bio || '',
        profilePic: user.profilePic || '',
      },
    });
    console.log('Logged in successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in login user', err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logged out successfully' });
    console.log('Logged out successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in logout', err.message);
  }
};

const updateUser = async (req, res) => {
  const { bio } = req.body;
  let { profilePic } = req.body;
  console.log('user object obtained from middleware is: ', req.user);
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      console.log('Invalid user');
      return res.status(400).json({ error: 'Invalid user' });
    }

    if (req.params.id !== userId.toString()) {
      console.log('You cannot update other profile');
      return res.status(400).json({ error: 'You cannot update other profile' });
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse?.secure_url || '';
    }

    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    res.status(200).json(user);
    console.log('Profile updated successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in updating user-profile', err.message);
  }
};

module.exports = {
  signUpUser,
  loginUser,
  logoutUser,
  updateUser,
};
