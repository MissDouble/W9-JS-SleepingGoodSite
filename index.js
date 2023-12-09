// import './node_modules/axios/dist/axios.min.js';

// import axios from 'axios';
// console.log(axios.isCancel('something'));
// const axios = require('axios');

// 請代入自己的網址路徑
// const addCardBtn1 = document.querySelector('.addCardBtn1');//不能是html裡面有很多個都一樣class name的情況
// addCardBtn1.addEventListener('click',function(e){
//   console.log(e);
//   console.log(addCardBtn1.getAttribute("id"));
// });



  const addCardBtn = document.querySelector('.productWrap');
  // let id = addCardBtn.getAttribute("id");
  // console.log(id);
  // let quantity = 1 ;

  addCardBtn.addEventListener('click',function(e){
    console.log(e.target);
    //console.log(e.target.getAttribute('id'));
    // quantity +=1;
    // console.log(quantity);
  });






const api_path = "dodo";
const token = "3Lq8WjY22kYkRgs1bQbwxnamk642";

// 取得產品列表
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      //console.log(response.data);
      let str = [];
      let list = response.data.products;
      //console.log(list);
      const productWrap = document.querySelector('.productWrap')
      list.forEach(function(item,index,array){
        str += `<li class="productCard" id=${item.id}>
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="商品照">
        <a href="#" class="addCardBtn" id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li> `
      });
      productWrap.innerHTML = str;
      //console.log(str);
    })
    .catch(function(error){
      console.log(error.response.data)
    })
}
getProductList();

//加入購物車
function addCartItem() {
  const addCardBtn = document.querySelector('.productWrap');
  addCardBtn.addEventListener('click',function(e){
    
    let id = e.target.getAttribute('id')
    console.log(id);

    let quantity = 1;
    // if(id !== null){
    //   quantity +=1;
    //   console.log(quantity);
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      // "productId": "dNcCfa1AcwnDWF8qXvSM",
      // "quantity": 8
      "productId": id,
      "quantity": quantity
    }
  }).then(function (response) {
      console.log(response.data);
      //getCartList();
    });
  });
}


// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
            let str = [];
      let list = response.data.carts
      //console.log(list);
      const shoppingList = document.querySelector('.shopping-list');
      list.forEach(function(item,index,array){
        //console.log(item.product.title);
        let itemTotal = item.product.price*item.quantity
        //console.log(itemTotal);
        str += `<tr>
                <td id="${item.id}">
                    <div class="cardItem-title">
                        <img src="${item.product.images}" alt="產品小圖">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${itemTotal}</td>
                <td class="discardBtn" >
                    <a href="#" id="${item.id}" class="material-icons">
                        clear
                    </a>
                </td>
                </tr>`
      });
      shoppingList.innerHTML = str;
      //console.log(str);
      
    })
}
getCartList();


const discardAll = document.querySelector('.discardAllBtn');
discardAll.addEventListener('click',function(e){
  deleteAllCartList();
  shoppingList.innerHTML = "";
})
// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      const finalTotal = document.querySelector('.total');
      finalTotal.textContent = `NT${0}`;
    })
}

const shoppingList = document.querySelector('.shopping-list');
let forCartId = "";
shoppingList.addEventListener('click',function(e){
  console.log(e.target);
  if(e.target === document.querySelector('.discardBtn>a')){
  forCartId = e.target.getAttribute('id');
  console.log(forCartId);
  const row = e.target.closest('tr');
  console.log(row);
  deleteCartItem(forCartId);
  if(row){
    row.remove();
}
}
else{
  console.log("沒點到刪除按鈕，無動作")
}
});
// 刪除購物車內特定產品
function deleteCartItem(cartId) {

  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      console.log(response.data);
      const finalTotal = document.querySelector('.total');
      finalTotal.textContent = `NT${response.data.finalTotal}`;
      console.log(response.data.finalTotal);
    })  
}

let obj ={
  data:{
    user:{}
  }
};

let name = document.querySelector('#customerName');
console.log(name);

let tel = document.querySelector('#customerPhone');
let email = document.querySelector('#customerEmail');
let address = document.querySelector('#customerAddress');
let payment = document.querySelector('#tradeWay');
let confirmBtn = document.querySelector('.orderInfo-btn');


confirmBtn.addEventListener('click',function(e){
  obj.data.user.name = name.value;
  console.log(name.value);
  console.log(obj.data.user.name);
  obj.data.user.tel = tel.value;
  obj.data.user.email = email.value;
  obj.data.user.address = address.value;
  obj.data.user.payment = payment.value;
  console.log(obj);
  createOrder(obj);
})




// 送出購買訂單
function createOrder(oderData) {

  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, oderData
    // {
    //   "data": {
    //     "user": {
    //       "name": "六角學院",
    //       "tel": "07-5313506",
    //       "email": "hexschool@hexschool.com",
    //       "address": "高雄市六角學院路",
    //       "payment": "Apple Pay"
    //     }
    //   }
    // }
  ).
    then(function (response) {
      console.log(response.data);
    })
    .catch(function(error){
      console.log(error.response.data);
    })
}

// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 修改訂單狀態

function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {

    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);

    })
}

