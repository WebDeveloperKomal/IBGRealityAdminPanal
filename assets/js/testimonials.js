function rate(star) {
    // Reset all stars to default color
    const stars = document.querySelectorAll('.star');
    stars.forEach(starElement => starElement.classList.remove('selected'));

    // Highlight selected stars
    for (let i = 0; i < star; i++) {
        stars[i].classList.add('selected');
    }

    // You can capture the selected star value (1 to 5) and use it as needed
    console.log(`User rated: ${star} star(s)`);
}