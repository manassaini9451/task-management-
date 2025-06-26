const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { search = '', status, priority } = req.query;

  const query = {
    user: req.user._id,
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};

exports.toggleTaskStatus = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = task.status === 'Pending' ? 'Complete' : 'Pending';
  await task.save();
  res.json(task);
};
