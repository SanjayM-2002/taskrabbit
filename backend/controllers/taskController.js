const { Task } = require('../models/taskModel');
const { User } = require('../models/userModel');

const cloudinary = require('cloudinary').v2;

const createTask = async (req, res) => {
  try {
    const { postedBy, text, title } = req.body;

    if (!postedBy || !text || !title) {
      return res
        .status(400)
        .json({ error: 'PostedBy, Title and Text fields are required' });
    }
    const user = await User.findById(postedBy);
    console.log('User data from middleware is: ', req.user._id.toString());
    console.log('User data extracted from postedBy is: ', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized to create post' });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    const newTask = new Task({
      postedBy,
      text,
      title,
    });
    await newTask.save();
    console.log('New post created successfully');
    console.log('New post is: ', newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      console.log('Post does not exist');
      return res.status(400).json({ error: 'Post does not exist' });
    }

    console.log('Post found');
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log('Post id from req params is: ', taskId);
    const post = await Task.findById(taskId);

    if (!post) {
      console.log('Post not found');
      return res.status(400).json({ error: 'Post not found' });
    }

    console.log('Data from middleware: ', req.user);

    if (post.postedBy.toString() !== req.user._id.toString()) {
      console.log('You cant delete post created by others');
      return res
        .status(401)
        .json({ error: 'You cant delete post created by others' });
    }

    await Task.findByIdAndDelete(post);

    console.log('Ta deleted successfully');
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in deleting post', err.message);
  }
};

const getUserTasks = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Task.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    console.log('No error');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in creating post', err.message);
  }
};

module.exports = {
  createTask,
  getTask,
  deleteTask,
  getUserTasks,
};
