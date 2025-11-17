// GANTI DENGAN URL WEB APP GAS YANG SUDAH DI-DEPLOY!
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzMCXwyyyVHPW3Qvt-Ff8-MW2EfV_j8rAYNIs1EjbOa3of-5-Btk5nSUlwF0wJ_LRpJvA/exec'; 

// ... (Konstanta lainnya) ...
const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const toastContainer = document.getElementById('toast-container');
const roleSelect = document.getElementById('role-select');


// ... (Fungsi showToast dan setLoadingState - TIDAK BERUBAH) ...


// ===========================================
// FUNGSI INISIALISASI (Mengisi Dropdown Role) - DIPERBAIKI KE POST
// ===========================================

async function loadRoles() {
    try {
        // Panggil fungsi getRoles di GAS MENGGUNAKAN POST
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST', // Menggunakan POST untuk menghindari masalah CORS
            redirect: 'follow', 
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            // Kirim payload untuk mengarahkan ke fungsi getRoles di GAS
            body: JSON.stringify({ apiAction: 'getRoles' })
        });
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
            const roles = result.data;
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role; 
                option.textContent = role;
                roleSelect.appendChild(option);
            });
        } else {
             showToast('Gagal memuat daftar Role dari GAS.', 'error');
        }

    } catch (error) {
        console.error('Gagal memuat role dari GAS:', error);
        showToast('Gagal terhubung ke server untuk memuat Role. Coba refresh halaman.', 'error');
    }
}

// ===========================================
// LOGIKA FORM SUBMISSION (TIDAK BERUBAH)
// ===========================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ... (Logika form submission tetap sama) ...
    const formData = {
        fullname: document.getElementById('fullname-input').value.trim(),
        whatsapp: document.getElementById('whatsapp-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        id_role: roleSelect.value, 
        password: document.getElementById('password-input').value,
    };

    // ... (Validasi) ...

    setLoadingState(true); 

    try {
        // Kirim data ke Google Apps Script (GAS) - doPost akan mengarahkan ke processSignup
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
            roleSelect.value = ""; 
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


// ... (Fungsi on DOMContentLoaded dan Show/Hide Password - TIDAK BERUBAH) ...
document.addEventListener('DOMContentLoaded', loadRoles);
