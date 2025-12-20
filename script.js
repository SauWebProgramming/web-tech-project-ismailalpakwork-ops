let allMovies = [];
let favorites = JSON.parse(localStorage.getItem('sineFavs')) || [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json');
        allMovies = await response.json();
        if(allMovies.length > 0) {
            renderMovies(allMovies);
            updateHero(allMovies[0]);
        }
    } catch (e) { console.error("Hata:", e); }
};

const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    list.innerHTML = movies.map(m => `
        <div class="card">
            <img src="${m.image}" alt="${m.title}" onerror="this.src='https://via.placeholder.com/300x450?text=LynxMovie'">
            <div class="card-info">
                <h3>${m.title}</h3>
                <div class="card-btns">
                    <button onclick="openDetails(${m.id})">ℹ Detaylar</button>
                    <button class="fav-btn ${favorites.includes(m.id) ? 'active' : ''}" onclick="toggleFavorite(${m.id})">
                        ${favorites.includes(m.id) ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};

const openDetails = (id) => {
    const m = allMovies.find(item => item.id === id);
    const modal = document.getElementById('detailsModal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <div class="modal-header" style="background-image: url('${m.image}')"></div>
            <div class="modal-body">
                <h2>${m.title} (${m.year})</h2>
                <p>⭐ IMDb: ${m.rating} | 📂 ${m.category}</p>
                <p>${m.description}</p>
                <button class="play-btn">▶ Hemen İzle</button>
                <div class="comments">
                    <h4>Yorumlar</h4>
                    <textarea placeholder="Fikrinizi paylaşın..."></textarea>
                    <button class="filter-btn" style="margin-top:5px" onclick="alert('Yorum gönderildi!')">Gönder</button>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

const closeModal = () => { document.getElementById('detailsModal').style.display = 'none'; };

const updateHero = (movie) => {
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), transparent), url('${movie.image}')`;
    document.getElementById('hero-title').innerText = movie.title;
    document.getElementById('hero-desc').innerText = movie.description;
    document.getElementById('heroInfoBtn').onclick = () => openDetails(movie.id);
};

const toggleFavorite = (id) => {
    const idx = favorites.indexOf(id);
    if (idx === -1) favorites.push(id); else favorites.splice(idx, 1);
    localStorage.setItem('sineFavs', JSON.stringify(favorites));
    renderMovies(allMovies);
};

const showFavorites = () => {
    const favs = allMovies.filter(m => favorites.includes(m.id));
    renderMovies(favs.length > 0 ? favs : (alert("Favori listeniz boş!"), allMovies));
};

const filterByCategory = (cat) => {
    renderMovies(cat === 'Tümü' ? allMovies : allMovies.filter(m => m.category === cat));
};

const sortByRating = () => {
    renderMovies([...allMovies].sort((a,b) => b.rating - a.rating));
};

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(term)));
});

getMovies();