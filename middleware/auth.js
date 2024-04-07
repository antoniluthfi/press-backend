var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');

exports.registrasi = function (req, res) {
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null,
        role: req.body.role,
        tgl_daftar: new Date()
    }

    var query = "SELECT email FROM ?? WHERE ??=?";
    var table = ["alluser", "email", post.email];

    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length == 0) {
                var query = "INSERT INTO ?? SET ?";
                var table = ["alluser"];
                query = mysql.format(query, table);
                connection.query(query, post, function (error, rows) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            success: true,
                            isRegistered: true,
                            message: "Registrasi berhasil! Selamat datang, " + post.username + "!"
                        }).end();
                    }
                });
            } else {
                res.json({
                    success: false,
                    isRegistered: true,
                    message: "Email anda telah terdaftar!"
                }).end();
            }
        }
    })
}

exports.login = function (req, res) {
    var post = {
        password: req.body.password,
        email: req.body.email
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["alluser", "password", md5(post.password), "email", post.email];

    query = mysql.format(query, table);

    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length == 1) {
                var token = jwt.sign({ rows }, config.secret, {
                    expiresIn: '2400000'
                });

                id_alluser = rows[0].id_alluser;
                username = rows[0].username;
                role = rows[0].role;


                var expired = 2400000
                var isVerified = rows[0].isVerified

                var data = {
                    id_alluser: id_alluser,
                    token_akses: token,
                    ip_address: ip.address()
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["akses_token"];

                query = mysql.format(query, table);
                connection.query(query, data, function (error, rows) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            success: true,
                            message: 'Token JWT tergenerate!',
                            token: token,
                            //4 tambahkan expired time
                            expires: expired,
                            currUser: data.id_alluser,
                            user: username,
                            //3 tambahkan role
                            role: role,
                            isVerified: isVerified
                        });
                    }
                });
            }
            else {
                res.json({ "Error": true, "Message": "Email atau password salah!" });
            }
        }
    });
}
exports.loginmahasiswa = function (req, res) {
    var post = {
        password: req.body.password,
        npm: req.body.username
    };

    connection.query('SELECT email FROM mahasiswa WHERE npm = ?', [post.npm], function (error, resultnpm, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari email dari database." });
        }

        if (resultnpm.length === 0) {
            return res.status(400).json({ error: "NPM tidak ditemukan." });
        }
        connection.query('SELECT id_mahasiswa FROM mahasiswa WHERE npm = ?', [post.npm], function (error, resultid, fields) {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Gagal mencari ID Mahasiswa dari database." });
            }

            if (resultid.length === 0) {
                return res.status(400).json({ error: "ID Mahasiswa tidak ditemukan." });
            }

            var email = resultnpm[0].email;
            var id_mahasiswa = resultid[0].id_mahasiswa;

            var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
            var table = ["alluser", "password", md5(post.password), "email", email];

            query = mysql.format(query, table);

            connection.query(query, function (error, rows) {
                if (error) {
                    console.log(error);
                } else {
                    if (rows.length == 1) {
                        var token = jwt.sign({ rows }, config.secret, {
                            expiresIn: '2400000'
                        });

                        id_alluser = rows[0].id_alluser;
                        username = rows[0].username;
                        role = rows[0].role;

                        var expired = 2400000;
                        var isVerified = rows[0].isVerified;

                        var data = {
                            id_alluser: id_alluser,
                            token_akses: token,
                            ip_address: ip.address()
                        };

                        var query = "INSERT INTO ?? SET ?";
                        var table = ["akses_token"];

                        query = mysql.format(query, table);
                        connection.query(query, data, function (error, rows) {
                            if (error) {
                                console.log(error);
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Token JWT tergenerate!',
                                    token: token,
                                    expires: expired,
                                    currUser: data.id_alluser,
                                    userid: id_mahasiswa,
                                    user: username,
                                    role: role
                                });
                            }
                        });
                    } else {
                        res.json({ "Error": true, "Message": "NPM atau password salah!" });
                    }
                }
            });
        });
    });
}

