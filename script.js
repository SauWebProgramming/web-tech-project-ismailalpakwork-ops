let allMovies = [];

// 1. Veriyi çekme (Fetch API & Async/Await)
const getMovies = async () => {
    try {
        const response = await fetch('data.json'); // [cite: 10, 49]
        allMovies = await response.json(); // [cite: 50]
        renderMovies(allMovies);
    } catch (error) {
        console.error("Veri yüklenemedi:", error);
    }
};

// 2. Filmleri listeleme
const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    list.innerHTML = ""; 

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.year} | ⭐ ${movie.rating}</p>
            <button onclick="showDetails(${movie.id})">Detayları Gör</button>
            <button onclick="addToFavorites(${movie.id})" style="background:#e74c3c; color:white; border:none; margin-top:5px; padding:5px; cursor:pointer;">❤️ Favori</button>
        `;
        list.appendChild(card);
    });
};

// 3. Detay Sayfası (SPA Mantığı) [cite: 26, 29]
const showDetails = (id) => {
    const movie = allMovies.find(m => m.id === id);
    const mainContent = document.getElementById('main-content');
    
    // URL'yi güncelleme (Ödev gereksinimi) [cite: 33, 34]
    window.location.hash = `movie-${id}`;

    mainContent.innerHTML = `
        <div class="detail-page" style="padding:20px; background:white; border-radius:10px;">
            <button onclick="location.reload()">← Ana Sayfaya Dön</button>
            <div style="display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;">
                <img src="${movie.image}" style="width: 250px; border-radius: 10px;">
                <div style="flex: 1; min-width: 300px;">
                    <h2>${movie.title}</h2>
                    <p><strong>Yıl:</strong> ${movie.year}</p>
                    <p><strong>Kategori:</strong> ${movie.category}</p>
                    <p><strong>Puan:</strong> ⭐ ${movie.rating}</p>
                    <p><strong>Özet:</strong> ${movie.description}</p>
                </div>
            </div>
        </div>
    `;
};

// 4. LocalStorage ile Favori Yönetimi 
const addToFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movie = allMovies.find(m => m.id === id);

    if (!favorites.some(f => f.id === id)) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Favorilere eklendi!");
    } else {
        alert("Bu film zaten favorilerinizde.");
    }
};

const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div style="padding:20px;">
            <button onclick="location.reload()">← Geri Dön</button>
            <h2 style="margin-top:20px;">Favorilerim</h2>
            <div id="movieList" class="grid-container"></div>
        </div>
    `;
    
    if (favorites.length === 0) {
        document.getElementById('movieList').innerHTML = "<p>Henüz favori eklemediniz.</p>";
    } else {
        renderMovies(favorites);
    }
};

// 5. Arama Çubuğu 
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(term));
    renderMovies(filtered);
});

// Favoriler butonuna tıklama olayı
document.getElementById('favBtn').onclick = showFavorites;

getMovies();