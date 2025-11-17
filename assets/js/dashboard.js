document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-collapsed');
        
        if (sidebar.classList.contains('sidebar-collapsed')) {
            mainContent.style.marginLeft = '70px';
        } else {
            mainContent.style.marginLeft = '256px';
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // User dropdown
    const userDropdownToggle = document.getElementById('userDropdownToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    userDropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });
    
    // Menu navigation
    const menuItems = document.querySelectorAll('.sidebar-item');
    const contentPages = document.querySelectorAll('.content-page');
    const pageTitle = document.getElementById('pageTitle');
    const mainContentArea = document.querySelector('main');
    
    // Function to load external HTML
    async function loadExternalHTML(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Extract the content from the loaded HTML
            const content = tempDiv.querySelector('#external-content') || tempDiv;
            
            // Clear main content and append new content
            mainContentArea.innerHTML = '';
            mainContentArea.appendChild(content);
            
            // Execute any scripts in the loaded content
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
            
            return true;
        } catch (error) {
            console.error('Error loading external HTML:', error);
            mainContentArea.innerHTML = `
                <div class="card bg-white rounded-lg p-8 max-w-md mx-auto mt-20">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Error Loading Content</h2>
                        <p class="text-gray-600 mb-6">Gagal memuat halaman. Silakan coba lagi.</p>
                        <button onclick="location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                            <i class="fas fa-redo mr-2"></i> Refresh
                        </button>
                    </div>
                </div>
            `;
            return false;
        }
    }
    
    menuItems.forEach(item => {
        item.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Get the page ID from data attribute
            const pageId = this.getAttribute('data-page');
            const menuText = this.querySelector('.menu-text').textContent;
            
            // Update page title
            pageTitle.textContent = menuText;
            
            // Special handling for external HTML pages
            if (pageId === 'register-aplikasi') {
                // Show loading indicator
                mainContentArea.innerHTML = `
                    <div class="flex justify-center items-center h-64">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                            <p class="text-gray-600">Memuat halaman...</p>
                        </div>
                    </div>
                `;
                
                // Load external HTML
                await loadExternalHTML('aplikasi.html');
            } else if (pageId === 'pengiriman') {
                // Show loading indicator
                mainContentArea.innerHTML = `
                    <div class="flex justify-center items-center h-64">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                            <p class="text-gray-600">Memuat halaman...</p>
                        </div>
                    </div>
                `;
                
                // Load external HTML
                await loadExternalHTML('pengiriman.html');
            } else {
                // Hide all content pages
                contentPages.forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show the selected content page
                const selectedPage = document.getElementById(pageId);
                if (selectedPage) {
                    selectedPage.classList.add('active');
                }
            }
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
            }
        });
    });
    
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth <= 768) {
            mainContent.style.marginLeft = '0';
        } else if (!sidebar.classList.contains('sidebar-collapsed')) {
            mainContent.style.marginLeft = '256px';
        } else {
            mainContent.style.marginLeft = '70px';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on load
});


//
// File: script.js
// Berisi logika SPA (loadPage) dan logika Sidebar Responsif
//

const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mainContent = document.getElementById('mainContent');
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
        
        // Mengatur tampilan backdrop
        if (sidebar.classList.contains('open')) {
            sidebarBackdrop.classList.remove('hidden');
        } else {
            // Berikan waktu untuk transisi opacity sebelum menyembunyikan sepenuhnya
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
            mainContent.style.marginLeft = '70px'; // CSS handles this, but JS can force it
        } else {
            // Expand
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            mainContent.style.marginLeft = '240px'; // CSS handles this, but JS can force it
        }
    }
}

// Tambahkan event listener untuk tombol tutup mobile
closeSidebarBtn.addEventListener('click', toggleSidebar);

// Event listener untuk mengatur tampilan awal sidebar saat ukuran layar berubah
function handleResize() {
    if (window.innerWidth >= 1024) {
        // Desktop: Pastikan sidebar diatur untuk collapse/expand
        sidebar.classList.remove('open', 'mobile-hidden');
        sidebarBackdrop.classList.add('hidden');
        sidebarBackdrop.classList.remove('open');
        // Pastikan style margin kiri diatur ulang
        mainContent.style.marginLeft = sidebar.classList.contains('sidebar-expanded') ? '240px' : '70px';
    } else {
        // Mobile: Pastikan sidebar disembunyikan
        sidebar.classList.remove('sidebar-expanded', 'sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded'); // Atur ulang ke expanded untuk mobile
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
        // Gunakan onclick yang sudah ada di HTML, tapi panggil secara programatik
        loadPage(defaultMenuItem.getAttribute('onclick').split("'")[1], defaultMenuItem);
    } else {
         pageTitle.innerText = "Dashboard"; // Fallback
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
                // Tangani error HTTP (misalnya 404)
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
