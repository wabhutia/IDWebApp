const mysql = require('mysql2/promise')


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool;

// server.js code
// pool.getConnection((err, connection) => {

//     if (err) {
//         console.log('Error Connecting to the DB: ', err)
//         return;
//     }

//     // Release connection to the Pool
//     connection.release()

//     // Start the server
//     const server = app.listen(process.env.PORT, () => {
//         console.log("Server is listening on port:", process.env.PORT);
//     })

//     // Handler server shutdown
//     process.on('SIGINT', () => {
//         server.close((err) => {
//             if (err) {
//                 console.error("Error closing the server:", err)
//             }
//             // Release the DB Connection
//             pool.end((err) => {
//                 if (err) {
//                     console.error('Error closing the database connection:', err);
//                 }
//                 process.exit();
//             });
//         });
//     });
// });