document.addEventListener('DOMContentLoaded', function () {
    // Give a slight delay to ensure all positioning is complete
    setTimeout(function () {
        document.body.classList.remove('loading');
    }, 400);
});