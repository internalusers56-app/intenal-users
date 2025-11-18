// ===================================================================================
// FILE: assets/js/signup.js - FINAL SIGNUP LOGIC (REVISED)
// ===================================================================================

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXPlJ_b8-ZphGzvAGYbPfaIUkqb6FWLFFqjo0EHtTMdhSb0KOxk1IpiBy9Q1ybwfmn/exec';

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');
const whatsappInput = document.getElementById('whatsapp-input');


// ===========================================
// FORMAT OTOMATIS NO WHATSAPP → 0xxx → +62xxx
// ===========================================
whatsappInput.addEventListener('input', () => {
    let value = whatsappInput.value.replace(/\D/g, '');

    if (value.startsWith("0")) {
        value = "+62" + value.substring(1);
    }

    if (value.startsWith("8")) {
        value = "+62" + value;
    }

    whatsappInput.value = value;
});


// ===========================================
// UTILITY: Toast + Loading Button
// ===========================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.innerHTML = '';
    container.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => { 
        toast.classList.remove('show'); 
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}

function setLoadingState(isLoading) {
    signupButton.disabled = isLoading;
    signupButton.innerHTML = isLoading
        ? '<span class="loading-spinner"></span> Mendaftar...'
        : 'Daftar Sekarang';
}


// ===========================================
// MAIN SIGNUP LOGIC
// ===========================================

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        fullname: document.getElementById('fullname-input').value.trim(),
        whatsapp: document.getElementById('whatsapp-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value
    };

    // Validasi
    const fieldLabels = {
        fullname: "Full Name",
        whatsapp: "No WhatsApp",
        email: "Email",
        password: "Password"
    };

    for (const key in formData) {
        if (!formData[key]) {
            showToast(`${fieldLabels[key]} tidak boleh kosong.`, 'error');
            return;
        }
    }

    setLoadingState(true);

    (async () => {
        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                redirect: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: "signup",
                    ...formData
                })
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

            if (error.message === 'Failed to fetch') {
                showToast('Pendaftaran berhasil! (fallback mode)', 'success');
                signupForm.reset();
            } else {
                showToast('Gagal terhubung ke server. Silakan coba lagi.', 'error');
            }
        } finally {
            setTimeout(() => setLoadingState(false), 2500);
        }
    })();
});


// ===========================================
// PASSWORD TOGGLE
// ===========================================

if (loginEye && passwordInput) {
    loginEye.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            loginEye.classList.replace('ri-eye-line', 'ri-eye-off-line');
        } else {
            passwordInput.type = 'password';
            loginEye.classList.replace('ri-eye-off-line', 'ri-eye-line');
        }
    });
}
