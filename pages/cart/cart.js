const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        logs: [],
        num:0,
        hasGuanLi:false,
        checkAll:false,
        getTotalPrice:0,
        cartList:[],
        choosed:0
    },
    onShow: function () {
        console.log("onShow")
        this.getCartList();
        this.setData({
            choosed:0,
            getTotalPrice:0,
            hasGuanLi:false,
            checkAll: false
        })
    },
    onLoad: function () {
        console.log("onLoad")
        this.getCartList();
    },
   
    getCartList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.CartList).then(function (res) {
            console.log(res);
            if (res.errno === 0) {
                that.setData({
                    cartList: res.data.cartList,
                    num: res.data.cartList.length
                });
            }
        });
    },
    guang(){
        wx.switchTab({
            url: '../index/index',
        })
    },
    chooseGoods(e){
        console.log(e.currentTarget);
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        let list = this.data.cartList;
        let currentPrice = this.data.getTotalPrice;
        if (e.detail.value.length>0){
                if (e.currentTarget.dataset.sall==1){  // 如果商品在售并且有库存
                    currentPrice += e.currentTarget.dataset.number * e.currentTarget.dataset.price;
                }
                let _choose = this.data.choosed
                this.setData({
                    choosed: _choose + 1
                })
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id == e.currentTarget.dataset.id) {
                        list[i].choose = true;
                    }
                }
        }else{
            let _choose = this.data.choosed
            this.setData({
                choosed: _choose - 1
            })
            if (e.currentTarget.dataset.sall == 1) {  // 如果商品在售并且有库存
                currentPrice -= e.currentTarget.dataset.number * e.currentTarget.dataset.price;
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == e.currentTarget.dataset.id) {
                    list[i].choose = false;
                }
            }
        }
        console.log(currentPrice);
        this.setData({
            getTotalPrice: currentPrice.toFixed(2)*1,
            cartList:list
        })
    },
    chooseAll(e){
        console.log(e.detail.value)
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        if (e.detail.value.length>0){
            let nreArr = this.data.cartList;
            for (let i = 0; i < nreArr.length;i++){
                nreArr[i].choose=true
            }
            this.getAllPrice();
            this.setData({
                cartList: nreArr,
                choosed: nreArr.length,
                checkAll: true
            })
        }else{
            let nreArr = this.data.cartList;
            for (let i = 0; i < nreArr.length; i++) {
                nreArr[i].choose = false
            }
            this.setData({
                cartList: nreArr,
                checkAll: false,
                getTotalPrice:0,
                choosed:0
            })
        }
        console.log(this.data.checkAll);
    },
    reduce(e){
        console.log(e.currentTarget.dataset);
        let getId = e.currentTarget.dataset.id;
        let list = this.data.cartList;
        let currentPrice = this.data.getTotalPrice;
        let _productId="";
        for (let i = 0; i < list.length;i++){
            if (list[i].id == getId){
                if (list[i].number<=1){
                    return
                }else{
                    list[i].number -= 1;
                    let _number = list[i].number;
                    console.log(_number)
                    this.updateCart(list[i].product_id,list[i].goods_id,_number,list[i].id);
                    if (e.currentTarget.dataset.check==true){
                        currentPrice -= list[i].retail_price * 1
                    }
                }
            }
        }
        this.setData({
            cartList: list,
            getTotalPrice: currentPrice.toFixed(2)*1
        })
    },
    add(e){
        console.log(e.currentTarget.dataset);
        let getId = e.currentTarget.dataset.id;
        let list = this.data.cartList;
        let currentPrice = this.data.getTotalPrice;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == getId) {
                if (list[i].number >= 10) {
                    return
                } else {
                    list[i].number += 1;
                    let _number = list[i].number;
                    console.log(_number)
                    this.updateCart(list[i].product_id,list[i].goods_id,_number,list[i].id);
                    if (e.currentTarget.dataset.check == true) {
                        currentPrice += list[i].retail_price * 1
                    }
                }
            }
        }
        this.setData({
            cartList: list,
            getTotalPrice: currentPrice.toFixed(2)*1
        })
    },
    settlement(e){  //  结算
        console.log(e)
        //获取已选择的商品
        let checkedGoods = this.data.cartList.filter(function (element, index, array) {
            if (element.choose == true) {
                return true;
            } else {
                return false;
            }
        });
        console.log(checkedGoods);
        if (checkedGoods.length <= 0) {
            return false;
        }
        console.log(checkedGoods);
       
        let chooseArray=[];
        let goodsProdects=[];
        for (let i = 0; i < checkedGoods.length;i++){
            if (checkedGoods[i].goodsIsNoSell == 1 && checkedGoods[i].productNumber>0){
                let obj = {};
                obj.goodsId = checkedGoods[i].goods_id;
                obj.number = checkedGoods[i].number;
                obj.productId = checkedGoods[i].product_id;
                obj.checked = 1;
                //goodsProdects.push(checkedGoods[i].goods_id + "-" + checkedGoods[i].id);
                chooseArray.push(obj);
                goodsProdects.push(checkedGoods[i].goods_id + "-" + checkedGoods[i].product_id) 
            }else{
                util.showErrorToast("有商品无法购买!");
                return false;
            }
        }
        console.log(goodsProdects.join(','));
        let that=this;
        util.request(api.BuyAdd, { goodsProdects: goodsProdects.join(',')}, "POST", 'application/json').then(res=>{
            console.log(res);
            if (res.errno==0){
                that.setData({
                    getTotalPrice:0,
                    choosed:0
                })
                wx.navigateTo({
                    url: '../makeOrder/makeOrder?goodsProdects=' + res.data.goodsProdects
                })
            }
        })
      
    },
    updateCart: function (productId, goodsId, number, id) {
        let that = this;
        util.request(api.CartUpdate, {
            productId: productId,
            goodsId: goodsId,
            number: number,
            id: id
        },'POST', 'application/json').then(function (res) {
            console.log(res);
            if (res.errno === 0) {
                // that.setData({
                // });
            }
            // that.setData({
            //     checkedAllStatus: that.isCheckedAll()
            // });
        });

    },
    getAllPrice(){
        let totalPrice=0;
        let list = this.data.cartList;
        for (let i = 0; i < list.length;i++){
            if (list[i].goodsIsNoSell == 1 && list[i].productNumber>0){
                totalPrice += list[i].number * list[i].retail_price
            }
        }
        console.log(totalPrice);
        this.setData({
            getTotalPrice: totalPrice.toFixed(2)*1
        })
    },
    management(e){
        this.setData({
            hasGuanLi:true
        })
    },
    done(e){
        this.setData({
            hasGuanLi: false
        })
    },
    deleteGoods(){
        let productIdss = this.data.cartList.filter(function (element, index, array) {
            if (element.choose == true) {
                return true;
            } else {
                return false;
            }
        });
        console.log(productIdss);
        if (productIdss.length <= 0) {
            return false;
        }
        productIdss = productIdss.map(function (element, index, array) {
            if (element.choose == true) {
                return element.product_id;
            }
        });
        console.log(productIdss);
        let myPar = productIdss.join(",");
        console.log(myPar);
        let that =this;
        util.request(api.CartDelete, {
            productIds: myPar
        }, 'POST', 'application/json').then(function (res) {
            console.log(res);
            if (res.errno === 0) {
                let cartList = res.data.cartList.map(v => {
                    v.choose = false;
                    return v;
                });
                console.log(cartList);
                that.setData({
                    cartList: cartList,
                    getTotalPrice:0,
                    checkAll:false,
                    choosed:0
                })
            }
            // that.setData({
            //     checkedAllStatus: that.isCheckedAll()
            // });
        });
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getCartList();
        this.setData({
            choosed:0,
            getTotalPrice:0,
            checkAll: false
        })
        wx.stopPullDownRefresh();
    }
})