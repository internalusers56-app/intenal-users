//
// File: script.js
// Perbaikan: Menghapus manipulasi margin-left yang redundan
//

const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mainContent = document.getElementById('mainContent'); // Tetap diperlukan
const pageTitle = document.getElementById('pageTitle');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');

// =======================================
// 1. Fungsi Sidebar Toggle (Responsif)
// =======================================

function toggleSidebar() {
    const isMobile = window.innerWidth < 1024; // Menggunakan breakpoint lg (1024px)

    if (isMobile) {
        // --- LOGIKA MOBILE (Show/Hide Fixed Sidebar) ---
        sidebar.classList.toggle('open');
        sidebarBackdrop.classList.toggle('open');
        
        if (sidebar.classList.contains('open')) {
            sidebarBackdrop.classList.remove('hidden');
        } else {
            setTimeout(() => {
                sidebarBackdrop.classList.add('hidden');
            }, 300); 
        }

    } else {
        // --- LOGIKA DESKTOP (Collapse/Expand) ---
        const isExpanded = sidebar.classList.contains('sidebar-expanded');

        if (isExpanded) {
            // Collapse
            sidebar.classList.remove('sidebar-expanded');
            sidebar.classList.add('sidebar-collapsed');
            // mainContent.style.marginLeft = '70px'; // DIHAPUS - Dibiarkan Flexbox yang mengatur
        } else {
            // Expand
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            // mainContent.style.marginLeft = '240px'; // DIHAPUS - Dibiarkan Flexbox yang mengatur
        }
    }
}

// Tambahkan event listener untuk tombol tutup mobile
closeSidebarBtn.addEventListener('click', toggleSidebar);

// Event listener untuk mengatur tampilan awal sidebar saat ukuran layar berubah
function handleResize() {
    if (window.innerWidth >= 1024) {
        // Desktop: Pastikan sidebar diatur untuk collapse/expand
        sidebar.classList.remove('open');
        sidebarBackdrop.classList.add('hidden');
        sidebarBackdrop.classList.remove('open');
        mainContent.style.marginLeft = '0px'; // Pastikan margin 0 di desktop (karena sudah flex)
        
        // Atur status desktop awal (default: expanded)
        if (!sidebar.classList.contains('sidebar-collapsed') && !sidebar.classList.contains('sidebar-expanded')) {
             sidebar.classList.add('sidebar-expanded');
        }

    } else {
        // Mobile: Pastikan sidebar disembunyikan
        sidebar.classList.add('sidebar-expanded'); // Atur ulang ke expanded untuk mobile
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.remove('open');
        mainContent.style.marginLeft = '0px';
    }
}

// Panggil saat load dan resize
window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', () => {
    handleResize();
    // Load halaman default saat pertama kali load
    const defaultMenuItem = document.querySelector('.menu-item.active-menu');
    if (defaultMenuItem) {
        // Panggil loadPage untuk memuat konten default
        loadPage(defaultMenuItem.getAttribute('onclick').split("'")[1], defaultMenuItem);
    } else {
         pageTitle.innerText = "Dashboard"; 
    }
});


// =======================================
// 2. Fungsi Load Konten (SPA)
// =======================================

function loadPage(page, element) {
    // 1. Hapus kelas aktif dari semua item
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active-menu'));
    
    // 2. Tambahkan kelas aktif ke item yang diklik
    if (element) element.classList.add('active-menu');

    // 3. Muat konten menggunakan Fetch API
    fetch(page)
        .then(res => {
            if (!res.ok) {
                return '<h1>Halaman Tidak Ditemukan (404)</h1><p>Konten untuk URL: ' + page + ' gagal dimuat.</p>';
            }
            return res.text();
        })
        .then(html => {
            document.getElementById('contentArea').innerHTML = html;
            
            // 4. Update judul halaman
            if (element) {
                const titleText = element.querySelector('.menu-text') ? element.querySelector('.menu-text').innerText : 'Dashboard';
                pageTitle.innerText = titleText;
            }

            // 5. Tutup sidebar di mobile setelah mengklik menu
            if (window.innerWidth < 1024) {
                toggleSidebar();
            }
        })
        .catch(err => {
            console.error('Gagal memuat halaman:', err);
            document.getElementById('contentArea').innerHTML = '<h1>Gagal Memuat Konten</h1><p>Terjadi kesalahan saat mengambil data halaman.</p>';
        });
}
