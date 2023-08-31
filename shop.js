async function getProducts() {
    try {
      const response = await fetch('http://localhost:5500/products'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      console.log("status: "+response.status)
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  let selectedProducts = [];

  function addProductToCart(productId, productName) {
    selectedProducts.push({ id: productId, name: productName });
    updateCartCounter();
    updateCartList();
  }
  

  function removeProductFromCart(productId) {
    selectedProducts = selectedProducts.filter(product => product.id !== productId);
    updateCartCounter();
    updateCartList();
  }
  

function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  cartCounter.textContent = selectedProducts.length;
}

function updateCartList() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
  
    selectedProducts.forEach(product => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.textContent = product.name; // Display product name
  
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn-danger';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        removeProductFromCart(product.id);
      });
  
      listItem.appendChild(removeButton);
      cartList.appendChild(listItem);
    });
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
      title.textContent = product.name;
  
      const descText = document.createElement('p');
      descText.classList.add('prod-desc-txt');
      descText.textContent = product.description;
  
      const priceLabel = document.createElement('p');
      priceLabel.style.float = 'left';
      priceLabel.style.paddingLeft = '20px';
      priceLabel.style.fontSize = '18px';
      priceLabel.textContent = 'Price: ';
  
      const price = document.createElement('p');
      price.classList.add('prod-price');
      price.textContent = product.price.toFixed(2);
  
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
      selectButton.textContent = 'Select';
      selectButton.id = product.id;
      selectButton.addEventListener('click', () => {
        const productName = product.name;;
        addProductToCart(selectButton.id, productName);
      });
      
  
      buttonDiv.appendChild(selectButton);
  
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
  