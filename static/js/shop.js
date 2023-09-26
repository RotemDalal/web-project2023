let multiBy = 1;
function updatemultiBy(num) {
  multiBy = Number(num);
}


async function getProducts() {
  try {
    const response = await fetch('http://localhost:5500/products'); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    console.log("status: " + response.status)
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

let selectedProducts = {};

$(document).ready(async function () {
  selectedProducts = await getCart();
  updateCartCounter();
  updateCartList();

})

async function getCart() {
  try {
    return $.ajax({
      type: "GET",
      url: "/api/getCart",
      success: function (cartData) {
        const { products } = cartData;
        return products
      },
      error: function (jqXHR) {
        if (jqXHR.status === 401) {
          console.log('not logged in to get cart')
          return {}
        } else {
          $('#error').text('Error Getting Cart: ' + jqXHR.responseText);
        }
        return {}
      },
      async: true
    });
  }
  catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
async function addProductToCart(productId, productName) {
  if (selectedProducts[productId]) {
    selectedProducts[productId].quantity += 1;
  } else {
    selectedProducts[productId] = { id: productId, name: productName, quantity: 1 };
  }
  await addToCart(productId);
  updateCartCounter();
  updateCartList();
}


function removeProductFromCart(productId) {
  delete selectedProducts[productId];
  updateCartCounter();
  updateCartList();
  removeFromCart(productId);
}

function removeFromCart(productId) {
  $.ajax({
    type: "POST",
    url: "/api/removeFromCart",
    data: JSON.stringify({ productId }),
    contentType: "application/json",
    success: async function () {
      console.log('removed from cart')
      selectedProducts = (await getCart())
      updateCartCounter();
      updateCartList();
    },
    error: function (jqXHR) {
      if (jqXHR.status === 401) {
        $('#error').text('Error Removing Product from Cart: Please login before trying to remove from cart');
      } else {
        $('#error').text('Error Removing Product from Cart: ' + jqXHR.responseText);
      }

    }
  });
}

function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  // iterate of the selectedProducts object and count the total number of products
  let totalNumOfProducts = 0
  for (const productId in selectedProducts) {
    const product = selectedProducts[productId];
    totalNumOfProducts += product.quantity;
  }
  cartCounter.innerHTML = totalNumOfProducts;
}

function updateCartList() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  Object.values(selectedProducts).forEach(product => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    // Display product name and quantity
    listItem.innerHTML = `${product.name} (Quantity: ${product.quantity})`;

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger';
    removeButton.innerHTML = 'Remove';
    removeButton.addEventListener('click', () => {
      removeProductFromCart(product.id);
    });

    listItem.appendChild(removeButton);
    cartList.appendChild(listItem);
  });
}


async function addToCart(productId) {
  let isProcessing = true;
  const button = document.querySelector("#add-to-cart-" + productId); 
  button.disabled = true;
  try {
    const response = await fetch('/api/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedProducts })
    });

    if (response.ok) {
      console.log('updated cart');
      return await getCart();
    } else {
      const text = await response.text();
      if (response.status === 401) {
        $('#error').text('Error Adding Product to Cart: Please login before trying to add to cart');
      } else {
        $('#error').text('Error Adding Product to Cart: ' + text);
      }
    }
  } catch (error) {
    console.error('There was an error with the fetch operation:', error);
  }
  finally {
    button.disabled = false;
    isProcessing = false;
  }
}



function switchColor(productId) {
  // Your switchColor logic here
  addProductToCart(productId);
}


//   $(document).ready(function() {
//     $(".select-button").click(function() {
//       $("#my-toast").show();
//     });
//   });
function addProductCards(products) {
  const productsContainer = document.getElementById('products-container');

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('prod-card');
    card.setAttribute('data-aos', 'fade-right');

    const desc = document.createElement('div');
    desc.classList.add('prod-desc');

    const title = document.createElement('h4');
    title.classList.add('prod-title');
    title.innerHTML = product.name;

    const descText = document.createElement('p');
    descText.classList.add('prod-desc-txt');
    descText.innerHTML = product.description;

    const priceLabel = document.createElement('p');
    priceLabel.style.float = 'left';
    priceLabel.style.paddingLeft = '20px';
    priceLabel.style.fontSize = '18px';
    priceLabel.innerHTML = 'Price: ';

    const price = document.createElement('p');
    price.classList.add('prod-price');
    price.innerHTML = "&nbsp;$" + product.price.toFixed(2);

    desc.appendChild(title);
    desc.appendChild(descText);
    desc.appendChild(priceLabel);
    desc.appendChild(price);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('prod-img');

    const img = document.createElement('img');
    img.src = `data:image/jpeg;base64,${product.image}`;
    img.alt = product.name;

    imgContainer.appendChild(img);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-div');

    const selectButton = document.createElement('button');
    selectButton.classList.add('select-button');
    selectButton.innerHTML = 'Add to cart';
    selectButton.id = "add-to-cart-"+product.id;
    selectButton.addEventListener('click', () => {
      const productName = product.name;
      addProductToCart(selectButton.id.split('-')[3], productName);
    });


    buttonDiv.appendChild(selectButton);
    buttonDiv.appendChild(document.createElement('br'));
    buttonDiv.appendChild(document.createElement('br'));
    const exchangeButton = document.createElement('button');
    exchangeButton.classList.add('select-button');
    exchangeButton.innerHTML = 'Exchange to NIS';
    exchangeButton.addEventListener('click', () => {
      if (exchangeButton.innerHTML === 'Exchange to NIS') {
        price.innerHTML = "&nbsp;&#8362;" + (product.price * multiBy).toFixed(2);
        exchangeButton.innerHTML = 'Exchange to USD';
      } else {
        price.innerHTML = "&nbsp;$" + product.price.toFixed(2);
        exchangeButton.innerHTML = 'Exchange to NIS';
      }
    });
    buttonDiv.appendChild(exchangeButton);

    card.appendChild(desc);
    card.appendChild(imgContainer);
    card.appendChild(buttonDiv);

    productsContainer.appendChild(card);
  });
}

async function displayProducts() {
  const products = await getProducts();
  addProductCards(products);
}

// Call the function to display products
displayProducts();  
