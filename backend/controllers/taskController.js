const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 5, search = '', priority, status } = req.query;

  const query = {
    user: req.user._id,
    $or: [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ]
  };
  if (priority) query.priority = priority;
  if (status) query.status = status;

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.json({ tasks, total });
};

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    user: req.user._id
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
