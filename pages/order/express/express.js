const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        expressList:[],
        userInfo:{},
        shippingNo:"",
        shippingId:"",
        type:""
    },
    onLoad:function(options){
        console.log(options);
        
        if (options.isRefund == "true"){
            this.setData({
                shippingNo: options.shippingNo,
                shippingId: options.shippingId
            })
            this.getRefund();
        }
        if (options.type == "lottery"){
            this.setData({
                orderId: options.orderId,
                type: options.type
            })
            this.getLottery();
        }
        if (options.isRefund != "true" && options.type != "lottery"){
            this.setData({
                orderId: options.orderId
               
            })
            this.getData();
        }
    },
    getLottery(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.LotterysendGoods, { orderId: that.data.orderId }).then(function (res) {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    expressList: res.data.expressDetail,
                    userInfo: res.data.userInfo
                })
            }
            wx.hideLoading();
        });
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.ExpressInfo, { orderId: that.data.orderId }).then(function (res) {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    expressList: res.data.expressDetail
                })
            }
            wx.hideLoading();
        });
    },
    getRefund(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.RefundExpress, { shippingId: that.data.shippingId, shippingNo: that.data.shippingNo })
        .then(function (res) {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    expressList: res.data.expressDetail
                })
            }
            wx.hideLoading();
        });
    }
})