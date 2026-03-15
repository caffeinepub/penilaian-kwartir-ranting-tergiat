# Penilaian Kwartir Ranting Tergiat

## Current State
Proyek baru, belum ada implementasi.

## Requested Changes (Diff)

### Add
- Aplikasi penilaian Kwartir Ranting Tergiat dengan tiga bagian utama:
  - A. Profil Kwartir Ranting (5 item)
  - B. Data Potensi (6 item)
  - C. Realisasi Program Kegiatan 5 Tahun (4 kategori, total 30+ sub-item)
- Sistem scoring otomatis berdasarkan jawaban dan frekuensi kegiatan
- Upload berkas bukti pendukung (foto, dokumen)
- Rekapitulasi hasil penilaian per bagian
- Admin dapat melihat semua penilaian yang masuk
- Form multi-step dengan navigasi antar bagian

### Modify
- Tidak ada

### Remove
- Tidak ada

## Implementation Plan
1. Backend: Motoko actor untuk menyimpan data penilaian, profil, potensi, dan realisasi kegiatan
2. Authorization: admin dan penilai
3. Blob storage: upload berkas bukti
4. Frontend: form multi-step dengan semua pertanyaan lengkap
5. Dashboard rekapitulasi hasil penilaian
