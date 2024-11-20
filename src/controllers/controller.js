const path = require('path');
const jwt = require("jsonwebtoken");
const { postLoginService, getCategoriesTreeService, getProductSearchService, getRatingProductService,
    getSellerIdService, getProductDetailService, postHistoryUserService, getTopProductInCategoryService,
    getTopSellingService, getTopRatedService, getBrandsTopBySalesService, getStoresTopRatedService,
    getRetentionRateSellerService } = require('../service/CRUDservice.js');

const SECRET_KEY = process.env.SECRET_KEY;

const getHome = (req, res) => {
    res.sendFile(path.join(__dirname, '../view/home.html'));
}

const token = (req, res) => {
    res.status(200).json({ message: 'Verify Successful!!!' });
}

const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const newToken = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: '1m' });
        res.json({ token: newToken });
    });
}

const getLoginForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../view/login.html'));
}

const postLogin = async (req, res) => {
    await postLoginService(req, res);
}

const getCategoriesTree = async (req, res) => {
    await getCategoriesTreeService(req, res);
}

const getProductSearch = async (req, res) => {
    await getProductSearchService(req, res);
}

const getProductDetail = async (req, res) => {
    await getProductDetailService(req, res);
}

const getProductRecommendation = async (req, res) => {
    const product_id = req.params.id;
    const user_id = req.query.userId;
    if (!product_id || !user_id) {
        return res.status(400).json({
            message: 'Missing required query parameters: product_id and user_id',
        });
    }
    try {
        const apiUrl = `http://127.0.0.1:5000/get_recommendations?product_id=${product_id}&user_id=${user_id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`);
        }
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        return res.status(500).json({
            message: 'Failed to fetch recommendations',
            error: error.message,
        });
    }
};

const getRatingProduct = async (req, res) => {
    await getRatingProductService(req, res);
}

const getSellerId = async (req, res) => {
    await getSellerIdService(req, res);
}

const postHistoryUser = async (req, res) => {
    await postHistoryUserService(req, res);
}

const getTopProductInCategory = async (req, res) => {
    await getTopProductInCategoryService(req, res);
}

const getTopSelling = async (req, res) => {
    await getTopSellingService(req, res);
}

const getTopRated = async (req, res) => {
    await getTopRatedService(req, res);
}

const getBrandsTopBySales = async (req, res) => {
    await getBrandsTopBySalesService(req, res);
}

const getStoresTopRated = async (req, res) => {
    await getStoresTopRatedService(req, res);
}

const getRetentionRateSeller = async (req, res) => {
    await getRetentionRateSellerService(req, res);
}

module.exports = {
    getHome, token, refreshToken, getLoginForm, postLogin,
    getCategoriesTree, getProductSearch, getProductDetail, getProductRecommendation,
    getRatingProduct, getSellerId, postHistoryUser, getTopProductInCategory, getTopSelling,
    getTopRated, getBrandsTopBySales, getStoresTopRated, getRetentionRateSeller
}