// ==UserScript==
// @name         Replace Logo
// @namespace    https://addons.mozilla.org/addon/violentmonkey/
// @version      0.1
// @description  Replace the contents of the logo element with a new image
// @match        https://www.google.*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Selecciona el logo de resultados
    var logoElement = document.getElementById("logo");
    if (logoElement) {
        logoElement.innerHTML = '<img src="https://i.imgur.com/D9SIhvS.jpeg" alt="Logo" width="120" >';
    }

    // Selecciona el logo SVG de la página principal
    var svgLogo = document.querySelector('body div.L3eUgb div.o3j99.LLD4me.yr19Zb.LS8OJ div.k1zIA.rSk4se svg.lnXdpd');
    if (svgLogo) {
        var img = document.createElement('img');
        img.src = 'https://i.imgur.com/D9SIhvS.jpeg';
        img.alt = 'Logo';
        img.width = 272;
    img.height = 110;
        img.style.display = 'block';
        img.style.margin = '0 auto 20px auto';
        img.style.padding = '0';
        img.style.userSelect = 'none';
        svgLogo.parentNode.replaceChild(img, svgLogo);
    }
})();
