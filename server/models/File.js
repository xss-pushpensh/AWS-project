const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
  path: { type: String },
  isPublic: { type: Boolean, default: false },
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'download'], default: 'view' },
    sharedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
