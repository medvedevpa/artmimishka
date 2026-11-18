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
  // A single editable catalog shared by the storefront, cart and product pages.
  const PACKAGING = Array.isArray(window.ART_MIMISHKA_PACKAGING) ? window.ART_MIMISHKA_PACKAGING.filter(x=>x.active!==false) : [];
  const COURSES = Array.isArray(window.ART_MIMISHKA_COURSES) ? window.ART_MIMISHKA_COURSES.filter(x=>x.active!==false) : [];
  let chosenPackaging = 'standard';
  try {chosenPackaging=sessionStorage.getItem('artmimishka_packaging')||'standard'} catch(_) {}
  const CATALOG = Array.isArray(window.ART_MIMISHKA_CATALOG) ? window.ART_MIMISHKA_CATALOG.filter(p => p && p.active !== false && p.id) : [];
  const PRODUCTS = Object.fromEntries(CATALOG.map(p => [p.id, {
    name: p.title || p.name || 'Изделие',
    image: p.image || '',
    price: Number.isFinite(Number(p.price_rub)) && p.price_rub !== null && p.price_rub !== '' ? Number(p.price_rub) : null,
    variants: Array.isArray(p.variants) && p.variants.length ? p.variants.map(v => ({id:v.id,name:v.title||v.name,price:Number(v.price_rub ?? v.price)})) : undefined,
    scents: Boolean(p.scents),
    source:p
  }]));
  const STATIC_PRODUCT_IDS = new Set(["cvetochnaya-feya", "elka-shkatulka", "elka-svecha", "igrushki-garri-ron-germiona", "kruzhka-aurora", "kruzhka-hogwarts", "kruzhka-magiya-hogvartsa", "kruzhka-rozhdestvenskiy-venok", "kruzhka-slonenok", "kruzhka-vintazhnyy-mishka", "kruzhka-vintazhnyy-slonenok", "svecha-shlyapa", "zakladki-dlya-knig"]);


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
  const prefix = /\/(products|courses)\//.test(location.pathname) ? '../../' :
    /\/(catalog|privacy|oferta|nalichie|kukolkahanna|volshebnyefei|rozhdestvenskayaprincessa)\//.test(location.pathname) ? '../' : '';
  const rub = n => n == null ? 'Цена уточняется' : new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const productImage = p => {
    const src = p?.image || '';
    return /^(data:|https?:|blob:)/.test(src) ? src : prefix + 'assets/img/' + encodeURI(src);
  };
  const productHref = p => STATIC_PRODUCT_IDS.has(p.id)
    ? prefix + 'products/' + encodeURIComponent(p.id) + '/index.html'
    : prefix + 'products/view/index.html?id=' + encodeURIComponent(p.id);
  const bagSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>`;
  function renderCatalog() {
    const grid = $('.a15-catalog-grid');
    const otherGrid = $('.studio-products-grid:not(.a15-catalog-grid)');
    const visible = CATALOG.slice().sort((a,b) => (a.rank ?? 999) - (b.rank ?? 999));
    if (grid) grid.innerHTML = visible.map((p,i) => {
      const href = productHref(p), name=htmlEscape(p.title), image=htmlEscape(productImage(p));
      const price=PRODUCTS[p.id].price == null ? 'Цена по запросу' : rub(PRODUCTS[p.id].price);
      const old = Number(p.old_price_rub)>Number(p.price_rub) && p.price_rub!==null ? `<del class="a16-old-price">${rub(Number(p.old_price_rub))}</del>` : '';
      return `<article class="a15-item product-card studio-card" data-category="${htmlEscape(p.category)} ${p.scents?'candles':''}" data-new="${p.new ? 'true':'false'}" data-title="${name}" data-rank="${p.rank??i+1}" data-price="${PRODUCTS[p.id].price ?? 99999999}">
        <a class="a15-item-photo" href="${href}" aria-label="Подробнее: ${name}"><img src="${image}" alt="${name} — фотография изделия" loading="lazy" decoding="async"></a>
        <button class="a15-heart" data-favorite="${htmlEscape(p.id)}" type="button" aria-label="В избранное: ${name}" aria-pressed="false">♡</button>
        <div class="a15-item-info"><a class="a15-item-name" href="${href}">${name}</a><div class="a15-item-bottom"><strong>${price}</strong>${old}<button type="button" class="a15-bag" data-add-cart="${htmlEscape(p.id)}" aria-label="Добавить в корзину: ${name}">${bagSvg}</button></div></div></article>`;
    }).join('');
    if (otherGrid) otherGrid.innerHTML = visible.map((p,i) => {
      const href = productHref(p), name=htmlEscape(p.title), image=htmlEscape(productImage(p));
      const price=PRODUCTS[p.id].price == null ? 'Цена по запросу' : rub(PRODUCTS[p.id].price);
      const old = Number(p.old_price_rub)>Number(p.price_rub) && p.price_rub!==null ? `<del class="a16-old-price">${rub(Number(p.old_price_rub))}</del>` : '';
      return `<article class="product-card studio-card" data-category="${htmlEscape(p.category)} ${p.scents?'candles':''}" data-new="${p.new?'true':'false'}" data-title="${name}" data-rank="${p.rank??i+1}" data-price="${PRODUCTS[p.id].price??99999999}">
         <a class="product-image" href="${href}" aria-label="Подробнее: ${name}"><img alt="${name}" src="${image}" loading="lazy" decoding="async"></a>
         <div class="product-info"><span class="product-category">${htmlEscape(p.kind||p.subtitle||'Ручная работа')}</span><h3><a href="${href}">${name}</a></h3><div class="product-foot"><span class="price-now">${price}</span>${old}<button class="cart-mini" data-add-cart="${htmlEscape(p.id)}" type="button" aria-label="Добавить в корзину: ${name}">${bagSvg}</button></div></div></article>`;
    }).join('');
  }
  function renderBestsellers() {
    const grid=$('.a15-best-grid');
    if(!grid)return;
    const featured=CATALOG.filter(p=>p.featured).sort((a,b)=>(a.rank??999)-(b.rank??999));
    const ordered=[...featured,...CATALOG.filter(p=>!p.featured).sort((a,b)=>(a.rank??999)-(b.rank??999))];
    grid.innerHTML=ordered.slice(0,3).map(p=>{
      const title=htmlEscape(p.title),href=productHref(p),src=htmlEscape(productImage(p));
      return `<article class="a15-bestseller"><a class="a15-bestseller-img" href="${href}"><img src="${src}" alt="${title}" loading="eager"></a><div class="a15-bestseller-copy"><a class="a15-bestseller-name" href="${href}">${title}</a><div class="a15-bestseller-price">${rub(PRODUCTS[p.id].price)}</div><button type="button" class="a15-best-buy" data-add-cart="${htmlEscape(p.id)}">В корзину <span aria-hidden="true">✧</span></button></div><button type="button" class="a15-best-heart" data-favorite="${htmlEscape(p.id)}" aria-label="В избранное: ${title}" aria-pressed="false">♡</button></article>`;
    }).join('');
  }
  function renderCourses(){
    const grid=$('.a15-courses-grid');if(!grid || !COURSES.length)return;
    grid.innerHTML=COURSES.slice().sort((a,b)=>(a.rank||99)-(b.rank||99)).map(p=>{
      const id=encodeURIComponent(p.id),old=['volshebnyefei','rozhdestvenskayaprincessa'].includes(p.id);
      const href=old?p.id+'/index.html':'courses/view/index.html?id='+id;
      const image=productImage(p);return `<article class="a15-course"><a class="a15-course-photo" href="${href}"><img src="${htmlEscape(image)}" alt="${htmlEscape(p.title)}" loading="lazy"></a><div><h3>${htmlEscape(p.title)}</h3><p>${htmlEscape(p.description||'Авторский мастер-класс')}</p><a href="${href}">Подробнее <span>›</span></a></div></article>`;
    }).join('');
  }
  renderCourses();
  function refreshProductDetail() {
    const slug = /\/products\/([^/]+)\//.exec(location.pathname)?.[1];
    const id = slug === 'view' ? new URLSearchParams(location.search).get('id') : slug;
    if (!id || !PRODUCTS[id]) return;
    const product = PRODUCTS[id]; const p = product.source;
    document.title = p.title + ' — ART MIMISHKA';
    const img = $('.detail-gallery img');
    if (img) {img.src=productImage(p);img.alt=p.title+' — фотография изделия';}
    const h1 = $('.detail-info h1');if(h1)h1.textContent=p.title;
    const sub=$('.detail-subtitle');if(sub)sub.textContent=p.description || '';
    const summary=$('.detail-info > p:not(.detail-subtitle):not(.helper)');if(summary)summary.textContent=p.description || p.long || '';
    const kind=$('.detail-info .eyebrow');if(kind)kind.textContent=(p.kind||'Авторская работа')+' · ART MIMISHKA';
    const priceInfo=$('.detail-meta');
    if(priceInfo){priceInfo.replaceChildren();
      const rows=[['Стоимость',rub(product.price)], ...(p.specifications||[]).map(o=>[o.name,o.value]), ['Наличие и сроки','Уточняются при заказе']];
      for (const [label,value] of rows) {const row=document.createElement('div');const sp=document.createElement('span');sp.textContent=label;const strong=document.createElement('strong');strong.textContent=value;row.append(sp,strong);priceInfo.append(row);}
    }
    const story = $('.product-story-main');
    if (story){const ps=$$('p',story);if(ps[0])ps[0].textContent=p.long||p.description||'';if(ps[1])ps[1].remove();}
    $$('[data-add-cart]', $('.detail-actions')||document).forEach(el=>el.dataset.addCart=id);
  }
  function refreshCourseDetail(){
    if(!/\/courses\/view\//.test(location.pathname))return;
    const course=COURSES.find(p=>p.id===new URLSearchParams(location.search).get('id'));
    const main=$('#course-content');if(!main)return;
    if(!course){main.textContent='Мастер-класс не найден';return}
    document.title=course.title+' — ART MIMISHKA';
    const h=$('h1',main),img=$('img',main),d=$('.course-description',main),pr=$('.course-price',main);
    if(h)h.textContent=course.title;if(img){img.src=productImage(course);img.alt=course.title}if(d)d.textContent=course.long||course.description||'';if(pr)pr.textContent=course.price_rub==null?'Стоимость уточняется':rub(course.price_rub);
  }
  refreshCourseDetail();
  renderCatalog();
  renderBestsellers();
  refreshProductDetail();
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
    renderSuccessSummary();
    if (matchMedia('(max-width: 700px)').matches) showMobileToast();
    else displayModal('cart-success', '[data-checkout]');
    track('add_to_cart', {product: id, variant: row.variant, scent: row.scent, price: unitPrice(row)});
  }
  let toastTimeout;
  function showMobileToast(){
    let toast=$('#a18-toast');
    if(!toast){toast=node('div','a18-toast');toast.id='a18-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.innerHTML='<span class="a18-toast-mark" aria-hidden="true">✓</span><div>Добавлено в корзину<small class="a18-toast-count"></small></div><button type="button">Корзина</button>';document.body.append(toast);toast.querySelector('button').addEventListener('click',()=>{toast.hidden=true;openCart()})}
    toast.querySelector('.a18-toast-count').textContent=count()+' шт. в корзине';
    toast.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.hidden=true,3600);
  }
  function renderSuccessSummary(){
    const area=$('#success-items'), total=$('#success-total');
    if(!area)return;
    area.replaceChildren();
    cart.forEach(row=>{
      const p=PRODUCTS[row.id];if(!p)return;
      const item=node('div','a16-success-row');
      const img=node('img'); img.src=productImage(p);img.alt='';img.loading='lazy';
      const body=node('div');body.append(node('b','',p.name));
      const opt=optionLabel(row);if(opt)body.append(node('small','',opt));
      body.append(node('span','',row.quantity+' шт. · '+(unitPrice(row)==null?'Цена по запросу':rub(unitPrice(row)*row.quantity))));
      item.append(img,body);area.append(item);
    });
    if(total)total.textContent=hasUnknown()?'В корзине '+count()+' шт. · известная сумма '+rub(sumKnown()):'В корзине '+count()+' шт. · итого '+rub(sumKnown());
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
      pic.src = productImage(p);
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
    let packing=$('#a18-packaging');
    if(!packing && PACKAGING.length){const bottom=$('.drawer-bottom',$('#cart-drawer'));packing=node('div','a18-packing');packing.id='a18-packaging';const title=node('label','','Упаковка заказа');title.htmlFor='a18-packing-choice';const sel=node('select');sel.id='a18-packing-choice';for(const p of PACKAGING){const opt=node('option','',p.title+(p.price_rub==null?' · цена уточняется':p.price_rub>0?' · +'+rub(p.price_rub):' · бесплатно'));opt.value=p.id;sel.append(opt)}sel.value=PACKAGING.some(x=>x.id===chosenPackaging)?chosenPackaging:PACKAGING[0].id;sel.addEventListener('change',()=>{chosenPackaging=sel.value;try{sessionStorage.setItem('artmimishka_packaging',chosenPackaging)}catch(_){}renderCart()});packing.append(title,sel);const preview=node('div','a18-packing-preview');preview.id='a18-packing-preview';packing.append(preview);bottom?.prepend(packing)}
    const pack=PACKAGING.find(p=>p.id===chosenPackaging);
    const packPreview=$('#a18-packing-preview');if(packPreview&&pack){packPreview.replaceChildren();if(pack.image){const photo=node('img');photo.alt='';photo.src=productImage(pack);packPreview.append(photo)}packPreview.append(node('small','',pack.description||''));
      const details=node('details','a19-pack-details');const summary=node('summary','','Подробнее об упаковке');details.append(summary);
      details.append(node('p','',pack.long_description||pack.description||'Подробности можно уточнить перед заказом.'));
      if(Array.isArray(pack.gallery))for(const src of pack.gallery){if(src){const pic=node('img','a19-pack-gallery');pic.alt='Вариант упаковки';pic.src=productImage({image:src});pic.loading='lazy';details.append(pic)}}
      if(pack.video){const video=node('video','a19-pack-video');video.controls=true;video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','Видео упаковки');video.src=/^(data:|https?:|blob:)/.test(pack.video)?pack.video:prefix+pack.video;details.append(video)}
      packPreview.after(details);
      const existing=$$('.a19-pack-details',packing).filter(x=>x!==details);existing.forEach(el=>el.remove());}
    if(total && pack && totalItems && !hasUnknown() && pack.price_rub!=null)total.textContent=`Предварительная сумма: ${rub(sumKnown()+Number(pack.price_rub||0))} (с упаковкой)`;
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
    const pack=PACKAGING.find(p=>p.id===chosenPackaging);
    if(pack){message.push('Упаковка: '+pack.title+(pack.price_rub==null?' (стоимость уточняется)':pack.price_rub>0?' (+'+rub(pack.price_rub)+')':' (без доплаты)'));if(pack.description)message.push('   '+pack.description);message.push('')}
    message.push(hasUnknown() ? (sumKnown() ? `Известная часть суммы: ${rub(sumKnown())}` : 'Итоговая сумма: уточняется') : pack?.price_rub==null ? `Предварительная сумма за изделия: ${rub(sumKnown())} · упаковка уточняется` : `Предварительная сумма с упаковкой: ${rub(sumKnown()+Number(pack?.price_rub||0))}`);
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
    // Packaging can also be chosen when checkout opens directly from the success dialog.
    let checkoutPacking=$('#a18-checkout-packing');
    if(!checkoutPacking && PACKAGING.length){
      const checkout=$('#checkout-dialog');
      const label=node('label','a18-checkout-pack-label','Упаковка заказа');label.htmlFor='a18-checkout-packing';
      checkoutPacking=node('select','a18-checkout-packing');checkoutPacking.id='a18-checkout-packing';
      for(const p of PACKAGING){const option=node('option','',p.title+(p.price_rub==null?' · цена уточняется':p.price_rub>0?' · +'+rub(p.price_rub):' · бесплатно'));option.value=p.id;checkoutPacking.append(option)}
      checkoutPacking.addEventListener('change',()=>{chosenPackaging=checkoutPacking.value;try{sessionStorage.setItem('artmimishka_packaging',chosenPackaging)}catch(_){}const drawerSelect=$('#a18-packing-choice');if(drawerSelect)drawerSelect.value=chosenPackaging;const text=$('#checkout-text');if(text)text.value=messageText()});
      checkout?.querySelector('textarea')?.before(label,checkoutPacking);
    }
    if(checkoutPacking)checkoutPacking.value=chosenPackaging;
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
