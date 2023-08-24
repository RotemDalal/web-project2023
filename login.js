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
        "url": "http://localhost:4001/register",
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
    $('#logout-item').hide();
    $('#login-item').show();
    $('#register-item').show();
    $('#hello-nav').text('');
})

$('#login-item').click(function () {
    $('#modal-login').show();
})

$('#cancel-btn').click(() => {
    $('#modal-login').hide();
    history.back();
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
        "url": "http://localhost:4001/login",
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
        $('#register-item').hide();
        $('#logout-item').show();
        localStorage.setItem("user", JSON.stringify(response));
        $('#hello-nav').text("hello " + response.username);
    });
    
})
