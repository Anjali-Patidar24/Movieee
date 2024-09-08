let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let viewWatchlistBtn = document.getElementById("viewWatchlist");
let backToSearchBtn = document.getElementById("backToSearch");
let APIKey = "17f8307a";


const getData = async (query) => {
    try {
        let data = await fetch(`http://www.omdbapi.com/?apikey=${APIKey}&s=${query}`);
        let jsonData = await data.json();

        document.getElementById("movieCardContainer").innerHTML = "";
        searchInput.value = "";

        if (jsonData.Response === "False") {
            alert('No movies found');
            return;
        }

        for (let movie of jsonData.Search) {
            let movieDetails = await getMovieDetails(movie.imdbID);

            let div = document.createElement("div");
            div.classList.add("movieCard");
            div.innerHTML = `
                <img src=${movieDetails.Poster} alt="${movieDetails.Title}">
                <div class="cardContent">
                    <h1>${movieDetails.Title}</h1>
                    <button class="reviewButton" data-id="${movieDetails.imdbID}">Review</button>
                    <button class="addToWatchlist" data-id="${movieDetails.imdbID}">Add to Watchlist</button>
                </div>
                <div class="hiddenDetails hidden">
                    <p class="rating">Rating: <span>${movieDetails.Ratings[0]?.Value.slice(0, 3) || 'N/A'}</span></p>
                    <a href="#" class="types">${movieDetails.Genre}</a>
                    <p>Released: <span>${movieDetails.Released}</span></p>
                    <p>Duration: <span>${movieDetails.Runtime}</span></p>
                    <p>Plot: <span id = 'plot'>${movieDetails.Plot}</span></p>
                </div>
            `;
            document.getElementById("movieCardContainer").appendChild(div);
        }
    } catch (error) {
        document.getElementById("movieCardContainer").innerHTML = 
        `<div class="movie-not-found">
            <h1>Something went wrong</h1>
        </div>
        `;
        console.log(error);
    }
};
const getMovieDetails = async (id) => {
    try {
        let data = await fetch(`http://www.omdbapi.com/?apikey=${APIKey}&i=${id}`);
        let jsonData = await data.json();
        return jsonData;
    } catch (error) {
        console.log(error);
    }
};

const renderWatchlist = () => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    let container = document.getElementById('watchlistContainer');

    if (watchlist.length === 0) {
        container.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }
 
    container.innerHTML = watchlist.map(movie => `
        <div class="movieCard1">
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="cardText">
                <h1>${movie.title}</h1>
                <p class="rating">Rating: <span>${movie.rating}</span></p>
                <div class="a"><a href="#" class="types">${movie.genre}</a></div>
                <p>Released: <span>${movie.released}</span></p>
                <p>Duration: <span>${movie.runtime}</span></p>
                <p>Plot: <span>${movie.plot}</span></p>
                <button class="removeFromWatchlist" data-title="${movie.title}">Remove</button>
            </div>
        </div>
    `).join('');
};

searchBtn.addEventListener("click", function () {
    let query = searchInput.value;
    if (query !== "") {
        getData(query);
    } else {
        alert('Please enter a movie name to search.');
    }
});


document.addEventListener('click', async function(e) {
    if (e.target && e.target.classList.contains('addToWatchlist')) {
        let movieId = e.target.getAttribute('data-id');
        let movieDetails = await getMovieDetails(movieId);

        let movieData = {
            title: movieDetails.Title,
            poster: movieDetails.Poster,
            rating: movieDetails.Ratings[0]?.Value.slice(0, 3) || 'N/A',
            genre: movieDetails.Genre,
            released: movieDetails.Released,
            runtime: movieDetails.Runtime,
            plot: movieDetails.Plot
        };

        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist.push(movieData);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));

        alert('Movie added to watchlist!');
    }

    if (e.target && e.target.classList.contains('removeFromWatchlist')) {
        let movieTitle = e.target.getAttribute('data-title');
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(movie => movie.title !== movieTitle);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
    }

    if (e.target && e.target.classList.contains('reviewButton')) {
        let movieId = e.target.getAttribute('data-id');
        let movieCard = e.target.closest('.movieCard');
        let hiddenDetails = movieCard.querySelector('.hiddenDetails');

      
        hiddenDetails.classList.toggle('hidden');

    
        if (hiddenDetails.classList.contains('hidden')) {
            e.target.textContent = 'Review';
        } else {
            e.target.textContent = 'Hide Review';
        }
    }
});


viewWatchlistBtn.addEventListener('click', function () {
    document.querySelector('.card').style.display = 'none';
    document.querySelector('.watchlist').style.display = 'block';
    renderWatchlist();
});


backToSearchBtn.addEventListener('click', function () {
    document.querySelector('.card').style.display = 'block';
    document.querySelector('.watchlist').style.display = 'none';
});
