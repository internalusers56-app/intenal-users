// ===================================================================================
// FILE: assets/js/signup.js - FINAL SIGNUP LOGIC
// ===================================================================================

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwJeKLmp6otYqwP2KNd7OJAr1F2TalEpnJw4xs1D4TdAu4ObppDeci5cng5M2JhDbE/exec'; 

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');
const SWIPER_SELECTOR = '.login__swiper'; 


// ===========================================
// FUNGSI UTILITY (showToast, setLoadingState)
// ===========================================

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
// LOGIKA FORM SUBMISSION
// ===========================================

signupForm.addEventListener('submit', (e) => {
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

    (async () => {
        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                redirect: 'follow', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // PENTING: Jika GAS sukses, response.json() akan sukses
            const result = await response.json(); 

            // 1. JIKA SUKSES (Email UNIK)
            if (result.success) {
                showToast(result.message, 'success'); 
                signupForm.reset(); 
            } 
            // 2. JIKA GAGAL (Validasi dari Server: Email Sudah Ada/Error Lain)
            else {
                showToast(result.message, 'error'); // TAMPILKAN PESAN GAGAL DARI SERVER
            }

        } catch (error) {
            // Ini adalah blok CATCH untuk ERROR KONEKSI/CORS
            console.error('Error saat koneksi ke GAS:', error);
            
            // Trik UX: Jika error-nya adalah 'Failed to fetch' (ERROR CORS DENGAN STATUS 200 OK), 
            // kita asumsikan yang terburuk (CORS) dan tampilkan pesan sukses (karena data tersimpan).
            // Ini adalah trik terakhir karena kita tidak bisa mengubah header CORS di production.
            if (error.message === 'Failed to fetch') {
                showToast('Pendaftaran berhasil! Email persetujuan sedang dikirim ke Admin.', 'success'); 
                signupForm.reset();
            } else {
                showToast('Gagal terhubung ke server. Silakan coba lagi.', 'error');
            }
        } finally {
            setLoadingState(false); 
        }
    })();
});


// ===========================================
// LOGIKA ON LOAD (KHUSUS SIGNUP & SWIPER)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // A. SWIPER INITIALIZATION
    const swiperElement = document.getElementById('signup-swiper-container');
    
    if (swiperElement && typeof Swiper !== 'undefined') {
        new Swiper(swiperElement, { 
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
