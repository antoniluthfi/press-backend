var mysql = require('mysql');

//connection
const connection = mysql.createConnection({
    // host: '172.17.0.1',
    // user: 'root',
    // password: 'tWJDIrBkJavvTXCPuj8oua69ZQovPe',
    // database: 'restapi'
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'presensi'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Mysql Terkoneksi');
});
module.exports = connection;