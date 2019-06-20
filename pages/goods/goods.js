const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
        goodsId:"",
        goodsInfo:{},
        myType:0,
        banner:[],
        page:1,
        currentPage: 1,
        totalPages: 1,
        joinModel:true,
        joinBuyTop:false,
        isShowServicePop:false,
        showChooseSpice:false,
        productId:null,
        allCount:0,
        serviceList:[],
        serBeforeList:[],
        commentList:[],
        specificationList:[],
        chooseSpicl:"请选择要购买的商品规格",
        starPic:[],
        imgType:0,
        starNum:5,
        cartGoodsCount:0,
        price:0,
        number:1,
        inventory:0,
        skuImg:"",
        goods: {},
        productList: [],
        checkedSpecText: '请选择规格数量',
        noScroll:"hidden",
        type:"",
        bargainId:"",
        gold:false,
        wish:false,
        shareId:"",
        userId:"",
        primary_pic_url:"",
    },
    onShow:function(){
        wx.removeStorageSync('couponId');
        wx.removeStorageSync('couponText');
        wx.removeStorageSync('coupon_number');
    },
    onLoad: function (options) {
        console.log(options);
        wx.removeStorageSync('couponId');
        wx.removeStorageSync('couponText');
        wx.removeStorageSync('coupon_number');
        this.setData({
            goodsId: options.id
        });
        if (options.type != null && options.type != undefined){
            this.setData({
                type: options.type
            })
        }
      if (options.shareId != null && options.shareId != undefined) {
          this.setData({
            shareId: options.shareId
          })
          wx.setStorageSync('shareId', options.shareId);
        }
        if (options.gold != null && options.gold != undefined) {
            this.setData({
                gold: true
            })
        }else{
            this.setData({
                gold: false
            })
        }
        if (options.wish != null && options.wish != undefined) {
            this.setData({
                wish: true
            })
        } else {
            this.setData({
                wish: false
            })
        }
        if (options.bargainId != null && options.bargainId != undefined) {
            this.setData({
                bargainId: options.bargainId
            })
        }
        console.log(this.data.gold, this.data.wish);
        this.getDetail();
        this.getComment(0);
        this.getCount();
        let that=this;
        util.request(api.CartGoodsCount).then(function (res) {
            console.log(res);
            if (res.errno === 0) {
                that.setData({
                    cartGoodsCount: res.data.cartList.length
                });
            }
        });
    },
    getDetail(){  // 获取商品详情
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoodsDetail, { id: that.data.goodsId, shareId: that.data.shareId}).then(function (res) { 
            console.log(res);
            if (res.errno==0){
                that.setData({
                    goodsInfo: res.data.info,
                    primary_pic_url: res.data.info.primary_pic_url,
                    banner: res.data.gallery,
                    productId: res.data.info.product_id,
                    serviceList: res.data.info.goodsServerIdList,
                    userId: res.data.userId,
                    specificationList: res.data.specificationList,
                    price: res.data.info.retail_price,
                    inventory: res.data.info.goods_number,
                    goods: res.data.info,
                    skuImg: res.data.info.list_pic_url,
                    productList: res.data.productList
                });
                if (res.data.info.goodsServerIdList!=null && res.data.info.goodsServerIdList.length>3){
                    that.setData({
                        serBeforeList: res.data.info.goodsServerIdList.slice(0, 3),
                    })
                }

                // console.log(res.data.specificationList)
                WxParse.wxParse('goodsDetails', 'html', res.data.info.goods_desc, that);
                wx.hideLoading();
            }
        });
    },

    getCount(){  // 获取评论数量
        let that = this;
        util.request(api.CommentCount, { goodsId: that.data.goodsId}).then(function (res) {
            console.log(res);
            if (res.errno==0){
                that.setData({
                    allCount: res.data.allCount,
                    starNum: res.data.startAverage
                })
                let starImg=[]
                if (Number.isInteger(res.data.startAverage)==true){
                    for (let i = 0; i < res.data.startAverage;i++){
                        starImg.push("../../static/images/full-star.png")
                    }
                    let starImgLength = starImg.length;
                    if (starImgLength<5){
                        let reduce = 5 - starImgLength;
                        for (let i = 0; i < reduce; i++) {
                            starImg.push("../../static/images/gray-star.png")
                        }
                    }
                }else{
                    let zheng = Math.floor(res.data.startAverage);
                    if (zheng>0){
                        let reduce = 4 - zheng;
                        for (let i = 0; i < zheng; i++) {
                            starImg.push("../../static/images/full-star.png")
                        }
                        starImg.push("../../static/images/half-star.png");
                        if (reduce>0){
                            for (let x = 0; x < reduce;x++){
                                starImg.push("../../static/images/gray-star.png")
                            }
                        }
                    }else{
                        for(let i=0;i<5;i++){
                            starImg.push("../../static/images/gray-star.png")
                        }
                    }
                }
                that.setData({
                    starPic: starImg
                })
            }
        });
    },
    checkPic(e){  // 评论是否根据图片筛选
        console.log(e.currentTarget.dataset);
        this.setData({
            imgType: e.currentTarget.dataset.type
        })
        this.getComment(e.currentTarget.dataset.type);
    },
    showServicePop(){  // 显示服务的modal
        this.setData({
            isShowServicePop:true
        })
    },
    previewImg(e){
        console.log(e.currentTarget.dataset);
        let _commentList = this.data.commentList;
        let _array=[];
        for (let i = 0; i < _commentList.length;i++){
            if (_commentList[i].id == e.currentTarget.dataset.id){
                for (let j = 0; j < _commentList[i].pic_list.length;j++){
                    _array.push(_commentList[i].pic_list[j].pic_url);
                }
            }
        }
        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: _array
        })
    },
    chooseSoeci(){
        this.setData({
            showChooseSpice:true,
            joinBuyTop:true
        })
    },
    clickModel(){
        this.setData({
            isShowServicePop: false
        }) 
    },
    clickSkuValue(e){
        console.log(e.currentTarget.dataset.nameId);
        console.log(e.currentTarget.dataset.valueId);
        let specNameId = e.currentTarget.dataset.nameId;
        let specValueId = e.currentTarget.dataset.valueId;

        //判断是否可以点击
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            if (_specificationList[i].specification_id == specNameId) {
                for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                    if (_specificationList[i].valueList[j].id == specValueId) {
                        //如果已经选中，则反选
                        if (_specificationList[i].valueList[j].checked) {
                            _specificationList[i].valueList[j].checked = false;
                        } else {
                            _specificationList[i].valueList[j].checked = true;
                          this.setData({
                            primary_pic_url: _specificationList[i].valueList[j].pic_url,
                          })
                        }
                    } else {
                        _specificationList[i].valueList[j].checked = false;
                    }
                }
            }
        }
        this.setData({
            specificationList: _specificationList
        });
        //重新计算spec改变后的信息
        this.changeSpecInfo();
        //根据选中的规格，判断是否有对应的sku信息
        let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
        console.log(checkedProduct);
        if (checkedProduct.length>0){
            console.log(checkedProduct[0].list_pic_url);
            this.setData({
                skuImg: checkedProduct[0].list_pic_url,
                inventory: checkedProduct[0].goods_number,
                price: checkedProduct[0].retail_price,
            })
        }else{
            this.setData({
                inventory: 0
            })
        }
    },
    changeSpecInfo: function () {
        let checkedNameValue = this.getCheckedSpecValue();
        //设置选择的信息
        let checkedValue = checkedNameValue.filter(function (v) {
            if (v.valueId != 0) {
                return true;
            } else {
                return false;
            }
        }).map(function (v) {
            return v.valueText;
        });
        if (checkedValue.length > 0) {
            this.setData({
                checkedSpecText: checkedValue.join('　')
            });
        } else {
            this.setData({
                checkedSpecText: '请选择规格数量'
            });
        }
    },
    //获取选中的规格信息
    getCheckedSpecValue: function () {
        let checkedValues = [];
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            let _checkedObj = {
                nameId: _specificationList[i].specification_id,
                valueId: 0,
                valueText: ''
            };
            for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                if (_specificationList[i].valueList[j].checked) {
                    _checkedObj.valueId = _specificationList[i].valueList[j].id;
                    _checkedObj.valueText = _specificationList[i].valueList[j].value;
                }
            }
            checkedValues.push(_checkedObj);
        }
        return checkedValues;
    },
    //判断规格是否选择完整
    isCheckedAllSpec: function () {
        return !this.getCheckedSpecValue().some(function (v) {
            if (v.valueId == 0) {
                return true;
            }
        });
    },
    getCheckedSpecKey: function () {
        let checkedValue = this.getCheckedSpecValue().map(function (v) {
            return v.valueId;
        });
        return checkedValue.join('_');
    },
    clickSure(){
        //提示选择完整规格
        if (!this.isCheckedAllSpec()) {
            wx.showToast({
                image: '/static/images/icon_error.png',
                title: "请选择规格!"
            });
            return false;
        }
        //根据选中的规格，判断是否有对应的sku信息
        let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
        console.log(checkedProduct);
        if (!checkedProduct || checkedProduct.length <= 0) {
            //找不到对应的product信息，提示没有库存
            wx.showToast({
                image: '/static/images/icon_error.png',
                title: "库存不足"
            });
            return false;
        }
        //验证库存
        //console.log(checkedProduct[0].goods_number, this.data.number);
        if (checkedProduct[0].goods_number < this.data.number) {
            wx.showToast({
                image: '/static/images/icon_error.png',
                title: "库存不足"
            });
            return false;
        }
        let that = this;
        if (that.data.joinModel == true && that.data.joinBuyTop==false){ // 如果是点击加入购物车按钮选择的规格
            //添加到购物车
            util.request(api.CartAdd, { goodsId: that.data.goods.id, number: that.data.number, productId: checkedProduct[0].id }, 'POST', 'application/json')
                .then(function (res) {
                    console.log(res);
                    if (res.errno == 0) {
                        wx.showToast({
                            title: '添加成功'
                        });
                        that.setData({
                            cartGoodsCount: res.data.cartTotal.goodsCount,
                            showChooseSpice: false
                        });
                    }
                });
        } else if (that.data.joinModel == false && that.data.joinBuyTop == false) { // 如果是点击立即购买按钮选择的规格
            util.request(api.BuyAdd, { goodsId: that.data.goods.id, number: that.data.number, productId: checkedProduct[0].id }, "POST", 'application/json')
                .then(function (res) {
                    console.log(res);
                    if (res.errno == 0){
                        that.setData({
                            showChooseSpice: false
                        });
                        if (that.data.type == "" && that.data.gold==false){
                            wx.navigateTo({
                                url: '../makeOrder/makeOrder?isBuy=true&inviterId=' + that.data.shareId,
                            })
                        } else if (that.data.type != ""){
                            wx.navigateTo({
                              url: '../makeOrder/makeOrder?isBuy=true&type=postage&inviterId=' + that.data.shareId,
                            })
                        } else if (that.data.gold == true){
                            wx.navigateTo({
                              url: '../makeOrder/makeOrder?isBuy=true&type=goldCoin&inviterId=' + that.data.shareId,
                            })
                        }
                        
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: res.errmsg,
                            mask: true
                        });
                    }
            });
        } else if (that.data.joinBuyTop == true){
            that.setData({
                showChooseSpice: false
            })
        }
    },
    getCheckedProductItem: function (key) {
        return this.data.productList.filter(function (v) {
            if (v.goods_specification_ids.indexOf(key) > -1) {
                return true;
            } else {
                return false;
            }
        });
    },

    clickModelt(){
        this.setData({
            showChooseSpice: false
        })
    },
    join(){
        if (this.data.checkedSpecText== '请选择规格数量'){
            this.setData({
                showChooseSpice: true,
                joinModel:true,
                joinBuyTop:false
            })
        }else{
            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "请选择规格!"
                });
                return false;
            }
            //根据选中的规格，判断是否有对应的sku信息
            let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
            console.log(checkedProduct);
            if (!checkedProduct || checkedProduct.length <= 0) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "库存不足"
                });
                return false;
            }
            //验证库存
            console.log(checkedProduct[0].goods_number, this.data.number);
            if (checkedProduct[0].goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "库存不足"
                });
                return false;
            }
            //添加到购物车
            let that=this;
            util.request(api.CartAdd, { goodsId: that.data.goods.id, number: that.data.number, productId: checkedProduct[0].id }, 'POST', 'application/json')
                .then(function (res) {
                    console.log(res);
                    if(res.errno==0){
                        wx.showToast({
                            title: '添加成功'
                        });
                        that.setData({
                            cartGoodsCount: res.data.cartTotal.goodsCount,
                            checkedSpecText:"请选择规格数量"
                        });
                    }
            });
        }
    },
    getComment(params){ // 获取评价列表
        console.log(params);
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.CommentList,
            { 
                goodsId: that.data.goodsId,
                showType: params, 
                page: that.data.page,
                size:10
            }).then(function (res) {
                console.log(res);
                if (res.errno==0){
                    that.setData({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        commentList:res.data.data
                    })
                }
                wx.hideLoading();
        });
    },
    checkBtn(e){
        console.log(e.currentTarget.dataset);
        this.setData({
            myType: e.currentTarget.dataset.type
        });
        // if (e.currentTarget.dataset.type==1){
        //     this.getComment(0)
        // }
    },
    goCart(){
        wx.switchTab({
            url: '../cart/cart',
        })
    },
    goBuy(){
        // let that = this;
        // util.request(api.UserPay, { id: 3 }).then(function (res) {
        //     console.log(res);
        // });
        if (this.data.checkedSpecText == '请选择规格数量') {
            this.setData({
                showChooseSpice: true,
                joinModel: false,
                joinBuyTop: false
            })
        } else {
            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "请选择规格!"
                });
                return false;
            }
            //根据选中的规格，判断是否有对应的sku信息
            let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
            console.log(checkedProduct);
            if (!checkedProduct || checkedProduct.length <= 0) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "库存不足"
                });
                return false;
            }
            //验证库存
            if (checkedProduct[0].goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: "库存不足"
                });
                return false;
            }
            let that = this;
            // 直接购买商品
            util.request(api.BuyAdd, { goodsId: that.data.goods.id, number: that.data.number, productId: checkedProduct[0].id }, "POST", 'application/json')
                .then(function (res) {
                    console.log(res);
                    if (res.errno == 0) {
                        that.setData({
                            showChooseSpice: false,
                            checkedSpecText: "请选择规格数量"
                        });
                        if (that.data.type == "" && that.data.gold == false) {
                            wx.navigateTo({
                                url: '../makeOrder/makeOrder?isBuy=true&inviterId=' + that.data.shareId,
                            })
                        } else if (that.data.type != "") {

                            wx.navigateTo({
                                url: '../makeOrder/makeOrder?isBuy=true&type=postage&inviterId=' + that.data.shareId,
                            })
                        } else if (that.data.gold == true) {
                            wx.navigateTo({
                                url: '../makeOrder/makeOrder?isBuy=true&type=goldCoin&inviterId=' + that.data.shareId,
                            })
                        }
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: res.errmsg,
                            mask: true
                        });
                    }
            });
        }
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
          return {
              title: "好东西与您分享！",
            path: "/pages/goods/goods?id=" + that.data.goodsId + "&shareId=" + that.data.userId
          }

        } else {
            console.log(res);
            return {
                title: "好东西与您分享！",
              path: "/pages/goods/goods?id=" + that.data.goodsId + "&shareId=" + that.data.userId
            }
        }
    },
    // 上拉加载更多
    onReachBottom: function () {
        var that = this;
        if(that.data.myType==1){
            if (that.data.currentPage < that.data.totalPages) {
                // 显示加载图标  
                wx.showLoading({
                    title: '加载中...',
                    icon: 'loading'
                })
                let nextPage = that.data.currentPage + 1 * 1;
                let _active = that.data.active;
                util.request(api.CommentList,{
                        goodsId: that.data.goodsId,
                        showType: that.data.imgType,
                        page: nextPage,
                        size: 10
                    }
                ).then(function (res) {
                    console.log(res);
                    let conArr = that.data.commentList;
                    that.setData({
                        commentList: conArr.concat(res.data.data),
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                    wx.hideLoading();
                });
            } else {
                return
            }
        }
    },
    cutNumber: function () {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
    },
    addNumber: function () {
        this.setData({
            number: this.data.number + 1
        });
    }
   
})