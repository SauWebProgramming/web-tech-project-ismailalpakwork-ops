let allMovies = [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        renderMovies(allMovies);
        // Hero alanını ilk filmle başlat
        if(allMovies.length > 0) updateHero(allMovies[0]);
    } catch (error) {
        console.error("Hata:", error);
    }
};

// Resim yüklenemezse devreye giren yedek mekanizma
const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    // Yüksek kaliteli resmi arka plana koy
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.1)), url('${movie.image}')`;
    document.getElementById('hero-title').innerText = movie.title;
    document.getElementById('hero-desc').innerText = movie.description;
};

const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    list.innerHTML = ""; 
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        // Resimlerin kesin yüklenmesi için onerror kontrolü ekledim
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Yok'">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <div class="card-btns">
                    <button onclick="showDetails(${movie.id})">İncele</button>
                    <button onclick="addToFavorites(${movie.id})" style="background:transparent; border:1px solid white;">❤️</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
};

// Kategori filtreleme sistemini premium hale getir
const filterByCategory = (cat) => {
    const filtered = cat === 'Tümü' ? allMovies : allMovies.filter(m => m.category.includes(cat));
    renderMovies(filtered);
    
    // Aktif butonu işaretle
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat || (cat === 'Dizi' && btn.innerText === 'Diziler'));
    });
};

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(term)));
});

getMovies();