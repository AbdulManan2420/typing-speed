import User from '../models/User.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user typing stats
export const updateTypingStats = async (req, res) => {
  try {
    const { wpm, accuracy } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update stats
    user.typingStats.testsTaken += 1;
    
    if (wpm > user.typingStats.highestWpm) {
      user.typingStats.highestWpm = wpm;
    }
    
    // Calculate new average accuracy
    const totalAccuracy = user.typingStats.averageAccuracy * (user.typingStats.testsTaken - 1);
    user.typingStats.averageAccuracy = (totalAccuracy + accuracy) / user.typingStats.testsTaken;

    await user.save();
    res.json(user.typingStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};