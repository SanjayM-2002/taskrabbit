const express = require('express');
const {
  signUpUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  searchUser,
  updateUser,
} = require('../controllers/userController');
const { protectRoute } = require('../middlewares/protectRoute');

const router = express.Router();

router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update/:id', protectRoute, updateUser);

module.exports = router;
