const connectToDatabase = require('../database/database.js');
const buildTree = require('../middleware/categoryTreeMiddleware.js');
const sql = require('mssql');
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const postLoginService = async (req, res) => {
    await connectToDatabase();
    const { username, password } = req.body;

    try {
        const request = new sql.Request();
        request.input('username', sql.NVarChar, username);
        request.input('password', sql.NVarChar, password);
        const result = await request.query(`
            SELECT * FROM users WHERE pass = @password AND name = @username
        `);
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }
        const user = result.recordset[0];
        if (password !== user.pass) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: token, refreshToken: refreshToken, user_id: user.id })
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getCategoriesTreeService = async (req, res) => {
    await connectToDatabase();

    try {
        const results = await sql.query(`
            WITH CategoryHierarchy AS (
                SELECT 
                    category_id, 
                    category_name, 
                    parent_id,
                    0 AS level,
                    CAST(category_id AS CHAR) AS hierarchy_path
                FROM categories
                WHERE parent_id IS NULL OR parent_id = 0
                UNION ALL
                SELECT 
                    c.category_id, 
                    c.category_name, 
                    c.parent_id,
                    ch.level + 1 AS level,
                    CAST(ch.hierarchy_path + ' > ' + CAST(c.category_id AS CHAR) AS CHAR) AS hierarchy_path
                FROM categories c
                INNER JOIN CategoryHierarchy ch ON c.parent_id = ch.category_id
            )
            SELECT 
                category_id, 
                category_name, 
                parent_id,
                level,
                hierarchy_path
            FROM CategoryHierarchy
            ORDER BY hierarchy_path;
        `);
        const tree = buildTree(results.recordset);
        res.json(tree);
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getProductSearchService = async (req, res) => {
    await connectToDatabase();
    const { search = '', orderBy = 'rating' } = req.query;

    try {
        const request = new sql.Request();

        const searchTerm = `%${search}%`;
        request.input('search', sql.NVarChar, searchTerm);

        const orderByMap = {
            rating: 'p.rating_average',
            price: 'p.price',
            popularity: 'p.review_count'
        };
        const orderByField = orderByMap[orderBy] || 'p.rating_average';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await request.query(`
            SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.short_description, 
                p.rating_average, 
                p.review_count
            FROM product p
            WHERE (p.name LIKE @search OR p.short_description LIKE @search)
            ORDER BY ${orderByField} DESC
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
        `);

        res.json({
            search,
            orderBy,
            page,
            limit,
            product_list: result.recordset
        });
    } catch (err) {
        console.error('Error querying data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getProductDetailService = async (req, res) => {
    await connectToDatabase();
    const { id } = req.params;

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);

        const result = await request.query(`
            SELECT 
                p.id, 
                p.name, 
                p.url, 
                p.price, 
                p.rating_average, 
                p.review_count, 
                p.all_time_quantity_sold, 
                p.brand_name, 
                p.current_seller_id,
                s.seller_name, 
                s.seller_link
            FROM product p
            JOIN store s ON p.current_seller_id = s.seller_id
            WHERE p.id = @id
        `);

        res.json(
            result.recordset
        );
    } catch (err) {
        console.error('Error querying data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getRatingProductService = async (req, res) => {
    await connectToDatabase();
    const { id } = req.params;

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const result = await request.query(`
            SELECT 
                r.id AS review_id, 
                r.title, 
                r.rating, 
                c.created_by_name, 
                r.created_at, 
                r.content
            FROM review r
            JOIN customer c ON r.created_by_id = c.created_by_id
            WHERE r.product_id = @id
            ORDER BY r.created_at DESC
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
        `)
        res.json({
            product_id: id,
            page,
            limit,
            reviews: result.recordset
        });
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getSellerIdService = async (req, res) => {
    await connectToDatabase();
    const { seller_id } = req.params;

    try {
        const request = new sql.Request();
        request.input('seller_id', sql.Int, seller_id);

        const result = await request.query(`
            SELECT 
                s.seller_name, 
                s.seller_link, 
                s.total_follower, 
                s.rating_seller
            FROM store s
            WHERE s.seller_id = @seller_id;
        `)

        res.json(result.recordset);
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const postHistoryUserService = async (req, res) => {
    await connectToDatabase();
    const { user_id } = req.params;

    try {
        const request = new sql.Request();
        request.input('user_id', sql.Int, user_id);

        const result = await request.query(`
            SELECT 
                o.id AS order_id, 
                o.product_id, 
                p.name AS product_name, 
                o.timeline_delivery_date
            FROM orders o
            JOIN product p ON o.product_id = p.id
            WHERE o.created_by_id = @user_id
            ORDER BY o.timeline_delivery_date DESC;
        `)

        res.json(result.recordset);
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const getTopProductInCategoryService = async (req, res) => {
    await connectToDatabase();
    const { category_id } = req.params;

    try {
        const request = new sql.Request();
        request.input('category_id', sql.Int, category_id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const result = await request.query(`
            SELECT 
                p.id AS product_id,
                p.name,
                p.price,
                p.all_time_quantity_sold,
                p.rating_average
            FROM product p
            WHERE (',' + p.breadcrumbs_id + ',' LIKE '%,' + CAST(@category_id AS VARCHAR) + ',%') 
            ORDER BY p.all_time_quantity_sold DESC
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
        `)
        res.json({
            category_id: category_id,
            page,
            limit,
            product_list: result.recordset
        });
    } catch (err) {
        console.error('Error check data:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = {
    postLoginService, getCategoriesTreeService, getProductSearchService,
    getProductDetailService, getRatingProductService, getSellerIdService,
    postHistoryUserService, getTopProductInCategoryService
}