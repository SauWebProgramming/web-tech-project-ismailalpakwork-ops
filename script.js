let allMovies = [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        if (!response.ok) throw new Error("Dosya bulunamadı");
        allMovies = await response.json(); 
        
        if(allMovies.length > 0) {
            renderMovies(allMovies);
            updateHero(allMovies[0]); // Sayfa açılınca ilk filmi afişe koy
        }
    } catch (error) {
        console.error("Hata:", error);
        document.getElementById('hero-title').innerText = "Bağlantı Hatası!";
    }
};

const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url('${movie.image}')`;
    document.getElementById('hero-title').innerText = movie.title;
    document.getElementById('hero-desc').innerText = movie.description;
};

const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    list.innerHTML = ""; 
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Yok'">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <button onclick="showDetails(${movie.id})">İncele</button>
            </div>
        `;
        list.appendChild(card);
    });
};

const filterByCategory = (category) => {
    // data.json içindeki kategori isimleriyle birebir eşleşme
    const filtered = category === 'Tümü' 
        ? allMovies 
        : allMovies.filter(m => m.category === category);

    renderMovies(filtered);

    // Buton aktiflik efekti
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === category);
    });
};

getMovies();