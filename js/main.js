window.onload = function() {
    // Remove no JS class from html
    var classes = document.documentElement.className;

    if (classes.includes("no-js")) {
        document.documentElement.className = document.documentElement.className.replace("no-js", "");
    }


    // Check if user has light/dark mode preference
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        // By default, emoji indicator is lighbulb. Change to moon if light is preferred on pageload.
        if (currentTheme == "light") {
            document.getElementById("theme_toggle").innerHTML = "&#x1F314";
        }
    }


    // Allow user to switch dark/light themes
    // See https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8
    const toggle = document.getElementById('theme_toggle');
    toggle.addEventListener("click", changeTheme);
}

function changeTheme() {
    var theme = document.documentElement.getAttribute('data-theme');

    if (theme == "light") {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById("theme_toggle").innerHTML = "&#x1F4A1;";
        localStorage.setItem("theme", "dark");
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("theme_toggle").innerHTML = "&#x1F314";
        localStorage.setItem("theme", "light");
    }
}