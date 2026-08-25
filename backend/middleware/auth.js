const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect('/auth/login');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).redirect('/auth/login');
  }
};