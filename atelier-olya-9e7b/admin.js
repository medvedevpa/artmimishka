(() => {
  'use strict';
  const COURSE_KEY='artmimishka_courses_draft_v1';
  const PACK_KEY='artmimishka_packaging_draft_v1';
  const publishedCourses=Array.isArray(window.ART_MIMISHKA_COURSES)?window.ART_MIMISHKA_COURSES:[];
  const publishedPackaging=Array.isArray(window.ART_MIMISHKA_PACKAGING)?window.ART_MIMISHKA_PACKAGING:[];
  const KEY = 'artmimishka_editor_draft_v1';
  const published = Array.isArray(window.ART_MIMISHKA_CATALOG) ? window.ART_MIMISHKA_CATALOG : [];
  const clone = value => JSON.parse(JSON.stringify(value));
  const $ = id => document.getElementById(id);
  const formatter = new Intl.NumberFormat('ru-RU');
  const rub = n => n === null || n === undefined || n === '' ? 'Цена по запросу' : formatter.format(n) + ' ₽';
  const categories = {courses:'Мастер-классы',mugs:'Кружки', trees:'Ёлки-шкатулки', ornaments:'Ёлочные игрушки', candles:'Свечи', spoons:'Ложечки', brooches:'Броши', accessories:'Аксессуары', gifts:'Подарки'};
  const fileImage = src => /^(data:|https?:|blob:)/.test(src||'') ? src : '../assets/img/' + encodeURI(src||'');
  const $fields = ['title','slug','category','price','old-price','kind','rank','active','new','hit','featured','scents','description','long','specs','variants'];
  const translit = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  const slugify = s => s.toLowerCase().split('').map(c=>translit[c]??c).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70) || 'new-product';
  const labelPairs = rows => (rows || []).map(x => x.name + ' | ' + x.value).join('\n');
  const variantPairs = rows => (rows || []).map(x => (x.title||x.name) + ' | ' + (x.price_rub??x.price)).join('\n');
  const parsePairs = text => text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(x=>x.split('|').map(v=>v.trim()));
  let list;
  try {
    const draft = JSON.parse(localStorage.getItem(KEY) || 'null');
    list = Array.isArray(draft) && draft.every(p=>p && typeof p.id==='string') ? draft : clone(published);
  } catch (_) {list=clone(published)}
  let current=null; let imageValue=''; let previousId=null;
  const readDraft=(key,baseline)=>{try {const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:clone(baseline)}catch(_){return clone(baseline)}};
  let courses=readDraft(COURSE_KEY,publishedCourses);
  let packaging=readDraft(PACK_KEY,publishedPackaging);
  let mode='products';let currentPack=null,packPhoto='';
  const activeList=()=>mode==='courses'?courses:list;
  function saveExtra(){try{localStorage.setItem(COURSE_KEY,JSON.stringify(courses));localStorage.setItem(PACK_KEY,JSON.stringify(packaging));status('Черновики сохранены')}catch(_){status('Недостаточно памяти — скачайте резервную копию')}}
  function chooseTab(next){
    mode=next;document.querySelectorAll('[data-editor-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.editorTab===next);b.setAttribute('aria-selected',String(b.dataset.editorTab===next))});
    $('editor-heading').textContent=next==='products'?'Товары':next==='courses'?'Мастер-классы':'Упаковка';
    $('packaging-form').hidden=next!=='packaging';$('editor-form').hidden=next==='packaging';$('add-product').title=next==='packaging'?'Добавить упаковку':'Добавить запись';
    $('featured').closest('label').hidden=next!=='products';$('scents').closest('label').hidden=next!=='products';
    $('category').closest('label').hidden=next==='courses';$('kind').closest('label').hidden=false;
    if(next==='packaging'){renderPackaging();if(packaging.length)selectPack(packaging[0].id);else addPack()}else{current=null;previousId=null;renderList();if(activeList().length)select(activeList()[0].id);else add()}
  }
  document.querySelectorAll('[data-editor-tab]').forEach(b=>b.addEventListener('click',()=>chooseTab(b.dataset.editorTab)));
  function renderPackaging(){const q=$('search').value.toLowerCase();const matches=packaging.filter(p=>p.title.toLowerCase().includes(q));$('product-count').textContent=`${matches.length} из ${packaging.length} вариантов упаковки`;$('product-list').replaceChildren();matches.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='list-item'+(p.id===currentPack?' active':'');b.textContent=p.title+' · '+rub(p.price_rub);b.addEventListener('click',()=>selectPack(p.id));$('product-list').append(b)})}
  function selectPack(id){const p=packaging.find(x=>x.id===id);if(!p)return;currentPack=id;$('form-title').textContent='Упаковка · '+p.title;$('pack-title').value=p.title;$('pack-id').value=p.id;$('pack-price').value=p.price_rub??'';$('pack-description').value=p.description||'';$('pack-active').checked=p.active!==false;packPhoto=p.image||'';$('pack-preview').hidden=!packPhoto;if(packPhoto)$('pack-preview').src=fileImage(packPhoto);renderPackaging()}
  function addPack(){currentPack=null;packPhoto='';$('packaging-form').reset();$('pack-preview').hidden=true;$('form-title').textContent='Новая упаковка'}
  $('packaging-form').addEventListener('submit',e=>{e.preventDefault();const id=$('pack-id').value.trim();if(!id)return;const p={id,title:$('pack-title').value.trim(),price_rub:$('pack-price').value.trim()===''?null:Number($('pack-price').value),description:$('pack-description').value.trim(),active:$('pack-active').checked,image:packPhoto};if(packaging.some(x=>x.id===id&&x.id!==currentPack)){alert('Такой ID уже существует');return;}const i=packaging.findIndex(x=>x.id===currentPack);if(i<0)packaging.push(p);else packaging[i]=p;currentPack=id;saveExtra();renderPackaging()});
  $('pack-delete').addEventListener('click',()=>{if(!currentPack||!confirm('Удалить этот вариант упаковки?'))return;packaging=packaging.filter(x=>x.id!==currentPack);saveExtra();if(packaging.length)selectPack(packaging[0].id);else addPack()});
  $('pack-title').addEventListener('blur',()=>{if(!currentPack&&!$('pack-id').value)$('pack-id').value=slugify($('pack-title').value)});
  $('pack-image').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;packPhoto=await fileToImage(f);$('pack-preview').src=packPhoto;$('pack-preview').hidden=false});
  async function fileToImage(file){const bitmap=await createImageBitmap(file);const ratio=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));const c=document.createElement('canvas');c.width=Math.round(bitmap.width*ratio);c.height=Math.round(bitmap.height*ratio);c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close?.();return c.toDataURL('image/webp',.82)}

  function status(text){$('status').textContent=text}
  function safeStore(){
    try {localStorage.setItem(KEY,JSON.stringify(list));status('Черновик сохранён');return true}
    catch(_) {status('Не удалось сохранить черновик: мало памяти. Скачайте резервную копию.');return false}
  }
  function uniqueId(base){let v=base,i=2;while(activeList().some(p=>p.id===v)){v=base+'-'+i++;}return v;}
  function getCurrent(){return activeList().find(p=>p.id===current)||null}
  function renderList(){
    const q=$('search').value.toLowerCase().trim();
    const source=activeList();
    const matches=source.filter(p=>p.title.toLowerCase().includes(q) || p.id.includes(q));
    $('product-count').textContent=`${matches.length} из ${source.length} записей · ${source.filter(p=>p.active!==false).length} видны на сайте`;
    $('product-list').replaceChildren();
    matches.sort((a,b)=>(a.rank??100)-(b.rank??100)).forEach(p=>{
      const btn=document.createElement('button');btn.type='button';btn.className='list-item'+(current===p.id?' active':'');
      const img=document.createElement('img');img.src=fileImage(p.image);img.alt='';
      const body=document.createElement('div');const name=document.createElement('b');name.textContent=p.title;
      const meta=document.createElement('span');meta.textContent=rub(p.price_rub)+(p.active===false?' · скрыт':'');
      body.append(name,meta);btn.append(img,body);btn.addEventListener('click',()=>select(p.id));$('product-list').append(btn);
    });
  }
  function select(id){
    current=id;previousId=id;
    const p=getCurrent();if(!p)return;
    $('form-title').textContent='Редактирование · '+p.title;
    $('title').value=p.title||'';$('slug').value=p.id||'';$('category').value=p.category||'mugs';
    $('price').value=p.price_rub??'';$('old-price').value=p.old_price_rub??'';
    $('kind').value=p.kind||'';$('rank').value=p.rank??100;
    $('active').checked=p.active!==false;$('new').checked=Boolean(p.new);$('hit').checked=p.status==='Хит продаж';$('featured').checked=Boolean(p.featured);$('scents').checked=Boolean(p.scents);
    $('description').value=p.description||'';$('long').value=p.long||'';
    $('specs').value=labelPairs(p.specifications);$('variants').value=variantPairs(p.variants);
    imageValue=p.image||'';$('form-photo').src=fileImage(imageValue);renderList();preview();
  }
  function fromForm(){
    if(!$('editor-form').checkValidity()){$('editor-form').reportValidity();return null}
    const title=$('title').value.trim();const id=$('slug').value.trim();
    if(!title||!id)return null;
    if(activeList().some(p=>p.id===id && p.id!==previousId)){alert('Артикул уже существует. Введите другой.');return null}
    const old=getCurrent()||{};
    const specs=parsePairs($('specs').value).filter(x=>x.length>=2).map(([name,...value])=>({name,value:value.join(' | ')}));
    const variants=parsePairs($('variants').value).filter(x=>x.length>=2).map(([name,price],i)=>({id:slugify(name)+'-'+(i+1),title:name,price_rub:Math.max(0,Number(price)||0)}));
    const price=$('price').value.trim()===''?null:Number($('price').value);
    const oldPrice=$('old-price').value.trim()===''?null:Number($('old-price').value);
    return {...old,id,title,subtitle:old.subtitle||$('kind').value.trim(),kind:$('kind').value.trim(),category:mode==='courses'?'courses':$('category').value,
      price_rub:price,old_price_rub:oldPrice,rank:Number($('rank').value)||100,
      active:$('active').checked,new:$('new').checked,status:$('hit').checked?'Хит продаж':$('new').checked?'Новинка':'Авторская работа',
      scents:$('scents').checked,featured:$('featured').checked,description:$('description').value.trim(),long:$('long').value.trim(),
      image:imageValue||'placeholder-product.svg',editorial:imageValue||'placeholder-product.svg',specifications:specs,variants};
  }
  function save(){
    const data=fromForm();if(!data)return false;
    const target=activeList();const idx=target.findIndex(x=>x.id===previousId);
    if(idx<0)target.push(data);else target[idx]=data;
    current=data.id;previousId=data.id;if(mode==='courses')saveExtra();else safeStore();renderList();preview();return true;
  }
  function add(){
    current=null;previousId=null;imageValue='';$('editor-form').reset();
    $('form-title').textContent=mode==='courses'?'Новый мастер-класс':'Новое изделие';$('slug').value='';$('rank').value=1+Math.max(0,...activeList().map(p=>p.rank||0));$('active').checked=true;
    $('form-photo').src='../assets/img/placeholder-product.svg';renderList();preview();$('title').focus();
  }
  function preview(){
    $('preview-image').src=imageValue?fileImage(imageValue):'../assets/img/placeholder-product.svg';
    $('preview-title').textContent=$('title').value||'Название изделия';
    $('preview-kind').textContent=$('kind').value||categories[$('category').value]||'Авторская работа';
    $('preview-description').textContent=$('description').value||'Описание появится здесь';
    $('preview-price').textContent=rub($('price').value.trim()===''?null:Number($('price').value));
    $('preview-badge').hidden=!$('new').checked&&!$('hit').checked;
    $('preview-badge').textContent=$('hit').checked?'Хит продаж':'Новинка';
  }
  // Small browser-native ZIP writer: one download for all publishable catalog data files.
  function zipFiles(entries){
    const te=new TextEncoder(), chunks=[], central=[];let offset=0;
    const u16=(v)=>[v&255,(v>>8)&255], u32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
    function crc32(data){let crc=0xffffffff;for(const b of data){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
    for(const [name,content] of entries){
      const file=te.encode(content),fn=te.encode(name),crc=crc32(file);
      const local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(file.length),...u32(file.length),...u16(fn.length),...u16(0),...fn]);
      chunks.push(local,file);
      const cen=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(file.length),...u32(file.length),...u16(fn.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...fn]);
      central.push(cen);offset+=local.length+file.length;
    }
    const centralSize=central.reduce((sum,b)=>sum+b.length,0);
    const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(centralSize),...u32(offset),...u16(0)]);
    return new Blob([...chunks,...central,end],{type:'application/zip'});
  }
  function download(filename,content,type){
    const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  async function processFile(file){
    if(!file.type.startsWith('image/')){alert('Выберите фотографию JPG, PNG или WEBP');return}
    try {
      const bitmap=await createImageBitmap(file);
      const max=1280, scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
      const ctx=canvas.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
      let result=canvas.toDataURL('image/webp',0.83);
      if(!result.startsWith('data:image/webp'))result=canvas.toDataURL('image/jpeg',0.84);
      imageValue=result;$('form-photo').src=result;preview();status('Фото готово, сохраните карточку');
    } catch(e){alert('Не удалось обработать фото. Используйте JPG, PNG или WEBP.')}
  }
  $('editor-form').addEventListener('submit',e=>{e.preventDefault();save()});
  $('add-product').addEventListener('click',()=>mode==='packaging'?addPack():add());
  $('search').addEventListener('input',()=>mode==='packaging'?renderPackaging():renderList());
  $('title').addEventListener('blur',()=>{if(!previousId&&!$('slug').value)$('slug').value=uniqueId(slugify($('title').value))});
  $('photo').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)processFile(f)});
  $('clear-photo').addEventListener('click',()=>{imageValue='';$('form-photo').src='../assets/img/placeholder-product.svg';preview()});
  $fields.forEach(f=>{$(f)?.addEventListener('input',preview)});
  $('delete-product').addEventListener('click',()=>{
    const p=getCurrent();if(!p)return;
    if(!confirm('Удалить «'+p.title+'» из редактируемого каталога?'))return;
    if(mode==='courses'){courses=courses.filter(x=>x.id!==p.id);saveExtra()}else{list=list.filter(x=>x.id!==p.id);safeStore()}if(activeList().length)select(activeList()[0].id);else add();
  });
  $('clone-product').addEventListener('click',()=>{
    if(!save())return;
    const p=clone(getCurrent());p.id=uniqueId(p.id+'-copy');p.title=p.title+' — копия';p.rank=Math.max(0,...list.map(x=>x.rank||0))+1;
    activeList().push(p);if(mode==='courses')saveExtra();else safeStore();select(p.id);
  });
  $('export-backup').addEventListener('click',()=>{if(mode!=='packaging'&&!save())return;download('artmimishka-catalog-backup.json',JSON.stringify({products:list,courses,packaging},null,2),'application/json;charset=utf-8')});
  $('export-publish').addEventListener('click',()=>{
    if(mode!=='packaging'&&!save())return;
    // Export executable static data, which works from file:// and GitHub Pages without a backend.
    const js='/* ART MIMISHKA: файл каталога, созданный в редакторе */\nwindow.ART_MIMISHKA_CATALOG = '+JSON.stringify(list,null,2)+';\n';
    const blob=zipFiles([
      ['assets/data/catalog.js',js],
      ['assets/data/courses.js','window.ART_MIMISHKA_COURSES = '+JSON.stringify(courses,null,2)+';\n'],
      ['assets/data/packaging.js','window.ART_MIMISHKA_PACKAGING = '+JSON.stringify(packaging,null,2)+';\n']
    ]);
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='artmimishka-dannye-dlya-github.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);
    status('Скачан ZIP с тремя файлами для assets/data/');
  });
  $('import-backup').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try {const data=JSON.parse(await file.text());const products=Array.isArray(data)?data:data.products;if(!Array.isArray(products)||!products.every(p=>typeof p.id==='string'&&typeof p.title==='string'))throw Error('bad');
      if(!confirm(`Заменить текущие черновики каталогом из ${products.length} товаров?`))return;
      list=products;if(!Array.isArray(data)){courses=Array.isArray(data.courses)?data.courses:courses;packaging=Array.isArray(data.packaging)?data.packaging:packaging;saveExtra()}safeStore();if(list.length)select(list[0].id);else add();
    } catch(_) {alert('Это не резервная копия каталога ART MIMISHKA в формате JSON')}e.target.value='';
  });
  $('restore-published').addEventListener('click',()=>{
    if(!confirm('Отменить локальные изменения и вернуть опубликованный каталог?'))return;
    list=clone(published);courses=clone(publishedCourses);packaging=clone(publishedPackaging);saveExtra();safeStore();if(list.length)select(list[0].id);else add();
  });
  if(list.length)select(list[0].id);else add();
})();
