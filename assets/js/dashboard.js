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
