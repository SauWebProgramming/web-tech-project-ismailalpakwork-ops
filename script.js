let allMovies = [];
let favorites = JSON.parse(localStorage.getItem("lynxFavs")) || [];

// --- Filtreleme Değişkenleri ---
let currentCategory = "Tümü";
let currentYear = "Tümü";
let currentSort = "default";
let displayedCount = 12;
const loadStep = 6;

/* -------------------- VERİ ÇEKME -------------------- */
async function getMovies() {
  try {
    const res = await fetch("data.json");
    allMovies = await res.json();
    
    // Uygulama Başlatıcıları
    handleUIRender(getActiveList());
    setRandomHero(); // Açılışta rastgele popüler film
    createDynamicCategories();
    updateFavCounter(); // Sayaç başlat
    checkThemeOnLoad(); // Tema kontrolü
  } catch (e) {
    console.error("Veri hatası:", e);
  }
}

/* -------------------- AKILLI FİLTRELEME MANTIĞI -------------------- */
function getActiveList() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  let list = [...allMovies];

  if (currentCategory !== "Tümü") list = list.filter(m => m.category === currentCategory);

  if (currentYear !== "Tümü") {
    if (currentYear === "2020+") list = list.filter(m => m.year >= 2020);
    else if (currentYear === "2010-2019") list = list.filter(m => m.year >= 2010 && m.year <= 2019);
    else if (currentYear === "2000-2009") list = list.filter(m => m.year >= 2000 && m.year <= 2009);
    else if (currentYear === "90s") list = list.filter(m => m.year < 2000);
  }

  if (search) list = list.filter(m => m.title.toLowerCase().includes(search));

  if (currentSort === "rating") list.sort((a, b) => b.rating - a.rating);
  else if (currentSort === "newest") list.sort((a, b) => b.year - a.year);
  else if (currentSort === "oldest") list.sort((a, b) => a.year - b.year);
  else if (currentSort === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));

  return list;
}

/* -------------------- UI YÖNETİCİSİ -------------------- */
function handleUIRender(list) {
  const container = document.getElementById("movieList");
  const search = document.getElementById("searchInput").value;

  if (search || currentCategory !== "Tümü" || currentYear !== "Tümü" || currentSort !== "default") {
    container.className = "grid-container";
    renderStandardGrid(list);
  } else {
    container.className = "row-system-container";
    renderNetflixRows();
  }
}

/* -------------------- FİLTRE TETİKLEYİCİLERİ -------------------- */
function setYear(year) {
  currentYear = year;
  updateFilterBadges();
  handleUIRender(getActiveList());
}

function setSort(sortType) {
  currentSort = sortType;
  updateFilterBadges();
  handleUIRender(getActiveList());
}

function resetFilter(type) {
  if (type === 'cat') currentCategory = "Tümü";
  if (type === 'year') currentYear = "Tümü";
  if (type === 'sort') currentSort = "default";
  updateFilterBadges();
  handleUIRender(getActiveList());
}

function updateFilterBadges() {
  const container = document.getElementById("activeFilters");
  let badges = "";
  if (currentCategory !== "Tümü") badges += `<span class="filter-badge">📂 ${currentCategory} <span class="badge-close" onclick="resetFilter('cat')">×</span></span>`;
  if (currentYear !== "Tümü") badges += `<span class="filter-badge">📅 ${currentYear} <span class="badge-close" onclick="resetFilter('year')">×</span></span>`;
  if (currentSort !== "default") badges += `<span class="filter-badge">🔃 Sıralı <span class="badge-close" onclick="resetFilter('sort')">×</span></span>`;
  container.innerHTML = badges;
}

/* -------------------- RENDER SİSTEMLERİ -------------------- */
function renderNetflixRows() {
  const container = document.getElementById("movieList");
  container.innerHTML = "";

  const rows = [
    { title: "🎬 Popüler Filmler", filter: m => m.rating >= 8.8 },
    { title: "🚀 Bilim Kurgu & Fantastik", filter: m => m.category === "Bilim Kurgu" || m.category === "Fantastik" },
    { title: "🔥 Aksiyon & Heyecan", filter: m => m.category === "Aksiyon" },
    { title: "🎭 Dram Seçkisi", filter: m => m.category === "Dram" }
  ];

  rows.forEach(row => {
    const rowMovies = allMovies.filter(row.filter);
    if (rowMovies.length > 0) {
      const rowSection = document.createElement("div");
      rowSection.className = "category-row";
      rowSection.innerHTML = `
        <h2 class="row-title">${row.title}</h2>
        <div class="row-container">
          ${rowMovies.map(movie => createMovieCardHTML(movie)).join('')}
        </div>
      `;
      container.appendChild(rowSection);
    }
  });
}

function renderStandardGrid(list) {
  const container = document.getElementById("movieList");
  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px; color:var(--accent);">Kriterlere uygun film bulunamadı.</div>`;
    return;
  }
  container.innerHTML = list.slice(0, displayedCount).map(movie => createMovieCardHTML(movie)).join('');
}

