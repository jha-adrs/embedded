require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const ca = fs.readFileSync(path.join(__dirname, 'ca.pem'));

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    ssl: {
        ca: ca
    }
});

const db = {
    init: async () => {
        try {
            await connection.query('SELECT 1 + 1 as results');
            console.log("Connected to the database");
        } catch (err) {
            console.log("Error connecting to the database");
            console.log(err);
        }
    },
    query: async (query, params, name="Query") => {
        try {
            const start = Date.now();
            const [results] = await connection.execute(query, params);
            const stop = Date.now();
            console.log(`${name} executed in ${stop - start} ms`);
            return results;
        } catch (error) {
            console.log("Error executing query");
            throw error;
        }
    },
    close: async () => {
        await connection.end();
    },
    transaction: async (queries) => {
        try {
            await connection.beginTransaction();
            for (let query of queries) {
                await connection.query(query);
            }
            await connection.commit();
        } catch (error) {
            console.log("Error in transaction");
            await connection.rollback();
            throw error;
        }
    }
}

module.exports = db;