const Result = require('../models/Result');

exports.saveResult = async (req, res) => {
  try {
    const {
      wpm,
      accuracy,
      consistency,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars,
      mode,
      timeLimit,
      wordCount
    } = req.body;

    const result = new Result({
      user: req.user.id,
      wpm,
      accuracy,
      consistency,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars,
      mode,
      timeLimit,
      wordCount
    });

    await result.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.render('results/history', { 
      title: 'Your Results', 
      results 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};