exports.loginadmin = function (req, res) {
    var post = {
        password: req.body.password,
        email: req.body.email
    };

    console.log(req)

    connection.query('SELECT id_admin FROM `admin` WHERE `email` = ?', [post.email], function (error, resultadmin, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID_Admin dari database." });
        }

        if (resultadmin.length === 0) {
            return res.status(400).json({ error: "ID_Admin tidak ditemukan." });
        }


        var id_admin = resultadmin[0].id_admin;

        var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
        var table = ["alluser", "password", md5(post.password), "email", post.email];

        query = mysql.format(query, table);

        connection.query(query, function (error, rows) {
            if (error) {
                console.log(error);
            } else {
                if (rows.length == 1) {
                    var token = jwt.sign({ rows }, config.secret, {
                        expiresIn: '2400000'
                    });

                    id_alluser = rows[0].id_alluser;
                    username = rows[0].username;
                    role = rows[0].role;

                    var expired = 2400000;
                    var isVerified = rows[0].isVerified;

                    var data = {
                        id_alluser: id_alluser,
                        token_akses: token,
                        ip_address: ip.address()
                    };

                    var query = "INSERT INTO ?? SET ?";
                    var table = ["akses_token"];

                    query = mysql.format(query, table);
                    connection.query(query, data, function (error, rows) {
                        if (error) {
                            console.log(error);
                        } else {
                            res.json({
                                success: true,
                                message: 'Token JWT tergenerate!',
                                token: token,
                                expires: expired,
                                currUser: data.id_alluser,
                                userid: id_admin,
                                user: username,
                                role: role
                            });
                        }
                    });
                } else {
                    res.json({ "Error": true, "Message": "NPM atau password salah!" });
                }
            }
        });

    });
}
exports.logindosen = function (req, res) {
    var post = {
        password: req.body.password,
        nip: req.body.nip
    };

    connection.query('SELECT email FROM dosen WHERE nip = ?', [post.nip], function (error, resultemail, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari email dari database." });
        }

        if (resultemail.length === 0) {
            return res.status(400).json({ error: "email tidak ditemukan." });
        }
        connection.query('SELECT id_dosen FROM dosen WHERE nip = ?', [post.nip], function (error, resultid, fields) {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Gagal mencari ID Dosen dari database." });
            }

            if (resultid.length === 0) {
                return res.status(400).json({ error: "ID Dosen tidak ditemukan." });
            }

            var email = resultemail[0].email;
            var id_dosen = resultid[0].id_dosen;

            var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
            var table = ["alluser", "password", md5(post.password), "email", email];

            query = mysql.format(query, table);

            connection.query(query, function (error, rows) {
                if (error) {
                    console.log(error);
                } else {
                    if (rows.length == 1) {
                        var token = jwt.sign({ rows }, config.secret, {
                            expiresIn: '2400000'
                        });

                        id_alluser = rows[0].id_alluser;
                        username = rows[0].username;
                        role = rows[0].role;

                        var expired = 2400000;
                        var isVerified = rows[0].isVerified;

                        var data = {
                            id_alluser: id_alluser,
                            token_akses: token,
                            ip_address: ip.address()
                        };

                        var query = "INSERT INTO ?? SET ?";
                        var table = ["akses_token"];

                        query = mysql.format(query, table);
                        connection.query(query, data, function (error, rows) {
                            if (error) {
                                console.log(error);
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Token JWT tergenerate!',
                                    token: token,
                                    expires: expired,
                                    currUser: data.id_alluser,
                                    userid: id_dosen,
                                    user: username,
                                    role: role
                                });
                            }
                        });
                    } else {
                        res.json({ "Error": true, "Message": "NPM atau password salah!" });
                    }
                }
            });
        });
    });
}

