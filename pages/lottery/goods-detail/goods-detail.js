const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var WxParse = require('../../../lib/wxParse/wxParse.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        id:"",
        banner:[],
        groupInfo:[],
        goodsInfo:{},
        serBeforeList: [],
        addressList:[],
        serviceList:[],
        orderId:"",
        lotteryInfo:{},
        isShowServicePop:false,
        isShowAddress:false,
        joinGroup:true,
        userId:""
    },
    onLoad:function(options){
        console.log(options);
        wx.removeStorageSync('couponId');
        wx.removeStorageSync('couponText');
        wx.removeStorageSync('coupon_number');
        this.setData({
            id:options.id
        })
        this.getdata();
        if (options.shareId != null && options.shareId != undefined) {
            wx.setStorageSync('shareId', options.shareId);
        }
    },
    onShow:function(){
        this.getdata();
    },
    showServicePop(e) {  // 显示服务的modal
    console.log(e);
        this.setData({
            isShowServicePop: true
        })
    },
    clickModel() {
        this.setData({
            isShowServicePop: false
        })
    },
    getdata(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.LotteryGoodsDetail,{id:that.data.id}).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    banner: res.data.gallery,
                    groupInfo: res.data.groupInfo,
                    joinGroup: res.data.joinGroup,
                    lotteryInfo: res.data.lotteryInfo,
                    serBeforeList: res.data.info.goodsServerIdList.slice(0, 3),
                    serviceList: res.data.info.goodsServerIdList,
                    goodsInfo:res.data.info,
                    userId: res.data.userId
                })
                if(res.data.orderId!=null && res.data.orderId!=""){
                    that.setData({
                        orderId:res.data.orderId
                    })
                }
                WxParse.wxParse('goodsDetails', 'html', res.data.info.goods_desc, that);
            }
            wx.hideLoading();
        });
        util.request(api.AddressList).then(res=>{
            console.log(res);
            if(res.errno==0){
                let _address = res.data;
                for (let i = 0; i < _address.length;i++){
                    _address[i].checkd=false
                }
                console.log(_address);
                that.setData({
                    addressList: _address
                })
            }
        })
    },
    clickMode(){
        this.setData({
            isShowAddress: false
        })
    },
    chooseAddress(){
        this.setData({
            isShowAddress:true
        })
    },
    checkAddress(e){
        let that=this;
        console.log(e.currentTarget.dataset.id);
        util.request(api.Lotterysubmit,
            { addressId: e.currentTarget.dataset.id, lotteryId: that.data.id, groupId: "", inviterId:""})
         .then(res=>{
            console.log(res);
             if (res.errno === 0) {
                 let _address = that.data.addressList;
                 for (let i = 0; i < _address.length; i++) {
                     if (_address[i].id == e.currentTarget.dataset.id) {
                         _address[i].checkd = true
                     } else {
                         _address[i].checkd = false
                     }
                 }
                 that.setData({
                     addressList: _address,
                     isShowAddress: false
                 })
                 wx.showToast({
                     title: '开团成功！',
                 })
                 setTimeout(function(){
                     wx.navigateTo({
                         url: '../detail/detail?orderId=' + res.data.orderId
                     })
                 },1000)
             }
        })
      
    },
    goJoin(e){
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '../detail/detail?orderId=' + e.currentTarget.dataset.id
        })
    },
    goAddAddress(){
        wx.navigateTo({
            url: '../../addAddress/addAddress',
        })
    },
    goLottery(){
        wx.navigateTo({
            url: '../detail/detail?orderId=' + this.data.orderId
        })
    },
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: "好东西与您分享！",
                path: "/pages/lottery/goods-detail/goods-detail?id=" + that.data.id + "&shareId=" + that.data.userId
            }

        } else {
            console.log(res);
            return {
                title: "好东西与您分享！",
                path: "/pages/lottery/goods-detail/goods-detail?id=" + that.data.id + "&shareId=" + that.data.userId
            }
        }
    },
})