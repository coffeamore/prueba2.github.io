// Get DOM elements
const cartIcon = document.getElementById('cart-icon');
const cierre=document.getElementById('cart-close-btn')
const cartContainer = document.getElementById('cart-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCount = document.getElementById('cart-count'); // Element to display the total number of products
let cart = []; // Array to store products in the cart

// Show/hide cart when clicking on the icon
cartIcon.addEventListener('click', () => {
  cartContainer.classList.toggle('cart-visible'); // Toggle visibility
});
// Suponiendo que ya tienes el botón definido como 'closeButton'
cierre.addEventListener('click', () => {
  if (cartContainer.classList.contains('cart-visible')) {
    cartContainer.classList.remove('cart-visible'); // Ocultar el carrito
  }
});

// Load products from JSON
fetch('../js/productos.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('products-container');

    data.productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h1>${producto.nombre}</h1>
        <p class="txt-card">${producto.descripcion}</p>
        <p class="txt-card-v">$${producto.precio}</p>
        <button class="btn-2 add-to-cart"
          data-id="${producto.id}"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}">
          Añadir al Carrito
        </button>
      `;
      container.appendChild(card);
    });

    // Add events to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (event) => {
        const clickedButton = event.target; // The button that was clicked
        const product = {
          id: clickedButton.getAttribute('data-id'),
          nombre: clickedButton.getAttribute('data-nombre'),
          precio: parseFloat(clickedButton.getAttribute('data-precio'))
        };
        addToCart(product); // Call the function with the product data
      });
    });
  })
  .catch(error => console.error('Error loading products:', error));

// Function to add products to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // If it already exists, increase the quantity
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product
    }
    updateCart(); // Update the cart after adding
}

// Function to update the cart (HTML and total)
function updateCart() {
  cartItems.innerHTML = ''; // Clear previous content
  let total = 0;
  let totalItems = 0;

  // Generate each cart item
  cart.forEach(product => {
    totalItems += product.quantity;
    const item = document.createElement('li');
    item.classList.add('cart-item');
    item.innerHTML = `
      ${product.nombre} x ${product.quantity} - $${product.precio * product.quantity}
      <button class="decrease-btn" data-id="${product.id}">-</button>
      <button class="increase-btn" data-id="${product.id}">+</button>
      <button class="remove-btn" data-id="${product.id}">Eliminar</button>
    `;
    cartItems.appendChild(item);
    total += product.precio * product.quantity;
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = totalItems; // Update the total number of products
  addRemoveEventListeners();
  addQuantityEventListeners();
}

// Function to add events to remove buttons
function addRemoveEventListeners() {
  const removeButtons = document.querySelectorAll('.remove-btn');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
}

// Function to add or subtract quantity
function addQuantityEventListeners() {
  const increaseButtons = document.querySelectorAll('.increase-btn');
  const decreaseButtons = document.querySelectorAll('.decrease-btn');

  increaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      changeProductQuantity(productId, 1);
    });
  });

  decreaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      changeProductQuantity(productId, -1);
    });
  });
}

// Function to change the quantity of a product
function changeProductQuantity(productId, change) {
  const product = cart.find(item => item.id === productId);
  
  if (product) {
    product.quantity += change;

    // Remove if the quantity reaches 0
    if (product.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId); // Remove product by ID
  updateCart();
}

// Function to finalize the purchase (empty cart)
checkoutBtn.addEventListener('click', () => {
  if (cart.length > 0) {
    alert('¡Gracias por su compra!');
    cart = []; // Empty cart
    updateCart();
  } else {
    alert('El carrito está vacío.');
  }
});