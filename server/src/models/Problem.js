import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  question_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  problem_description: {
    type: String,
    required: true
  },
  starter_code: {
    type: String,
    required: true
  },
  estimated_date: {
    type: String
  },
  prompt: {
    type: String,
    required: true
  },
  completion: {
    type: String,
    required: true
  },
  entry_point: {
    type: String,
    required: true
  },
  test: {
    type: String,
    required: true
  },
  input_output: [{
    input: String,
    output: String
  }],
  query: {
    type: String
  },
  response: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
problemSchema.index({ difficulty: 1, question_id: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ task_id: 'text', problem_description: 'text' });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
