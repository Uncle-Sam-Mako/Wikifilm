
let changeStyleMode = function(){
    let switcher = document.getElementById("night-mode"),
    page = document.getElementsByTagName("html")[0];
    switcher.addEventListener('change', function(){
        page.classList.toggle("night-mode");
    });
}
changeStyleMode();

//TMDB API
const API_KEY = "834aaad6249c99581606d4c68f11385b";
const url = "https://api.themoviedb.org/3/search/multi?api_key=834aaad6249c99581606d4c68f11385b&language=en-US&page=1&include_adult=false";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const IMAGE_PATH_ORIGINAL = "https://image.tmdb.org/t/p/original";
const loader = document.getElementById('modal-preloader');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function formatRevenue(mont){
    let formatMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" ,minimumFractionDigits: 3 });
    let money = formatMoney.format(mont).slice(0, -4);
    return money;
}
function addLoading(){
    loader.classList.add("active")
}
function removeLoading(){
    loader.classList.remove("active");
}
//index.html
function randomBackground(){
    function setBannerImage(items){
        const numberOfItem = items.length;
        let randomIndex = getRandomInt(numberOfItem);
        let randomItem = items[randomIndex];
        let imgPoster = document.getElementById('random-poster');
        imgPoster.src = IMAGE_PATH + randomItem.poster_path;
    }
    function searchFilmToPutOnBanner(){
        let randomPage = getRandomInt(11);
        const url = `https://api.themoviedb.org/3/keyword/253695/movies?api_key=834aaad6249c99581606d4c68f11385b&language=fr&include_adult=false&page=${randomPage}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const movies = data.results; 
                setBannerImage(movies);
                console.log(movies)
                console.log(data.total_pages)
            })
            .catch(() =>{
                console.log("Error", error);
            })
    }
    searchFilmToPutOnBanner()
};

//search.html
function getMovies(){
    const inputSearch = document.querySelector("#inputSearch");
    const buttonSearch = document.querySelector("#buttonSearch");
    const movieSearched = document.querySelector(".result-section .movie-container");


    function search(page){
        const value = inputSearch.value;
        if(value){
            newUrl = url + "&query=" + value;
            console.log("Value : ", value);
            fetch(newUrl)
                .then((res) => res.json())
                .then((data) => {
                    const movies = data.results; 
                    setMoviesSearched(movies);
                    console.log(movies);
                })
                .catch(() =>{
                    console.log("Error", error);
                })
            document.getElementById("result-title").innerHTML = `Results for "${value}"`;
            document.querySelector('.result-section').style.display = "block";
        }else{
            document.querySelector('.result-section').style.display = "none";
        }
    }

    function getNewestMovies(){
        const url = "https://api.themoviedb.org/3/movie/upcoming?api_key=834aaad6249c99581606d4c68f11385b&language=fr&page=1";
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const movies = data.results; 
                setNewestMovies(movies)
                console.log(movies);
            })
            .catch(() => {
                console.log("Error", error);
            })
    }

    function setNewestMovies(items){
        const moviesBlock = document.getElementById('newestSection');
        for(let i = 0, l = items.length; i<l; i++ ){
            let item = items[i];
            let movieItemTemplate = document.getElementById("newest-movie-template");
            let movieItem = document.importNode(movieItemTemplate.content, true);
            movieItem.querySelector("a").dataset.movie_id = item.id;
            movieItem.querySelector(".movie-poster img").src = item.poster_path ? IMAGE_PATH + item.poster_path : 'https://via.placeholder.com/300x450?text=No+poster';
            movieItem.querySelector('.movie-title p').innerHTML=item.title;
            moviesBlock.appendChild(movieItem);
        }
    }

    function setMoviesSearched(items){
        ClearMoviesSearched();
        const moviesBlock = document.getElementById('resultSection');
        for(let i = 0, l = items.length; i<l; i++ ){
            let item = items[i];
            if(item.media_type==="tv" || item.media_type==="movie"){
                let movieItemTemplate = document.getElementById("movie-template");
                let movieItem = document.importNode(movieItemTemplate.content, true);
                movieItem.querySelector("a").dataset.movie_id = item.id;
                movieItem.querySelector(".movie-poster img").src = item.poster_path ? IMAGE_PATH + item.poster_path : 'https://via.placeholder.com/300x450?text=No+poster';
                if(item.media_type ==="movie") {
                    movieItem.querySelector('.movie-title p').innerHTML=item.title;
                }else{
                    movieItem.querySelector('.movie-title p').innerHTML=item.name;
                }
                moviesBlock.appendChild(movieItem);
            }
        }
    }

    function setRecommendMovie(items){
        const moviesBlock = document.getElementById('recommendedSection');
        const numberOfItem = items.length;
        let randomIndex = Math.floor(Math.random() * Math.floor(numberOfItem));
        let randomItem = items[randomIndex];
        moviesBlock.querySelector(".movie-poster img").src = randomItem.poster_path ? IMAGE_PATH + randomItem.poster_path : 'https://via.placeholder.com/300x450?text=No+poster';
        moviesBlock.querySelector(".original_title").innerHTML = randomItem.title;
        moviesBlock.querySelector(".release_date").innerHTML = randomItem.release_date;
        moviesBlock.querySelector(".original_language").innerHTML = randomItem.original_language;
        moviesBlock.querySelector(".overview").innerHTML = randomItem.overview;    
    }

    function getRecommendMovie(){
        let randomPage = getRandomInt(11);
        const url = `https://api.themoviedb.org/3/keyword/253695/movies?api_key=834aaad6249c99581606d4c68f11385b&language=fr&include_adult=false&page=${randomPage}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const movies = data.results; 
                setRecommendMovie(movies);
            })
            .catch(() =>{
                console.log("Error", error);
            })
    }

    function ClearMoviesSearched(){
        const moviesBlock = document.querySelector('.result-section .movie-container .flex');
        moviesBlock.innerHTML="";
    }

    function setModalInfos(movie){
        const container = document.getElementById("movie-infos-modal");
        document.getElementById("poster-background").src = IMAGE_PATH_ORIGINAL + movie.backdrop_path;
        container.querySelector(".big-title p").innerHTML = movie.title ? movie.title : " - " ;
        container.querySelector(".country").innerHTML = movie.production_countries[0].iso_3166_1 ? movie.production_countries[0].iso_3166_1 : " - ";
        container.querySelector(".genre").innerHTML = `${movie.genres[0].name}, ${movie.genres[1].name} `
        container.querySelector(".original-title").innerHTML = movie.original_title ? movie.original_title : " - ";
        container.querySelector(".original-language").innerHTML = movie.original_language ? movie.original_language : " - "; 
        container.querySelector(".release-date").innerHTML = movie.release_date ? movie.release_date : " - ";
        container.querySelector(".origin-country").innerHTML = movie.production_countries[0].name ? movie.production_countries[0].name : " - ";
        container.querySelector(".overview p").innerHTML = movie.overview ? movie.overview : " Aucune information ";
        container.querySelector(".vote_average").innerHTML = movie.vote_average ? movie.vote_average : "?";
        container.querySelector(".revenue").innerHTML = movie.revenue ? formatRevenue(movie.revenue) : "?";
        removeLoading();
    }

    function getModalInfos(movie_id){
        addLoading();
        let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}&language=fr`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const movie = data; 
                console.log(movie);
                setModalInfos(movie);
                
            })
            .catch(() =>{
                console.log("Error", error);
            })
    }
    buttonSearch.addEventListener('click', function(e){
        e.preventDefault();
        search();
    })
    inputSearch.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            search();
        }
    })
    document.getElementById('hello').addEventListener('click', function(e){ 
        var initElem = e.target; 
        var movie_id = initElem.getAttribute("data-movie_id");
        if(initElem.className != 'js-modal-open'){ // Si l'élément n'est pas un de ceux à traiter 
            return; 
        } 
        getModalInfos(movie_id);
        openModal(e)
    });
    getNewestMovies();
    getRecommendMovie();
};



let film = { "adult": false, "backdrop_path": "/9yBVqNruk6Ykrwc32qrK2TIE5xw.jpg", "belongs_to_collection": null, "budget": 20000000, "genres": [{ "id": 14, "name": "Fantasy" }, { "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 878, "name": "Science Fiction" }, { "id": 53, "name": "Thriller" }], "homepage": "https://www.mortalkombatmovie.net", "id": 460465, "imdb_id": "tt0293429", "original_language": "en", "original_title": "Mortal Kombat", "overview": "Washed-up MMA fighter Cole Young, unaware of his heritage, and hunted by Emperor Shang Tsung's best warrior, Sub-Zero, seeks out and trains with Earth's greatest champions as he prepares to stand against the enemies of Outworld in a high stakes battle for the universe.", "popularity": 10185.721, "poster_path": "/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg", "production_companies": [{ "id": 76907, "logo_path": "/wChlWsVgwSd4ZWxTIm8PTEcaESz.png", "name": "Atomic Monster", "origin_country": "US" }, { "id": 8000, "logo_path": "/f8NwLg72BByt3eav7lX1lcJfe60.png", "name": "Broken Road Productions", "origin_country": "US" }, { "id": 12, "logo_path": "/iaYpEp3LQmb8AfAtmTvpqd4149c.png", "name": "New Line Cinema", "origin_country": "US" }, { "id": 174, "logo_path": "/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png", "name": "Warner Bros. Pictures", "origin_country": "US" }, { "id": 2806, "logo_path": "/vxOhCbpsRBh10m6LZ3HyImTYpPY.png", "name": "South Australian Film Corporation", "origin_country": "AU" }, { "id": 13033, "logo_path": null, "name": "NetherRealm Studios", "origin_country": "" }], "production_countries": [{ "iso_3166_1": "AU", "name": "Australia" }, { "iso_3166_1": "US", "name": "United States of America" }], "release_date": "2021-04-07", "revenue": 50115000, "runtime": 110, "spoken_languages": [{ "english_name": "Japanese", "iso_639_1": "ja", "name": "日本語" }, { "english_name": "English", "iso_639_1": "en", "name": "English" }, { "english_name": "Mandarin", "iso_639_1": "zh", "name": "普通话" }], "status": "Released", "tagline": "Get over here.", "title": "Mortal Kombat", "video": false, "vote_average": 8.0, "vote_count": 1622 }