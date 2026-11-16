(() => {
  'use strict';

  const TG = 'https://t.me/olmimishka';
  const MAX = 'https://max.ru/u/f9LHodD0cOJTmZSXC2xDiFKOupGok4hs0EyRTp6BvPzztb1ugJhLJU4sZng';
  const AROMAS = [
    'Сумеречный лес', 'Глинтвейн', 'Тайское манго', 'Солёный океан', 'Щелкунчик',
    'Клубника со сливками', 'Пина колада', 'Чистый хлопок', 'Арабика', 'Кашемировое дерево',
    'Кожа и сандал', 'Табак и ваниль', 'Малиновое варенье', 'Хвойная Ель',
    'Рождественское утро', 'Имбирный пряник', 'Ванильный пудинг', 'Какао',
    'Кокосовое мороженое', 'Лаванда'
  ];
  const AROMA_LATER = 'Подобрать при оформлении';
  const PRODUCTS = {
  "elka-shkatulka": {
    "name": "Ёлка-шкатулка",
    "image": "tree-box.webp",
    "price": 5000
  },
  "igrushki-garri-ron-germiona": {
    "name": "Набор ёлочных игрушек «Рон, Гарри, Гермиона»",
    "image": "ornaments-trio.webp",
    "price": 2700,
    "variants": [
      {
        "id": "set",
        "name": "Набор 3 шт.",
        "price": 2700
      },
      {
        "id": "ron",
        "name": "Рон",
        "price": 1100
      },
      {
        "id": "garri",
        "name": "Гарри",
        "price": 1100
      },
      {
        "id": "germiona",
        "name": "Гермиона",
        "price": 1100
      }
    ]
  },
  "kruzhka-magiya-hogvartsa": {
    "name": "Кружка HP «Магия Хогвартса»",
    "image": "mug-letter.webp",
    "price": 4000
  },
  "elka-svecha": {
    "name": "Ёлка со свечой внутри",
    "image": "tree-candle.webp",
    "price": 6000,
    "scents": true
  },
  "kruzhka-hogwarts": {
    "name": "Тёмно-синяя кружка Hogwarts",
    "image": "mug-hogwarts.webp",
    "price": null
  },
  "svecha-shlyapa": {
    "name": "Аромасвеча «Распределяющая шляпа»",
    "image": "candle-hat.webp",
    "price": 4000,
    "scents": true
  },
  "kruzhka-kukolka-hanna": {
    "name": "Кружка «Куколка Ханна»",
    "image": "cup-hanna.webp",
    "price": 2500
  },
  "nebesnaya-feya": {
    "name": "Кружка и ложечка «Небесная фея»",
    "image": "fairy-sky.webp",
    "price": 3700,
    "variants": [
      {
        "id": "set",
        "name": "Набор: кружка + ложечка",
        "price": 3700
      },
      {
        "id": "mug",
        "name": "Кружка (повтор)",
        "price": 3200
      },
      {
        "id": "spoon",
        "name": "Ложечка",
        "price": 800
      }
    ]
  },
  "cvetochnaya-feya": {
    "name": "Кружка и ложечка «Цветочная фея»",
    "image": "fairy-flower.webp",
    "price": 3700,
    "variants": [
      {
        "id": "set",
        "name": "Набор: кружка + ложечка",
        "price": 3700
      },
      {
        "id": "mug",
        "name": "Кружка",
        "price": 3000
      },
      {
        "id": "spoon",
        "name": "Ложечка",
        "price": 1100
      }
    ]
  },
  "kruzhka-aurora": {
    "name": "Кружка «Малышка Аврора»",
    "image": "cup-aurora.webp",
    "price": 2500
  },
  "kruzhka-slonenok": {
    "name": "Кружка «Маленький слонёнок»",
    "image": "cup-baby-elephant.webp",
    "price": 2200
  },
  "kruzhka-vintazhnyy-mishka": {
    "name": "Кружка «Винтажный мишка»",
    "image": "vintage-bear.webp",
    "price": 3000
  },
  "lozhechka-bear-love": {
    "name": "Ложечка «Bear love»",
    "image": "spoon-bear-love.webp",
    "price": 1200
  },
  "brosh-vintazhnyy-slonik": {
    "name": "Брошечка «Винтажный слоник»",
    "image": "brooch-elephant.webp",
    "price": 900
  },
  "zakladki-dlya-knig": {
    "name": "Закладки для книг",
    "image": "bookmarks.webp",
    "price": 350,
    "variants": [
      {
        "id": "one",
        "name": "1 закладка",
        "price": 350
      },
      {
        "id": "five",
        "name": "Набор 5 закладок",
        "price": 1250
      }
    ]
  },
  "kruzhka-vintazhnyy-slonenok": {
    "name": "Кружка «Винтажный слонёнок»",
    "image": "cup-vintage-elephant.webp",
    "price": 2500
  },
  "lozhechka-snegovichok": {
    "name": "Ложечка «Снеговичок»",
    "image": "spoon-snowman.webp",
    "price": 1100
  },
  "kruzhka-rozhdestvenskiy-venok": {
    "name": "Кружка «Рождественский венок»",
    "image": "cup-wreath.webp",
    "price": 2490
  }
};

  const KEY = 'artmimishka_cart_v3';
  const OLD_KEY = 'artmimishka_cart_v2';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const modals = ['cart-drawer', 'cart-success', 'checkout-dialog', 'product-config'];
  const scrimFor = {
    'cart-drawer': 'scrim',
    'cart-success': 'success-scrim',
    'checkout-dialog': 'checkout-scrim',
    'product-config': 'config-scrim'
  };
  const prefix = location.pathname.includes('/products/') ? '../../' :
    /\/(catalog|privacy|oferta|nalichie|kukolkahanna|volshebnyefei|rozhdestvenskayaprincessa)\//.test(location.pathname) ? '../' : '';
  const rub = n => n == null ? 'Цена уточняется' : new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const clampQuantity = n => Math.max(0, Math.min(99, Number.isInteger(n) ? n : 0));
  let cart = [];
  let currentConfig = null;
  let previousFocus = null;

  function normaliseRow(row) {
    if (!row || !PRODUCTS[row.id]) return null;
    const product = PRODUCTS[row.id];
    const variant = product.variants?.some(v => v.id === row.variant) ? row.variant : (product.variants?.[0].id ?? '');
    const scent = product.scents ? (AROMAS.includes(row.scent) ? row.scent : AROMA_LATER) : '';
    const quantity = clampQuantity(row.quantity);
    return quantity ? {id: row.id, variant, scent, quantity} : null;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (Array.isArray(stored)) cart = stored.map(normaliseRow).filter(Boolean);
    else {
      const old = JSON.parse(localStorage.getItem(OLD_KEY) || '{}');
      if (old && typeof old === 'object') {
        cart = Object.entries(old).map(([id, quantity]) => normaliseRow({id, quantity})).filter(Boolean);
      }
    }
  } catch (_) { cart = []; }

  function itemOption(row) {
    const p = PRODUCTS[row.id];
    return p?.variants?.find(v => v.id === row.variant) || null;
  }
  function unitPrice(row) {
    const p = PRODUCTS[row.id];
    return itemOption(row)?.price ?? p?.price ?? null;
  }
  function optionLabel(row) {
    const extras = [];
    const option = itemOption(row);
    if (option) extras.push(option.name);
    if (row.scent) extras.push('Аромат: ' + row.scent);
    return extras.join(' · ');
  }
  function count() { return cart.reduce((sum, row) => sum + row.quantity, 0); }
  function sumKnown() { return cart.reduce((sum, row) => sum + (unitPrice(row) || 0) * row.quantity, 0); }
  function hasUnknown() { return cart.some(row => unitPrice(row) == null); }
  function track(event, detail = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, ...detail});
    if (typeof window.ym === 'function' && Number.isInteger(window.ART_METRIKA_ID)) {
      try { window.ym(window.ART_METRIKA_ID, 'reachGoal', event, detail); } catch (_) { /* analytics optional */ }
    }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (_) { /* private browsing */ }
    renderCart();
  }
  function node(tag, css = '', text) {
    const result = document.createElement(tag);
    if (css) result.className = css;
    if (text !== undefined) result.textContent = text;
    return result;
  }
  function setClose(restoreFocus = true) {
    modals.forEach(id => {
      const element = document.getElementById(id);
      const backdrop = document.getElementById(scrimFor[id]);
      if (element) element.hidden = true;
      if (backdrop) backdrop.hidden = true;
    });
    document.body.classList.remove('no-scroll');
    if (restoreFocus && previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
  }
  function displayModal(id, selector) {
    setClose(false);
    const element = document.getElementById(id);
    if (!element) return;
    element.hidden = false;
    const backdrop = document.getElementById(scrimFor[id]);
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    const focusTarget = selector ? element.querySelector(selector) : element.querySelector('button, select, a, textarea');
    focusTarget?.focus?.();
  }
  function openCart() {
    previousFocus = document.activeElement;
    renderCart();
    displayModal('cart-drawer', '[data-close-cart]');
    track('cart_open');
  }
  function addLine(id, variant = '', scent = '') {
    const p = PRODUCTS[id];
    if (!p) return;
    previousFocus = document.activeElement;
    const row = normaliseRow({id, variant, scent, quantity: 1});
    if (!row) return;
    const existing = cart.find(r => r.id === row.id && r.variant === row.variant && r.scent === row.scent);
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else cart.push(row);
    persist();
    const name = p.name + (optionLabel(row) ? ' · ' + optionLabel(row) : '');
    const label = $('#success-product');
    if (label) label.textContent = name + ' — ' + rub(unitPrice(row));
    displayModal('cart-success', '[data-checkout]');
    track('add_to_cart', {product: id, variant: row.variant, scent: row.scent, price: unitPrice(row)});
  }
  function openConfig(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    currentConfig = id;
    previousFocus = document.activeElement;
    const name = $('#config-item-name');
    if (name) name.textContent = p.name;
    const variantField = $('#variant-field');
    const variantSelect = $('#variant-select');
    const scentField = $('#scent-field');
    const scentSelect = $('#scent-select');
    if (variantField && variantSelect) {
      variantField.hidden = !p.variants;
      variantSelect.replaceChildren();
      if (p.variants) p.variants.forEach(v => {
        const option = node('option', '', `${v.name} — ${rub(v.price)}`);
        option.value = v.id;
        variantSelect.append(option);
      });
    }
    if (scentField && scentSelect) {
      scentField.hidden = !p.scents;
      scentSelect.replaceChildren();
      if (p.scents) {
        const starter = node('option', '', AROMA_LATER);
        starter.value = AROMA_LATER;
        scentSelect.append(starter);
        AROMAS.forEach(name => {
          const option = node('option', '', name);
          option.value = name;
          scentSelect.append(option);
        });
      }
    }
    updateConfigPrice();
    displayModal('product-config', p.variants ? '#variant-select' : '#scent-select');
  }
  function updateConfigPrice() {
    if (!currentConfig) return;
    const p = PRODUCTS[currentConfig];
    const variant = p.variants?.find(v => v.id === $('#variant-select')?.value);
    const price = variant?.price ?? p.price;
    const element = $('#config-price');
    if (element) element.textContent = 'Стоимость: ' + rub(price);
  }
  function confirmConfig() {
    if (!currentConfig) return;
    const id = currentConfig;
    const variant = PRODUCTS[id].variants ? ($('#variant-select')?.value || 'set') : '';
    const scent = PRODUCTS[id].scents ? ($('#scent-select')?.value || AROMA_LATER) : '';
    currentConfig = null;
    addLine(id, variant, scent);
  }
  function adjustRow(index, diff) {
    if (!cart[index]) return;
    const quantity = clampQuantity(cart[index].quantity + diff);
    if (quantity) cart[index].quantity = quantity;
    else cart.splice(index, 1);
    persist();
  }
  function renderCart() {
    const totalItems = count();
    $$('[data-cart-count]').forEach(el => { el.textContent = totalItems; });
    const area = $('#cart-items');
    if (!area) return;
    area.replaceChildren();
    cart.forEach((row, index) => {
      const p = PRODUCTS[row.id];
      const item = node('div', 'cart-item');
      const pic = node('img');
      pic.src = prefix + 'assets/img/' + p.image;
      pic.alt = '';
      pic.loading = 'lazy';
      const body = node('div');
      body.append(node('h3', '', p.name));
      if (optionLabel(row)) body.append(node('small', 'cart-option', optionLabel(row)));
      const subtotal = unitPrice(row) == null ? 'Стоимость уточняется' : rub(unitPrice(row) * row.quantity);
      body.append(node('small', 'cart-line-price', subtotal));
      const controls = node('div', 'cart-controls');
      const minus = node('button', '', '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Уменьшить количество ' + p.name);
      minus.addEventListener('click', () => adjustRow(index, -1));
      const current = node('strong', '', String(row.quantity));
      const plus = node('button', '', '+');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Увеличить количество ' + p.name);
      plus.addEventListener('click', () => adjustRow(index, 1));
      const remove = node('button', 'remove', 'Удалить');
      remove.type = 'button';
      remove.addEventListener('click', () => { cart.splice(index, 1); persist(); });
      controls.append(minus, current, plus, remove);
      body.append(controls);
      item.append(pic, body);
      area.append(item);
    });
    const empty = $('#cart-empty');
    if (empty) empty.hidden = totalItems > 0;
    const total = $('#cart-total');
    if (total) total.textContent = hasUnknown()
      ? (sumKnown() ? `Известная сумма: ${rub(sumKnown())} · стоимость одной из позиций уточняется` : 'Стоимость уточняется в мастерской')
      : `Предварительная сумма: ${rub(sumKnown())}`;
    const check = $('[data-checkout]', $('#cart-drawer'));
    if (check) check.disabled = totalItems === 0;
  }
  function messageText() {
    const message = [
      'Здравствуйте! Хочу оформить заказ в мастерской ART MIMISHKA:',
      ''
    ];
    cart.forEach((r, i) => {
      const p = PRODUCTS[r.id];
      const price = unitPrice(r);
      message.push(`${i + 1}. ${p.name}`);
      if (itemOption(r)) message.push(`   Вариант: ${itemOption(r).name}`);
      if (r.scent) message.push(`   Аромат: ${r.scent}`);
      message.push(`   Количество: ${r.quantity} шт.`);
      message.push(`   Сумма: ${price == null ? 'уточняется' : rub(price * r.quantity)}`);
      message.push('');
    });
    message.push(hasUnknown() ? (sumKnown() ? `Известная часть суммы: ${rub(sumKnown())}` : 'Итоговая сумма: уточняется') : `Предварительная сумма: ${rub(sumKnown())}`);
    message.push('');
    if (cart.some(r => r.scent && r.scent !== AROMA_LATER)) {
      message.push('Пожалуйста, подтвердите наличие выбранных ароматов. Если какой-то закончился, предложите замену.');
    }
    message.push('Подскажите, пожалуйста, наличие изделий, итоговую стоимость, сроки изготовления и варианты доставки.');
    message.push('');
    message.push('Список составлен на artmimishka.ru. Оплата согласуется отдельно.');
    return message.join('\n');
  }
  function openCheckout() {
    if (!count()) { openCart(); return; }
    previousFocus = document.activeElement;
    const field = $('#checkout-text');
    if (field) field.value = messageText();
    const status = $('#copy-status');
    if (status) status.textContent = '';
    const tg = $('#checkout-dialog a[href^="https://t.me/"]');
    const max = $('#checkout-dialog a[href^="https://max.ru/"]');
    if (tg) tg.href = TG;
    if (max) max.href = MAX;
    displayModal('checkout-dialog', '#copy-order');
    track('checkout_start', {items: count(), known_sum: sumKnown()});
  }
  async function copyOrder() {
    const textarea = $('#checkout-text');
    if (!textarea) return;
    let success = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textarea.value);
        success = true;
      }
    } catch (_) { /* local file origin may deny clipboard */ }
    if (!success) {
      textarea.focus();
      textarea.select();
      try { success = document.execCommand('copy'); } catch (_) { /* fallback */ }
    }
    const status = $('#copy-status');
    if (status) status.textContent = success
      ? 'Заказ скопирован. Откройте Telegram или MAX и вставьте сообщение.'
      : 'Выделите и скопируйте текст заказа вручную, затем отправьте его в мессенджер.';
    track('copy_order', {success});
  }
  function applyFilter(filter, scope) {
    $$('.product-card[data-category]', scope).forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || filter === 'popular'
        || (filter === 'new' ? card.dataset.new === 'true' : categories.includes(filter));
      card.classList.toggle('is-hidden', !show);
    });
    $$('[data-filter]', scope).forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    track('catalog_filter', {filter});
  }

  function sortProducts(scope, sort) {
    const grid = $('.studio-products-grid', scope);
    if (!grid) return;
    const cards = $$('.studio-card', grid);
    cards.sort((a,b) => {
      if (sort === 'price-up') return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === 'price-down') return Number(b.dataset.price) - Number(a.dataset.price);
      if (sort === 'title') return a.dataset.title.localeCompare(b.dataset.title, 'ru');
      return Number(a.dataset.rank) - Number(b.dataset.rank);
    });
    grid.append(...cards);
  }
  document.addEventListener('change', e => {
    if (e.target.matches('[data-sort]')) sortProducts(e.target.closest('.catalog-section') || document, e.target.value);
  });
  const WISH_KEY = 'artmimishka_favorites_v1';
  let favorites = [];
  try { favorites = JSON.parse(localStorage.getItem(WISH_KEY) || '[]') || []; } catch (_) { favorites = []; }
  function redrawFavorites() {
    $$('[data-favorite]').forEach(btn => {
      const active = favorites.includes(btn.dataset.favorite);
      btn.setAttribute('aria-pressed', String(active));
      btn.textContent = active ? '♥' : '♡';
    });
  }
  redrawFavorites();
  const menu = $('.menu-toggle');
  const links = $('.nav-links');
  if (menu && links) {
    const close = () => { links.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const expanded = links.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(expanded));
    });
    $$('a', links).forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => { if (!e.target.closest('.nav-bar')) close(); });
  }
  document.addEventListener('click', event => {
    const t = event.target;
    const fav = t.closest('[data-favorite]');
    if (fav) {
      event.preventDefault();
      const id = fav.dataset.favorite;
      favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites,id];
      try { localStorage.setItem(WISH_KEY, JSON.stringify(favorites)); } catch (_) {}
      redrawFavorites();
      track('favorite_toggle', {product:id, active:favorites.includes(id)});
      return;
    }
    const add = t.closest('[data-add-cart]');
    if (add) {
      event.preventDefault();
      const id = add.dataset.addCart;
      if (!PRODUCTS[id]) return;
      if (PRODUCTS[id].variants || PRODUCTS[id].scents) openConfig(id);
      else addLine(id);
      return;
    }
    if (t.closest('[data-open-cart]')) { event.preventDefault(); openCart(); return; }
    if (t.closest('[data-close-cart], [data-close-success], [data-close-checkout], [data-close-config]')
      || ['scrim', 'success-scrim', 'checkout-scrim', 'config-scrim'].includes(t.id)) {
      setClose(); return;
    }
    if (t.closest('[data-checkout]')) { event.preventDefault(); openCheckout(); return; }
    const filter = t.closest('[data-filter]');
    if (filter) {
      applyFilter(filter.dataset.filter, filter.closest('.catalog-section') || document);
      return;
    }
    const tracked = t.closest('[data-track]');
    if (tracked) track('contact_click', {channel: tracked.dataset.track || '', page: location.pathname});
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setClose();
    if (e.key === 'Tab') {
      const active = modals.map(id => document.getElementById(id)).find(el => el && !el.hidden);
      if (!active) return;
      const focusables = $$('button:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]', active)
        .filter(el => !el.closest('[hidden]') && el.getClientRects().length);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#variant-select')?.addEventListener('change', updateConfigPrice);
  $('#config-add')?.addEventListener('click', confirmConfig);
  $('#copy-order')?.addEventListener('click', copyOrder);
  renderCart();
})();
