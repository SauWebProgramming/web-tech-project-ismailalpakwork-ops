let allMovies = [];

const getMovies = async () => {
    try {
        const response = await fetch('data.json'); 
        allMovies = await response.json(); 
        renderMovies(allMovies);
    } catch (error) {
        console.error("Veri yüklenemedi:", error);
    }
};

const renderMovies = (movies) => {
    const list = document.getElementById('movieList');
    if (!list) return;
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
            </div>
        `;
        list.appendChild(card);
    });
};

// Kategori Filtreleme
const filterByCategory = (category) => {
    const filtered = category === 'Tümü' 
        ? allMovies 
        : allMovies.filter(m => m.category.includes(category));
    
    renderMovies(filtered);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === category);
    });
};

const showDetails = (id) => {
    const movie = allMovies.find(m => m.id === id);
    const mainContent = document.getElementById('main-content');
    window.location.hash = `movie-${id}`;
    
    // Hero alanını gizle (Detay sayfasında kafa karıştırmasın)
    document.getElementById('hero').style.display = 'none';
    document.querySelector('.category-filters').style.display = 'none';

    mainContent.innerHTML = `
        <div style="padding:40px 5%;">
            <button onclick="location.reload()">← Ana Sayfaya Dön</button>
            <div style="display:flex; gap:30px; margin-top:20px;">
                <img src="${movie.image}" style="width:300px; border-radius:10px;">
                <div>
                    <h1>${movie.title}</h1>
                    <p>${movie.description}</p>
                    <p><strong>Puan:</strong> ⭐ ${movie.rating}</p>
                </div>
            </div>
        </div>
    `;
};

// Arama ve Diğerleri
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(term)));
});

getMovies();