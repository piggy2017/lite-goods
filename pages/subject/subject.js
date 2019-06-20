const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        hotGoods:[]
    },
    onLoad:function(){
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.SpecialTopic+"/1").then(function (res) {  // 热卖商品
            console.log(res);
            if (res.errno === 0) {
                that.setData({
                    hotGoods: res.data.specialTopic
                });
                console.log(that.data.hotGoods);
            }
            wx.hideLoading();
        });
    },
    goTop() {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    goHome(){
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onPullDownRefresh(){
        this.getData();
        wx.stopPullDownRefresh();
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            return {
                title: "购物就能返现，快来看看吧！",
                path: "/pages/subject/subject"
            }

        } else {
            console.log(res);
            return {
                title: "购物就能返现，快来看看吧！",
                path: "/pages/subject/subject"
            }
        }
    }
})