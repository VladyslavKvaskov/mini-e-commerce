"use strict";

let page = 'client';
let priceToPay = 0;
let form_method = 'POST';
let productToEditID;
let cartItems = [];
let dataToRemoveFromCart;
let timeOut;

window.onload = () =>{
  historyPrevNext();
  getAllProducts();
  if(localStorage.getItem('cart-items')){
    cartItems = JSON.parse(localStorage.getItem('cart-items'));
    cartProducts.innerHTML = '';
    for(let cartItem of cartItems){
      priceToPay += parseInt(cartItem.price, 10);
      cartProducts.insertAdjacentHTML('beforeend', `
        <div class="card">
          <div>
            <img class="prod-img" src="${cartItem.img}">
            <h2>${cartItem.name}</h2>
            <p class="c-desc">${cartItem.desc}</p>
          </div>
          <div>
            <div class="priceTag">${cartItem.price}$</div>
            <button type="button" class="remove-from-cart" onclick="removeItemFromCart(\`${JSON.stringify(cartItem).replace(/"/g, '-br-br-br')}\`, this);">Remove</button>
          </div>
        </div>
      `);
    }
    priceCart.innerText = `${priceToPay}$`;
    total.innerText = `Total: ${priceToPay}$`;
  }
}

window.onpopstate = () =>{
  historyPrevNext();
}

acBttn.onclick = () =>{
  if(page == 'client'){
    page = 'admin';
    update_url('/?page=admin');
    setAdminPage();
  }
  else if(page == 'admin'){
    page = 'client';
    update_url('/?page=client');
    setClientPage();
  }
  form.classList.remove('show-form');
  cartPage.classList.remove('show-form');
}

addItem.onclick = () =>{
  update_url('/?page=admin&form=shown');
  form.classList.add('show-form');
  form_method = 'POST';
}

closeFormBttn.onclick = () =>{
  update_url('/?page=admin');
  form.classList.remove('show-form');
}

closeCartBttn.onclick = () =>{
  cartPage.classList.remove('show-form');
  update_url('/?page=client');
}

cart.onclick = () =>{
  cartPage.classList.add('show-form');
  update_url('/?page=client&cart=shown');
}

submitBttn.onclick = async () =>{
  let form_isValid = true;
  let available;

  if(codeInput.value.length == 0 || nameInput.value.length == 0 || priceInput.value.length == 0 || imgInput.value.length == 0 || descInput.value.length == 0){
    form_isValid = false;
    appMessage(`ERROR! All the text inputs must be filled out!`, '#ff5019');
    submitBttn.type = 'submit';
  }
  else {
    submitBttn.type = 'button';
  }
  if(form_method == 'POST'){
    await fetch('https://5db82951177b350014ac76e3.mockapi.io/products')
    .then(response => response.json())
    .then(data => {
      clientProducts.innerHTML = '';
      adminProducts.innerHTML = '';
      codeInput.setCustomValidity('');
      for(let d of data){
        if(codeInput.value == d.code){
          appMessage(`ERROR! Code '${codeInput.value}' already exists!`, '#ff5019');
          form_isValid = false;
        }
      }
    });
  }

  if(checkbox.checked)
    available = true;
  else
    available = false;

  if(form_method == 'POST' && form_isValid){
    postProduct({
      "code": codeInput.value,
      "name": nameInput.value,
      "price": priceInput.value,
      "available": available,
      "img": imgInput.value,
      "desc": descInput.value.replace(/\n/g, '<br>')
    });
  }
  else if(form_method == 'PUT' && form_isValid){
    editProduct(productToEditID, {
      "code": codeInput.value,
      "name": nameInput.value,
      "price": priceInput.value,
      "available": available,
      "img": imgInput.value,
      "desc": descInput.value.replace(/\n/g, '<br>')
    });
  }
}

function update_url(url){
  history.pushState(null, null, url);
}

