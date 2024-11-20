const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenQuery } = require('../middleware/middleware.js');
const { getHome, token, refreshToken, getLoginForm, postLogin,
    getCategoriesTree, getProductSearch, getProductDetail, getProductRecommendation,
    getRatingProduct, getSellerId, postHistoryUser, getTopProductInCategory, getTopSelling,
    getTopRated, getBrandsTopBySales, getStoresTopRated, getRetentionRateSeller } = require('../controllers/controller.js');

router.get('/', getHome);
router.get('/token', verifyToken, token);
router.post('/token/refresh', refreshToken);
router.get('/login', getLoginForm);
router.post('/login/verify', postLogin);

router.get('/categories/tree', verifyTokenQuery, getCategoriesTree);
router.get('/products/search', verifyTokenQuery, getProductSearch);
router.get('/products/:id/details', verifyTokenQuery, getProductDetail);
router.get('/products/:id/recommendations', verifyTokenQuery, getProductRecommendation);
router.get('/products/:id/reviews', verifyTokenQuery, getRatingProduct);
router.get('/seller/:seller_id', verifyTokenQuery, getSellerId);
router.get('/users/:user_id/orders/history', verifyTokenQuery, postHistoryUser);
router.get('/categories/:category_id/top-products', verifyTokenQuery, getTopProductInCategory);
router.get('/products/top-selling', verifyTokenQuery, getTopSelling);
router.get('/products/top-rated', verifyTokenQuery, getTopRated);
router.get('/brands/top-by-sales', verifyTokenQuery, getBrandsTopBySales);
router.get('/stores/top-rated', verifyTokenQuery, getStoresTopRated);
router.get('/stores/:seller_id/retention-rate', verifyTokenQuery, getRetentionRateSeller);

module.exports = router;