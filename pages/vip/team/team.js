const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        pic:"",
        name:"",
        num:10,
        money:0,
        userId:"",
        teamList:[]
    },
    onLoad: function () {
        let userPic = wx.getStorageSync('userInfo');
        console.log(userPic);
        console.log(app.globalData.userInfo);
        if (app.globalData.userInfo != null) {
            this.setData({
                pic: app.globalData.userInfo.avatarUrl,
                name: app.globalData.userInfo.nickName
            })
        } else if (app.globalData.userInfo == null) {
            let userPic = wx.getStorageSync('userInfo');
            this.setData({
                pic: userPic.avatarUrl,
                name: userPic.nickName
            })
        }
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.UserteamList).then(function (res) {
            console.log(res);
            that.setData({
                teamList: res.data.userTeam,
                userId:res.data.userId
            })
            wx.hideLoading();
        });
        util.request(api.UsercashbackList).then(function (res) {
            console.log(res);
              if(res){
                that.setData({
                  money: res
                })
               
              }
        
        });
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
                return {
                    title: "这儿很多好东西，快来看看吧！",
                    path: "/pages/index/index?userId=" + this.data.userId
                }
        } else {
            console.log(res);
            return {
                title: "这儿很多好东西，快来看看吧！",
                path: "/pages/index/index?userId=" + this.data.userId
            }
        }
    },

})