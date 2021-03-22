// SHOW MENU

const showMenu = (toggleId,navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show-menu')
        })
    }
}

showMenu('nav-toggle','nav-menu')

// REMOVE BUTTON FOR MOBILE MENU

const navlink = document.querySelectorAll('nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
}