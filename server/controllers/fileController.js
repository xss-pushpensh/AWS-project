const fs = require('fs');
const File = require('../models/File');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { canAccess } = require('../utils/access');

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findById(req.user._id);
    if (user.storageUsed + req.file.size > user.storageLimit) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ message: 'Storage quota exceeded' });
    }
    const file = await File.create({
      owner: user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
    user.storageUsed += req.file.size;
    await user.save();
    await ActivityLog.create({ user: user._id, action: 'upload', file: file._id, ip: req.ip });
    res.status(201).json(file);
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    const own = await File.find({ owner: req.user._id }).sort('-createdAt');
    const shared = await File.find({ 'sharedWith.user': req.user._id }).sort('-createdAt');
    res.json({ own, shared });
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    if (!canAccess(file, req.user._id))
      return res.status(403).json({ message: 'Access denied' });
    res.json(file);
  } catch (e) { next(e); }
};

exports.download = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    if (!canAccess(file, req.user._id))
      return res.status(403).json({ message: 'Access denied' });
    await ActivityLog.create({ user: req.user._id, action: 'download', file: file._id, ip: req.ip });
    res.download(file.path, file.originalName);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    if (!file.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Owner only' });

    try { fs.unlinkSync(file.path); } catch {}
    await User.findByIdAndUpdate(file.owner, { $inc: { storageUsed: -file.size } });
    await file.deleteOne();
    await ActivityLog.create({ user: req.user._id, action: 'delete', ip: req.ip });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};

exports.share = async (req, res, next) => {
  try {
    const { userIds = [], permission = 'view' } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    if (!file.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Owner only' });

    for (const uid of userIds) {
      if (uid === req.user._id.toString()) continue;
      if (!file.sharedWith.some(s => s.user.equals(uid)))
        file.sharedWith.push({ user: uid, permission });
    }
    await file.save();
    await ActivityLog.create({
      user: req.user._id, action: 'share', file: file._id,
      meta: { sharedWith: userIds, permission }, ip: req.ip,
    });
    res.json(file);
  } catch (e) { next(e); }
};

exports.revoke = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    if (!file.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Owner only' });
    file.sharedWith = file.sharedWith.filter(s => !s.user.equals(req.params.userId));
    await file.save();
    await ActivityLog.create({ user: req.user._id, action: 'revoke', file: file._id, ip: req.ip });
    res.json(file);
  } catch (e) { next(e); }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email').limit(50);
    res.json(users);
  } catch (e) { next(e); }
};
