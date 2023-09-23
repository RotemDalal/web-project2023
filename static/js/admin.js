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
        const name = $('#product-name').val();
        const price = $('#product-price').val();
        const image = $('#product-image').val();
        const description = $('#product-description').val();
        const product = {
            name,
            price,
            image,
            description
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
});
