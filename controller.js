

var response = require('./res');
var connection = require('./koneksi');
var md5 = require('md5');
var nodemailer = require('nodemailer');  



exports.index = function(req,res){
    response.ok("API Berjalan",res)
};

//Mahasiswa
exports.getalldatamahasiswa = function(req, res) {
    connection.query('SELECT mahasiswa.*, kelas.nama_kelas FROM mahasiswa INNER JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas;', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getdatamahasiswabyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT mahasiswa.*, kelas.nama_kelas FROM mahasiswa INNER JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas WHERE mahasiswa.id_mahasiswa = ?', [id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Data dengan ID " + id + " tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdatamahasiswa = function(req, res){
    var npm = req.body.npm;
    var nama_mahasiswa = req.body.nama_mahasiswa;
    var jk = req.body.jk;
    var alamat = req.body.alamat;
    var foto = req.file.filename; 
    var status = req.body.status;
    var notlp = req.body.notlp;
    var email = req.body.email;
    var password = md5(req.body.password);
    var nama_kelas = req.body.nama_kelas;

    if (!npm || npm.length !== 10) {
        return res.status(400).json({ error: "NPM harus terdiri dari 10 karakter." });
    }    

    if (!nama_mahasiswa || typeof nama_mahasiswa !== 'string') {
        return res.status(400).json({ error: "Nama harus diisi dan berupa string." });
    }

    if (!jk || (jk !== 'Laki-laki' && jk !== 'Perempuan')) {
        return res.status(400).json({ error: "Jenis Kelamin harus diisi dengan 'Laki-laki' atau 'Perempuan'." });
    }    

    if (!alamat) {
        return res.status(400).json({ error: "Alamat harus diisi." });
    }

    if (!foto) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }

    if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
        return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
    }

    if (!notlp ) {
        return res.status(400).json({ error: "No Telepon harus diisi." });
    }

    if (!email) {
        return res.status(400).json({ error: "Email harus diisi." });
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
    }    

    if (!password) {
        return res.status(400).json({ error: "Password harus diisi." });
    }
   

    connection.query('SELECT id_kelas FROM kelas WHERE nama_kelas = ?', [nama_kelas], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID Kelas dari database." });
        }
    
        if (result.length === 0) {
            return res.status(400).json({ error: "Kelas tidak ditemukan." });
        } else {
            var id_kelas = result[0].id_kelas;
            connection.query('SELECT * FROM mahasiswa WHERE npm = ? OR email = ?', [npm, email], function(error, result, fields){
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal memeriksa NPM dan Email dari database." });
                }
    
                if (result.length > 0) {
                    // Check if NPM or Email already exists
                    var duplicateField = result[0].npm === npm ? 'NPM' : 'Email';
                    return res.status(400).json({ error: `${duplicateField} sudah terdaftar.` });
                } else {
                    // Continue with the insertion
                    connection.query('INSERT INTO mahasiswa (npm, nama_mahasiswa, jk, alamat, foto, status, notlp, email, password, id_kelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [npm, nama_mahasiswa, jk, alamat, foto, status, notlp, email, password, id_kelas], function(error, rows, fields){
                        if(error){
                            console.log(error);
                            return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                        } else {
                            var userData = {
                                username: nama_mahasiswa,
                                email: email,
                                password: password,
                                role: 3, 
                                tgl_daftar: new Date()
                            };
                            connection.query('INSERT INTO alluser SET ?', userData, function(error, rows, fields){
                                if(error){
                                    console.log(error);
                                    return res.status(500).json({ error: "Gagal menambahkan data ke tabel alluser." });
                                } else {
                                    return res.status(200).json({ message: "Data berhasil diinputkan." });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
exports.ubahdatamahasiswa = function (req, res) {
    let id_mahasiswa = req.params.id_mahasiswa;
    var npm = req.body.npm;
    var nama_mahasiswa = req.body.nama_mahasiswa;
    var jk = req.body.jk;
    var alamat = req.body.alamat;
    var foto = req.file.filename; 
    var status = req.body.status;
    var notlp = req.body.notlp;
    var email = req.body.email;
    var password = req.body.password ? md5(req.body.password) : null;
    
    if (!npm ) {
        return res.status(400).json({ error: "NPM harus diisi." });
    }
    if (!nama_mahasiswa) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }
    if (!jk || (jk !== 'Laki-laki' && jk !== 'Perempuan')) {
        return res.status(400).json({ error: "Jenis Kelamin harus diisi dengan 'Laki-laki' atau 'Perempuan'." });
    }    
    if (!alamat) {
        return res.status(400).json({ error: "Alamat harus diisi." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    
    if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
        return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
    }
    if (!notlp ) {
        return res.status(400).json({ error: "No Telepon harus diisi." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email harus diisi." });
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
    }     
    if (!password) {
        return res.status(400).json({ error: "Password harus diisi." });
    }

    if (!npm || npm.length !== 10) {
        return res.status(400).json({ error: "NPM harus terdiri dari 10 karakter." });
    }    

    if (typeof nama_mahasiswa !== 'string') {
        return res.status(400).json({ error: "Nama harus berupa string." });
    }

    connection.query('SELECT * FROM mahasiswa WHERE npm = ?', [npm], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa NPM di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "NPM sudah terdaftar." });
        } else {
            connection.query('UPDATE mahasiswa SET npm=?, nama_mahasiswa=?, jk=?, alamat=?, foto=?, status=?, notlp=?, email=?, password=? WHERE id_mahasiswa=?', [npm, nama_mahasiswa, jk, alamat, foto, status, notlp,email, password, id_mahasiswa], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mengubah data di database." });
                } else {
                    return res.status(200).json({ message: "Berhasil mengubah data." });
                }
            });
        }
    });
};
exports.hapusdatamahasiswa = function (req, res) {
    let id_mahasiswa = req.params.id_mahasiswa;
    connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa=?',[id_mahasiswa],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID "+id_mahasiswa + "tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Admin
exports.getalldataadmin = function(req, res) {
    
    connection.query('SELECT * FROM admin', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getadminbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM admin where id_admin = ?',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID " + id + " tidak ditemukan" });

        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdataadmin = function(req, res){
    var nama_admin = req.body.nama_admin;
    var username = req.body.username;
    var email = req.body.email;
    var password = md5(req.body.password);
    var status = req.body.status;
    var foto = req.file.filename; 

    if (!nama_admin) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }   
    if (!username) {
        return res.status(400).json({ error: "Username harus diisi." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email harus diisi." });
    }
    if (!password) {
        return res.status(400).json({ error: "Password harus diisi." });
    }
    if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
        return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    if (typeof nama_admin !== 'string') {
        return res.status(400).json({ error: "Nama harus berupa string." });
    }

    connection.query('SELECT * FROM admin WHERE username = ? OR email = ?', [username, email], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa Username dan Email di database." });
        }

        if (result.length > 0) {
            // Check if Username or Email already exists
            var duplicateField = result[0].username === username ? 'Username' : 'Email';
            return res.status(400).json({ error: `${duplicateField} sudah terdaftar.` });
        } else {
            // Continue with the insertion
            connection.query('INSERT INTO admin (nama_admin, username, email, password, status, foto) VALUES (?, ?, ?, ?, ?, ?)', [nama_admin, username, email, password, status, foto], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                } else {
                    var userData = {
                        username: nama_admin,
                        email: email,
                        password: password,
                        role: 1, 
                        tgl_daftar: new Date()
                    };
                    connection.query('INSERT INTO alluser SET ?', userData, function(error, rows, fields){
                        if(error){
                            console.log(error);
                            return res.status(500).json({ error: "Gagal menambahkan data ke tabel alluser." });
                        } else {
                            return res.status(200).json({ message: "Data berhasil diinputkan." });
                        }
                    });
                }
            });
        }
    });
};
exports.ubahdataadmin = function(req,res){
        let id = req.params.id;
        var nama_admin = req.body.nama_admin;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password ? md5(req.body.password) : null;
        var status = req.body.status;
        var foto = req.file.filename; 
        

    
        if (!nama_admin) {
            return res.status(400).json({ error: "Nama harus diisi." });
        }   
        if (!username) {
            return res.status(400).json({ error: "Username harus diisi." });
        }
        if (!email) {
            return res.status(400).json({ error: "Email harus diisi." });
        }
        if (!password) {
            return res.status(400).json({ error: "Password harus diisi." });
        }
        if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
            return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Foto harus diunggah." });
        }
        if (typeof nama_admin !== 'string') {
            return res.status(400).json({ error: "Nama harus berupa string." });
        }

        connection.query('SELECT * FROM admin WHERE username = ?', [username], function(error, result, fields){
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Gagal memeriksa Username di database." });
            }

            if (result.length > 0) {
                return res.status(400).json({ error: "Username sudah terdaftar." });
            } else {
                connection.query('UPDATE admin SET nama_admin=?, username=?, email=?, password=?, status=?, foto=? WHERE id_admin=?', [nama_admin, username, email, password, status, foto, id], function(error, rows, fields){
                    if(error){
                        console.log(error);
                        return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                    } else {
                        return res.status(200).json({ message: "Berhasil Mengubah data." });
                    }
                });
            }
        });
};
exports.hapusdatamaadmin = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM admin WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Dosen
exports.getalldatadosen = function(req, res) {
    
    connection.query('SELECT * FROM dosen', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getdatadosenbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM dosen where id_dosen = ?',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID "+id+ "tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdatadosen = function(req, res){
    var nip = req.body.nip;
    var nama_dosen = req.body.nama_dosen;
    var jk = req.body.jk;
    var alamat = req.body.alamat;
    var foto = req.file.filename; 
    var status = req.body.status;
    var notlp = req.body.notlp;
    var email = req.body.email;
    var password= req.body.password ? md5(req.body.password) : null;

    if (!nip ) {
        return res.status(400).json({ error: "NIP harus diisi." });
    }
    if (!nama_dosen) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }
    if (!jk || (jk !== 'Laki-laki' && jk !== 'Perempuan')) {
        return res.status(400).json({ error: "Jenis Kelamin harus diisi dengan 'Laki-laki' atau 'Perempuan'." });
    }    
    if (!alamat) {
        return res.status(400).json({ error: "Alamat harus diisi." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    
    if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
        return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
    }
    if (!notlp ) {
        return res.status(400).json({ error: "No Telepon harus diisi." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email harus diisi." });
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
    }    
    if (!password) {
        return res.status(400).json({ error: "Password harus diisi." });
    }

    if (!nip || nip.length !== 16) {
        return res.status(400).json({ error: "NPM harus terdiri dari 16 karakter." });
    }    

    if (typeof nama_dosen !== 'string') {
        return res.status(400).json({ error: "Nama harus berupa string." });
    }

    connection.query('SELECT * FROM dosen WHERE nip = ? OR email = ?', [nip, email], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa NIP dan Email di database." });
        }

        if (result.length > 0) {
            // Check if NIP or Email already exists
            var duplicateField = result[0].nip === nip ? 'NIP' : 'Email';
            return res.status(400).json({ error: `${duplicateField} sudah terdaftar.` });
        } else {
            // Continue with the insertion
            connection.query('INSERT INTO dosen (nip, nama_dosen, jk, alamat, foto, status, notlp, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nip, nama_dosen, jk, alamat, foto, status, notlp, email, password], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                } else {
                    var userData = {
                        username: nama_dosen,
                        email: email,
                        password: password,
                        role: 2, 
                        tgl_daftar: new Date()
                    };
                    connection.query('INSERT INTO alluser SET ?', userData, function(error, rows, fields){
                        if(error){
                            console.log(error);
                            return res.status(500).json({ error: "Gagal menambahkan data ke tabel alluser." });
                        } else {
                            return res.status(200).json({ message: "Data berhasil diinputkan." });
                        }
                    });
                }
            });
        }
    });
};
exports.ubahdatadosen = function (req, res) {
    let id = req.params.id;
    var nip = req.body.nip;
    var nama_dosen = req.body.nama_dosen;
    var jk = req.body.jk;
    var alamat = req.body.alamat;
    var foto = req.file.filename; 
    var status = req.body.status;
    var notlp = req.body.notlp;
    var email = req.body.email;
    var password = req.body.password ? md5(req.body.password) : null;

    if (!nip ) {
        return res.status(400).json({ error: "NIP harus diisi." });
    }
    if (!nama_dosen) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }
    if (!jk || (jk !== 'Laki-laki' && jk !== 'Perempuan')) {
        return res.status(400).json({ error: "Jenis Kelamin harus diisi dengan 'Laki-laki' atau 'Perempuan'." });
    }    
    if (!alamat) {
        return res.status(400).json({ error: "Alamat harus diisi." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    
    if (!status || (status !== 'Aktif' && status !== 'Tidak Aktif')) {
        return res.status(400).json({ error: "Status harus diisi dengan 'Aktif' atau 'Tidak Aktif'." });
    }
    if (!notlp ) {
        return res.status(400).json({ error: "No Telepon harus diisi." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email harus diisi." });
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
    }    
    if (!password) {
        return res.status(400).json({ error: "Password harus diisi." });
    }

    if (!nip || nip.length !== 16) {
        return res.status(400).json({ error: "NPM harus terdiri dari 16 karakter." });
    }    

    if (typeof nama_dosen !== 'string') {
        return res.status(400).json({ error: "Nama harus berupa string." });
    }

    connection.query('SELECT * FROM dosen WHERE nip = ?', [nip], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa NIP di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "NIP sudah terdaftar." });
        } else {
            connection.query('UPDATE dosen SET nip=?, nama_dosen=?, jk=?, alamat=?, foto=?, status=?, notlp=?, email=?, password=? WHERE id_dosen=?', [nip, nama_dosen, jk, alamat, foto, status, notlp, email, password, id], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal Mengubah data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Mengubah data." });
                }
            });
        }
    });
};
exports.hapusdatadosen = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM dosen WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Matakuliah
exports.getalldatamatakuliah = function(req, res) {
    
    connection.query('SELECT * FROM matakuliah', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getdatamatakuliahbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM matakuliah where id_matakuliah = ?',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID"+ id +"tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdatamatakuliah = function (req, res) {
    var kode_matakuliah = req.body.kode_matakuliah;
    var nama_matakuliah = req.body.nama_matakuliah;
    var sks = req.body.sks;
    var foto = req.file.filename; 

    if (!kode_matakuliah) {
        return res.status(400).json({ error: "Kode Matakuliah harus diisi." });
    }
    if (!nama_matakuliah) {
        return res.status(400).json({ error: "Nama Matakuliah harus diisi." });
    }
    if (!sks) {
        return res.status(400).json({ error: "Jumlah SKS harus diisi." });
    }
    if (typeof nama_matakuliah !== 'string') {
        return res.status(400).json({ error: "Nama Matakuliah harus berupa string." });
    }
    if (typeof sks !== 'number') {
        return res.status(400).json({ error: "Jumlah SKS harus berupa numeric." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    connection.query('SELECT * FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function (error, result, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa kode_matakuliah di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "kode_matakuliah sudah terdaftar." });
        } else {
            connection.query('INSERT INTO matakuliah (kode_matakuliah, nama_matakuliah, sks,foto) VALUES (?, ?, ?,?)', [kode_matakuliah, nama_matakuliah, sks, foto], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal Menambah data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Menambahkan data." });
                }
            });
        }
    });
};
exports.ubahdatamatakuliah =function(req,res){
    let id = req.params.id;
    var kode_matakuliah = req.body.kode_matakuliah;
    var nama_matakuliah = req.body.nama_matakuliah;
    var sks = req.body.sks;
    var foto = req.file.filename; 

    if (!kode_matakuliah) {
        return res.status(400).json({ error: "Kode Matakuliah harus diisi." });
    }
    if (!nama_matakuliah) {
        return res.status(400).json({ error: "Nama Matakuliah harus diisi." });
    }
    if (!sks) {
        return res.status(400).json({ error: "Jumlah SKS harus diisi." });
    }
    if (typeof nama_matakuliah !== 'string') {
        return res.status(400).json({ error: "Nama Matakuliah harus berupa string." });
    }
    // if (typeof sks !== 'number') {
    //     return res.status(400).json({ error: "Jumlah SKS harus berupa numeric." });
    // }
    if (!req.file) {
        return res.status(400).json({ error: "Foto harus diunggah." });
    }
    connection.query('SELECT * FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function (error, result, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa kode_matakuliah di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "kode_matakuliah sudah terdaftar." });
        } else {
            connection.query('UPDATE matakuliah SET kode_matakuliah=?, nama_matakuliah=?, sks=?,foto=? WHERE id_matakuliah=?', [kode_matakuliah, nama_matakuliah, sks, foto,id], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal Mengubah data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Mengubah data." });
                }
            });
        }
    });
};
exports.hapusdatamatakuliah = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM matakuliah WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Ruangan
exports.getalldataruangan = function(req, res) {
    
    connection.query('SELECT * FROM ruangan', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getdataruanganbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM ruangan where id_ruangan = ?',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdataruangan = function(req, res){
    var gedung = req.body.gedung;
    var lantai = req.body.lantai;
    var ruangan = req.body.ruangan;
    if (!gedung) {
        return res.status(400).json({ error: "Gedung harus diisi." });
    }
    if (!lantai) {
        return res.status(400).json({ error: "Lantai harus diisi." });
    }
    if (!ruangan) {
        return res.status(400).json({ error: "Ruangan harus diisi." });
    }

    if (typeof gedung !== 'gedung') {
        return res.status(400).json({ error: "Gedung harus berupa numeric." });
    }
    if (typeof lantai !== 'lantai') {
        return res.status(400).json({ error: "Lantai harus berupa numeric." });
    }
    if (typeof ruangan !== 'ruangan') {
        return res.status(400).json({ error: "Ruangan harus berupa numeric." });
    }
    connection.query('SELECT * FROM ruangan WHERE gedung = ? AND lantai = ? AND ruangan = ?', [gedung, lantai, ruangan], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa ruangan di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "ruangan sudah terdaftar." });
        } else {
            connection.query('INSERT INTO ruangan (gedung, lantai, ruangan) VALUES (?, ?, ?)', [gedung, lantai, ruangan], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Menambahkan data." });
                }          
            });
        }
    });
    
};
exports.ubahdataruangan =function(req,res){
    let id = req.params.id;
    var gedung = req.body.gedung;
    var lantai = req.body.lantai;
    var ruangan = req.body.ruangan;
    if (!gedung) {
        return res.status(400).json({ error: "Gedung harus diisi." });
    }
    if (!lantai) {
        return res.status(400).json({ error: "Lantai harus diisi." });
    }
    if (!ruangan) {
        return res.status(400).json({ error: "Ruangan harus diisi." });
    }

    if (typeof gedung !== 'gedung') {
        return res.status(400).json({ error: "Gedung harus berupa numeric." });
    }
    if (typeof lantai !== 'lantai') {
        return res.status(400).json({ error: "Lantai harus berupa numeric." });
    }
    if (typeof ruangan !== 'ruangan') {
        return res.status(400).json({ error: "Ruangan harus berupa numeric." });
    }
    connection.query('SELECT * FROM ruangan WHERE gedung = ? AND lantai = ? AND ruangan = ?', [gedung, lantai, ruangan], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa ruangan di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "ruangan sudah terdaftar." });
        } else {
            connection.query('UPDATE ruangan SET gedung =?, lantai=?, ruangan=? WHERE id_ruangan=?', [gedung, lantai, ruangan, id], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mengubah data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil megubah data." });
                }          
            });
        }
    });
    
};
exports.hapusruangan = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM ruangan WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Kelas
exports.getalldatakelas = function(req, res) {
    
    connection.query('SELECT * FROM kelas', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getdatakelasbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM kelas where id_kelas = ?',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
};
exports.tambahdatakelas = function(req, res){
    var nama_kelas = req.body.nama_kelas;
    var angkatan = req.body.angkatan;

    if (!nama_kelas) {
        return res.status(400).json({ error: "Nama Kelas harus diisi." });
    }
    if (!angkatan) {
        return res.status(400).json({ error: "Tahun Angkatan harus diisi." });
    }

    connection.query('SELECT * FROM kelas WHERE nama_kelas = ? AND angkatan = ? ', [nama_kelas, angkatan], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa Kelas di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "Kelas sudah terdaftar." });
        } else {
            connection.query('INSERT INTO kelas (nama_kelas, angkatan) VALUES (?, ?)', [nama_kelas, angkatan], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Menambahkan data." });
                }          
            });
        }
    });
    
};
exports.ubahdatakelas =function(req,res){
    let id = req.params.id;
    var nama_kelas = req.body.nama_kelas;
    var angkatan = req.body.angkatan;

    if (!nama_kelas) {
        return res.status(400).json({ error: "Nama Kelas harus diisi." });
    }
    if (!angkatan) {
        return res.status(400).json({ error: "Tahun Angkatan harus diisi." });
    }

    connection.query('SELECT * FROM kelas WHERE nama_kelas = ? AND angkatan = ? ', [nama_kelas, angkatan], function(error, result, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal memeriksa Kelas di database." });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "Kelas sudah terdaftar." });
        } else {
            connection.query('UPDATE kelas SET nama_kelas=?, angkatan=? WHERE id_kelas=?', [nama_kelas, angkatan,id], function(error, rows, fields){
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Gagal Mengubah data ke database." });
                } else {
                    return res.status(200).json({ message: "Berhasil Mengubah data." });
                }          
            });
        }
    });
    
};
exports.hapuskelas = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM kelas WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID id tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Jadwal
exports.getalldatajadwal = function(req, res) {
    connection.query('SELECT jadwal.*, dosen.*, matakuliah.*, ruangan.*, mahasiswa.*, kelas.* FROM jadwal JOIN dosen ON jadwal.id_dosen_jadwal = dosen.id_dosen JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_ruangan_jadwal = ruangan.id_ruangan JOIN mahasiswa ON jadwal.id_mahasiswa_jadwal = mahasiswa.id_mahasiswa JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas',
        function(error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        });
};
exports.getdatajadwalbyid = function(req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM jadwal JOIN dosen ON jadwal.id_dosen_jadwal = dosen.id_dosen JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_ruangan_jadwal = ruangan.id_ruangan JOIN mahasiswa ON jadwal.id_mahasiswa_jadwal = mahasiswa.id_mahasiswa JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas WHERE jadwal.id_jadwal = ?;',[id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "data dengan ID " + id + " tidak ditemukan" });
        } else {
            response.ok(rows, res);
        }
    });
    
};
exports.getalldatajadwalmahasiswa = function (req, res) {
    connection.query('SELECT mahasiswa.id_mahasiswa AS id_mahasiswa, mahasiswa.npm, mahasiswa.nama_mahasiswa, mahasiswa.jk, mahasiswa.alamat, mahasiswa.foto, mahasiswa.status, mahasiswa.notlp, mahasiswa.email, mahasiswa.password, mahasiswa.id_kelas, jadwal.hari, jadwal.jam_mulai, jadwal.jam_selesai, jadwal.semester, kelas.nama_kelas, matakuliah.nama_matakuliah, matakuliah.sks FROM mahasiswa INNER JOIN jadwal ON mahasiswa.id_mahasiswa = jadwal.id_mahasiswa_jadwal LEFT JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas LEFT JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah ORDER BY mahasiswa.nama_mahasiswa, jadwal.hari;'
        , function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.nested(rows, res);
            }
        });
};
exports.getdatajadwalmahasiswabyidmahasiswa = function (req, res) {
    let id = req.params.id;
    connection.query('SELECT mahasiswa.id_mahasiswa AS id_mahasiswa, mahasiswa.npm, mahasiswa.nama_mahasiswa, mahasiswa.jk, mahasiswa.alamat, mahasiswa.foto, mahasiswa.status, mahasiswa.notlp, mahasiswa.email, mahasiswa.password, mahasiswa.id_kelas, jadwal.hari, jadwal.jam_mulai, jadwal.jam_selesai, jadwal.semester, kelas.nama_kelas, matakuliah.nama_matakuliah, matakuliah.sks FROM mahasiswa INNER JOIN jadwal ON mahasiswa.id_mahasiswa = jadwal.id_mahasiswa_jadwal LEFT JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas LEFT JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah WHERE jadwal.id_mahasiswa_jadwal=? ORDER BY mahasiswa.nama_mahasiswa, jadwal.hari ;',[id]
        , function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.nested(rows, res);
            }
        });
};
exports.tambahdatajadwal = function(req, res) {
    var nip_dosen = req.body.nip_dosen;
    var npm = req.body.npm;
    var kode_matakuliah = req.body.kode_matakuliah;
    var semester = req.body.semester;
    var hari = req.body.hari;
    var jam_mulai = req.body.jam_mulai;
    var jam_selesai = req.body.jam_selesai;
    var gedung = req.body.gedung;
    var lantai = req.body.lantai;
    var ruangan = req.body.ruangan;

    if (!nip_dosen ) {
        return res.status(400).json({ error: "NIP harus diisi" });
    } 
    if (!npm ) {
        return res.status(400).json({ error: "NPM harus diisi." });
    }    
    
    if (!kode_matakuliah ) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }
    if (!semester) {
        return res.status(400).json({ error: "Semester harus diisi." });
    }
    
    if (!hari || (hari !== 'Senin' && hari !== 'Selasa'  && hari !== 'Rabu'  && hari !== 'Kamis'  && hari !== 'Jumat'  && hari !== 'Sabtu')) {
        return res.status(400).json({ error: " Hari harus diisi Nama hari diawali dengan huruf kapital contoh 'Rabu'" });
    }    
    if (!jam_mulai) {
        return res.status(400).json({ error: "Jam Mulai harus diisi." });
    }
    if (!jam_selesai) {
        return res.status(400).json({ error: "Jam Selesai harus diisi." });
    }    
    if (!gedung) {
        return res.status(400).json({ error: "Gedung harus diisi." });
    }
    if (!lantai) {
        return res.status(400).json({ error: "Lantai harus diisi." });
    }
    if (!ruangan) {
        return res.status(400).json({ error: "Ruangan harus diisi." });
    }

    connection.query('SELECT id_dosen FROM dosen WHERE nip = ? ', [nip_dosen], function(error, resultdosen, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID Dosen dari database." });
        }

        if (resultdosen.length === 0) {
            return res.status(400).json({ error: "Dosen tidak ditemukan." });
        } else {
            connection.query('SELECT id_mahasiswa FROM mahasiswa WHERE npm = ?', [npm], function(error, resultmahasiswa, fields){
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mencari ID Mahasiswa dari database." });
                }

                if (resultmahasiswa.length === 0) {
                    return res.status(400).json({ error: "Mahasiswa tidak ditemukan." });
                } else {
                    connection.query('SELECT id_matakuliah FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function(error, resultmatakuliah, fields){
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: "Gagal mencari ID Matakuliah dari database." });
                        }

                        if (resultmatakuliah.length === 0) {
                            return res.status(400).json({ error: "Matakuliah tidak ditemukan." });
                        } else {
                            connection.query('SELECT id_ruangan FROM ruangan WHERE gedung = ? AND lantai = ? AND ruangan = ?', [gedung, lantai,ruangan], function(error, result, fields){
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ error: "Gagal mencari ID Ruangan dari database." });
                                }
                        
                                if (result.length === 0) {
                                    return res.status(400).json({ error: "Ruangan tidak ditemukan." });
                                } else {
                                    var id_dosen = resultdosen[0].id_dosen;
                                    var id_mahasiswa = resultmahasiswa[0].id_mahasiswa;
                                    var id_matakuliah = resultmatakuliah[0].id_matakuliah;
                                    var id_ruangan = result[0].id_ruangan;
                            
                                    connection.query('SELECT * FROM jadwal WHERE id_dosen_jadwal = ? AND id_mahasiswa_jadwal = ? AND id_matakuliah_jadwal = ? AND semester = ? AND hari = ? AND jam_mulai = ? AND jam_selesai = ? AND id_ruangan_jadwal = ?', [id_dosen, id_mahasiswa, id_matakuliah, semester, hari, jam_mulai, jam_selesai, id_ruangan], function(error, existingRows, fields){
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: "Gagal memeriksa keberadaan data di database." });
                                        }
                        
                                        if (existingRows.length > 0) {
                                            return res.status(400).json({ error: "Jadwal sudah ada." });
                                        } else {
                                            connection.query('INSERT INTO jadwal (id_dosen_jadwal, id_mahasiswa_jadwal, id_matakuliah_jadwal, semester, hari, jam_mulai, jam_selesai, id_ruangan_jadwal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id_dosen, id_mahasiswa, id_matakuliah, semester, hari, jam_mulai, jam_selesai, id_ruangan], function(error, rows, fields){
                                                if(error){
                                                    console.log(error);
                                                    return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                                                } else {
                                                    return res.status(200).json({ message: "Berhasil Menambahkan data." });
                                                }
                                            });
                                        }
                                    });
                                } 
                            });
                        } 
                    });
                } 
            });
        } 
    });
};
exports.ubahdatajadwal =function(req,res){
    let id = req.params.id;
    var nip_dosen = req.body.nip_dosen;
    var npm = req.body.npm;
    var kode_matakuliah = req.body.kode_matakuliah;
    var semester = req.body.semester;
    var hari = req.body.hari;
    var jam_mulai = req.body.jam_mulai;
    var jam_selesai = req.body.jam_selesai;
    var gedung = req.body.gedung;
    var lantai = req.body.lantai;
    var ruangan = req.body.ruangan;

    if (!nip_dosen ) {
        return res.status(400).json({ error: "NIP harus diisi" });
    } 
    if (!npm ) {
        return res.status(400).json({ error: "NPM harus diisi." });
    }    
    
    if (!kode_matakuliah ) {
        return res.status(400).json({ error: "Nama harus diisi." });
    }
    if (!semester) {
        return res.status(400).json({ error: "Semester harus diisi." });
    }
    
    if (!hari || (hari !== 'Senin' && hari !== 'Selasa'  && hari !== 'Rabu'  && hari !== 'Kamis'  && hari !== 'Jumat'  && hari !== 'Sabtu')) {
        return res.status(400).json({ error: " Hari harus diisi Nama hari diawali dengan huruf kapital contoh 'Rabu'" });
    }    
    if (!jam_mulai) {
        return res.status(400).json({ error: "Jam Mulai harus diisi." });
    }
    if (!jam_selesai) {
        return res.status(400).json({ error: "Jam Selesai harus diisi." });
    }    
    if (!gedung) {
        return res.status(400).json({ error: "Gedung harus diisi." });
    }
    if (!lantai) {
        return res.status(400).json({ error: "Lantai harus diisi." });
    }
    if (!ruangan) {
        return res.status(400).json({ error: "Ruangan harus diisi." });
    }

    connection.query('SELECT id_dosen FROM dosen WHERE nip = ? ', [nip_dosen], function(error, resultdosen, fields){
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID Dosen dari database." });
        }

        if (resultdosen.length === 0) {
            return res.status(400).json({ error: "Dosen tidak ditemukan." });
        } else {
            connection.query('SELECT id_mahasiswa FROM mahasiswa WHERE npm = ?', [npm], function(error, resultmahasiswa, fields){
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mencari ID Mahasiswa dari database." });
                }

                if (resultmahasiswa.length === 0) {
                    return res.status(400).json({ error: "Mahasiswa tidak ditemukan." });
                } else {
                    connection.query('SELECT id_matakuliah FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function(error, resultmatakuliah, fields){
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: "Gagal mencari ID Matakuliah dari database." });
                        }

                        if (resultmatakuliah.length === 0) {
                            return res.status(400).json({ error: "Matakuliah tidak ditemukan." });
                        } else {
                            connection.query('SELECT id_ruangan FROM ruangan WHERE gedung = ? AND lantai = ? AND ruangan = ?', [gedung, lantai,ruangan], function(error, result, fields){
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ error: "Gagal mencari ID Ruangan dari database." });
                                }
                        
                                if (result.length === 0) {
                                    return res.status(400).json({ error: "Ruangan tidak ditemukan." });
                                } else {
                                    var id_dosen = resultdosen[0].id_dosen;
                                    var id_mahasiswa = resultmahasiswa[0].id_mahasiswa;
                                    var id_matakuliah = resultmatakuliah[0].id_matakuliah;
                                    var id_ruangan = result[0].id_ruangan;
                            
                                    connection.query('SELECT * FROM jadwal WHERE id_dosen_jadwal = ? AND id_mahasiswa_jadwal = ? AND id_matakuliah_jadwal = ? AND semester = ? AND hari = ? AND jam_mulai = ? AND jam_selesai = ? AND id_ruangan_jadwal = ?', [id_dosen, id_mahasiswa, id_matakuliah, semester, hari, jam_mulai, jam_selesai, id_ruangan], function(error, existingRows, fields){
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: "Gagal memeriksa keberadaan data di database." });
                                        }
                        
                                        if (existingRows.length > 0) {
                                            return res.status(400).json({ error: "Jadwal sudah ada." });
                                        } else {
                                            connection.query('UPDATE jadwal SET id_dosen_jadwal=?, id_mahasiswa_jadwal=?, id_matakuliah_jadwal=?, semester=?, hari=?, jam_mulai=?, jam_selesai=?, id_ruangan_jadwal=? WHERE id_jadwal=?', [id_dosen, id_mahasiswa, id_matakuliah, semester, hari, jam_mulai, jam_selesai, id_ruangan,id], function(error, rows, fields){
                                                if(error){
                                                    console.log(error);
                                                    return res.status(500).json({ error: "Gagal Mengubah data ke database." });
                                                } else {
                                                    return res.status(200).json({ message: "Berhasil Mengubah data." });
                                                }
                                            });
                                        }
                                    });
                                } 
                            });
                        } 
                    });
                } 
            });
        } 
    });
};
exports.hapusjadwal = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM jadwal WHERE id_jadwal=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID"+ id +"tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};

