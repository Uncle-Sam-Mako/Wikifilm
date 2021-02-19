
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
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500"


const inputSearch = document.querySelector("#inputSearch");
const buttonSearch = document.querySelector("#buttonSearch");
const movieSearched = document.querySelector(".result-section .movie-container");


function search(page){
    const value = inputSearch.value;
    newUrl = url + "&query=" + value;
    console.log("Value : ", value);
    fetch(newUrl)
        .then((res) => res.json())
        .then((data) => {
            const movies = data.results; 
            setMoviesSearched(movies);
            setResultTitle(data, value);
            console.log(movies);
        })
        .catch(() =>{
            console.log("Error", error);
        })
}
function getNewestMovies(){
    const url = "https://api.themoviedb.org/3/movie/upcoming?api_key=834aaad6249c99581606d4c68f11385b&language=en-US&page=1";
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            const movies = data.results; 
            setNewestMovies(movies);
            console.log(movies);
        })
        .catch(() =>{
            console.log("Error", error);
        })
}
function setResultTitle(resultFound, value){
    const resultTitle = document.querySelector('.result-section h2');
    resultTitle.innerHTML = `Results for "${value}"`;
}

function setNewestMovies(items){
    const moviesBlock = document.querySelector('.newest-section .movie-container .flex');
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
    const moviesBlock = document.querySelector('.result-section .movie-container .flex');
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


function ClearMoviesSearched(){
    const moviesBlock = document.querySelector('.result-section .movie-container .flex');
    moviesBlock.innerHTML="";
}

window.onload = function(){
    getNewestMovies();
    buttonSearch.addEventListener('click', function(e){
        e.preventDefault();
        search();
    })
    inputSearch.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            search();
        }
    })
}