function createMovieCardHTML(movie) {
  const isFav = favorites.includes(movie.id);
  return `
    <div class="card" onclick="openDetails(${movie.id})">
      <img src="${movie.image}" alt="${movie.title}" loading="lazy">
      <div class="card-info">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.rating}</p>
        <div class="card-btns">
            <button class="fav-icon" onclick="event.stopPropagation(); toggleFavorite(${movie.id})">
                ${isFav ? "❤️" : "🤍"}
            </button>
        </div>
      </div>
    </div>
  `;
}

/* -------------------- DİNAMİK KATEGORİLER -------------------- */
function createDynamicCategories() {
  const container = document.getElementById("dynamicCategories");
  if(!container) return;
  const categories = ["Tümü", ...new Set(allMovies.map(m => m.category))];
  container.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => {
      currentCategory = cat;
      updateFilterBadges();
      handleUIRender(getActiveList());
    };
    container.appendChild(btn);
  });
}

/* -------------------- MODAL & FAVORİ -------------------- */
// ... (Diğer fonksiyonlar aynı kalacak, sadece openDetails güncellendi)

function openDetails(id) {
  const movie = allMovies.find(m => m.id === id);
  const modal = document.getElementById("detailsModal");
  modal.style.display = "flex";
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="closeModal()" style="position:absolute; right:25px; top:15px; z-index:10; font-size:35px; cursor:pointer; color:#fff;">&times;</span>
      <div class="modal-header" style="background: url('${movie.image}')"></div>
      <div class="modal-body">
        <h2 style="font-size: 2.8rem; margin: 0 0 10px 0; font-weight: 900;">${movie.title} (${movie.year})</h2>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; color: var(--accent); font-weight: bold; font-size: 1.1rem;">
            <span>⭐ ${movie.rating} IMDb</span>
            <span>📂 ${movie.category}</span>
            <span>📅 ${movie.year}</span>
        </div>
        <p style="font-size: 1.15rem; line-height: 1.7; opacity: 0.9; margin-bottom: 30px; max-width: 800px;">${movie.description}</p>
        <button class="play-btn" style="padding: 15px 40px; font-size: 1.1rem;">▶ Hemen İzle</button>
      </div>
    </div>
  `;
}

function closeModal() { document.getElementById("detailsModal").style.display = "none"; }

function toggleFavorite(id) {
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
    showToast("Favorilere eklendi! 💚");
  } else {
    favorites.splice(index, 1);
    showToast("Favorilerden çıkarıldı.");
  }
  localStorage.setItem("lynxFavs", JSON.stringify(favorites));
  updateFavCounter();
  handleUIRender(getActiveList());
}

function updateFavCounter() {
  const counter = document.getElementById("favCount");
  if(counter) counter.innerText = favorites.length;
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  toast.style.cssText = `position:fixed;bottom:30px;left:30px;background:#53fc18;color:black;padding:12px 20px;border-radius:8px;font-weight:bold;z-index:9999;box-shadow: 0 0 20px rgba(83,252,24,0.4);`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

/* -------------------- HERO YÖNETİMİ -------------------- */
function updateHero(movie) {
  const hero = document.getElementById("hero");
  if(!hero || !movie) return;
  hero.style.backgroundImage = `linear-gradient(to right, var(--dark), transparent), url('${movie.image}')`;
  document.getElementById("hero-title").innerText = movie.title;
  document.getElementById("hero-desc").innerText = movie.description;
  document.getElementById("heroInfoBtn").onclick = () => openDetails(movie.id);
}

function setRandomHero() {
    if(allMovies.length === 0) return;
    const popularMovies = allMovies.filter(m => m.rating >= 8.5);
    const randomMovie = popularMovies[Math.floor(Math.random() * popularMovies.length)];
    updateHero(randomMovie);
}

/* -------------------- TEMA YÖNETİMİ -------------------- */
function checkThemeOnLoad() {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        if(themeIcon) themeIcon.innerText = "☀️";
    }
}

const themeToggle = document.getElementById("themeToggle");
if(themeToggle) {
    themeToggle.onclick = () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        const themeIcon = document.getElementById("themeIcon");
        
        if(themeIcon) themeIcon.innerText = isLight ? "☀️" : "🌙";
        localStorage.setItem("theme", isLight ? "light" : "dark");
        
        // Tema değişince Hero gradyanını güncellemek için tekrar çağır
        const currentHeroTitle = document.getElementById("hero-title").innerText;
        const currentMovie = allMovies.find(m => m.title === currentHeroTitle);
        if(currentMovie) updateHero(currentMovie);
        
        showToast(isLight ? "Aydınlık Mod Aktif ☀️" : "Karanlık Mod Aktif 🌙");
    };
}

/* -------------------- SEARCH & SCROLL -------------------- */
document.getElementById("searchInput").addEventListener("input", () => {
  handleUIRender(getActiveList());
});

window.addEventListener("scroll", () => {
  const scrollBtn = document.getElementById("scrollTop");
  if(scrollBtn) scrollBtn.style.display = window.scrollY > 400 ? "flex" : "none";
});

getMovies();