require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine.js');
const router = require('./router/router.js');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOSTNAME;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use('/api', router);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`);
})