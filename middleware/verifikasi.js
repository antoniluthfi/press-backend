const jwt = require('jsonwebtoken');
const config = require('../config/secret');

function verifikasi(allowedRoles) {
    return function(req, res, next) {
       
        var tokenWithBearer = req.headers.authorization;

        if(tokenWithBearer) {
            var token = tokenWithBearer.split(' ')[1];

            // verifikasi
            jwt.verify(token, config.secret, function(err, decoded) {
                if(err) {
                    return res.status(401).send({auth:false, message:'Token tidak terdaftar!'});
                } else {
                    if(decoded.rows && decoded.rows.length > 0 && allowedRoles.includes(decoded.rows[0].role)){
                        req.auth = decoded;
                        next();
                    } else {
                        return res.status(401).send({auth:false, message:'Gagal mengotorisasi role anda!'});
                    }
                }
            });
        } else {
            return res.status(401).send({auth:false, message:'Token tidak tersedia!'});
        }
    }
}

module.exports = verifikasi;
