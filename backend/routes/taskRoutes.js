const express = require('express');

const {
  createTask,
  getTask,
  getUserTasks,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();
router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});

router.post('/create', protectRoute, createTask);
router.get('/getPostById/:id', protectRoute, getTask);
router.delete('/:id', protectRoute, deleteTask);
router.get('/user/:email', getUserTasks);

module.exports = router;
