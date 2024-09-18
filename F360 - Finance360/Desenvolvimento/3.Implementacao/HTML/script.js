function scrollToLogin() {
    document.getElementById('login').scrollIntoView({ behavior: 'smooth' });
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("backToTopBtn").style.display = "block";
    } else {
        document.getElementById("backToTopBtn").style.display = "none";
    }
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault();
window.location.href = 'HTML/portfolio.html';
});