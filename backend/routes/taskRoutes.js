const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} = require('../controllers/taskController');

router.get('/', protect, getTasks);
router.post('/', protect, upload.single('file'), createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/status', protect, toggleTaskStatus);

module.exports = router;
