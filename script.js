function openHamburger() {
    if ($('.hamburger-menu').css('display') === 'none') {
        $('.hamburger-menu').show();
    } else {
        $('.hamburger-menu').hide();
    }
}


$('#register-item').click(() => {
    $('#modal-register').show();
})
$('#cancel-btn-reg').click(() => {
    $('#modal-register').hide();
});
$('#register-btn-reg').click(() => {
    var username = $('#username-reg').val();
    // Validate name
    if (username === "") {
        alert("username must be filled out");
        return;
    }
    if (!username.match(/[A-Za-z\u0590-\u05FF]/)) {
        alert("username must contain letters only");
        return;
    }
    var email = $('#email').val();
    
    // Validate email
    if (email === "") {
        alert("Email address must be filled out");
        return;
    }
    /*if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        alert("You have entered an invalid email address");
        return;
    }*/


    var password = $('#password-reg').val();
    // Check password length
    if (password.length < 8) {
        alert('Password is too short. It should be at least 8 characters.');
        return;
    } else if (password.length > 20) {
        alert('Password is too long. It should be no more than 20 characters.');
        return;
    }

    var settings = {
        "url": "http://localhost:5500/register",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify({
            "username": username,
            "password": password
        }),
        "statusCode": {
            500: function (xhr) {
                alert('An error occurred')
            }
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        $('#modal-register').hide();
        console.log(response);
        $('#login-item').hide();
        $('#register-item').hide();
        $('#logout-item').show();
        localStorage.setItem("user", JSON.stringify(response));
        $('#hello-nav').text("hello " + response.username);
    });
})



$('#logout-item').click(() => {
    localStorage.setItem('user', null);
    $('#logout-item').show();
    $('#register-item').show();
    $('#hello-nav').text('');
})

$('#login-item').click(function () {
    $('#modal-login').show();
})

$('#cancel-btn').click(() => {
    $('#modal-login').hide();
})

$('#login-btn').click(() => {
    var username = $('#username').val();
    var password = $('#password').val();

    // Check password length
    if (password.length < 8) {
        alert('Password is too short. It should be at least 8 characters.');
        return;
    } else if (password.length > 20) {
        alert('Password is too long. It should be no more than 20 characters.');
        return;
    }

    var settings = {
        "url": "http://localhost:5500/login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify({
            "username": username,
            "password": password
        }),
        "statusCode": {
            401: function (xhr) {
                alert('User not found or invalid credentials.');
            },
            500: function (xhr) {
                alert('An internal server error occurred.');
            }
        }
    };

    $.ajax(settings).done(function (response) {
        $('#modal-login').hide();
        console.log(response);
        $('#login-item').hide();
        $('#logout-item').show();
        localStorage.setItem("user", JSON.stringify(response));
        $('#hello-nav').text("hello " + response.username);
    });
})

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


// Animation
AOS.init({
    duration: 1400,
    once: true,
    // delay: 400,
});

/*function validateForm() {
  
    let email = document.forms["myForm"]["email"].value;
    if (email === "") {
        alert("Email address must be filled out");
        return false;
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        alert("You have entered an invalid email address");
        return false;
    }
    alert("Your details have been sent successfully!");
    return true;
}*/

function switchColor(id) {
    let val = document.getElementById(id).innerHTML;
    if (val === "Select") {
        document.getElementById(id).innerHTML = 'Unselect';
        document.getElementById(id).style.backgroundColor = '#eee';
        document.getElementById(id).style.border = '#eee';
        document.getElementById(id).style.color = 'black';
    }
    if (val === "Unselect") {
        document.getElementById(id).innerHTML = 'Select';
        document.getElementById(id).style.backgroundColor = '#282828';
        document.getElementById(id).style.border = '#282828';
        document.getElementById(id).style.color = 'white';
    }
}

function makeOrder() {
    let counter = 0;
    let numOfCards = document.getElementsByClassName('prod-card').length;
    for (let i = 1; i <= numOfCards; i++) {
        let val = document.getElementById(i).innerHTML;
        if (val === "Unselect") {
            counter++;
            document.getElementById(i).innerHTML = 'Select';
            document.getElementById(i).style.backgroundColor = '#282828';
            document.getElementById(i).style.border = '#282828';
            document.getElementById(i).style.color = 'white';
        }
    }
    if (counter === 0) {
        alert("No product selected");
    }
    else if (counter === 1) {
        alert("Your order has been accepted! (" + counter + " product total)");
    } else {
        alert("Your order has been accepted! (" + counter + " products total)");
    }
}