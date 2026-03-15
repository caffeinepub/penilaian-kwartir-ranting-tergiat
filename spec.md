# Penilaian Kwartir Ranting Tergiat

## Current State
Admin pembantu ditambahkan langsung oleh admin utama via Principal ID dan langsung bisa mengakses form penilaian tanpa verifikasi tambahan.

## Requested Changes (Diff)

### Add
- Alur pendaftaran admin pembantu: pengguna yang login bisa mengajukan permintaan menjadi admin pembantu
- Backend: set `pendingAdminPembantu` untuk menyimpan permintaan yang belum diverifikasi
- Backend: fungsi `requestAdminPembantu()` - pengguna mengajukan permintaan
- Backend: fungsi `approveAdminPembantu(principal)` - admin menyetujui permintaan
- Backend: fungsi `rejectAdminPembantu(principal)` - admin menolak permintaan
- Backend: fungsi `getPendingAdminPembantu()` - admin melihat daftar pending
- Backend: fungsi `isCallerPendingAdminPembantu()` - cek status pending
- Frontend: tab baru di AdminView "Permintaan Masuk" untuk approve/reject
- Frontend: tampilan "Menunggu Verifikasi" untuk pengguna yang sudah request tapi belum disetujui
- Frontend: tombol "Daftar sebagai Admin Pembantu" di halaman home untuk pengguna biasa

### Modify
- `isCallerAdminPembantu()` tetap hanya return true untuk yang sudah disetujui
- AdminView: tab "Kelola Admin Pembantu" menampilkan daftar approved + pending dengan aksi approve/reject
- HomePage: jika user pending, tampilkan halaman tunggu verifikasi, bukan form penilaian

### Remove
- Penambahan admin pembantu langsung via Principal ID oleh admin (diganti dengan alur approve dari permintaan)

## Implementation Plan
1. Update backend main.mo: tambah pendingAdminPembantu set, fungsi request/approve/reject/getPending
2. Update useQueries.ts: tambah hook untuk request, approve, reject, getPending, isPending
3. Update HomePage.tsx: tambah AdminPembantuPendingView, tombol daftar di UserView, tab permintaan di AdminView