function getQuery(queryVar){
  let query = window.location.search.substring(1);
  let lets = query.split("&");
  for (let i = 0; i < lets.length; i++) {
    let pair = lets[i].split("=");
    if (pair[0] == queryVar)
      return pair[1];
  }
  return (false);
}

function getAllProducts(){
  fetch('https://5db82951177b350014ac76e3.mockapi.io/products')
  .then(response => response.json())
  .then(data => {
    clientProducts.innerHTML = '';
    adminProducts.innerHTML = '';

    for(let d of data){
      if(d.available){
        clientProducts.insertAdjacentHTML('beforeend', `
          <div class="card">
            <div>
              <img class="prod-img" src="${d.img}">
              <h2>${d.name}</h2>
              <p class="c-desc">${d.desc}</p>
            </div>
            <div>
              <div class="priceTag">${d.price}$</div>
              <button type="button" class="add-to-cart" onclick="addItemToCart(\`${JSON.stringify(d).replace(/"/g, '-br-br-br')}\`);">Add to Cart</button>
            </div>
          </div>
        `);

        adminProducts.insertAdjacentHTML('beforeend', `
          <div class="card admin-card">
            <div>
              <img class="prod-img" src="${d.img}">
              <h2>${d.name}</h2>
              <p class="c-desc">${d.desc}</p>
            </div>
            <div>
              <div class="priceTag">${d.price}$</div>
              <div class="admin-bttns">
                <button type="button" class="edit-bttn" onclick="
                    update_url('?page=admin&form=shown');
                    productToEditID = ${d.id};
                    form_method = 'PUT';
                    document.getElementById('form').classList.add('show-form');
                    codeInput.value = ${d.code};
                    nameInput.value = '${d.name}';
                    priceInput.value = ${d.price};
                    checkbox.checked = ${d.available};
                    imgInput.value = '${d.img}';
                    descInput.value = \`${d.desc.replace(/<br>/g, '\n')}\`;
                  ">EDIT</button>
                <button type="button" class="delete-bttn" onclick="deleteProduct(${d.id}, this);">DELETE</button>
              </div>
            </div>
          </div>
        `);
      }
      else {
        adminProducts.insertAdjacentHTML('beforeend', `
          <div class="card admin-card">
            <div>
              <img class="prod-img" src="${d.img}">
              <h2>${d.name}</h2>
              <p class="c-desc">${d.desc}</p>
            </div>
            <div>
              <div class="priceTag">${d.price}$</div>
              <div class="not-available">Not Available</div>
              <div class="admin-bttns">
                <button type="button" class="edit-bttn" onclick="
                    update_url('?page=admin&form=shown');
                    productToEditID = ${d.id};
                    form_method = 'PUT';
                    document.getElementById('form').classList.add('show-form');
                    codeInput.value = ${d.code};
                    nameInput.value = '${d.name}';
                    priceInput.value = ${d.price};
                    checkbox.checked = ${d.available};
                    imgInput.value = '${d.img}';
                    descInput.value = \`${d.desc.replace(/<br>/g, '\n')}\`;
                  ">EDIT</button>
                <button type="button" class="delete-bttn" onclick="deleteProduct(${d.id}, this);">DELETE</button>
              </div>
            </div>
          </div>
        `);
      }
    }
    if(!getQuery('form'))
      form.classList.remove('show-form');
    if(!getQuery('cart'))
      cartPage.classList.remove('show-form');
  });
}

function postProduct(json){
  fetch('https://5db82951177b350014ac76e3.mockapi.io/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json)
  }).then(response => {
    if(response.status == 201){
      form.classList.remove('show-form');
      update_url('/?page=admin');
      getAllProducts();
      appMessage('Successfully added the product!', '#34a853');
    }
    else {
      appMessage('Could not add the product!', '#ff5019');
    }
  });
}

