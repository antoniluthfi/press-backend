## Script
#### 1. Menggunakan Yarn
- `yarn migrate:up`: untuk melakukan create tabel database
- `yarn migrate:up --filename=nama_file_migration`: untuk melakukan create tabel database pada salah satu file migration
- `yarn migrate:down`: untuk melakukan drop tabel database
- `yarn migrate:down --filename=nama_file_migration`: untuk melakukan drop tabel database pada salah satu file migration
- `yarn migrate:refresh`: untuk melakukan refresh tabel database (ini akan menghilangkan seluruh data didalam tabel tersebut)
- `yarn db:seed`: untuk menambah data pada suatu tabel

#### 2. Menggunakan NPM
- `npm run migrate:up`: untuk melakukan create tabel database
- `npm run migrate:down`: untuk melakukan drop tabel database
- `npm run migrate:refresh`: untuk melakukan refresh tabel database (ini akan menghilangkan seluruh data didalam tabel tersebut)
- `npm run db:seed`: untuk menambah data pada suatu tabel

## Detail Database
- `users`: Tabel untuk menyimpan informasi pengguna (dosen dan mahasiswa)
- `courses`: Tabel untuk menyimpan informasi mata kuliah
- `user_courses`: Tabel untuk menentukan informasi mengenai suatu mata kuliah dapat diikuti oleh mahasiswa yang mana saja
- `course_meetings`: Tabel untuk menyimpan informasi pertemuan dari suatu mata kuliah
- `attendance_records`: Tabel untuk menyimpan catatan presensi mahasiswa
- `qr_codes`: Tabel untuk menyimpan informasi QR code