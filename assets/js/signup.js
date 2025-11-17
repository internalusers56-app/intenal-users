// ===================================================================================
// FILE: assets/js/signup.js - PERBAIKAN LAYOUT/SWIPER
// ===================================================================================

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzMCXwyyyVHPW3Qvt-Ff8-MW2EfV_j8rAYNIs1EjbOa3of-5-Btk5nSUlwF0wJ_LRpJvA/exec'; 

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');
const SWIPER_SELECTOR = '.login__swiper'; // Gunakan selector umum


// ===========================================
// FUNGSI UTILITY (showToast, setLoadingState - TETAP SAMA)
// ===========================================
// ... (Tulis ulang fungsi showToast dan setLoadingState di sini) ...
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.innerHTML = ''; 
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { toast.remove(); }, 500); }, 5000);
}

function setLoadingState(isLoading) {
    if (isLoading) {
        signupButton.disabled = true; 
        signupButton.innerHTML = '<span class="loading-spinner"></span> Mendaftar...';
    } else {
        signupButton.disabled = false; 
        signupButton.innerHTML = 'Daftar Sekarang';
    }
}


// ===========================================
// LOGIKA FORM SUBMISSION (TETAP SAMA)
// ===========================================
signupForm.addEventListener('submit', async (e) => {
    // ... (Logika fetch ke GAS) ...
    e.preventDefault();
    
    const formData = {
        fullname: document.getElementById('fullname-input').value.trim(),
        whatsapp: document.getElementById('whatsapp-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
    };

    for (const key in formData) {
        if (!formData[key]) {
            showToast(`Field ${key.replace('Input', '').toUpperCase()} tidak boleh kosong.`, 'error');
            return;
        }
    }

    setLoadingState(true); 

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            redirect: 'follow', 
            headers: { 'Content-Type': 'text/plain;charset=utf-8', },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            signupForm.reset(); 
        } else {
            showToast(result.message, 'error');
        }

    } catch (error) {
        console.error('Error saat koneksi ke GAS:', error);
        showToast('Gagal terhubung ke server. Silakan coba lagi.', 'error');
    } finally {
        setLoadingState(false); 
    }
});


// ===========================================
// LOGIKA ON LOAD (KHUSUS SIGNUP & SWIPER)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // A. SWIPER INITIALIZATION KHUSUS
    // Kita cek apakah ini halaman signup (dengan mengecek ID unik)
    // Jika ada ID "signup-swiper-container" (dari HTML yang kita sepakati)
    const swiperElement = document.getElementById('signup-swiper-container');
    
    if (swiperElement && typeof Swiper !== 'undefined') {
        // PENTING: Jangan hapus class apapun! Biarkan main.js juga mencoba jika itu halaman lain.

        // Periksa apakah Swiper BELUM diinisialisasi oleh main.js (jika main.js sudah berjalan)
        // Jika element belum memiliki data Swiper, inisialisasi di sini.
        // Jika main.js berjalan duluan (yang mungkin terjadi), ia akan crash (error awal kita).
        
        // Agar aman, kita inisialisasi Swiper di sini dan biarkan main.js yang mengaturnya di halaman lain.
        
        // Inisialisasi Swiper menggunakan selector umum karena kita tidak bisa mengandalkan timing
        // Jika Anda masih mendapatkan error, HAPUS BARIS INI dan pastikan main.js diubah untuk mengecualikan halaman signup.
        new Swiper(swiperElement, { // Menggunakan elemen HTML langsung
            loop: true, 
            spaceBetween: 32,
            grabCursor: true,
            pagination: {
                el: swiperElement.querySelector('.swiper-pagination'),
                clickable: true,
            },
            autoplay: {
                 delay: 3000, 
                 disableOnInteraction: false, 
            },
        });
    }

    // B. TOGGLE PASSWORD EYE
    if(loginEye && passwordInput) {
        loginEye.addEventListener('click', () => {
            if(passwordInput.type === 'password'){
                passwordInput.type = 'text';
                loginEye.classList.replace('ri-eye-line', 'ri-eye-off-line');
            } else {
                passwordInput.type = 'password';
                loginEye.classList.replace('ri-eye-off-line', 'ri-eye-line');
            }
        });
    }
});
