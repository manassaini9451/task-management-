const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Complete'], default: 'Pending' },
  dueDate: { type: Date },
  file: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
