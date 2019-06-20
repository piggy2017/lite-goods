const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        orderId: ""
    },
    onLoad:function(options){
        wx.removeStorageSync('couponId');
        wx.removeStorageSync('couponText');
        console.log(options);
        this.setData({
            orderId: options.orderId
        })
    },
    viewOrder(){
        wx.redirectTo({
            url: '../order/order-detail/order-detail?orderId='+this.data.orderId,
        })
    },
    backHome(){
        wx.switchTab({
            url: '../index/index',
        })
    }
})