//Presensi
exports.getalldatapresensi = function(req, res) {
    
    connection.query('SELECT presensi.*, jadwal.*, dosen.*, matakuliah.*, ruangan.*, mahasiswa.*, kelas.* FROM presensi JOIN jadwal ON presensi.id_jadwal = jadwal.id_jadwal JOIN dosen ON jadwal.id_dosen_jadwal = dosen.id_dosen JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_ruangan_jadwal = ruangan.id_ruangan JOIN mahasiswa ON jadwal.id_mahasiswa_jadwal = mahasiswa.id_mahasiswa JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas;', function(error, rows, fields) {
        if (error) {
            console.log(error);  
        } else {
            response.ok(rows, res);
        }
    });
};
exports.getpresensibyid =function(req,res){
    let id = req.params.id;
    connection.query('SELECT presensi.*, jadwal.*, dosen.*, matakuliah.*, ruangan.*, mahasiswa.*, kelas.* FROM presensi JOIN jadwal ON presensi.id_jadwal = jadwal.id_jadwal JOIN dosen ON jadwal.id_dosen_jadwal = dosen.id_dosen JOIN matakuliah ON jadwal.id_matakuliah_jadwal = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_ruangan_jadwal = ruangan.id_ruangan JOIN mahasiswa ON jadwal.id_mahasiswa_jadwal = mahasiswa.id_mahasiswa JOIN kelas ON mahasiswa.id_kelas = kelas.id_kelas WHERE presensi.id_presensi = ?', [id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Data dengan ID " + id + " tidak ditemukan" });
        } else {
            return res.status(200).json(rows);
        }
    });
};
exports.getalldatapresensimahasiswa = function (req, res) {
    connection.query('SELECT m.id_mahasiswa, m.npm, m.nama_mahasiswa, m.jk, m.alamat, m.foto, m.status, m.notlp, m.email, m.password, m.id_kelas, mk.id_matakuliah, mk.kode_matakuliah, mk.nama_matakuliah, mk.sks, COUNT(p.id_presensi) AS jumlah_presensi FROM mahasiswa m JOIN jadwal j ON m.id_mahasiswa = j.id_mahasiswa_jadwal JOIN kelas jk ON m.id_kelas = jk.id_kelas JOIN matakuliah mk ON j.id_matakuliah_jadwal = mk.id_matakuliah LEFT JOIN presensi p ON j.id_jadwal = p.id_jadwal GROUP BY m.id_mahasiswa, mk.id_matakuliah;'
        , function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.nestedPresensi(rows, res);
            }
        });
};
exports.getdatapresensimahasiswabyidmahasiswa = function (req, res) {
    let id = req.params.id;

    connection.query('SELECT m.id_mahasiswa, m.npm, m.nama_mahasiswa, m.jk, m.alamat, m.foto, m.status, m.notlp, m.email, m.password, m.id_kelas, mk.id_matakuliah, mk.kode_matakuliah, mk.nama_matakuliah, mk.sks, COUNT(p.id_presensi) AS jumlah_presensi FROM mahasiswa m JOIN jadwal j ON m.id_mahasiswa = j.id_mahasiswa_jadwal JOIN kelas jk ON m.id_kelas = jk.id_kelas JOIN matakuliah mk ON j.id_matakuliah_jadwal = mk.id_matakuliah LEFT JOIN presensi p ON j.id_jadwal = p.id_jadwal WHERE j.id_mahasiswa_jadwal=? GROUP BY m.id_mahasiswa, mk.id_matakuliah;'
        ,[id], function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.nestedPresensi(rows, res);
            }
        });
};
exports.getdatapresensimahasiswabyiddosen = function (req, res) {
    let id = req.params.id;

    connection.query('SELECT m.id_mahasiswa, m.npm, m.nama_mahasiswa, m.jk, m.alamat, m.foto, m.status, m.notlp, m.email, m.password, m.id_kelas, mk.id_matakuliah, mk.kode_matakuliah, mk.nama_matakuliah, mk.sks, COUNT(p.id_presensi) AS jumlah_presensi FROM mahasiswa m JOIN jadwal j ON m.id_mahasiswa = j.id_mahasiswa_jadwal JOIN kelas jk ON m.id_kelas = jk.id_kelas JOIN matakuliah mk ON j.id_matakuliah_jadwal = mk.id_matakuliah LEFT JOIN presensi p ON j.id_jadwal = p.id_jadwal WHERE j.id_dosen_jadwal=? GROUP BY m.id_dosen, mk.id_matakuliah;'
        ,[id], function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.nestedPresensi(rows, res);
            }
        });
};
exports.tambahdatapresensi = function(req, res) {
    var kode_matakuliah = req.body.kode_matakuliah;
    var waktu = req.body.waktu;
    var lokasi = req.body.lokasi;

    if (!kode_matakuliah) {
        return res.status(400).json({ error: "kode matakuliah harus diisi." });
    }

    if (!waktu) {
        return res.status(400).json({ error: "waktu harus diunggah." });
    }

    connection.query('SELECT id_matakuliah FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function(error, resultkode, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID matakuliah dari database." });
        }

        if (resultkode.length === 0) {
            return res.status(400).json({ error: "matakuliah tidak ditemukan." });
        } else {
            var id_matakuliah = resultkode[0].id_matakuliah;
            connection.query('SELECT id_jadwal FROM jadwal WHERE id_matakuliah_jadwal = ?', [id_matakuliah], function(error, resultjadwal, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mencari ID jadwal dari database." });
                }

                if (resultjadwal.length === 0) {
                    return res.status(400).json({ error: "jadwal tidak ditemukan." });
                } else {
                    var id_jadwal = resultjadwal[0].id_jadwal;
                    connection.query('INSERT INTO presensi (id_jadwal, waktu, lokasi) VALUES (?, ?, ?)', [id_jadwal, waktu, lokasi], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: "Gagal menambahkan data ke database." });
                        } else {
                            return res.status(200).json({ message: "Berhasil Menambahkan data." });
                        }
                    });
                }
            });
        }
    });
};
exports.ubahdatapresensi = function(req, res) {
    let id = req.params.id;
    var kode_matakuliah = req.body.kode_matakuliah;
    var waktu = req.body.waktu;
    var lokasi = req.body.lokasi;

    if (!kode_matakuliah) {
        return res.status(400).json({ error: "kode matakuliah harus diisi." });
    }

    if (!waktu) {
        return res.status(400).json({ error: "waktu harus diunggah." });
    }

    connection.query('SELECT id_matakuliah FROM matakuliah WHERE kode_matakuliah = ?', [kode_matakuliah], function(error, resultkode, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Gagal mencari ID matakuliah dari database." });
        }

        if (resultkode.length === 0) {
            return res.status(400).json({ error: "matakuliah tidak ditemukan." });
        } else {
            var id_matakuliah = resultkode[0].id_matakuliah;
            connection.query('SELECT id_jadwal FROM jadwal WHERE id_matakuliah_jadwal = ?', [id_matakuliah], function(error, resultjadwal, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Gagal mencari ID jadwal dari database." });
                }

                if (resultjadwal.length === 0) {
                    return res.status(400).json({ error: "jadwal tidak ditemukan." });
                } else {
                    var id_jadwal = resultjadwal[0].id_jadwal;
                    connection.query('UPDATE presensi SET id_jadwal=?, waktu=?, lokasi=? WHERE id_presensi=?', [id_jadwal, waktu, lokasi,id], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: "Gagal Mengubah data ke database." });
                        } else {
                            return res.status(200).json({ message: "Berhasil mengubah data." });
                        }
                    });
                }
            });
        }
    });
};
exports.hapuspresensi = function (req, res) {
    let id = req.params.id;
    connection.query('DELETE FROM presensi WHERE id=?',[id],function(error, rows, fields) {
        if (error) {
            console.log(error);  
           return res.status(500).json({ error: "data dengan ID"+ id +"tidak ditemukan" });
        } else {
            response.ok("Data Berhasil Dihapus", res);
        }
    });
};