const themeDarkIcon = document.getElementById('theme-dark-icon');
const themeLightIcon = document.getElementById('theme-light-icon');
const themeToggleBtn = document.getElementById('theme-toggle');

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark')
}

themeToggleBtn.onclick = () => {
    // toggle icons inside button
    themeDarkIcon.classList.toggle('hidden');
    themeLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        // if PREVIOUS theme is equal to light
        let fn = localStorage.getItem('color-theme') === 'light' ? Dark : Light;
        fn();
    }
    // if NOT set via local storage previously
    else {
        let fn = document.documentElement.classList.contains('dark') ? Light : Dark;
        fn();
    }
}

function Light() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
}
function Dark() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
}