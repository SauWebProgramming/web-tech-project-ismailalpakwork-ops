let allMovies = [];

// 1. Veriyi Çekme (Fetch API & Async/Await)
const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        renderMovies(allMovies);
    } catch (error) {
        console.error("Veri yüklenemedi:", error);
    }
};

// 2. Filmleri Listeleme (Ana Sayfa Yapısı)
const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    if(!list) return; // Eğer favorilerden dönerken liste yoksa hata vermemesi için
    
    list.innerHTML = ""; 

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p>${movie.year} | ⭐ ${movie.rating}</p>
                <button onclick="showDetails(${movie.id})">Detaylar</button>
                <button onclick="addToFavorites(${movie.id})" style="background:#e74c3c; color:white; border:none; margin-top:5px; padding:5px; cursor:pointer;">❤️ Favori</button>
            </div>
        `;
        list.appendChild(card);
    });
};

// 3. Detay Sayfası (SPA Mantığı - Sayfa Yenilemeden)
const showDetails = (id) => {
    const movie = allMovies.find(m => m.id === id);
    const mainContent = document.getElementById('main-content');
    
    // URL'yi güncelleme (Ödev gereksinimi)
    window.location.hash = `movie-${id}`;

    mainContent.innerHTML = `
        <div class="detail-page" style="padding:20px; background:#1f1f1f; color:white; border-radius:10px;">
            <button onclick="window.location.hash=''; renderMovies(allMovies)" style="margin-bottom:20px; cursor:pointer;">← Ana Sayfaya Dön</button>
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
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

// 5. Favorilerden Film Çıkarma Özelliği
const removeFromFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites(); // Listeyi anında güncelle
};

// 6. Favorileri Gösterme (SPA)
const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div style="padding:20px;">
            <button onclick="window.location.hash=''; location.reload()" style="cursor:pointer;">← Geri Dön</button>
            <h2 style="margin-top:20px;">Favorilerim</h2>
            <div id="favoriteList" class="grid-container"></div>
        </div>
    `;
    
    const favList = document.getElementById('favoriteList');
    if (favorites.length === 0) {
        favList.innerHTML = "<p>Henüz favori eklemediniz.</p>";
    } else {
        favorites.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <button onclick="removeFromFavorites(${movie.id})" style="background:#c0392b; color:white; border:none; padding:5px; cursor:pointer; width:100%;">🗑️ Sil</button>
                </div>
            `;
            favList.appendChild(card);
        });
    }
};

// 7. Arama ve Sıralama Fonksiyonları
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(term));
    renderMovies(filtered);
});

function sortByRating() {
    const sorted = [...allMovies].sort((a, b) => b.rating - a.rating);
    renderMovies(sorted);
}

function sortByYear() {
    const sorted = [...allMovies].sort((a, b) => b.year - a.year);
    renderMovies(sorted);
}

// Favoriler butonuna tıklama olayı
document.getElementById('favBtn').onclick = showFavorites;

// Başlangıçta verileri çek
getMovies();