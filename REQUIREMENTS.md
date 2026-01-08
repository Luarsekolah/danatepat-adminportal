# Analisis Requirement: Fitur Manajemen Program Bantuan

## Deskripsi Umum
Fitur ini memungkinkan admin mengelola daftar program bantuan secara komprehensif, mulai dari pembuatan program, pengaturan alokasi anggaran, hingga monitoring dan pelaporan kegiatan program.

---

## 1. Input Data Program Bantuan

### 1.1 Nama Program
- **Tipe Data:** Text
- **Contoh:** Program Bantuan ITB
- **Status:** Wajib

### 1.2 Nama Sub Program
- **Tipe Data:** Multiple entries (minimal 1)
- **Contoh:**
  - Bantuan Makan Siang
  - Bantuan Pembelian Buku
  - Bantuan Tuition
- **Status:** Wajib (minimal satu harus ada)

### 1.3 Total Anggaran
- **Tipe Data:** Numeric (Currency)
- **Contoh:** 10.000.000
- **Status:** Wajib

### 1.4 Donatur
- **Tipe Data:** Text
- **Contoh:** Kampus ITB
- **Status:** Wajib

### 1.5 Alokasi Nominal per Sub Program
- **Tipe Data:** Multiple entries dengan denomination per sub program
- **Keterangan:** Total alokasi didistribusikan ke semua sub program yang terdaftar
- **Contoh:**
  - Bantuan Makan Siang: 300.000
  - Bantuan Pembelian Buku: 300.000
  - Bantuan Tuition: 400.000
- **Status:** Wajib

### 1.6 Nominal Maksimal per Transaksi Penerima
- **Tipe Data:** Numeric (Currency)
- **Contoh:** 50.000
- **Keterangan:** Batas maksimal nominal yang dapat ditransaksikan penerima manfaat dalam sekali transaksi
- **Status:** Wajib

### 1.7 Expired Token
- **Tipe Data:** Date/Calendar Input
- **Keterangan:** Waktu berlakunya token setelah ditransfer ke penerima manfaat
- **Status:** Wajib

### 1.8 Maksimal Transaksi Merchant per Hari
- **Tipe Data:** Numeric (Integer)
- **Contoh:** 10 kali transaksi
- **Keterangan:** Batas maksimal jumlah transaksi yang dapat diterima merchant dalam sehari
- **Status:** Wajib

### 1.9 Tanggal Mulai Program
- **Tipe Data:** Date/Calendar Input
- **Keterangan:** Tanggal program dimulai dan sistem mulai melakukan distribusi donasi
- **Status:** Wajib

### 1.10 Status Program
- **Tipe Data:** Enumeration
- **Pilihan:**
  - **Draft:** Status default ketika program pertama kali dibuat
  - **Aktif:** Status otomatis ketika memasuki tanggal mulai program (sistem otomatis mengubah status dan mulai distribusi dana)
  - **Tidak Aktif:** Status manual atau ketika program sudah berakhir
- **Status:** Sistem generate (bukan input manual)

---

## 2. Aksi Tambahan per Program

### 2.1 Daftar Merchant

#### Fungsi
Admin dapat menambahkan daftar merchant yang terafiliasi ke program per sub program.

#### Format Upload
- **Media:** CSV File
- **Struktur Kolom:**
  | No | Nama Usaha | Kategori Usaha | Alamat | Geo Location | No. HP | Email | Norek Bank | Nama Pemilik Rekening | Bank |

#### Contoh Alokasi Merchant per Sub Program
- Bantuan Makan Siang: Merchant A, Merchant B
- Bantuan Pembelian Buku: Merchant C, Merchant D
- Bantuan Tuition: Merchant E, Merchant F

### 2.2 Daftar Penerima Manfaat

#### Fungsi
Admin dapat menambahkan daftar penerima manfaat yang terafiliasi ke program.

