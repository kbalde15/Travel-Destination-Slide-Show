"use strict";

const $ = (id) => document.getElementById(id);

let bnrCntr = 0;
let slides = [];
let timer;
let isPaused = false;

const loadSlides = async () => {
    try {
        const response = await fetch('slides.json');
        if (!response.ok) throw new Error('Could not find slides.json');

        slides = await response.json();

        if (slides.length > 0) {
            setupControls();
            cycle();
        }
    } catch (error) {
        console.error("Error loading slideshow:", error);
    }
};

const pauseSlideshow = () => {
    const btn = $('btnToggle');
    isPaused = true;
    if (btn) {
        btn.innerHTML = "Continue";
        btn.classList.add('paused');
    }
    clearTimeout(timer);
};

const setupControls = () => {
    const btn = $('btnToggle');
    if (btn) {
        btn.onclick = () => {
            if (isPaused) {
                isPaused = false;
                btn.innerHTML = "Pause";
                btn.classList.remove('paused');
                cycle();
            } else {
                pauseSlideshow();
            }
        };
    }
};

const openOffsetWindow = (url) => {
    pauseSlideshow();

    const width = 700, height = 600, left = 200, top = 150;

    window.open(
        url,
        'SantoriniDetailWindow',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
};

const cycle = () => {
    if (isPaused) return;

    const currentSlide = slides[bnrCntr];
    const slide_image = $('slide_image');
    const caption = $('caption');

    if (slide_image && caption) {
        slide_image.src = currentSlide.src;
        caption.textContent = currentSlide.caption;

        slide_image.classList.remove("fade-in");
        void slide_image.offsetWidth;
        slide_image.classList.add("fade-in");

        slide_image.onclick = () => openOffsetWindow(currentSlide.url);
    }

    bnrCntr = (bnrCntr + 1) % slides.length;

    timer = setTimeout(cycle, 3000);
};

document.addEventListener("DOMContentLoaded", loadSlides);