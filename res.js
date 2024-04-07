'use strict';

exports.ok = function(values, res){
    var data ={
        'status' :200,
        'values' : values
    };
     res.json(data);
     res.end();
};
exports.nested = function (values, res) {
    const hasil = values.reduce((pengelompokan, item) => {
        if (pengelompokan[item.nama_mahasiswa]) {
            const group = pengelompokan[item.nama_mahasiswa];
            group.jadwal.push({
                hari: item.hari,
                jam_mulai: item.jam_mulai,
                jam_selesai: item.jam_selesai,
                semester: item.semester,
                nama_kelas: item.nama_kelas,
                nama_matakuliah: item.nama_matakuliah,
                sks: item.sks
            });
        } else {
            pengelompokan[item.nama_mahasiswa] = {
                id_mahasiswa: item.id_mahasiswa,
                npm: item.npm,
                nama_mahasiswa: item.nama_mahasiswa,
                jk: item.jk,
                alamat: item.alamat,
                foto: item.foto,
                status: item.status,
                notlp: item.notlp,
                email: item.email,
                password: item.password,
                id_kelas: item.id_kelas,
                jadwal: [{
                    hari: item.hari,
                    jam_mulai: item.jam_mulai,
                    jam_selesai: item.jam_selesai,
                    semester: item.semester,
                    nama_kelas: item.nama_kelas,
                    nama_matakuliah: item.nama_matakuliah,
                    sks: item.sks
                }]
            };
        }
        return pengelompokan;
    }, {});

    var data = {
        'status': 200,
        'values': Object.values(hasil) 
    };
    res.json(data);
    res.end();
};

exports.nestedPresensi = function (values, res) {
    const hasil = values.reduce((pengelompokan, item) => {
        if (pengelompokan[item.nama_mahasiswa]) {
            const group = pengelompokan[item.nama_mahasiswa];
            if (Array.isArray(group.jadwal)) {
                group.jadwal.push({
                    hari: item.hari,
                    jam_mulai: item.jam_mulai,
                    jam_selesai: item.jam_selesai,
                    semester: item.semester,
                    nama_kelas: item.nama_kelas,
                    nama_matakuliah: item.nama_matakuliah,
                    sks: item.sks,
                    jumlah_presensi: item.jumlah_presensi
                });
            } else {
                group.jadwal = [{
                    hari: group.hari,
                    jam_mulai: group.jam_mulai,
                    jam_selesai: group.jam_selesai,
                    semester: group.semester,
                    nama_kelas: group.nama_kelas,
                    nama_matakuliah: group.nama_matakuliah,
                    sks: group.sks,
                    jumlah_presensi: group.jumlah_presensi
                }, {
                    hari: item.hari,
                    jam_mulai: item.jam_mulai,
                    jam_selesai: item.jam_selesai,
                    semester: item.semester,
                    nama_kelas: item.nama_kelas,
                    nama_matakuliah: item.nama_matakuliah,
                    sks: item.sks,
                    jumlah_presensi: item.jumlah_presensi
                }];
                delete group.hari;
                delete group.jam_mulai;
                delete group.jam_selesai;
                delete group.semester;
                delete group.nama_kelas;
                delete group.nama_matakuliah;
                delete group.sks;
                delete group.jumlah_presensi;
            }
        } else {
            pengelompokan[item.nama_mahasiswa] = {
                id_mahasiswa: item.id_mahasiswa,
                npm: item.npm,
                nama_mahasiswa: item.nama_mahasiswa,
                jk: item.jk,
                alamat: item.alamat,
                foto: item.foto,
                status: item.status,
                notlp: item.notlp,
                email: item.email,
                password: item.password,
                id_kelas: item.id_kelas,
                jadwal: [{
                    hari: item.hari,
                    jam_mulai: item.jam_mulai,
                    jam_selesai: item.jam_selesai,
                    semester: item.semester,
                    nama_kelas: item.nama_kelas,
                    nama_matakuliah: item.nama_matakuliah,
                    sks: item.sks,
                    jumlah_presensi: item.jumlah_presensi
                }]
            };
        }
        return pengelompokan;
    }, {});

    var data = {
        'status': 200,
        'values': Object.values(hasil) 
    };
    res.json(data);
    res.end();
};
