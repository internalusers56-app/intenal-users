// GANTI DENGAN URL WEB APP GAS SETELAH DI-DEPLOY!
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzMCXwyyyVHPW3Qvt-Ff8-MW2EfV_j8rAYNIs1EjbOa3of-5-Btk5nSUlwF0wJ_LRpJvA/exec'; 

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const roleSelect = document.getElementById('role-select');


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
        signupButton.disabled = true; // KUNCI TOMBOL
        signupButton.innerHTML = '<span class="loading-spinner"></span> Mendaftar...';
    } else {
        signupButton.disabled = false; // AKTIFKAN KEMBALI TOMBOL
        signupButton.innerHTML = 'Daftar Sekarang';
    }
}

// ===========================================
// FUNGSI INISIALISASI (Mengisi Dropdown Role)
// ===========================================

async function loadRoles() {
    try {
        // Panggil fungsi getRoles di GAS menggunakan doGet (url?func=getRoles)
        const response = await fetch(`${GAS_WEB_APP_URL}?func=getRoles`, {
             method: 'GET',
             redirect: 'follow'
        });
        
        // Ambil teks response dan parse sebagai JSON
        const roles = JSON.parse(await response.text());

        if (Array.isArray(roles)) {
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role; // Value dan text sama
                option.textContent = role;
                roleSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Gagal memuat role dari GAS:', error);
        showToast('Gagal memuat daftar Role. Coba refresh halaman.', 'error');
    }
}

// ===========================================
// LOGIKA FORM SUBMISSION
// ===========================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Ambil data dari form, termasuk Role
    const formData = {
        fullname: document.getElementById('fullname-input').value.trim(),
        whatsapp: document.getElementById('whatsapp-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        id_role: roleSelect.value, // Ambil nilai dari dropdown
        password: document.getElementById('password-input').value,
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
        // 3. Kirim data ke Google Apps Script (GAS)
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
            // Reset dropdown ke default setelah reset form
            roleSelect.value = ""; 
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
// FUNGSI TAMBAHAN (On Load)
// ===========================================

// Panggil fungsi untuk mengisi dropdown saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadRoles);

// FUNGSI SHOW/HIDE PASSWORD
const passwordInput = document.getElementById('password-input');
const loginEye = document.getElementById('loginEye');

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