function deleteProduct(id, productToRemoveFromDOM){
  fetch(`https://5db82951177b350014ac76e3.mockapi.io/products/${id}`,{
    method: 'DELETE'
  }).then(response => {
    if(response.status == 200){
      productToRemoveFromDOM.parentElement.parentElement.parentElement.remove();
      appMessage('Successfully deleted the product!', '#34a853');
    }
    else{
      appMessage('Could not delete the product!', '#ff5019');
    }
    return response.json()
  });
}

function editProduct(id, json){
  fetch(`https://5db82951177b350014ac76e3.mockapi.io/products/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json)
  }).then(response => {
    if(response.status == 200){
      update_url('/?page=admin');
      getAllProducts();
      appMessage('Successfully edited the product!', '#34a853');
    }
    else{
      appMessage('Could not edit the product!', '#ff5019');
    }
    return response.json()
  });
}

function addItemToCart(json){
  let product_info = JSON.parse(json.replace(/-br-br-br/g, '\"'));
  priceToPay += parseInt(product_info.price, 10);
  priceCart.innerText = `${priceToPay}$`;
  total.innerText = `Total: ${priceToPay}$`;

  cartItems.push(product_info);
  localStorage.setItem('cart-items', JSON.stringify(cartItems));

  cartProducts.innerHTML = '';
  let itemsInCart = JSON.parse(localStorage.getItem('cart-items'));

  for(let cartItem of cartItems){
    cartProducts.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div>
          <img class="prod-img" src="${cartItem.img}">
          <h2>${cartItem.name}</h2>
          <p class="c-desc">${cartItem.desc}</p>
        </div>
        <div>
          <div class="priceTag">${cartItem.price}$</div>
          <button type="button" class="remove-from-cart" onclick="removeItemFromCart(\`${JSON.stringify(cartItem).replace(/"/g, '-br-br-br')}\`, this);">Remove</button>
        </div>
      </div>
    `);
  }
}

function removeItemFromCart(json, productToRemoveFromDOM){
  let product_info = JSON.parse(json.replace(/-br-br-br/g, '\"'));
  cartItems.splice(cartItems.indexOf(product_info), 1);
  localStorage.setItem('cart-items', JSON.stringify(cartItems));
  productToRemoveFromDOM.parentElement.parentElement.remove();
  priceToPay -= parseInt(product_info.price, 10);
  priceCart.innerText = `${priceToPay}$`;
  total.innerText = `Total: ${priceToPay}$`;
}

function setAdminPage(){
  adminBttn.classList.add('selected');
  clientBttn.classList.remove('selected');

  adminPage.classList.remove('hide');
  clientPage.classList.add('hide');
}

function setClientPage(){
  clientBttn.classList.add('selected');
  adminBttn.classList.remove('selected');

  adminPage.classList.add('hide');
  clientPage.classList.remove('hide');
}

function historyPrevNext(){
  if(!getQuery('page') && !getQuery('form')){
    page = 'client';
    form.classList.remove('show-form');
    cartPage.classList.remove('show-form');
    setClientPage();
  }
  else if (getQuery('page') == 'client' && getQuery('cart') == 'shown') {
    page = 'client';
    cartPage.classList.add('show-form');
    form.classList.remove('show-form');
    setClientPage();
  }
  else if(getQuery('page') == 'client'){
    page = 'client';
    form.classList.remove('show-form');
    cartPage.classList.remove('show-form');
    setClientPage();
  }
  else if(getQuery('page') == 'admin' && getQuery('form') == 'shown'){
    page = 'admin';
    setAdminPage();
    form.classList.add('show-form');
    cartPage.classList.remove('show-form');
  }
  else if(getQuery('page') == 'admin'){
    page = 'admin';
    form.classList.remove('show-form');
    cartPage.classList.remove('show-form');
    setAdminPage();
  }
}

function appMessage(app_message_txt, background){
  clearTimeout(timeOut);
  app_message.innerHTML=app_message_txt;
  app_message.setAttribute('style',`background:${background};transform:translateX(0);`);
  TimeOutf();
}

function TimeOutf(){
  timeOut = setTimeout(function(){app_message.style['transform']='translateX(-100vw)';}, 5000);
}
