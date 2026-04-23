# 📋 Setup Google Sheets — Undangan Digital

## Langkah 1: Buat Google Sheets Baru

1. Buka [Google Sheets](https://sheets.google.com) → klik **Blank spreadsheet**
2. Beri nama: **"Data Undangan Pernikahan"**

## Langkah 2: Pasang Apps Script

1. Klik **Extensions** → **Apps Script**
2. Hapus semua kode bawaan di editor
3. Buka file `google-apps-script.gs` dari project ini
4. **Copy-paste** seluruh kode ke editor Apps Script
5. **Penting:** Ganti `DOMAIN` di baris 18 dengan URL hosting kamu:
   ```javascript
   const DOMAIN = 'https://yourusername.github.io/undangan-anti';
   ```
6. Klik **💾 Save** (Ctrl+S)

## Langkah 3: Setup Sheet

1. Di Apps Script editor, pilih fungsi **`setupSheets`** dari dropdown
2. Klik **▶ Run**
3. Beri izin akses saat diminta (klik "Advanced" → "Go to ... (unsafe)" → "Allow")
4. Dua sheet akan otomatis terbuat:
   - **Daftar Tamu** — untuk manajemen tamu & kirim WA
   - **RSVP** — untuk menampung data konfirmasi kehadiran

## Langkah 4: Deploy Web App

1. Klik **Deploy** → **New deployment**
2. Klik ⚙️ gear icon → pilih **Web app**
3. Isi:
   - **Description:** `RSVP API`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Klik **Deploy**
5. **Copy URL** yang muncul (contoh: `https://script.google.com/macros/s/AKfy.../exec`)

## Langkah 5: Hubungkan ke Website

Buka file `script.js`, cari bagian `CONFIG`, paste URL deployment:

```javascript
const CONFIG = {
  // ... config lainnya
  googleScriptUrl: 'https://script.google.com/macros/s/PASTE_URL_DISINI/exec',
};
```

## 📊 Struktur Sheet

### Sheet 1: Daftar Tamu
| Kolom | Isi | Keterangan |
|---|---|---|
| A - Nama Tamu | Input manual | Nama lengkap tamu |
| B - No. HP | Input manual | Format: 6281234567890 (tanpa +) |
| C - Link Undangan | **Formula otomatis** | Auto-generate link `domain/?to=Nama` |
| D - Tombol Kirim WA | **Formula otomatis** | Klik untuk buka WhatsApp + kirim undangan |

> **Cara pakai:** Isi kolom A dan B saja, kolom C dan D otomatis terisi. Klik link di kolom D untuk mengirim undangan via WhatsApp.

### Sheet 2: RSVP
| Kolom | Isi | Keterangan |
|---|---|---|
| A - Timestamp | Otomatis | Waktu tamu mengisi RSVP |
| B - Nama | Otomatis | Nama dari form RSVP |
| C - Kehadiran | Otomatis | ✅ Hadir / ❌ Tidak / 🤔 Ragu |
| D - Jumlah Tamu | Otomatis | Jumlah orang yang hadir |
| E - Pesan | Otomatis | Ucapan & doa dari tamu |

> **Data masuk otomatis** setiap kali tamu mengisi form Konfirmasi Kehadiran di website.

## ⚠️ Troubleshooting

- **CORS error?** Pastikan deploy sebagai "Anyone" dan gunakan `no-cors` mode di fetch
- **Data tidak masuk?** Cek URL deployment sudah benar di `script.js`
- **Mau update script?** Deploy ulang: Deploy → Manage deployments → Edit → New version
