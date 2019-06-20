const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        logsList:[]
    },
    onLoad: function () {
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.RechargeList).then(function (res) {
            console.log(res);
            that.setData({
                logsList: res.data
            })
            wx.hideLoading();
        });
    }
})