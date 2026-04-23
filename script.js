/**
 * Digital Wedding Invitation — Script
 * Features: Guest name, Cover toggle, Countdown, Music, RSVP, Gallery lightbox, Map, AOS
 */

(function () {
  'use strict';

  // ===== CONFIG =====
  const CONFIG = {
    weddingDate: new Date('2026-09-20T08:00:00+07:00'),
    venue: {
      name: 'Gedung Serba Guna, Bekasi',
      lat: -6.2383,
      lng: 106.9756,
    },
    // Using a royalty-free music URL (placeholder — replace with actual file)
    musicUrl: 'https://cdn.pixabay.com/audio/2024/11/28/audio_3049ea498e.mp3',
    // Google Apps Script Web App URL — paste your deployment URL here
    googleScriptUrl: '',
  };

  // ===== DOM ELEMENTS =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const cover = $('#cover');
  const mainContent = $('#main-content');
  const openBtn = $('#open-invitation-btn');
  const guestNameEl = $('#guest-name');
  const musicToggle = $('#music-toggle');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxClose = $('#lightbox-close');
  const rsvpBtn = $('#rsvp-btn');

  // ===== 1. GUEST NAME PERSONALIZATION =====
  function initGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to');
    if (guestName) {
      guestNameEl.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
    }
  }

  // ===== 2. COVER / OPEN INVITATION =====
  let bgMusic = null;

  function openInvitation() {
    // Hide cover
    cover.classList.add('hidden');
    document.body.classList.remove('no-scroll');

    // Show main content
    mainContent.classList.add('visible');

    // Show music toggle
    musicToggle.classList.add('visible');

    // Init AOS after content is visible
    setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic',
      });

      // Init map
      initMap();

      // Start music
      startMusic();
    }, 400);

    // Remove cover from DOM after animation
    setTimeout(() => {
      cover.style.display = 'none';
    }, 1000);
  }

  // ===== 3. BACKGROUND MUSIC (Howler.js) =====
  function startMusic() {
    if (bgMusic) return;

    bgMusic = new Howl({
      src: [CONFIG.musicUrl],
      loop: true,
      volume: 0.4,
      html5: true,
      onplay: () => {
        musicToggle.classList.add('playing');
      },
      onpause: () => {
        musicToggle.classList.remove('playing');
      },
      onstop: () => {
        musicToggle.classList.remove('playing');
      },
    });

    bgMusic.play();
  }

  function toggleMusic() {
    if (!bgMusic) {
      startMusic();
      return;
    }

    if (bgMusic.playing()) {
      bgMusic.pause();
    } else {
      bgMusic.play();
    }
  }

  // ===== 4. COUNTDOWN TIMER =====
  function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      $('#cd-days').textContent = '00';
      $('#cd-hours').textContent = '00';
      $('#cd-minutes').textContent = '00';
      $('#cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    $('#cd-days').textContent = String(days).padStart(2, '0');
    $('#cd-hours').textContent = String(hours).padStart(2, '0');
    $('#cd-minutes').textContent = String(minutes).padStart(2, '0');
    $('#cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ===== 5. GALLERY LIGHTBOX =====
  function initGallery() {
    const items = $$('.gallery-item');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    });

    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // ===== 6. LEAFLET MAP =====
  function initMap() {
    const map = L.map('map', {
      scrollWheelZoom: false,
    }).setView([CONFIG.venue.lat, CONFIG.venue.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 36px; height: 36px;
        background: linear-gradient(135deg, #8FAE8B, #6B8E68);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: center;
      "><span style="transform: rotate(45deg); color: white; font-size: 14px;">♥</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    L.marker([CONFIG.venue.lat, CONFIG.venue.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<div style="text-align:center; font-family: 'Poppins', sans-serif; padding: 0.3rem;">
          <strong style="color: #3A3A3A;">${CONFIG.venue.name}</strong><br>
          <small style="color: #8A8A8A;">Lokasi Resepsi</small>
        </div>`
      );

    // Fix map rendering issues
    setTimeout(() => map.invalidateSize(), 500);
  }

  // ===== 7. RSVP (SweetAlert2) =====
  function initRSVP() {
    rsvpBtn.addEventListener('click', () => {
      Swal.fire({
        title: 'Konfirmasi Kehadiran',
        html: `
          <div class="swal-rsvp-form">
            <label for="rsvp-name">Nama Lengkap</label>
            <input type="text" id="rsvp-name" placeholder="Masukkan nama Anda" value="${guestNameEl.textContent !== 'Tamu Undangan' ? guestNameEl.textContent : ''}">

            <label for="rsvp-attendance">Kehadiran</label>
            <select id="rsvp-attendance">
              <option value="">-- Pilih --</option>
              <option value="hadir">✅ Hadir</option>
              <option value="tidak">❌ Tidak Hadir</option>
              <option value="ragu">🤔 Masih Ragu</option>
            </select>

            <label for="rsvp-guests">Jumlah Tamu</label>
            <input type="number" id="rsvp-guests" min="1" max="5" value="1" placeholder="1">

            <label for="rsvp-message">Ucapan & Doa</label>
            <textarea id="rsvp-message" rows="3" placeholder="Tulis ucapan untuk kedua mempelai..."></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Kirim',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#8FAE8B',
        cancelButtonColor: '#d4d4d4',
        customClass: {
          popup: 'swal-rsvp-popup',
        },
        preConfirm: () => {
          const name = document.getElementById('rsvp-name').value.trim();
          const attendance = document.getElementById('rsvp-attendance').value;
          const guests = document.getElementById('rsvp-guests').value;
          const message = document.getElementById('rsvp-message').value.trim();

          if (!name) {
            Swal.showValidationMessage('Mohon masukkan nama Anda');
            return false;
          }
          if (!attendance) {
            Swal.showValidationMessage('Mohon pilih status kehadiran');
            return false;
          }

          return { name, attendance, guests, message };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const d = result.value;
          const attendText =
            d.attendance === 'hadir'
              ? 'Hadir'
              : d.attendance === 'tidak'
              ? 'Tidak Hadir'
              : 'Masih Ragu';

          // Send data to Google Sheets
          submitRSVP(d).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Terima Kasih! 🎉',
              html: `
                <p style="font-size:0.9rem; color: #5A5A5A;">
                  <strong>${d.name}</strong><br>
                  Status: ${attendText}<br>
                  Jumlah tamu: ${d.guests} orang
                  ${d.message ? `<br><br><em>"${d.message}"</em>` : ''}
                </p>
              `,
              confirmButtonText: 'Tutup',
              confirmButtonColor: '#8FAE8B',
            });
          });
        }
      });
    });
  }

  // ===== 8. SUBMIT RSVP TO GOOGLE SHEETS =====
  async function submitRSVP(data) {
    if (!CONFIG.googleScriptUrl) {
      console.log('RSVP Data (Google Sheets URL not configured):', data);
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Mengirim...',
      text: 'Menyimpan konfirmasi kehadiran Anda',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await fetch(CONFIG.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log('RSVP submitted successfully:', data);
    } catch (error) {
      console.error('RSVP submission error:', error);
      // Still show success to user (no-cors doesn't return response)
    }
  }

  // ===== INIT =====
  function init() {
    initGuestName();
    initCountdown();
    initGallery();
    initRSVP();

    // Open invitation button
    openBtn.addEventListener('click', openInvitation);

    // Music toggle
    musicToggle.addEventListener('click', toggleMusic);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
