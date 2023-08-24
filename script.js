function openHamburger() {
    if ($('.hamburger-menu').css('display') === 'none') {
        $('.hamburger-menu').show();
    } else {
        $('.hamburger-menu').hide();
    }
}

// Animation
AOS.init({
    duration: 1400,
    once: true,
    // delay: 400,
});

// https://swiperjs.com/get-started
$(document).ready(function () {
    new Swiper('.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        loopedSlides: 10,
        slidesPerView: 'auto',
        spaceBetween: 150,
        centeredSlides: true,
        simulateTouch: true,
        touchEventsTarget: true,
        touchReleaseOnEdges: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },

    })
})





// const clearInput = () => {
//     const input = document.getElementsByTagName("input")[0];
//     input.value = "";
//   }
  
//   const clearBtn = document.getElementById("clear-btn");
//   clearBtn.addEventListener("click", clearInput);