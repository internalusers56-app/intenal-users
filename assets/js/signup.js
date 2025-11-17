// ===================================================================================
// FILE: assets/js/signup.js
// Logika yang disesuaikan untuk tidak merusak main.js
// ===================================================================================

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzMCXwyyyVHPW3Qvt-Ff8-MW2EfV_j8rAYNIs1EjbOa3of-5-Btk5nSUlwF0wJ_LRpJvA/exec'; 

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');
// ... (Hapus const roleSelect) ...


// ===========================================
// FUNGSI UTILITY (Ambil dari main.js atau versi lokal)
// ===========================================

// KARENA main.js MENYEDIAKAN showToast dan setLoadingState, kita tidak perlu mendefinisikannya lagi.
// Jika main.js BELUM TERSEDIA saat dipanggil, gunakan versi lokal:

function showToast(message, type = 'success') {
    // Menggunakan implementasi lokal jika global belum tersedia
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.innerHTML = ''; 
    toastContainer.appendChild(toast);
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
    e.preventDefault();
    
    // ... (Logika validasi dan fetch tetap sama) ...
    // ...
});


// ===========================================
// LOGIKA ON LOAD (KHUSUS SIGNUP)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // A. SWIPER INITIALIZATION KHUSUS (Mengatasi Error main.js)
    const swiperContainerId = 'signup-swiper-container';
    const swiperElement = document.getElementById(swiperContainerId); 
    
    if (swiperElement && typeof Swiper !== 'undefined') {
        // HENTIKAN main.js! Hapus class '.swiper' yang menjadi target main.js
        swiperElement.classList.remove('login__swiper', 'swiper'); 

        // Inisialisasi Swiper di sini menggunakan ID unik
        new Swiper(`#${swiperContainerId}`, {
            loop: true, 
            spaceBetween: 32,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                 delay: 3000, 
                 disableOnInteraction: false, 
            },
        });
    }

    // B. TOGGLE PASSWORD EYE
    // Variabel loginEye dan passwordInput sudah didefinisikan di atas
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
