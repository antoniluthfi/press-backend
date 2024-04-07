'use strict'

const { upload } = require('./uploadfotomahasiswa');
const { uploadAdmin } = require('./uploadfotoadmin');
const { uploadDosen } = require('./uploadfotodosen');
const { uploadMakul } = require('./uploadfotomatakuliah');

module.exports = function(app){
    var json = require('./controller');
    

    app.route('/')
    .get(json.index);
//Mahasiswa
    app.route('/tampilsemuadatamahasiswa')
    .get(json.getalldatamahasiswa);
    app.route('/tampildatamahasiswabyid/:id')
    .get(json.getdatamahasiswabyid);
    app.route('/tambahmahasiswa')
    .post(upload.single('foto'), json.tambahdatamahasiswa);
    app.route('/ubahdatamahasiswa/:id')
    .put(upload.single('foto'), json.ubahdatamahasiswa);
    app.route('/hapusdatamahasiswa/:id')
    .delete(json.hapusdatamahasiswa);

//Admin
    app.route('/tampilsemuaadmin')
    .get(json.getalldataadmin);
    app.route('/tampiladminbyid/:id')
    .get(json.getadminbyid);
    app.route('/tambahdataadmin')
    .post(uploadAdmin.single('foto'), json.tambahdataadmin);
    app.route('/ubahdataadmin/:id')
    .put(uploadAdmin.single('foto'), json.ubahdataadmin);
    app.route('/hapusdataadmin/:id')
    .delete(json.hapusdatamaadmin);
//Dosen
    app.route('/tampilsemuadosen')
    .get(json.getalldatadosen);
    app.route('/tampildosenbyid/:id')
    .get(json.getdatadosenbyid);
    app.route('/tambahdatadosen')
    .post(uploadDosen.single('foto'), json.tambahdatadosen);
    app.route('/ubahdatadosen/:id')
    .put(uploadDosen.single('foto'), json.ubahdatadosen);
    app.route('/hapusdatadosen/:id')
    .delete(json.hapusdatadosen);
//Matakuliah
    app.route('/tampilsemuamatakuliah')
    .get(json.getalldatamatakuliah);
    app.route('/tampilmatakuliahbyid/:id')
    .get(json.getdatamatakuliahbyid);
    app.route('/tambahmatakuliah')
    .post(uploadMakul.single('foto'),json.tambahdatamatakuliah);
    app.route('/ubahmatakuliah/:id')
    .put(uploadMakul.single('foto'),json.ubahdatamatakuliah);
    app.route('/hapusmatakuliah/:id')
    .delete(json.hapusdatamatakuliah);
    
//Ruangan
    app.route('/tampilsemuaruangan')
        .get(json.getalldataruangan);
    app.route('/tampilruanganbyid/:id')
        .get(json.getdataruanganbyid);
    app.route('/tambahruangan')
        .post(json.tambahdataruangan);
    app.route('/ubahruangan/:id')
        .put(json.ubahdataruangan);
    app.route('/hapusruangan/:id')
        .delete(json.hapusruangan);
//Kelas
    app.route('/tampilsemuakelas')
        .get(json.getalldatakelas);
    app.route('/tampilkelasbyid/:id')
        .get(json.getdatakelasbyid);
    app.route('/tambahkelas')
        .post(json.tambahdatakelas);
    app.route('/ubahkelasid/:id')
        .put(json.ubahdatakelas);
    app.route('/hapuskelas/:id')
        .delete(json.hapuskelas);
//Jadwal
    app.route('/tampilsemuajadwal')
    .get(json.getalldatajadwal);
    app.route('/tampiljadwalbyid/:id')
    .get(json.getdatajadwalbyid);
    app.route('/tampilsemuajadwalmahasiswa')
    .get(json.getalldatajadwalmahasiswa);
    app.route('/tampiljadwalmahasiswabyidmahasiswa/:id')
    .get(json.getdatajadwalmahasiswabyidmahasiswa);
    app.route('/tambahjadwal')
        .post(json.tambahdatajadwal);
    app.route('/ubahjadwal/:id')
        .put(json.ubahdatajadwal);
    app.route('/hapusjadwal/:id')
        .delete(json.hapusjadwal);
//Presensi
    app.route('/tampilsemuapresensi')
    .get(json.getalldatapresensi);
    app.route('/tampilpresesnsibyid/:id')
    .get(json.getpresensibyid)
    app.route('/tampilpresesnsimahasiswa')
    .get(json.getalldatapresensimahasiswa)
    app.route('/tampilpresesnsibyidmahasiwa/:id')
    .get(json.getdatapresensimahasiswabyidmahasiswa)
    app.route('/tambahpresensi')
        .post(json.tambahdatapresensi);
    app.route('/ubahpresensi/:id')
        .put(json.ubahdatapresensi);
    app.route('/hapuspresensi/:id')
        .delete(json.hapuspresensi);
}