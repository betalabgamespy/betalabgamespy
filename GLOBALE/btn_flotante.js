function toggleTooltipMenu() {
    const menu = document.getElementById('tooltipMenu');
    menu.classList.toggle('show');
}

function openWhatsApp() {
    // REEMPLAZA CON TU NÚMERO DE WHATSAPP
    const phoneNumber = "595993574822"; // Ejemplo para Perú: 51 + tu número
    const message = "Hola, me gustaría obtener más información";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

function openInstagram() {
    // REEMPLAZA CON TU USUARIO DE INSTAGRAM
    const instagramURL = "https://instagram.com/betalabgamespy";
    window.open(instagramURL, '_blank');
}

function openFacebook() {
    // REEMPLAZA CON TU PÁGINA DE FACEBOOK
    const facebookURL = "https://facebook.com/betalabgamespy";
    window.open(facebookURL, '_blank');
}

function openContactForm() {
    alert("Abrir formulario de contacto");
}

document.addEventListener('click', function(e) {
    const floatingContact = document.querySelector('.floating-contact-tooltip');
    if (!floatingContact.contains(e.target)) {
        document.getElementById('tooltipMenu').classList.remove('show');
    }
});