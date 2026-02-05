const { UserAuthController } = require('../http/controllers/auth.controller');
const expressAsyncHandler = require('express-async-handler');
const { verifyAccessToken, requireAdmin, requireSuperAdmin } = require('../http/middlewares/auth.middleware');
const { uploadFile } = require('../utils/multer');
const router = require('express').Router();

router.post('/signup', expressAsyncHandler(UserAuthController.signup));
router.post('/signin', expressAsyncHandler(UserAuthController.signin));
router.get('/refresh-token', expressAsyncHandler(UserAuthController.refreshToken));

router.patch('/update', verifyAccessToken, expressAsyncHandler(UserAuthController.updateProfile));
router.patch('/change-password', verifyAccessToken, expressAsyncHandler(UserAuthController.changePassword));
router.post('/upload-avatar', verifyAccessToken, uploadFile.single('avatar'), expressAsyncHandler(UserAuthController.updateAvatar));
router.get('/profile', verifyAccessToken, expressAsyncHandler(UserAuthController.getUserProfile));
router.get('/list', verifyAccessToken, requireAdmin, expressAsyncHandler(UserAuthController.getAllUsers));
router.patch('/:id', verifyAccessToken, requireSuperAdmin, expressAsyncHandler(UserAuthController.updateUserByAdmin));
router.delete('/:id', verifyAccessToken, requireSuperAdmin, expressAsyncHandler(UserAuthController.deleteUserByAdmin));
router.post('/logout', expressAsyncHandler(UserAuthController.logout));
router.get('/debug', expressAsyncHandler(UserAuthController.debugCookies));

module.exports = {
  userAuthRoutes: router,
};
