const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        couponList: []
    },
    onLoad: function () {
        this.getCoupon();
    },
    getCoupon() {
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.CouponList).then(res => {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    couponList: res.data
                })
            }
            wx.hideLoading()
        })
    },
    useConupon(e) {
        console.log(e.currentTarget.dataset.names);
        console.log(e.currentTarget.dataset.id);
        let _name = e.currentTarget.dataset.names;
        if (_name.includes("新晋团员专享")){
            wx.switchTab({
                url: '../group/my-group/my-group',
            })
        }else{
            wx.switchTab({
                url: '../index/index',
            })
        }
       
    }
})