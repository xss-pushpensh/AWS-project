const User = require('../models/User');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');

exports.users = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (e) { next(e); }
};

exports.logs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email')
      .populate('file', 'originalName')
      .sort('-createdAt').limit(200);
    res.json(logs);
  } catch (e) { next(e); }
};

exports.stats = async (req, res, next) => {
  try {
    const [userCount, fileCount, totalBytes] = await Promise.all([
      User.countDocuments(),
      File.countDocuments(),
      File.aggregate([{ $group: { _id: null, total: { $sum: '$size' } } }]),
    ]);
    res.json({
      userCount,
      fileCount,
      totalBytes: totalBytes[0]?.total || 0,
    });
  } catch (e) { next(e); }
};

exports.toggleRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json(user);
  } catch (e) { next(e); }
};
