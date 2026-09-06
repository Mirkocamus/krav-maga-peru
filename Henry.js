/* ==========================================================================
   CORE ENGINE: VERSION COMPATIBLE CON DOBLE CLIC (FILE:// PROTOCOL)
   ========================================================================== */

let lenis;

document.addEventListener("DOMContentLoaded", () => {
  initLenisGsapTicker();
  initCustomSplitText();
  initMagneticButtons();
  initScrollAnimations();
  initLazyLoading();
});

/* 1. LENIS SMOOTH SCROLL v1.3.26 + GSAP TICKER */
function initLenisGsapTicker() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
}

/* 2. CUSTOM SPLITTEXT ENGINE */
function initCustomSplitText() {
  document.querySelectorAll('.split-text').forEach(element => {
    if (element.classList.contains('splitted')) return;
    const text = element.innerText;
    element.innerHTML = text.split("").map(char => 
      char === " " ? "&nbsp;" : `<span class="char" style="display:inline-block; opacity:1; transform:translateY(0);">${char}</span>`
    ).join("");
    element.classList.add('splitted');
  });
}

/* 3. BOTONES MAGNÉTICOS */
function initMagneticButtons() {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      xTo(x * 0.3);
      yTo(y * 0.3);
    });

    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* 4. SCROLLTRIGGER & HORIZONTAL PINNING */
function initScrollAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function() {
      let panels = gsap.utils.toArray(".panel-slide");
      
      let horizontalTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-section",
          pin: true,
          scrub: 1,
          end: () => "+=" + document.querySelector(".horizontal-wrap").offsetWidth
        }
      });

      gsap.utils.toArray(".panel-img-parallax").forEach(img => {
        gsap.to(img, {
          xPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".panel-slide"),
            containerAnimation: horizontalTween,
            scrub: true
          }
        });
      });
    }
  });
}

/* 5. MENÚ OVERLAY */
const burgerBtn = document.getElementById('burgerBtn');
const menuOverlay = document.getElementById('menuOverlay');

if (burgerBtn && menuOverlay) {
  burgerBtn.addEventListener('click', () => {
    const isActive = menuOverlay.classList.toggle('active');
    if (lenis) {
      isActive ? lenis.stop() : lenis.start();
    }
  });
}

function closeMenu() {
  if (menuOverlay) menuOverlay.classList.remove('active');
  if (lenis) lenis.start();
}

/* 6. LAZY LOADING */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src;
        obs.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => observer.observe(img));
}

/* 7. CARRITO TÁCTICO */
let cart = [];

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('active');
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
  document.getElementById('cartDrawer').classList.add('active');
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');

  if (cartBadge) cartBadge.innerText = cart.length;

  if (cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="cart-empty">El carrito se encuentra vacío.</p>';
    if (cartTotalDisplay) cartTotalDisplay.innerText = 'S/ 0.00';
    return;
  }

  let total = 0;
  if (cartItemsContainer) cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    total += item.price;
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML += `
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #222;">
          <div>
            <strong>${item.name}</strong>
            <div style="color:var(--accent-orange);">S/ ${item.price}.00</div>
          </div>
          <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    }
  });

  if (cartTotalDisplay) cartTotalDisplay.innerText = `S/ ${total}.00`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("Seleccione al menos un producto.");
  let msg = "Hola Krav Maga Perú, deseo comprar:%0A";
  let total = 0;
  cart.forEach(item => {
    msg += `- ${item.name} (S/ ${item.price}.00)%0A`;
    total += item.price;
  });
  msg += `%0ATotal a pagar: S/ ${total}.00`;
  window.open(`https://wa.me/51999999999?text=${msg}`, "_blank");
}

/* 8. FITCO LATAM MODAL */
function openFitcoWidget() {
  document.getElementById('modalFitco').classList.add('active');
}

function closeFitcoWidget() {
  document.getElementById('modalFitco').classList.remove('active');
}

function selectSlot(btn) {
  document.querySelectorAll('.slot-btn').forEach(b => b.style.borderColor = 'var(--border-muted)');
  btn.style.borderColor = 'var(--accent-orange)';
}

function confirmFitcoBooking() {
  const name = document.getElementById('fitcoName').value;
  const phone = document.getElementById('fitcoPhone').value;
  if (!name || !phone) return alert("Por favor complete sus datos para agendar.");
  
  alert(`¡Reserva confirmada en Fitco LATAM, ${name}! Tu QR de acceso fue enviado por WhatsApp con Karina AI.`);
  closeFitcoWidget();
}