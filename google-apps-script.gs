/**
 * Google Apps Script — Wedding Invitation Backend
 * 
 * SETUP:
 * 1. Buka Google Sheets baru
 * 2. Buat 2 sheet: "Daftar Tamu" dan "RSVP"
 * 3. Buka Extensions > Apps Script
 * 4. Paste seluruh kode ini ke editor
 * 5. Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL deployment, paste ke script.js (CONFIG.googleScriptUrl)
 */

// ===== SHEET CONFIG =====
const SHEET_TAMU = 'Daftar Tamu';
const SHEET_RSVP = 'RSVP';
const DOMAIN = 'https://yourusername.github.io/undangan-anti'; // Ganti dengan domain kamu

// ===== SETUP: Jalankan fungsi ini SEKALI untuk membuat header ===== 
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // --- Sheet 1: Daftar Tamu ---
  let sheetTamu = ss.getSheetByName(SHEET_TAMU);
  if (!sheetTamu) {
    sheetTamu = ss.insertSheet(SHEET_TAMU);
  }
  sheetTamu.getRange('A1:D1').setValues([['Nama Tamu', 'No. HP', 'Link Undangan', 'Tombol Kirim WA']]);
  sheetTamu.getRange('A1:D1').setFontWeight('bold').setBackground('#8FAE8B').setFontColor('#FFFFFF');
  sheetTamu.setColumnWidth(1, 200);
  sheetTamu.setColumnWidth(2, 150);
  sheetTamu.setColumnWidth(3, 300);
  sheetTamu.setColumnWidth(4, 350);

  // Contoh data + formula
  sheetTamu.getRange('A2').setValue('Budi');
  sheetTamu.getRange('B2').setValue('6281234567890');
  
  // Formula Link Undangan (Kolom C)
  sheetTamu.getRange('C2').setFormula(
    '=HYPERLINK("' + DOMAIN + '/?to="&ENCODEURL(A2), "' + DOMAIN + '/?to="&A2)'
  );
  
  // Formula Tombol Kirim WA (Kolom D)  
  sheetTamu.getRange('D2').setFormula(
    '=HYPERLINK("https://wa.me/"&B2&"?text="&ENCODEURL("Assalamualaikum, "&A2&". Kami mengundang Anda ke pernikahan kami. Klik untuk membuka undangan: ' + DOMAIN + '/?to="&ENCODEURL(A2)), "📩 Kirim WA ke "&A2)'
  );

  // --- Sheet 2: RSVP ---
  let sheetRSVP = ss.getSheetByName(SHEET_RSVP);
  if (!sheetRSVP) {
    sheetRSVP = ss.insertSheet(SHEET_RSVP);
  }
  sheetRSVP.getRange('A1:E1').setValues([['Timestamp', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Pesan']]);
  sheetRSVP.getRange('A1:E1').setFontWeight('bold').setBackground('#C8A96E').setFontColor('#FFFFFF');
  sheetRSVP.setColumnWidth(1, 180);
  sheetRSVP.setColumnWidth(2, 200);
  sheetRSVP.setColumnWidth(3, 120);
  sheetRSVP.setColumnWidth(4, 120);
  sheetRSVP.setColumnWidth(5, 350);

  SpreadsheetApp.getUi().alert('✅ Setup selesai! Sheet "Daftar Tamu" dan "RSVP" sudah siap.');
}

// ===== WEB APP: Handle POST dari website =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_RSVP);

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    
    const kehadiranMap = {
      'hadir': '✅ Hadir',
      'tidak': '❌ Tidak Hadir',
      'ragu': '🤔 Masih Ragu'
    };

    sheet.appendRow([
      timestamp,
      data.name || '',
      kehadiranMap[data.attendance] || data.attendance,
      data.guests || 1,
      data.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data RSVP berhasil disimpan!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== WEB APP: Handle GET (test endpoint) =====
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Wedding RSVP API is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
