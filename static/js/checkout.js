$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "/api/getCart",
        contentType: "application/json",
        success: function (res) {
            console.log(res);
            const valuesOfRes = Object.values(res)
            console.log(valuesOfRes);
            const mainConatiner = document.getElementsByTagName("main");
            valuesOfRes.forEach(value => {
                mainConatiner[0].innerHTML += "<div class=\"product-container\">" + "<div class=\"product-name\">" + value.name + "</div>" +"<div class=\"product-quantity\">" + value.quantity + "</div>"+ "</div>"
            })
            mainConatiner[0].innerHTML += "<button id=\"buy-button\">Buy</button>"
            let totalQuantity = 0;
                valuesOfRes.forEach(({quantity}) => {
                    totalQuantity += quantity
                })
            document.getElementById("buy-button").addEventListener("click",() => {
                
                const data = {
                    purchaseDate: Date.now(),
                    quantity: totalQuantity
                }
                $.ajax({
                    type: "POST",
                    url: "/api/addOrder",
                    "data": JSON.stringify(data),
                    contentType: "application/json",
                    success: function (res) {
                        $.ajax({
                            type: "GET",
                            url: "/api/clearCart",
                            contentType: "application/json",
                            success: function (res) {
                                window.location = "/"
                            },
                            error: function (jqXHR) {
                                console.log(jqXHR)
                            }
                        });
                    },
                    error: function (jqXHR) {
                        console.log(jqXHR)
                    }
                });
            })
        },
        error: function (jqXHR) {
            console.log(jqXHR)
        }
    });

});
