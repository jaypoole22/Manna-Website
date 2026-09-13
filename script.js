const cart = [];
const drawer = document.querySelector('.cart-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
const cartItems = document.querySelector('.cart-items');

function setDrawer(open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) document.querySelector('.close-cart').focus();
}

function rendercart() {
  document.querySelector('.cart-count').textContent = cart.length;
  document.querySelector('#subtotal').textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your blessing is waiting.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div><strong>${item.product}</strong>
      <br><button type="button" data-remove="${index}">Remove</button>
      <div class="quantity-controls">
        <button type="button" data-decrease="${index}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-increase="${index}">+</button>
      </div>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>`).join('')
  
}

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    const priceId = button.dataset.priceId;

const price = Number(
  button.querySelector('span').textContent.replace('$', '')
);

const existingItem = cart.find(
  item => item.product === product
);

if (existingItem) {
  existingItem.quantity += 1;
} else {
  cart.push({
    product: product,
    price: price,
    priceId: priceId,
    quantity: 1
  });  
}
console.log(cart);

    rendercart();
    setDrawer(true);

    setTimeout(() => {
      setDrawer(false);
    }, 2000);
  });
});

cartItems.addEventListener('click', event => {
  const remove = event.target.closest('[data-remove]');
  if (!remove) return;
  cart.splice(Number(remove.dataset.remove), 1);
  rendercart();
});

document.querySelector('.cart-button').addEventListener('click', () => setDrawer(true));
document.querySelector('.close-cart').addEventListener('click', () => setDrawer(false));
document.querySelector('.checkout').addEventListener('click', async () => {
  const response = await fetch('https://mz1pijzhh2.execute-api.us-east-1.amazonaws.com/Checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart: cart })
  });
  const data = await response.json();
  window.location.href = data.url;
});
backdrop.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setDrawer(false); });

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
});

document.querySelector('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  const status = document.querySelector('.form-status');
  if (!email.validity.valid) {
    status.textContent = 'Enter a valid email address.';
    email.focus();
    return;
  }
  status.textContent = 'You’re on the list. Welcome to Manna.';
  event.currentTarget.reset();

  console.log('Newsletter signup:', email.value);
});

document.querySelector('#year').textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 36);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
