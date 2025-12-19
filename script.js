let allMovies = [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        renderMovies(allMovies);
        if(allMovies.length > 0) updateHero(allMovies[0]); // İlk filmi afişe koy
    } catch (error) { console.error("Hata:", error); }
};

const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    hero.style.background = `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url(${movie.image})`;
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
            <img src="${movie.image}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <button onclick="showDetails(${movie.id})">İncele</button>
            </div>
        `;
        list.appendChild(card);
    });
};

const filterByCategory = (cat) => {
    const filtered = cat === 'Tümü' ? allMovies : allMovies.filter(m => m.category.includes(cat));
    renderMovies(filtered);
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
};

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(term)));
});

getMovies();