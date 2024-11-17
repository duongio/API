const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: 'DESKTOP-1E24BBA',
    database: process.env.DB_NAME,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false
    }
};

const connectToDatabase = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to SQL Database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

const closeDatabaseConnection = async () => {
    try {
        await sql.close();
        console.log('Database connection closed');
    } catch (err) {
        console.error('Error closing the database connection:', err);
    }
};

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit();
});

process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
    process.exit();
});


module.exports = connectToDatabase;