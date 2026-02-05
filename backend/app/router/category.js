const expressAsyncHandler = require('express-async-handler');
const { CategoryController } = require('../http/controllers/category.controller');

const { verifyAccessToken, requireAdmin, decideAuthMiddleware } = require('../http/middlewares/auth.middleware');

const router = require('express').Router();

router.get('/list', decideAuthMiddleware, expressAsyncHandler(CategoryController.getListOfCategories));
router.post('/add', verifyAccessToken, requireAdmin, expressAsyncHandler(CategoryController.addNewCategory));
router.patch('/update/:id', verifyAccessToken, requireAdmin, expressAsyncHandler(CategoryController.updateCategory));
router.delete('/remove/:id', verifyAccessToken, requireAdmin, expressAsyncHandler(CategoryController.removeCategory));

module.exports = {
  categoryRoutes: router,
};
