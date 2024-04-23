require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const ca = fs.readFileSync(path.join(__dirname, 'ca.pem'));
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    ssl: {
        ca: ca
    }
})

const db = {
    init : ()=>{
        connection.connect((err)=>{
            if(err){
                console.log("Error connecting to the database");
                console.log(process.env.HOST, process.env.USER, process.env.PASSWORD, process.env.DATABASE, process.env.PORT);
                return;
            }
            console.log("Connected to the database");
        });
    },
    query: (query, callback)=>{
        connection.query(query, (error, results, fields)=>{
            if(error){
                console.log("Error executing query");
                return;
            }
            callback(results);
        });
    },
    close: ()=>{
        connection.end();
    },
    transaction : (queries, callback)=>{
        connection.beginTransaction((err)=>{
            if(err){
                console.log("Error beginning transaction");
                return;
            }
            queries.forEach((query)=>{
                connection.query(query, (error, results, fields)=>{
                    if(error){
                        connection.rollback(()=>{
                            console.log("Error rolling back transaction");
                            return;
                        });
                    }
                });
            });
            connection.commit((err)=>{
                if(err){
                    connection.rollback(()=>{
                        console.log("Error committing transaction");
                        return;
                    });
                }
                callback();
            });
        });
    },
    withTransaction : (transaction,query,callback)=>{
        // Continue with an existing transaction
        transaction.query(query, (error, results, fields)=>{
            if(error){
                connection.rollback(()=>{
                    console.log("Error rolling back transaction");
                    return;
                });
            }
            callback();
        });
    }

}
module.exports = db;