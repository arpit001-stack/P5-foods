
const products = [
    {
        id: 1,
        name: "Maggi packet",
        price: 14,
        // Uncooked Maggi image
        image: "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3e%3crect x='50' y='50' width='300' height='200' rx='10' fill='%23FFD700' stroke='%23DAA520' stroke-width='5'/%3e%3ccircle cx='200' cy='150' r='80' fill='%23FF0000'/%3e%3ctext x='200' y='165' font-family='Arial, sans-serif' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3eMaggi%3c/text%3e%3cpath d='M80 80 Q 120 120 80 160 T 80 240' stroke='%23DAA520' stroke-width='3' fill='none' opacity='0.5'/%3e%3cpath d='M320 80 Q 280 120 320 160 T 320 240' stroke='%23DAA520' stroke-width='3' fill='none' opacity='0.5'/%3e%3ctext x='200' y='230' font-family='Arial, sans-serif' font-size='18' fill='%23333' text-anchor='middle'%3e2-Minute Noodles%3c/text%3e%3c/svg%3e",
        description: "Raw Maggi block, ready to be cooked."
    },
    {
        id: 2,
        name: "Tiger Biscuits (Chocolate & Mango)",
        price: 5,
        // Using a reliable placeholder for Biscuits/Cookies
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop",
        description: "Crunchy tea-time snacks to make your day."
    }
];

let cart = [];

// DOM Elements
const menuContainer = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentSection = document.getElementById('payment-section');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const modalActions = document.getElementById('modal-actions');
const themeToggleBtn = document.querySelector('.theme-switch input[type="checkbox"]');

// Init
function init() {
    loadTheme();
    renderMenu();
    updateCartUI();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (savedTheme === 'light') {
        themeToggleBtn.checked = true;
    } else {
        themeToggleBtn.checked = false;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

themeToggleBtn.addEventListener('change', switchTheme);

function renderMenu() {
    menuContainer.innerHTML = products.map(product => `
        <div class="card">
            <div class="card-img-container">
                <img src="${product.image}" alt="${product.name}" class="card-img" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'%23ddd\'/%3e%3ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' font-family=\'Arial\' font-size=\'20\' fill=\'%23555\'%3eImage Not Found%3c/text%3e%3c/svg%3e';">
            </div>
            <div class="card-content">
                <div>
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-desc">${product.description}</p>
                </div>
                <div class="card-footer">
                    <span class="price">₹${product.price}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.addToCart = function (id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Simple animation for cart icon
    cartBtn.classList.add('fa-bounce');
    setTimeout(() => cartBtn.classList.remove('fa-bounce'), 1000);

    updateCartUI();
};

window.removeFromCart = function (id) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem.quantity > 1) {
        existingItem.quantity--;
    } else {
        cart = cart.filter(item => item.id !== id);
    }
    updateCartUI();
    renderCartItems(); // Re-render modal items
};

function updateCartUI() {
    const totalCount = cart.reduce((bcc, item) => bcc + item.quantity, 0);
    cartCount.textContent = totalCount;
    cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
}

function calculateTotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

function renderCartItems() {
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        totalPriceEl.textContent = '₹0';
        return;
    }

    checkoutBtn.disabled = false;
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name}</span>
            <div class="item-control">
                <button class="qty-btn" onclick="removeFromCart(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="addToCart(${item.id}); renderCartItems();">+</button>
            </div>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');

    totalPriceEl.textContent = `₹${calculateTotal()}`;
}

// Modal Handling
cartBtn.addEventListener('click', () => {
    paymentSection.classList.add('hidden');
    modalActions.classList.remove('hidden');
    renderCartItems();
    checkoutModal.classList.add('open');
});

closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('open');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    // Show Payment Section
    modalActions.classList.add('hidden');
    paymentSection.classList.remove('hidden');
});

confirmPaymentBtn.addEventListener('click', () => {
    // Construct WhatsApp Message
    const orderDetails = cart.map(item => `${item.name} x${item.quantity} (₹${item.price * item.quantity})`).join('%0a');
    const total = calculateTotal();
    const text = `*New Order from P5 Night Foods*%0a%0a${orderDetails}%0a%0a*Total: ₹${total}*%0a%0aPayment Mode: Cash on Delivery%0aPlease confirm my order.`;

    // Redirect to WhatsApp with the specific number
    const phoneNumber = "916299434084"; // Country code + Number
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');

    // Reset Cart locally (optional, but good UX)
    cart = [];
    updateCartUI();
    checkoutModal.classList.remove('open');
});

// Run
init();
