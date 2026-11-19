exports.canAccess = (file, userId) =>
  file.owner.equals(userId) ||
  file.isPublic ||
  file.sharedWith.some(s => s.user.equals(userId));
