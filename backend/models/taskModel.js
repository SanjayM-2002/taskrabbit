import mongoose, { Schema } from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      maxLength: 50,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
