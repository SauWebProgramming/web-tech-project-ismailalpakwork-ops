let allMovies = [];

// 1. Verileri data.json'dan Çek
const getMovies = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Dosya okunamadı");
        allMovies = await response.json();
        
        if(allMovies.length > 0) {
            renderMovies(allMovies);
            updateHero(allMovies[0]); // Sayfa açılınca ilk filmi afişe koy
        }
    } catch (error) {
        console.error("Hata:", error);
    }
};

// 2. Filmleri Listele (Grid Yapısı)
const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    if(!list) return;
    list.innerHTML = ""; 
    
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=SineSistem'">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <button onclick="updateHeroById(${movie.id})">İncele</button>
            </div>
        `;
        list.appendChild(card);
    });
};

// 3. Afişi (Hero) Güncelle
const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url('${movie.image}')`;
    document.getElementById('hero-title').innerText = movie.title;
    document.getElementById('hero-desc').innerText = movie.description;
};

// 4. ID'ye Göre Afişi Güncelle (İncele Butonu)
const updateHeroById = (id) => {
    const movie = allMovies.find(m => m.id === id);
    if(movie) {
        updateHero(movie);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfayı yukarı kaydır
    }
};

// 5. Kategori Filtreleme
const filterByCategory = (cat) => {
    const filtered = (cat === 'Tümü') ? allMovies : allMovies.filter(m => m.category === cat);
    renderMovies(filtered);
    
    // Aktif buton rengini güncelle
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });
};

// Başlat
getMovies();