#### Format Upload
- **Media:** CSV File
- **Struktur Kolom:**
  | No | Nama Lengkap Sesuai KTP | NIK KTP | Tanggal Lahir | No. HP | Email | URL Foto KTP | URL Foto |

#### Validasi
- **Kuota Check:** Jika jumlah data penerima manfaat yang diupload melebihi kuota yang ditentukan, sistem menolak proses upload

---

## 3. Fitur Pengawasan (Monitoring)

### 3.1 Informasi yang Ditampilkan

#### Dana Terpakai per Periode
- Menampilkan total dana yang sudah digunakan dalam periode waktu tertentu
- **Tipe Visualisasi:** Time-based chart atau table

#### Sisa Saldo Rekening Pooling
- Menampilkan remaining balance di rekening pooling dana program
- **Tipe Visualisasi:** Balance indicator

#### Settlement ke Merchant
- Menampilkan total jumlah settlement yang sudah dibayarkan ke merchant
- **Tipe Visualisasi:** Numeric summary

#### Persentase Realisasi Program
- Menampilkan progress realisasi program dibanding target
- **Catatan:** Perlu pendalaman lebih lanjut dengan PO

#### Token yang Tidak Terserap
- Menampilkan jumlah token yang tidak terpakai atau expired
- **Tipe Visualisasi:** Numeric summary

### 3.2 Activity Log

#### Konten
Menampilkan 5-10 aktivitas terbaru yang terjadi pada program, meliputi:
- Transaksi donasi oleh donatur
- Transaksi penerima manfaat ke merchant
- Transaksi settlement dari rekening pooling ke merchant

#### Format
- **Tipe Visualisasi:** Activity timeline atau log list
- **Sorting:** Reverse chronological (terbaru di atas)

---

## 4. Statistik Daftar Program Bantuan

Menu daftar program dilengkapi dengan informasi statistik berikut:

| Metrik                 | Deskripsi                                              |
| ---------------------- | ------------------------------------------------------ |
| Total Semua Program    | Jumlah keseluruhan program bantuan yang ada di sistem  |
| Total Program Aktif    | Jumlah program yang statusnya "Aktif"                  |
| Total Dana Keseluruhan | Total anggaran dari semua program yang ada             |
| Total Penerima Manfaat | Jumlah keseluruhan penerima manfaat dari semua program |

---

## 5. Fitur Tambahan

### 5.1 Pagination
- Menu daftar program bantuan dilengkapi dengan pagination data
- Memudahkan admin navigasi ketika data program berjumlah banyak

---

## 6. User Flow Diagram

```
Admin membuat Program Bantuan
    ↓
Input: Nama Program, Sub Program(s), Anggaran, Donatur, Alokasi per Sub, dll
    ↓
Status → "Draft" (Otomatis)
    ↓
Upload Merchant (per Sub Program)
    ↓
Upload Penerima Manfaat (Validate kuota)
    ↓
Menunggu Tanggal Mulai Program...
    ↓
Tanggal Mulai = Today
    ↓
Sistem otomatis:
  - Ubah Status → "Aktif"
  - Mulai distribusi dana ke penerima manfaat
    ↓
Monitoring & Pengawasan:
  - Track dana terpakai
  - Lihat activity log
  - Review statistik program
```

---

## 7. Catatan Penting

- **Validasi Data:** Sistem harus validasi bahwa total alokasi sub program ≤ Total Anggaran Program
- **Automation:** Status program otomatis berubah dari Draft → Aktif pada tanggal mulai program
- **Token Management:** Sistem harus track expired token dan report di dashboard pengawasan
- **Merchant Limit:** Sistem harus enforce batasan transaksi merchant per hari
- **Beneficiary Limit:** Sistem harus enforce batasan nominal per transaksi penerima manfaat
- **PO Coordination:** Persentase realisasi program memerlukan koordinasi lebih lanjut dengan Product Owner untuk metodologi perhitungan