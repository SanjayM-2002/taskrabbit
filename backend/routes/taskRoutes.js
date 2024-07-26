const express = require('express');

const {
  createTask,
  getTask,
  getUserTasks,
  deleteTask,
  updateTask,
} = require('../controllers/taskController');
const { protectRoute } = require('../middlewares/protectRoute');

const router = express.Router();
router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});

router.post('/create', protectRoute, createTask);
router.get('/getTaskById/:id', protectRoute, getTask);
router.delete('/delete/:id', protectRoute, deleteTask);
router.get('/userTasks', protectRoute, getUserTasks);
router.put('/update/:id', protectRoute, updateTask);
module.exports = router;
