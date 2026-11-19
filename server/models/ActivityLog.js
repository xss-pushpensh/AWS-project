const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['upload','download','delete','share','revoke','login','register'], required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  meta: { type: Object },
  ip: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('ActivityLog', logSchema);
