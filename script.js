// script.js — product rendering, filters, contact mailto
const PRODUCTS = [
  {"id":1,"name":"Fotshoe Pro SG","type":"cleats","size":[40,41,42,43],"price":320,"image":"images/pro-sg.jpg","desc":"Шиповки для натурального поля."},
  {"id":2,"name":"Fotshoe Futsal X","type":"indoor","size":[38,39,40,41,42],"price":180,"image":"images/futsal-x.jpg","desc":"Легкі футзалки для швидкої гри."},
  {"id":3,"name":"Fotshoe Turf Master","type":"turf","size":[39,40,41,42,43,44],"price":220,"image":"images/turf-master.jpg","desc":"Ідеальні для штучних покриттів."},
  {"id":4,"name":"Fotshoe Lite FG","type":"cleats","size":[40,41,42],"price":390,"image":"images/lite-fg.jpg","desc":"Преміум конструкція, футуристична підошва."},
  {"id":5,"name":"Fotshoe Training","type":"turf","size":[38,39,40,41],"price":140,"image":"images/training.jpg","desc":"Повсякденні тренувальні кеди."}
];

function $(id){return document.getElementById(id)}
function renderProducts(list){
  const container = $('products');
  container.innerHTML = '';
  if(list.length===0){
    container.innerHTML = '<p class="muted">За цими фільтрами нічого не знайдено.</p>';
    return;
  }
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div>
        <h3>${p.name}</h3>
        <p class="muted small">${p.desc}</p>
      </div>
      <div class="meta">
        <div class="sizes">Розміри: ${p.size.join(', ')}</div>
        <div class="price">₴${p.price}</div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn ghost" onclick="copyInfo(${p.id})">Скопіювати</button>
        <button class="btn primary" onclick="openMail(${p.id})">Запитати</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function copyInfo(id){
  const p = PRODUCTS.find(x=>x.id===id);
  navigator.clipboard?.writeText(`${p.name} — ₴${p.price} — розміри: ${p.size.join(', ')}`)
    .then(()=>alert('Інформацію скопійовано в буфер обміну.'))
    .catch(()=>alert('Копіювання недоступне.'));
}

function openMail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const subject = encodeURIComponent(`Запит щодо ${p.name}`);
  const body = encodeURIComponent(`Вітаю!\n\nЗацікавився(лась) товаром: ${p.name}\nЦіна: ₴${p.price}\nРозміри: ${p.size.join(', ')}\n\nБудь ласка, напишіть деталі щодо наявності та доставки.\n\nДякую.`);
  window.location.href = `mailto:info@fotshoe.example?subject=${subject}&body=${body}`;
}

/* filters */
function applyFilters(){
  const type = $('typeFilter').value;
  const size = $('sizeFilter').value;
  const price = Number($('priceFilter').value);
  const query = $('searchInput').value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p=>{
    if(type!=='all' && p.type!==type) return false;
    if(size!=='all' && !p.size.includes(Number(size))) return false;
    if(p.price>price) return false;
    if(query && !p.name.toLowerCase().includes(query)) return false;
    return true;
  });
  renderProducts(filtered);
}

/* events */
document.addEventListener('DOMContentLoaded',()=>{
  // set initial range value label
  $('priceValue').textContent = `₴${$('priceFilter').value}`;
  renderProducts(PRODUCTS);
  ['typeFilter','sizeFilter','searchInput'].forEach(id=>{
    $(id).addEventListener('input', applyFilters);
  });
  $('priceFilter').addEventListener('input', (e)=>{
    $('priceValue').textContent = `₴${e.target.value}`;
    applyFilters();
  });

  // contact form uses mailto
  $('contactForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $('name').value.trim();
    const email = $('email').value.trim();
    const msg = $('message').value.trim();
    const subject = encodeURIComponent(`Запит від ${name}`);
    const body = encodeURIComponent(`Ім'я: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:info@fotshoe.example?subject=${subject}&body=${body}`;
  });
});
