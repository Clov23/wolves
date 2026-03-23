/* ============================================================
   [INICIO] Branch: Indez-Destacados-Chris | Autor: Chris
   Descripcion: Sistema de carrito de compras en vanilla JS.
   Gestiona agregar/quitar productos, persistencia en localStorage,
   panel lateral slide-out, controles de cantidad y notificaciones.
   Se integra con las cards de producto-card y catalogo-card.
============================================================ */

(function () {
    'use strict';

    // ─── Storage key ───────────────────────────────────────────
    var STORAGE_KEY = 'lobos_carrito';

    // ─── DOM references ────────────────────────────────────────
    var overlay      = document.getElementById('carritoOverlay');
    var panel        = document.getElementById('carritoPanel');
    var body         = document.getElementById('carritoBody');
    var footer       = document.getElementById('carritoFooter');
    var totalEl      = document.getElementById('carritoTotal');
    var btnCerrar    = document.getElementById('carritoCerrar');
    var btnVaciar    = document.getElementById('carritoVaciar');
    var btnFinalizar = document.getElementById('carritoFinalizar');
    var badgeCount   = document.querySelector('.navbar-inicio__carrito-count');
    var cartLink     = document.querySelector('.navbar-inicio__carrito');

    // ─── Cart state ────────────────────────────────────────────
    var cart = loadCart();

    // ─── Initialization ────────────────────────────────────────
    renderCart();
    updateBadge();
    bindButtons();
    bindPanelControls();

    // ─── Load cart from localStorage ───────────────────────────
    function loadCart() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // ─── Save cart to localStorage ─────────────────────────────
    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    // ─── Get product data from a card element ──────────────────
    function getProductFromCard(card) {
        return {
            id:     card.dataset.id,
            nombre: card.dataset.nombre,
            precio: parseInt(card.dataset.precio, 10),
            img:    card.dataset.img
        };
    }

    // ─── Add item to cart ──────────────────────────────────────
    function addToCart(product) {
        var existing = cart.find(function (item) { return item.id === product.id; });
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id:     product.id,
                nombre: product.nombre,
                precio: product.precio,
                img:    product.img,
                qty:    1
            });
        }
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Change quantity ───────────────────────────────────────
    function changeQty(id, delta) {
        var item = cart.find(function (i) { return i.id === id; });
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(function (i) { return i.id !== id; });
        }
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Remove item ──────────────────────────────────────────
    function removeItem(id) {
        cart = cart.filter(function (i) { return i.id !== id; });
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Clear cart ────────────────────────────────────────────
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Calculate total ───────────────────────────────────────
    function getTotal() {
        return cart.reduce(function (sum, item) { return sum + item.precio * item.qty; }, 0);
    }

    // ─── Count total items ─────────────────────────────────────
    function getTotalItems() {
        return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    }

    // ─── Format price ──────────────────────────────────────────
    function formatPrice(n) {
        return '$' + n.toLocaleString('es-MX') + ' MXN';
    }

    // ─── Update navbar badge ───────────────────────────────────
    function updateBadge() {
        var count = getTotalItems();
        badgeCount.textContent = count;
        // Trigger bounce animation
        badgeCount.classList.remove('navbar-inicio__carrito-count--bounce');
        // Force reflow to restart animation
        void badgeCount.offsetWidth;
        badgeCount.classList.add('navbar-inicio__carrito-count--bounce');
    }

    // ─── Render cart panel content ─────────────────────────────
    function renderCart() {
        if (cart.length === 0) {
            body.innerHTML =
                '<div class="carrito-vacio">' +
                    '<i class="bi bi-cart-x carrito-vacio__icon"></i>' +
                    '<p class="carrito-vacio__texto">Tu carrito está vacío</p>' +
                '</div>';
            footer.style.display = 'none';
            totalEl.textContent = formatPrice(0);
            return;
        }

        footer.style.display = '';
        var html = '';
        cart.forEach(function (item) {
            var subtotal = item.precio * item.qty;
            html +=
                '<div class="carrito-item" data-item-id="' + item.id + '">' +
                    '<img class="carrito-item__img" src="' + item.img + '" alt="' + item.nombre + '">' +
                    '<div class="carrito-item__info">' +
                        '<div class="carrito-item__nombre" title="' + item.nombre + '">' + item.nombre + '</div>' +
                        '<div class="carrito-item__precio-unit">' + formatPrice(item.precio) + ' c/u</div>' +
                        '<div class="carrito-item__controles">' +
                            '<button class="carrito-item__btn-qty" data-action="minus" data-id="' + item.id + '">−</button>' +
                            '<span class="carrito-item__qty">' + item.qty + '</span>' +
                            '<button class="carrito-item__btn-qty" data-action="plus" data-id="' + item.id + '">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="carrito-item__right">' +
                        '<button class="carrito-item__eliminar" data-action="remove" data-id="' + item.id + '" title="Eliminar">' +
                            '<i class="bi bi-trash3"></i>' +
                        '</button>' +
                        '<div class="carrito-item__subtotal">' + formatPrice(subtotal) + '</div>' +
                    '</div>' +
                '</div>';
        });
        body.innerHTML = html;
        totalEl.textContent = formatPrice(getTotal());
    }

    // ─── Bind add-to-cart / buy buttons ────────────────────────
    function bindButtons() {
        document.addEventListener('click', function (e) {
            // Find the closest button (handles clicks on the <i> icon inside)
            var btn = e.target.closest('.btn-carrito, .btn-comprar');
            if (!btn) return;

            // Find the parent card with data attributes
            var card = btn.closest('[data-id]');
            if (!card) return;

            var product = getProductFromCard(card);

            if (btn.classList.contains('btn-carrito')) {
                addToCart(product);
                showToast(product.nombre + ' agregado al carrito');
            }

            if (btn.classList.contains('btn-comprar')) {
                addToCart(product);
                openCart();
            }
        });

        // Navbar cart icon opens panel
        if (cartLink) {
            cartLink.addEventListener('click', function (e) {
                e.preventDefault();
                openCart();
            });
        }
    }

    // ─── Bind panel internal controls ──────────────────────────
    function bindPanelControls() {
        // Delegated click for qty +/- and remove inside the panel body
        body.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;

            var action = btn.dataset.action;
            var id     = btn.dataset.id;

            if (action === 'plus')   changeQty(id, 1);
            if (action === 'minus')  changeQty(id, -1);
            if (action === 'remove') removeItem(id);
        });

        // Close button
        btnCerrar.addEventListener('click', closeCart);

        // Overlay click
        overlay.addEventListener('click', closeCart);

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('carrito-panel--open')) {
                closeCart();
            }
        });

        // Clear cart
        btnVaciar.addEventListener('click', function () {
            clearCart();
            showToast('Carrito vaciado');
        });

        // Checkout placeholder
        btnFinalizar.addEventListener('click', function () {
            if (cart.length === 0) {
                showToast('Tu carrito está vacío');
                return;
            }
            showToast('Redirigiendo al checkout...');
            // Future: redirect to checkout page
        });
    }

    // ─── Open / Close panel ────────────────────────────────────
    function openCart() {
        panel.classList.add('carrito-panel--open');
        overlay.classList.add('carrito-overlay--visible');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        panel.classList.remove('carrito-panel--open');
        overlay.classList.remove('carrito-overlay--visible');
        document.body.style.overflow = '';
    }

    // ─── Toast notification ────────────────────────────────────
    var toastTimer = null;

    function showToast(message) {
        // Reuse or create toast element
        var toast = document.querySelector('.carrito-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'carrito-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.remove('carrito-toast--visible');
        // Force reflow
        void toast.offsetWidth;
        toast.classList.add('carrito-toast--visible');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('carrito-toast--visible');
        }, 2500);
    }

})();

/* [FIN] Cart JS - Indez-Destacados-Chris */
