$(document).ready(function () {
    $('#remove-product-btn').on('click', function () {
        const name = $('#remove-product-name').val();
        const product = {
            name
        };
        $.ajax({
            type: "POST",
            url: "/api/removeProduct",
            data: JSON.stringify(product),
            contentType: "application/json",
            success: function () {
                alert('Product removed successfully');
            },
            error: function (jqXHR) {
                $('#error').text('Error removing product: ' + jqXHR.responseText);
            }
        });
    });

    $('#add-product-btn').on('click', function () {
        const id = parseInt($('#id').val());
        const name = $('#name').val();
        const description = $('#description').val();
        const price = parseInt($('#price').val());
        const image = $('#image').val();
        const kosher = Boolean( $('#kosher').val());
        const alcoholPercentage = parseInt($('#alcoholPercentage').val());
        const volume =parseInt( $('#volume').val());
        const type = $('#type').val();
        const drySweet = $('#drySweet').val();
        const grapeVarieties = $('#grapeVarieties').val();


        const product = {
            id,
            name,
            description,
            price,
            image,
            kosher,
            alcoholPercentage,
            volume,
            type,
            drySweet,
            grapeVarieties
        };
        $.ajax({
            type: "POST",
            url: "/api/addProduct",
            data: JSON.stringify(product),
            contentType: "application/json",
            success: function () {
                alert('Product added successfully');
            },
            error: function () {
                $('#error').text('Error adding product');
            }
        });
    });
    $('#post-btn').on('click', function () {
        const msg = $('#post-message').val();
        $.ajax({
            type: "POST",
            url: "/api/postToFB",
            data: JSON.stringify({ message: msg }),
            contentType: "application/json",
            success: function () {
                alert('Posted to Facebook successfully');
            },
            error: function () {
                $('#error').text('Error adding product');
            }
        });
    });
    // edit facebook-page-data to add facebook page data
    $.ajax({
        type: "GET",
        url: "/api/getFBDetails",
        contentType: "application/json",
        success: function (res) {
            $('#facebook-page-data').text('Page Name:' + res.name)
        },
        error: function (jqXHR) {
            $('#error').text('Error removing product: ' + jqXHR.responseText);
        }
    });

});
