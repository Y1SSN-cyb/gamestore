const games = [
    { id: 1, title: "Elden Ring", category: "aventure", price: 600, image: "images/er.jpg", description: "Jeu d’action-RPG en monde ouvert où le joueur explore un univers sombre et dangereux." },
    { id: 2, title: "Call Of Duty", category: "action", price: 500, image: "images/cod.jpg", description: "Jeu de tir à la première personne axé sur l’action intense." },
    { id: 3, title: "FC 26", category: "sport", price: 400, image: "images/fc.jpg", description: "Jeu de football réaliste proposant des équipes officielles." },
    { id: 4, title: "Expedition 33", category: "action", price: 300, image: "images/ex33.jpg", description: "Jeu de rôle narratif au tour par tour avec un univers unique." },
    { id: 5, title: "Hogwarts Legacy", category: "aventure", price: 450, image: "images/hl.jpg", description: "Vivez l'imprévisible dans l'univers de Harry Potter." },
    { id: 6, title: "Forza Horizon 5", category: "sport", price: 450, image: "images/fh.jpg", description: "Jeu de course en monde ouvert dans les paysages du Mexique." },
    { id: 7, title: "GTA 5", category: "action", price: 350, image: "images/gta.jpg", description: "Jeu d’action culte dans la ville de Los Santos." },
    { id: 8, title: "Cyberpunk 2077", category: "aventure", price: 430, image: "images/cp2.jpg", description: "Jeu de rôle futuriste dans une métropole obsédée par la technologie." },
    { id: 9, title: "MotoGP 25", category: "sport", price: 400, image: "images/motogp.jpg", description: "Jeu de course de motos réaliste." }
];

let cart = [];
let currentFilter = 'tous';
let selectedGame = null;

function displayGames() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredGames = currentFilter === 'tous' 
        ? games 
        : games.filter(g => g.category === currentFilter);

    filteredGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openModal(game);
        
        card.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-info">
                <div class="game-title">${game.title}</div>
                <span class="game-category">${game.category.toUpperCase()}</span>
                <div class="game-price">${game.price} DH</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${game.id})">
                    Ajouter au panier
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterGames(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    
    displayGames();
}

function openModal(game) {
    selectedGame = game;
    
    document.getElementById('modalImage').src = game.image;
    document.getElementById('modalTitle').textContent = game.title;
    document.getElementById('modalCategory').textContent = game.category.toUpperCase();
    document.getElementById('modalDescription').textContent = game.description;
    document.getElementById('modalPrice').textContent = game.price + ' DH';
    document.getElementById('gameModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    const existingItem = cart.find(item => item.id === gameId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...game, quantity: 1 });
    }
    
    updateCartCount();
    updateCartDisplay();
}

function addToCartFromModal() {
    if (selectedGame) {
        addToCart(selectedGame.id);
        closeModal();
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.marginBottom = "15px";

        div.innerHTML = `
            <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
            <div style="flex-grow: 1;">
                <strong>${item.title}</strong> (x${item.quantity})<br>
                <span style="color: #9d4edd;">${itemTotal.toFixed(2)} DH</span>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Retirer</button>
        `;
        cartItems.appendChild(div);
    });
    
    document.getElementById('cartTotal').textContent = `Total: ${total.toFixed(2)} DH`;
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    
    updateCartCount();
    updateCartDisplay();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

function subscribeNewsletter(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailInput').value;
    const messageDiv = document.getElementById('newsletterMessage');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
        messageDiv.innerHTML = '<div class="message success">✅ Merci de votre inscription !</div>';
        document.getElementById('emailInput').value = '';
    } else {
        messageDiv.innerHTML = '<div class="message error">❌ Adresse email invalide</div>';
    }
}

window.onclick = function(event) {
    const gameModal = document.getElementById('gameModal');
    const cartModal = document.getElementById('cartModal');
    
    if (event.target == gameModal) closeModal();
    if (event.target == cartModal) toggleCart();
}

displayGames();