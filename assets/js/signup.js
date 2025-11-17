// ===================================================================================
// GANTI DENGAN URL WEB APP GAS YANG SUDAH DI-DEPLOY!
// ===================================================================================
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzMCXwyyyVHPW3Qvt-Ff8-MW2EfV_j8rAYNIs1EjbOa3of-5-Btk5nSUlwF0wJ_LRpJvA/exec'; 

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');

// --- Hapus const roleSelect ---

// ===========================================
// FUNGSI UTILITY (Toast & Loading)
// ===========================================

/**
 * Menampilkan Toast Message di tengah halaman.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - 'success' atau 'error'.
 */
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.innerHTML = ''; 
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 5000);
}

/**
 * Mengatur status tombol saat proses submit.
 * @param {boolean} isLoading - true jika loading, false jika selesai.
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        signupButton.disabled = true; 
        signupButton.innerHTML = '<span class="loading-spinner"></span> Mendaftar...';
    } else {
        signupButton.disabled = false; 
        signupButton.innerHTML = 'Daftar Sekarang';
    }
}

// --- Hapus fungsi loadRoles ---

// ===========================================
// LOGIKA FORM SUBMISSION
// ===========================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Ambil data dari form (tanpa id_role)
    const formData = {
        fullname: document.getElementById('fullname-input').value.trim(),
        whatsapp: document.getElementById('whatsapp-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
        // id_role dihilangkan dari payload
    };

    // 2. Validasi sisi klien
    for (const key in formData) {
        if (!formData[key]) {
            showToast(`Field ${key.replace('Input', '').toUpperCase()} tidak boleh kosong.`, 'error');
            return;
        }
    }

    setLoadingState(true); // Mulai animasi tombol dan kunci

    try {
        // 3. Kirim data pendaftaran ke Google Apps Script (GAS)
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            redirect: 'follow', 
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            signupForm.reset(); 
            // Hapus: roleSelect.value = ""; 
        } else {
            showToast(result.message, 'error');
        }

    } catch (error) {
        console.error('Error saat koneksi ke GAS:', error);
        showToast('Gagal terhubung ke server. Silakan coba lagi.', 'error');
    } finally {
        setLoadingState(false); // Hentikan animasi dan aktifkan tombol kembali
    }
});


// ===========================================
// FUNGSI TAMBAHAN (On Load dan Password Toggle)
// ===========================================

// Hapus: document.addEventListener('DOMContentLoaded', loadRoles);

// FUNGSI SHOW/HIDE PASSWORD
loginEye.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        loginEye.classList.remove('ri-eye-line');
        loginEye.classList.add('ri-eye-off-line');
    } else {
        passwordInput.type = 'password';
        loginEye.classList.remove('ri-eye-off-line');
        loginEye.classList.add('ri-eye-line');
    }
});
