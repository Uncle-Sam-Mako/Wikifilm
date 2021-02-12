
let changeStyleMode = function(){
    let switcher = document.getElementById("night-mode"),
    page = document.getElementsByTagName("html")[0];
    switcher.addEventListener('change', function(){
        page.classList.toggle("night-mode");
    });
}
changeStyleMode();