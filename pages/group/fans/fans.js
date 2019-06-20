const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        bindFans:0,
        totalFans:0,
        totalNumber:0,
        userId:"",
        userInfo:[]
    },
    onLoad:function(){
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.UserteamGroupInfo).then(res => {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    bindFans: res.data.bindFans,
                    totalFans: res.data.totalFans,
                    totalNumber: res.data.totalNumber,
                    userId: res.data.userId,
                    userInfo: res.data.userInfo
                })
            }
            wx.hideLoading();
        });
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            return {
                title: "购物就能返现，快来看看吧",
                path: "/pages/group/my-group/my-group?shareId=" + that.data.userId
            }

        } else {
            console.log(res);
            return {
                title: "购物就能返现，快来看看吧",
                path: "/pages/group/my-group/my-group?shareId=" + that.data.userId
            }
        }
    },
})