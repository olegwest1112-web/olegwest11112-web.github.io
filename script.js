const products = [
  { id: 1, name: 'Смартфон Test 1', price: 9999, oldPrice: 12999, img: 'black-square' },
  { id: 2, name: 'Ноутбук Test 2', price: 39999, oldPrice: null, img: 'black-square' },
  { id: 3, name: 'Пральна машина Test 3', price: 14999, oldPrice: 19999, img: 'black-square' },
  { id: 4, name: 'Кавоварка Test 4', price: 4999, oldPrice: null, img: 'black-square' },
]; // Mock товари

// Функції бекенду (LocalStorage)
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || products;
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function addProduct(product) {
  const prods = getProducts();
  prods.push({ id: prods.length + 1, ...product, img: 'black-square' }); // Чорний квадрат для фото
  saveProducts(prods);
  alert('Товар доданий!');
  location.reload();
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = getProducts().find(p => p.id === id);
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Додано до кошика!');
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function clearCart() {
  localStorage.removeItem('cart');
  location.reload();
}

// Для головної: рендер товарів
function renderProducts() {
  const container = document.querySelector('.products');
  if (container) {
    container.innerHTML = '';
    getProducts().forEach(p => {
      container.innerHTML += `
        <a href="product.html?id=${p.id}" class="card">
          <div class="card-img">Чорний квадрат (placeholder)</div>
          <div class="card-body">
            <div class="card-title">${p.name}</div>
            <div>
              <span class="card-price">${p.price} ₴</span>
              ${p.oldPrice ? `<span class="card-old-price">${p.oldPrice} ₴</span>` : ''}
            </div>
            <button onclick="addToCart(${p.id})" class="btn">Додати в кошик</button>
          </div>
        </a>
      `;
    });
  }
}

// Для сторінки товару
function renderProduct() {
  const id = new URLSearchParams(window.location.search).get('id');
  const product = getProducts().find(p => p.id == id);
  if (product) {
    document.title = product.name;
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.product-price').innerHTML = `${product.price} ₴ ${product.oldPrice ? `<span class="card-old-price">${product.oldPrice} ₴</span>` : ''}`;
    // Чорний квадрат для фото
    document.querySelector('.product-img').textContent = 'Чорний квадрат (placeholder)';
  }
}

// Для кошика
function renderCart() {
  const container = document.querySelector('.cart-items');
  const totalElem = document.querySelector('.cart-total');
  if (container) {
    container.innerHTML = '';
    const cart = getCart();
    let total = 0;
    cart.forEach(p => {
      container.innerHTML += `
        <div class="card">
          <div class="card-img">Чорний квадрат</div>
          <div class="card-body">
            <div class="card-title">${p.name}</div>
            <div class="card-price">${p.price} ₴</div>
          </div>
        </div>
      `;
      total += p.price;
    });
    totalElem.textContent = total;
  }
}

// Для адміна
function handleAdminForm() {
  const form = document.querySelector('#admin-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value;
      const price = parseInt(form.price.value);
      const oldPrice = parseInt(form.oldPrice.value) || null;
      addProduct({ name, price, oldPrice });
      form.reset();
    });
  }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('products') === null) saveProducts(products);
  renderProducts();
  renderProduct();
  renderCart();
  handleAdminForm();
});
