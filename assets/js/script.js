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

// ===== CONSOLIDATED CART FUNCTIONALITY =====
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

// FIXED: Single cart management object
const CartManager = {
    isOpen: false,
    
    init() {
        this.bindEvents();
        this.renderCartItems();
    },
    
    bindEvents() {
        // Find cart trigger elements with multiple selectors
        const cartTriggers = document.querySelectorAll(
            '.bottom-nav-item.cart, [data-nav="cart"], #cartIcon, [onclick="openCart()"]'
        );
        
        const cartDrawer = document.getElementById('cartDrawer');
        const closeBtn = document.getElementById('closeCartDrawer');
        const cartCloseBtn = document.querySelector('.cart-drawer-close');
        const cartOverlay = document.querySelector('.cart-drawer-overlay');
        
        // FIXED: Single event listener for opening cart
        cartTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        });
        
        // FIXED: Close button events (multiple selectors for different close buttons)
        [closeBtn, cartCloseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    this.closeCart();
                });
            }
        });
        
        // FIXED: Overlay click to close (but not if onclick attribute exists)
        if (cartOverlay) {
            cartOverlay.addEventListener('click', (e) => {
                // Only close if the click is directly on the overlay, not bubbled from children
                if (e.target === cartOverlay) {
                    this.closeCart();
                }
            });
        }
        
        // FIXED: Click outside drawer to close
        if (cartDrawer) {
            cartDrawer.addEventListener('click', (e) => {
                if (e.target === cartDrawer) {
                    this.closeCart();
                }
            });
        }
        
        // FIXED: Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
        
        // FIXED: Quantity controls using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const isPlus = e.target.textContent === '+';
                const quantityDisplay = e.target.parentElement.querySelector('.quantity-display');
                const itemId = parseInt(e.target.getAttribute('data-item-id') || 
                              e.target.closest('.cart-item').dataset.itemId);
                
                if (itemId) {
                    this.updateQuantity(itemId, isPlus ? 1 : -1);
                }
            }
            
            if (e.target.classList.contains('remove-item')) {
                const itemId = parseInt(e.target.getAttribute('data-item-id') || 
                              e.target.closest('.cart-item').dataset.itemId);
                if (itemId) {
                    this.removeItem(itemId);
                }
            }
        });
    },
    
    openCart() {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer && !this.isOpen) {
            this.isOpen = true;
            cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
            console.log('Cart opened');
        }
    },
    
    closeCart() {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer && this.isOpen) {
            this.isOpen = false;
            cartDrawer.classList.remove('active');
            // FIXED: Always restore overflow, regardless of other overlays
            document.body.style.overflow = '';
            console.log('Cart closed, overflow restored');
        }
    },
    
    updateQuantity(itemId, change) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.renderCartItems();
            }
        }
    },
    
    removeItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        this.renderCartItems();
    },
    
    calculateTotal() {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    renderCartItems() {
        const cartBody = document.getElementById('cartBody');
        const totalAmount = document.getElementById('totalAmount');
        
        if (!cartBody || !totalAmount) return;
        
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
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-item-id="${item.id}">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="qty-btn" data-item-id="${item.id}">+</button>
                        <button class="remove-item" data-item-id="${item.id}" title="Remove item">🗑</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.calculateTotal();
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }
};

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK COMPATIBILITY =====
// These functions provide compatibility with existing HTML onclick attributes
function openCart() {
    CartManager.openCart();
}

function closeCart() {
    CartManager.closeCart();
}

function updateQuantity(itemId, change) {
    CartManager.updateQuantity(itemId, change);
}

function removeItem(itemId) {
    CartManager.removeItem(itemId);
}

