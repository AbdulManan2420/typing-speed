const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  consistency: {
    type: Number,
    required: true
  },
  correctChars: {
    type: Number,
    required: true
  },
  incorrectChars: {
    type: Number,
    required: true
  },
  extraChars: {
    type: Number,
    required: true
  },
  missedChars: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    enum: ['time', 'words', 'quotes', 'custom'],
    required: true
  },
  timeLimit: {
    type: Number,
    required: function() { return this.mode === 'time'; }
  },
  wordCount: {
    type: Number,
    required: function() { return this.mode === 'words'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);