
const api_path = "dodo";
const token = "3Lq8WjY22kYkRgs1bQbwxnamk642";

const orderPagetable = document.querySelector('.orderPage-table');
const orderList = document.querySelector('.orderList');
let listItems =[];

//初始化頁面
function init(){
    getOrderList();
}
init();

//修改訂單狀態-操作

orderList.addEventListener('click',function(e){
    

})

orderList.addEventListener("click",function(e){
    e.preventDefault();
    const targetClass = e.target.getAttribute('class');
    let id = e.target.getAttribute('id');
    if(e.target.value === "刪除"){
        //console.log(e.target);
        let deleteTargetId = e.target.id;
        //console.log(deleteTargetId);
        deleteOrderItem(deleteTargetId);
        let row = e.target.closest('tr');
        //console.log(row);
        row.remove();
        return;
    }    
    if (targetClass == "orderStatus"){
        let status =e.target.getAttribute('data-status');
        editOrderList(status,id);
    }
    // if(e.target === document.querySelector('.orderStatus>a')){
    //     //console.log("你點擊到訂單狀態");
    //     let editStatusId = e.target.getAttribute('id');
    //     let status = e.target.getAttribute("data-status");
    //     //console.log(status,editStatusId);
    //     editOrderList(status,editStatusId);
    //     return;
    
  })

// 刪除全部訂單-操作
const discardAll = document.querySelector('.discardAllBtn');
discardAll.addEventListener('click', function(e){
    deleteAllOrder();
})

//繪製圓餅圖-依照類別繪製
function renderC3(){
    //console.log("renderC3 listItems:",listItems);
    //物件資料搜集
    let total ={};
    listItems.forEach(function(item){
        item.products.forEach(function(productItem){
            if(total[productItem.category]==undefined){
                total[productItem.category] = productItem.price*productItem.quantity;
            }else{
                total[productItem.category] += productItem.price*productItem.quantity;
            }
        })
    })
    //console.log(total);
    //物件資料轉成陣列資料 total = {收納: 5670, 床架: 33780, 窗簾: 1200}
let categoryAry = Object.keys(total);
//console.log(categoryAry);
let newData = [];
categoryAry.forEach(function(item,index,array){
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
})
//console.log(newData);
// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: newData,
        colors:{
            "收納":"#DACBFF",
            "床架":"#9D7FEA",
            "窗簾": "#5434A7",
        }
    },
});

}

//繪製圓餅圖-依照品項營收繪製




//圓餅圖範例程式
// C3.js
// let chart = c3.generate({
//     bindto: '#chart', // HTML 元素綁定
//     data: {
//         type: "pie",
//         columns: [
//         ['Louvre 雙人床架', 1],
//         ['Antony 雙人床架', 2],
//         ['Anty 雙人床架', 3],
//         ['其他', 4],
//         ],
//         colors:{
//             "Louvre 雙人床架":"#DACBFF",
//             "Antony 雙人床架":"#9D7FEA",
//             "Anty 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
// });

// 取得訂單列表
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        //console.log(response.data);

        let str =[];
        let allProductItems = [];

        //console.log('orderList:',orderList);
        listItems = response.data.orders;
        let orderStatus;
        //console.log('listItems:',listItems);

        //遍歷每一筆訂單
        listItems.forEach(function(item){
            //let createAt = item.createAt;
            //console.log('createAt:',item.createdAt);
            //console.log('total:',item.total);
            //console.log('quantity:',item.quantity);
            //訂單狀態true&false的對應顯示文字
            if(item.paid == true){
                orderStatus = "已處理";
            }else{
                orderStatus = "未處理";
            }
            //console.log(orderStatus);
            let titleStr =[];
            let productItems =[];
            let id = item.id;
            //console.log('id:',id);
            let products = item.products;
            //console.log('products:',products);
            //遍歷每一筆訂單內的每一筆產品
            products.forEach(function(item,index,array){
                //計算每一筆訂單之單一產品款式及數量
                // let id = item.id;
                // let title = item.title;
                // let quantity = item.quantity;
                // let price = item.price;
                // let category = item.category;
                // //console.log(productItems);
                // productItems.push({'id':id ,'title':title ,'quantity': quantity,'price':price,'category':category});
                //console.log(item.title);
                titleStr +=
                `<p>${item.title}</p>`
            }),
            // //console.log(productItems);
            // allProductItems.push(productItems);
            // allProductItems.forEach(function(item1){
            //     if(item1.length === 1){

            //     }
            //     if(item1.length>1){
            //     item1.forEach(function(item2){
                    
            //     })
            // }
            // })

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
            <td >
              <a href="#" class="orderStatus" id="${item.id}" data-status="${item.paid}">${orderStatus}</a>
            </td>
            <td>
              <input id="${item.id}" type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>`
        })
        orderList.innerHTML = str;
        ////console.log(allProductItems);
        renderC3();
    })
  }
  
  



  // 修改訂單狀態
  function editOrderList(status,orderId) {
    console.log(status,orderId)
    let newStatus;
    if(status === 'true'){//由於 data-status可能是字串，你可能需要將 status 的比較改為字串 "true"
        newStatus = false;
        console.log(newStatus);
    }else{
        newStatus = true;
        console.log(newStatus)
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": orderId,
          "paid": newStatus
        }
      },
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        console.log(response.data);
        getOrderList();
        // response.data.orders.forEach(function(item){
        //     if(item.id === orderId){
        //         if(item.paid === true){
        //             document.querySelector('.orderStatus>a').textContent= "已處理";
        //         }else{
        //             document.querySelector('.orderStatus>a').textContent= "未處理";
        //         }
        //     }
        })
        // if(response.data.paid == true){
        //     document.querySelector('.orderStatus>a').textContent= "已處理";
        // }else{
        //     document.querySelector('.orderStatus>a').textContent= "未處理";
        // }
        
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
        orderList.innerHTML = ""; 
        resetC3();
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
        //console.log(response.data);
        getOrderList();
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

// 沒有資料時的 C3.js 
function resetC3(){
  newData = [];
  let chart = c3.generate({
      bindto: '#chart', // HTML 元素綁定
      data: {
          type: "pie",
          columns: newData,
          colors:{
              "收納":"#DACBFF",
              "床架":"#9D7FEA",
              "窗簾": "#5434A7",
          }
      },
  });
}