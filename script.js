// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500); // Simulated loading time
});

// Custom Cursor
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Interactive elements hover effect for cursor
const interactiveElements = document.querySelectorAll('a, button, .product-card, .category-circle');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '50px';
        cursorGlow.style.height = '50px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(255,0,255,0.8) 0%, rgba(255,0,255,0) 70%)';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '30px';
        cursorGlow.style.height = '30px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(0,243,255,0.8) 0%, rgba(0,243,255,0) 70%)';
    });
});

// Floating Background Particles
const particlesContainer = document.getElementById('particles-bg');
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    createParticle();
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * window.innerWidth;
    const posY = window.innerHeight + Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    // Randomize colors
    const colors = ['var(--neon-blue)', 'var(--neon-magenta)', 'var(--neon-purple)', 'var(--neon-cyan)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = randomColor;
    particle.style.boxShadow = `0 0 ${size * 2}px ${randomColor}`;
    
    particlesContainer.appendChild(particle);
}

// Hero Parallax Effect
const heroParallax = document.getElementById('hero-parallax');
const heroCards = document.querySelectorAll('.hero-card');

document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    heroCards.forEach((card, index) => {
        const depth = (index + 1) * 0.5; // Different depth for each card
        if(card.classList.contains('center-card')) {
            card.style.transform = `scale(1.1) rotateY(${-15 + xAxis * depth}deg) rotateX(${yAxis * depth}deg)`;
        } else if (card.classList.contains('left-card')) {
            card.style.transform = `translateX(-150px) translateZ(-100px) rotateY(${15 + xAxis * depth}deg) rotateX(${yAxis * depth}deg)`;
        } else {
            card.style.transform = `translateX(150px) translateZ(-100px) rotateY(${-25 + xAxis * depth}deg) rotateX(${yAxis * depth}deg)`;
        }
    });
});

// Reset parallax on mouse leave
heroParallax.addEventListener('mouseleave', () => {
    heroCards.forEach((card) => {
        card.style.transition = 'transform 0.5s ease';
        if(card.classList.contains('center-card')) {
            card.style.transform = `scale(1.1) rotateY(-15deg) rotateX(0deg)`;
        } else if (card.classList.contains('left-card')) {
            card.style.transform = `translateX(-150px) translateZ(-100px) rotateY(15deg) rotateX(0deg)`;
        } else {
            card.style.transform = `translateX(150px) translateZ(-100px) rotateY(-25deg) rotateX(0deg)`;
        }
        
        setTimeout(() => {
            card.style.transition = 'transform 0.1s';
        }, 500);
    });
});

// Scroll animations
const scrollElements = document.querySelectorAll('.reveal-on-scroll');
const nav = document.querySelector('.glass-nav');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};

const displayScrollElement = (element) => {
    element.classList.add('is-visible');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.1)) {
            displayScrollElement(el);
        }
    });
    
    // Nav scroll effect
    if(window.scrollY > 50) {
        nav.style.padding = '10px 5%';
        nav.style.background = 'rgba(5, 5, 8, 0.9)';
    } else {
        nav.style.padding = '15px 5%';
        nav.style.background = 'rgba(5, 5, 8, 0.7)';
    }
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Trigger once on load
setTimeout(handleScrollAnimation, 1000);

// Cart Functionality
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const sfxHover = document.getElementById('sfx-hover');
const sfxClick = document.getElementById('sfx-click');

let soundEnabled = true;

// Toggle Cart
const toggleCart = () => {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
    if(soundEnabled) playSound(sfxClick);
};

cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Add to Cart
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        const img = e.target.dataset.img;
        
        addToCart(id, name, price, img);
        if(soundEnabled) playSound(sfxClick);
        
        // Button animation
        const originalText = e.target.innerText;
        e.target.innerText = 'ADDED ✓';
        e.target.style.background = 'var(--neon-cyan)';
        e.target.style.color = '#000';
        
        setTimeout(() => {
            e.target.innerText = originalText;
            e.target.style.background = 'rgba(0, 243, 255, 0.1)';
            e.target.style.color = 'var(--neon-cyan)';
        }, 1500);
    });
});

function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }
    
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.innerText = `Cr ${total.toFixed(2)}`;
    
    // Update items list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cargo bay is empty</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Cr ${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">&times;</button>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
}

// Global functions for inline onclick handlers in dynamically generated HTML
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;

// Sound Effects
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if(soundEnabled) {
        soundToggle.style.color = 'var(--text-main)';
        soundToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    } else {
        soundToggle.style.color = 'var(--text-muted)';
        soundToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    }
});

function playSound(audioEl) {
    if(!soundEnabled) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.log('Audio play failed:', e));
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
let isLightMode = false;

themeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    if (isLightMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'; // Moon icon
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'; // Sun icon
    }
});

// AI Assistant click animation
const aiBtn = document.getElementById('ai-assistant');
aiBtn.addEventListener('click', () => {
    if(soundEnabled) playSound(sfxClick);
    const originalContent = aiBtn.innerHTML;
    aiBtn.innerHTML = '<div class="loader-circle" style="width:30px; height:30px; border-width:2px;"></div>';
    setTimeout(() => {
        aiBtn.innerHTML = originalContent;
        alert('Oracle AI uplink established. How can I assist your navigation today?');
    }, 1500);
});

// Category interaction
const categories = document.querySelectorAll('.category-circle');
categories.forEach(cat => {
    cat.addEventListener('click', () => {
        if(soundEnabled) playSound(sfxClick);
        categories.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        
        // Add a glitch effect to products to simulate loading new category
        const products = document.querySelectorAll('.product-card');
        products.forEach(p => {
            p.style.opacity = '0.5';
            p.style.transform = 'scale(0.95)';
            setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = '';
            }, 300);
        });
    });
});
