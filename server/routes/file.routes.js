const router = require('express').Router();
const ctrl = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(protect);
router.get('/users/list', ctrl.listUsers);
router.post('/', upload.single('file'), ctrl.upload);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/download', ctrl.download);
router.delete('/:id', ctrl.remove);
router.post('/:id/share', ctrl.share);
router.delete('/:id/share/:userId', ctrl.revoke);

module.exports = router;
