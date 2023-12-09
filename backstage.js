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

        const orderList = document.querySelector('.orderList');
        console.log('orderList:',orderList);
 
        let listItems = response.data.orders;
        console.log('listItems:',listItems);
        listItems.forEach(function(item){
            let status = response.data.status;
            if(status === true){
                status = "已處理";
            }else{
                status = "未處理";
            }
            console.log(status);
            let titleStr =[];
            let id = item.id;
            console.log('id:',id);
            //const titleList = document.querySelector('.titleList');
            //console.log("titleList:",titleList);
            let products = item.products;
            console.log('products:',products);
            products.forEach(function(item,index,array){
                console.log(item.title);
                titleStr +=
                `<p>${item.title}</p>`
            }),
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
            <td>${item.createAt}</td>
            <td class="orderStatus">
              <a href="#">${status}</a>
            </td>
            <td>
              <input id="${item.id}" type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>`
        //})


            // titleList.innerHTML = titleStr;
            // console.log(titleStr);

        })
orderList.innerHTML = str;
      })
  }
  getOrderList();
  
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