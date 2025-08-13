'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Cart drawer functionality
    // Cart drawer functionality - FIXED THE SYNTAX ERROR
    const cartIcon = document.querySelector('.bottom-nav-item.cart') || 
                    document.querySelector('[data-nav="cart"]') ||
                    document.querySelector('#cartIcon');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCartDrawer = document.getElementById('closeCartDrawer');
    const cartDrawerOverlay = document.querySelector('.cart-drawer-overlay');

    // Debug logging
    console.log('Cart icon found:', !!cartIcon);
    console.log('Cart drawer found:', !!cartDrawer);
    console.log('Cart icon element:', cartIcon);

    // Open cart drawer
    if (cartIcon && cartDrawer) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cart clicked!');
            cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close cart drawer function
    function closeDrawer() {
        if (cartDrawer) {
            cartDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Close button
    if (closeCartDrawer) {
        closeCartDrawer.addEventListener('click', closeDrawer);
    }

    // Overlay click
    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', closeDrawer);
    }

    // Quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const isPlus = e.target.classList.contains('plus');
            const quantitySpan = e.target.parentElement.querySelector('span');
            let quantity = parseInt(quantitySpan.textContent);
            
            if (isPlus) {
                quantity++;
            } else if (quantity > 1) {
                quantity--;
            }
            
            quantitySpan.textContent = quantity;
            
            // Update total (you can implement this based on your needs)
            updateCartTotal();
        }
    });

    // Function to update cart total
    function updateCartTotal() {
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.cart-item-quantity span').textContent);
            total += price * quantity;
        });
        
        const totalElement = document.querySelector('.cart-total span');
        if (totalElement) {
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }
});

// Add this right after cartDrawer.classList.add('active');
console.log('Active class added:', cartDrawer.classList.contains('active'));
console.log('Drawer visibility:', window.getComputedStyle(cartDrawer).visibility);
console.log('Drawer opacity:', window.getComputedStyle(cartDrawer).opacity);
console.log('Content transform:', window.getComputedStyle(cartDrawer.querySelector('.cart-drawer-content')).transform);

// Add to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Search overlay functionality
    const searchIcon = document.querySelector('.bottom-nav-item[data-nav="search"]');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const clearSearch = document.getElementById('clearSearch');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchResults = document.getElementById('searchResults');

    // Open search overlay
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Auto-focus search input
            setTimeout(() => mobileSearchInput.focus(), 300);
        });
    }

    // Close search overlay
    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        mobileSearchInput.value = '';
        clearSearch.style.display = 'none';
        searchSuggestions.style.display = 'block';
        searchResults.style.display = 'none';
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchOverlay);
    }

    // Search input handling
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 0) {
                clearSearch.style.display = 'block';
                searchSuggestions.style.display = 'none';
                searchResults.style.display = 'block';
                performSearch(query);
            } else {
                clearSearch.style.display = 'none';
                searchSuggestions.style.display = 'block';
                searchResults.style.display = 'none';
            }
        });
    }

    // Clear search
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            mobileSearchInput.value = '';
            this.style.display = 'none';
            searchSuggestions.style.display = 'block';
            searchResults.style.display = 'none';
            mobileSearchInput.focus();
        });
    }

    // Handle search tags
    document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const query = this.textContent;
            mobileSearchInput.value = query;
            performSearch(query);
        });
    });

    // Mock search function
    function performSearch(query) {
        // Here you would typically make an API call
        console.log('Searching for:', query);
        
        // Mock results - replace with real search logic
        const mockResults = [
            { name: 'Modern Sofa', price: '$299', category: 'Living Room', image: '../assets/images/product-1.jpg' },
            { name: 'Office Chair', price: '$150', category: 'Office', image: '../assets/images/product-2.jpg' }
        ];
        
        displayResults(mockResults);
    }

    function displayResults(results) {
        const resultsContainer = searchResults;
        resultsContainer.innerHTML = results.map(item => `
            <div class="search-result-item">
                <img src="${item.image}" alt="${item.name}" class="result-image">
                <div class="result-details">
                    <h4 class="result-title">${item.name}</h4>
                    <p class="result-price">${item.price}</p>
                    <p class="result-category">${item.category}</p>
                </div>
            </div>
        `).join('');
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });
});

// Add to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Profile overlay functionality
    const profileIcon = document.querySelector('.bottom-nav-item.profile') || 
                   document.querySelector('[data-nav="profile"]') ||
                   document.querySelector('#profileIcon');
    const profileOverlay = document.getElementById('profileOverlay');
    const profileBackdrop = document.querySelector('.profile-overlay-backdrop');
    const closeProfileBtns = document.querySelectorAll('[id^="closeProfile"]');
    
    // Auth modal elements
    const authModal = document.getElementById('authModal');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authForm = document.getElementById('authForm');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    
    // Profile sections
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    
    // Mock user state (replace with real authentication)
    let isLoggedIn = false; // Change to true to test logged-in state
    let currentUser = {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: '../assets/images/user-avatar.jpg'
    };

    // Open profile overlay
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            profileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Show appropriate section based on login state
            if (isLoggedIn) {
                authSection.style.display = 'none';
                userSection.style.display = 'block';
                updateUserInfo();
            } else {
                authSection.style.display = 'block';
                userSection.style.display = 'none';
            }
        });
    }

    // Close profile overlay
    function closeProfileOverlay() {
        profileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeProfileBtns.forEach(btn => {
        btn.addEventListener('click', closeProfileOverlay);
    });

    if (profileBackdrop) {
        profileBackdrop.addEventListener('click', closeProfileOverlay);
    }

    // Auth modal functionality
    function openAuthModal(mode = 'signin') {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const title = document.getElementById('authModalTitle');
        const submit = document.getElementById('authSubmit');
        const switchText = document.getElementById('authSwitchText');
        const nameGroup = document.getElementById('nameGroup');
        
        if (mode === 'signup') {
            title.textContent = 'Create Account';
            submit.textContent = 'Sign Up';
            switchText.textContent = 'Already have an account?';
            authSwitchBtn.textContent = 'Sign In';
            nameGroup.style.display = 'block';
        } else {
            title.textContent = 'Sign In';
            submit.textContent = 'Sign In';
            switchText.textContent = "Don't have an account?";
            authSwitchBtn.textContent = 'Sign Up';
            nameGroup.style.display = 'none';
        }
        
        authModal.dataset.mode = mode;
    }

    function closeAuthModalFunc() {
        authModal.style.display = 'none';
        document.body.style.overflow = '';
        authForm.reset();
    }

    if (signInBtn) {
        signInBtn.addEventListener('click', () => openAuthModal('signin'));
    }

    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => openAuthModal('signup'));
    }

    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', closeAuthModalFunc);
    }

    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', function() {
            const currentMode = authModal.dataset.mode;
            openAuthModal(currentMode === 'signin' ? 'signup' : 'signin');
        });
    }

    // Handle auth form submission
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const name = document.getElementById('authName').value;
            const mode = authModal.dataset.mode;
            
            // Mock authentication (replace with real API calls)
            console.log(`${mode === 'signin' ? 'Signing in' : 'Signing up'}:`, { email, password, name });
            
            // Simulate successful login
            setTimeout(() => {
                isLoggedIn = true;
                if (mode === 'signup') {
                    currentUser.name = name;
                    currentUser.email = email;
                }
                
                closeAuthModalFunc();
                closeProfileOverlay();
                
                // Show success message
                alert(`${mode === 'signin' ? 'Signed in' : 'Account created'} successfully!`);
                
                // Update profile icon to show logged in state
                updateProfileIcon();
            }, 1000);
        });
    }

    // Sign out functionality
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                isLoggedIn = false;
                closeProfileOverlay();
                updateProfileIcon();
                alert('Signed out successfully!');
            }
        });
    }

    // Update user info in profile
    function updateUserInfo() {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userAvatar) userAvatar.src = currentUser.avatar;
    }

    // Update profile icon based on login state
    function updateProfileIcon() {
        if (profileIcon) {
            const icon = profileIcon.querySelector('ion-icon');
            if (isLoggedIn) {
                icon.setAttribute('name', 'person');
                profileIcon.classList.add('logged-in');
            } else {
                icon.setAttribute('name', 'person-outline');
                profileIcon.classList.remove('logged-in');
            }
        }
    }

    // Handle notification clicks
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            const dot = this.querySelector('.unread-dot');
            if (dot) dot.remove();
            
            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            const currentCount = parseInt(badge.textContent);
            if (currentCount > 0) {
                badge.textContent = currentCount - 1;
            }
        });
    });

    // Initialize profile icon state
    updateProfileIcon();

    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (profileOverlay.classList.contains('active')) {
                closeProfileOverlay();
            }
            if (authModal.style.display === 'flex') {
                closeAuthModalFunc();
            }
        }
    });
});

// Cart data
        let cartItems = [
            {
                id: 1,
                name: "The Silent Patient",
                price: 24.99,
                quantity: 1,
                image: "https://res.cloudinary.com/dpofqivee/image/upload/v1/readable_bookstore/images/products/Atomic_habits_kcoc90"
            },
            {
                id: 2,
                name: "Atomic Habits",
                price: 18.99,
                quantity: 2,
                image: "https://res.cloudinary.com/dpofqivee/image/upload/v1/readable_bookstore/images/products/Atomic_habits_kcoc90"
            }
        ];

        // Open cart
        function openCart() {
            document.getElementById('cartDrawer').classList.add('active');
            renderCartItems();
        }

        // Close cart
        function closeCart() {
            document.getElementById('cartDrawer').classList.remove('active');
        }

        // Update quantity
        function updateQuantity(itemId, change) {
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeItem(itemId);
                } else {
                    renderCartItems();
                }
            }
        }

        // Remove item
        function removeItem(itemId) {
            cartItems = cartItems.filter(item => item.id !== itemId);
            renderCartItems();
        }

        // Calculate total
        function calculateTotal() {
            return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        // Render cart items
        function renderCartItems() {
            const cartBody = document.getElementById('cartBody');
            const totalAmount = document.getElementById('totalAmount');
            
            if (cartItems.length === 0) {
                cartBody.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <p>Your cart is empty</p>
                    </div>
                `;
                totalAmount.textContent = '$0.00';
                return;
            }

            cartBody.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeItem(${item.id})" title="Remove item">🗑</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Update total
            const total = calculateTotal();
            totalAmount.textContent = `$${total.toFixed(2)}`;
        }

        // Initialize cart on page load
        document.addEventListener('DOMContentLoaded', function() {
            renderCartItems();
        });

        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            const cartDrawer = document.getElementById('cartDrawer');
            if (e.target === cartDrawer) {
                closeCart();
            }
        });

        // Close cart with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCart();
            }
        });