// ===== SEARCH OVERLAY FUNCTIONALITY =====
const SearchManager = {
    init() {
        const searchIcon = document.querySelector('.bottom-nav-item[data-nav="search"]');
        const searchOverlay = document.getElementById('searchOverlay');
        const closeSearch = document.getElementById('closeSearch');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const clearSearch = document.getElementById('clearSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchResults = document.getElementById('searchResults');

        if (searchIcon && searchOverlay) {
            searchIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSearch();
            });
        }

        if (closeSearch) {
            closeSearch.addEventListener('click', () => this.closeSearch());
        }

        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value.trim());
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => this.clearSearch());
        }

        document.querySelectorAll('.search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.textContent;
                if (mobileSearchInput) {
                    mobileSearchInput.value = query;
                    this.performSearch(query);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
                this.closeSearch();
            }
        });
    },

    openSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (mobileSearchInput) {
                setTimeout(() => mobileSearchInput.focus(), 300);
            }
        }
    },

    closeSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            // FIXED: Only restore overflow if cart is not open
            if (!CartManager.isOpen) {
                document.body.style.overflow = '';
            }
            
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
            }
            this.clearSearch();
        }
    },

    handleSearch(query) {
        const clearSearch = document.getElementById('clearSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchResults = document.getElementById('searchResults');

        if (query.length > 0) {
            if (clearSearch) clearSearch.style.display = 'block';
            if (searchSuggestions) searchSuggestions.style.display = 'none';
            if (searchResults) searchResults.style.display = 'block';
            this.performSearch(query);
        } else {
            if (clearSearch) clearSearch.style.display = 'none';
            if (searchSuggestions) searchSuggestions.style.display = 'block';
            if (searchResults) searchResults.style.display = 'none';
        }
    },

    clearSearch() {
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const clearSearch = document.getElementById('clearSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchResults = document.getElementById('searchResults');

        if (mobileSearchInput) {
            mobileSearchInput.value = '';
            mobileSearchInput.focus();
        }
        if (clearSearch) clearSearch.style.display = 'none';
        if (searchSuggestions) searchSuggestions.style.display = 'block';
        if (searchResults) searchResults.style.display = 'none';
    },

    performSearch(query) {
        console.log('Searching for:', query);
        
        const mockResults = [
            { name: 'Modern Sofa', price: '$299', category: 'Living Room', image: '../assets/images/product-1.jpg' },
            { name: 'Office Chair', price: '$150', category: 'Office', image: '../assets/images/product-2.jpg' }
        ];
        
        this.displayResults(mockResults);
    },

    displayResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.innerHTML = results.map(item => `
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
    }
};

// ===== PROFILE OVERLAY FUNCTIONALITY =====
const ProfileManager = {
    isLoggedIn: false,
    currentUser: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: '../assets/images/user-avatar.jpg'
    },

    init() {
        this.bindEvents();
        this.updateProfileIcon();
    },

    bindEvents() {
        const profileIcon = document.querySelector('.bottom-nav-item.profile, [data-nav="profile"], #profileIcon');
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
        const signOutBtn = document.getElementById('signOutBtn');

        if (profileIcon) {
            profileIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openProfile();
            });
        }

        closeProfileBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeProfile());
        });

        if (profileBackdrop) {
            profileBackdrop.addEventListener('click', () => this.closeProfile());
        }

        if (signInBtn) {
            signInBtn.addEventListener('click', () => this.openAuthModal('signin'));
        }

        if (signUpBtn) {
            signUpBtn.addEventListener('click', () => this.openAuthModal('signup'));
        }

        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', () => this.closeAuthModal());
        }

        if (authSwitchBtn) {
            authSwitchBtn.addEventListener('click', () => {
                const currentMode = authModal ? authModal.dataset.mode : 'signin';
                this.openAuthModal(currentMode === 'signin' ? 'signup' : 'signin');
            });
        }

        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuth(e));
        }

        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.signOut());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (profileOverlay && profileOverlay.classList.contains('active')) {
                    this.closeProfile();
                }
                if (authModal && authModal.style.display === 'flex') {
                    this.closeAuthModal();
                }
            }
        });
    },

    openProfile() {
        const profileOverlay = document.getElementById('profileOverlay');
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');

        if (profileOverlay) {
            profileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (this.isLoggedIn) {
                if (authSection) authSection.style.display = 'none';
                if (userSection) userSection.style.display = 'block';
                this.updateUserInfo();
            } else {
                if (authSection) authSection.style.display = 'block';
                if (userSection) userSection.style.display = 'none';
            }
        }
    },

    closeProfile() {
        const profileOverlay = document.getElementById('profileOverlay');
        if (profileOverlay) {
            profileOverlay.classList.remove('active');
            // FIXED: Only restore overflow if cart is not open
            if (!CartManager.isOpen) {
                document.body.style.overflow = '';
            }
        }
    },

    openAuthModal(mode = 'signin') {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const title = document.getElementById('authModalTitle');
            const submit = document.getElementById('authSubmit');
            const switchText = document.getElementById('authSwitchText');
            const nameGroup = document.getElementById('nameGroup');
            const authSwitchBtn = document.getElementById('authSwitchBtn');
            
            if (mode === 'signup') {
                if (title) title.textContent = 'Create Account';
                if (submit) submit.textContent = 'Sign Up';
                if (switchText) switchText.textContent = 'Already have an account?';
                if (authSwitchBtn) authSwitchBtn.textContent = 'Sign In';
                if (nameGroup) nameGroup.style.display = 'block';
            } else {
                if (title) title.textContent = 'Sign In';
                if (submit) submit.textContent = 'Sign In';
                if (switchText) switchText.textContent = "Don't have an account?";
                if (authSwitchBtn) authSwitchBtn.textContent = 'Sign Up';
                if (nameGroup) nameGroup.style.display = 'none';
            }
            
            authModal.dataset.mode = mode;
        }
    },

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        const authForm = document.getElementById('authForm');
        
        if (authModal) {
            authModal.style.display = 'none';
            // FIXED: Only restore overflow if cart is not open
            if (!CartManager.isOpen) {
                document.body.style.overflow = '';
            }
        }
        if (authForm) {
            authForm.reset();
        }
    },

    handleAuth(e) {
        e.preventDefault();
        
        const email = document.getElementById('authEmail')?.value;
        const password = document.getElementById('authPassword')?.value;
        const name = document.getElementById('authName')?.value;
        const mode = document.getElementById('authModal')?.dataset.mode;
        
        console.log(`${mode === 'signin' ? 'Signing in' : 'Signing up'}:`, { email, password, name });
        
        setTimeout(() => {
            this.isLoggedIn = true;
            if (mode === 'signup' && name) {
                this.currentUser.name = name;
                this.currentUser.email = email;
            }
            
            this.closeAuthModal();
            this.closeProfile();
            
            alert(`${mode === 'signin' ? 'Signed in' : 'Account created'} successfully!`);
            this.updateProfileIcon();
        }, 1000);
    },

    signOut() {
        if (confirm('Are you sure you want to sign out?')) {
            this.isLoggedIn = false;
            this.closeProfile();
            this.updateProfileIcon();
            alert('Signed out successfully!');
        }
    },

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (userAvatar) userAvatar.src = this.currentUser.avatar;
    },

    updateProfileIcon() {
        const profileIcon = document.querySelector('.bottom-nav-item.profile, [data-nav="profile"], #profileIcon');
        if (profileIcon) {
            const icon = profileIcon.querySelector('ion-icon');
            if (icon) {
                if (this.isLoggedIn) {
                    icon.setAttribute('name', 'person');
                    profileIcon.classList.add('logged-in');
                } else {
                    icon.setAttribute('name', 'person-outline');
                    profileIcon.classList.remove('logged-in');
                }
            }
        }
    }
};

// ===== INITIALIZE ALL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all managers
    CartManager.init();
    SearchManager.init();
    ProfileManager.init();
    
    // Handle notification clicks
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            const dot = this.querySelector('.unread-dot');
            if (dot) dot.remove();
            
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const currentCount = parseInt(badge.textContent);
                if (currentCount > 0) {
                    badge.textContent = currentCount - 1;
                }
            }
        });
    });
});

