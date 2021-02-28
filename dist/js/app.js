
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
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
        container.querySelector(".big-title p").innerHTML= movie.title;
        container.querySelector(".country").innerHTML = movie.production_countries[0].iso_3166_1;
        container.querySelector(".genre").innerHTML = `${movie.genres[0].name}, ${movie.genres[1].name} `
        container.querySelector(".original-title").innerHTML = movie.original_title;
        container.querySelector(".original-language").innerHTML = movie.original_language;
        container.querySelector(".release-date").innerHTML = movie.release_date;
        container.querySelector(".origin-country").innerHTML = movie.production_countries[0].name;
        container.querySelector(".overview p").innerHTML = movie.overview;
        container.querySelector(".vote_average").innerHTML = movie.vote_average;

    }

    function getModalInfos(movie_id){
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

    const movieModal = document.getElementById('.movie-infos-modal');
    movieModal.onload = function(){
        const pagePreloader = document.getElementById('preloader2');
        pagePreloader.classList.remove("active");
    }
};

// window.onload = function(){
//     const pagePreloader = document.getElementById('preloader');
//     pagePreloader.classList.remove("active");
// }