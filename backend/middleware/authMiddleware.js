const jwt = require('jsonwebtoken');
const User = require('../models/user'); // ✅ File must be named `user.js`

const protect = async (req, res, next) => {
  let token;

  try {
    token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
