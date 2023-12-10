

let dataforChart = [];

// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});


const orderPagetable = document.querySelector('.orderPage-table');
const api_path = "dodo";
const token = "3Lq8WjY22kYkRgs1bQbwxnamk642";





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

        let str =[];
        let allProductItems = [];
        const orderList = document.querySelector('.orderList');
        console.log('orderList:',orderList);
        let listItems = response.data.orders;
        let paid = listItems.paid;
        console.log('listItems:',listItems);

        //遍歷每一筆訂單
        listItems.forEach(function(item){
            //let createAt = item.createAt;
            console.log('createAt:',item.createdAt);
            console.log('total:',item.total);
            console.log('quantity:',item.quantity);
            if(paid === true){
                paid = "已處理";
            }else{
                paid = "未處理";
            }
            console.log(paid);
            let titleStr =[];
            let productItems =[];
            let id = item.id;
            console.log('id:',id);
            //const titleList = document.querySelector('.titleList');
            //console.log("titleList:",titleList);
            let products = item.products;
            console.log('products:',products);
            //遍歷每一筆訂單內的每一筆產品
            products.forEach(function(item,index,array){
                //計算每一筆訂單之單一產品款式及數量
                let id = item.id;
                let title = item.title;
                let quantity = item.quantity;
                let price = item.price;
                let category = item.category;
                console.log(productItems);
                productItems.push({'id':id ,'title':title ,'quantity': quantity,'price':price,'category':category});

                console.log(item.title);
                titleStr +=
                `<p>${item.title}</p>`
            }),
            console.log(productItems);
            allProductItems.push(productItems);
            allProductItems.forEach(function(item1){
                if(item1.length === 1){

                }
                if(item1.length>1){
                item1.forEach(function(item2){
                    
                })
            }
            })

            str +=        
            `<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td class="titleList">
            ${titleStr}
            </td>
            <td>${formatTimestampToDateString(item.createdAt)}</td>
            <td class="orderStatus">
              <a href="#" id="${item.id}">${paid}</a>
            </td>
            <td>
              <input id="${item.id}" type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>`
        })
        orderList.innerHTML = str;
        console.log(allProductItems);
    })
  }
  getOrderList();
  
//不懂修改訂單狀態的邏輯
  const orderList = document.querySelector('.orderList');
orderList.addEventListener('click',function(e){
    if (e.target === document.querySelector('.orderStatus>a')){
        console.log(e.target.id);
        editOrderList(e.target.id)
    }
})


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
        if(response.data.paid === true){
            document.querySelector('.orderStatus>a').textContent= "已處理";
        }else{
            document.querySelector('.orderStatus>a').textContent= "未處理";
        }
        
      })
  }
  
const discardAll = document.querySelector('.discardAllBtn');
discardAll.addEventListener('click', function(e){
    deleteAllOrder();
    
})

  // 刪除全部訂單
  function deleteAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        orderPagetable.innerHTML = ""; 
      })
  }
  orderPagetable.addEventListener("click",function(e){
    if(e.target.value === "刪除"){
        console.log(e.target);
        let deleteTargetId = e.target.id;
        console.log(deleteTargetId);
        deleteOrderItem(deleteTargetId);
        let row = e.target.closest('tr');
        console.log(row);
        row.remove();
    }else{
        console.log("沒有點到刪除按鈕");
    }
  })
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


//時間戳記轉換為年月日格式
function formatTimestampToDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }