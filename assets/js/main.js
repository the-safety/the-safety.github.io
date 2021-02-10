var burger = document.querySelector('.navbar-burger');
if (burger) {
    burger.addEventListener('click', function (event) {
        event.stopPropagation();
        burger.classList.toggle('is-active');
        document.querySelector('.navbar-menu').classList.toggle('is-active');
    });
}

function $(id) {
    return document.getElementById(id);
}