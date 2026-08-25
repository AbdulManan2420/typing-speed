const User = require('../models/User');
const Result = require('../models/Result');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const recentResults = await Result.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('users/dashboard', {
      title: 'Dashboard',
      user,
      results: recentResults
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};