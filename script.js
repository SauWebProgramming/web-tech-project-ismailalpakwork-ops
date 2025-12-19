let allMovies = [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        if(allMovies.length > 0) {
            renderMovies(allMovies);
            updateHero(allMovies[0]);
        }
    } catch (error) {
        console.error("Yükleme hatası:", error);
    }
};

const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    if (!hero || !movie) return;
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url('${movie.image}')`;
    document.getElementById('hero-title').innerText = movie.title;
    document.getElementById('hero-desc').innerText = movie.description;
};

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

const updateHeroById = (id) => {
    const movie = allMovies.find(m => m.id === id);
    updateHero(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // İncele deyince yukarı çıkar
};

const filterByCategory = (cat) => {
    let filtered;
    if (cat === 'Tümü') {
        filtered = allMovies;
    } else if (cat === 'Diziler') {
        // ID'si 20'den büyük olan son eklediğin içerikleri dizi say
        filtered = allMovies.filter(m => m.id > 20);
    } else {
        filtered = allMovies.filter(m => m.category === cat);
    }
    renderMovies(filtered);
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
};

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(term)));
});

getMovies();