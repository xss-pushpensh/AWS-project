const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/users', ctrl.users);
router.get('/logs', ctrl.logs);
router.get('/stats', ctrl.stats);
router.patch('/users/:id/role', ctrl.toggleRole);

module.exports = router;
