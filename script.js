let allMovies = [];

// 1. Veriyi Çekme (Yükleme Efekti Eklendi)
const getMovies = async () => {
    const list = document.getElementById('movieList');
    list.innerHTML = "<p style='color:white; padding:20px;'>Filmler yükleniyor...</p>"; // Kullanıcıya geri bildirim
    
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        renderMovies(allMovies);
    } catch (error) {
        list.innerHTML = "<p style='color:red; padding:20px;'>Veri yüklenirken bir hata oluştu!</p>";
        console.error("Veri yüklenemedi:", error);
    }
};

// 2. Filmleri Listeleme (Kart Tasarımı Korundu)
const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    if(!list) return; 
    
    list.innerHTML = ""; 

    if (movies.length === 0) {
        list.innerHTML = "<p style='padding:20px;'>Aradığınız kriterlere uygun film bulunamadı.</p>";
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" loading="lazy">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p>${movie.year} | ⭐ ${movie.rating}</p>
                <button onclick="showDetails(${movie.id})">Detaylar</button>
                <button onclick="addToFavorites(${movie.id})" style="background:#e74c3c; color:white; border:none; margin-top:5px; padding:5px; cursor:pointer; border-radius:4px;">❤️ Favori</button>
            </div>
        `;
        list.appendChild(card);
    });
};

// 3. Detay Sayfası (Dinamik Başlık Eklendi)
const showDetails = (id) => {
    const movie = allMovies.find(m => m.id === id);
    const mainContent = document.getElementById('main-content');
    
    window.location.hash = `movie-${id}`;
    document.title = `SineSistem | ${movie.title}`; // Sayfa başlığını değiştirir

    mainContent.innerHTML = `
        <div class="detail-page" style="padding:20px; background:#1f1f1f; color:white; border-radius:10px; animation: fadeIn 0.5s;">
            <button onclick="window.location.hash=''; document.title='SineSistem'; renderMovies(allMovies)" style="margin-bottom:20px; cursor:pointer; padding:8px 15px;">← Ana Sayfaya Dön</button>
            
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <img src="${movie.image}" style="width: 300px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                <div style="flex: 1; min-width: 300px;">
                    <h2 style="color:#e50914; font-size:32px;">${movie.title}</h2>
                    <p style="font-size:18px;"><strong>Yıl:</strong> ${movie.year} | <strong>Puan:</strong> ⭐ ${movie.rating}</p>
                    <p><strong>Kategori:</strong> ${movie.category}</p>
                    <p style="line-height:1.6; color:#ccc; margin-top:15px;">${movie.description}</p>
                </div>
            </div>
        </div>
    `;
};

// 4. LocalStorage İşlemleri
const addToFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movie = allMovies.find(m => m.id === id);

    if (!favorites.some(f => f.id === id)) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movie.title} favorilere eklendi!`);
    } else {
        alert("Bu film zaten favorilerinizde.");
    }
};

const removeFromFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites(); 
};

// 5. Favoriler Sayfası (Gelişmiş Görünüm)
const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div style="padding:20px;">
            <button onclick="window.location.hash=''; location.reload()" style="cursor:pointer; padding:8px 15px;">← Geri Dön</button>
            <h2 style="margin-top:20px;">❤️ Favori Filmlerim</h2>
            <div id="favoriteList" class="grid-container"></div>
        </div>
    `;
    
    const favList = document.getElementById('favoriteList');
    if (favorites.length === 0) {
        favList.innerHTML = "<p style='padding:20px;'>Henüz favori listenize bir film eklemediniz.</p>";
    } else {
        favorites.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <button onclick="removeFromFavorites(${movie.id})" style="background:#c0392b; color:white; border:none; padding:8px; cursor:pointer; width:100%; border-radius:4px; margin-top:10px;">🗑️ Favorilerden Sil</button>
                </div>
            `;
            favList.appendChild(card);
        });
    }
};

// 6. Arama ve Filtreleme
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(term));
    renderMovies(filtered);
});

function sortByRating() {
    renderMovies([...allMovies].sort((a, b) => b.rating - a.rating));
}

function sortByYear() {
    renderMovies([...allMovies].sort((a, b) => b.year - a.year));
}

// Olay Dinleyicileri ve Başlangıç
document.getElementById('favBtn').onclick = showFavorites;
getMovies();