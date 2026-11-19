const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    await ActivityLog.create({ user: user._id, action: 'register', ip: req.ip });
    res.status(201).json({
      token: sign(user._id),
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    await ActivityLog.create({ user: user._id, action: 'login', ip: req.ip });
    res.json({
      token: sign(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) { next(e); }
};

exports.me = async (req, res) => res.json(req.user);
