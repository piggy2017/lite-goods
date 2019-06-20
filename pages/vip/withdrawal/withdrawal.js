const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        tixianList:[]
    },
    onLoad: function () {
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.WithdrawList).then(function (res) { 
            console.log(res);
            that.setData({
                tixianList:res.data
            })
            wx.hideLoading();
        });
    },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getData();
    wx.stopPullDownRefresh();
  }
   
})