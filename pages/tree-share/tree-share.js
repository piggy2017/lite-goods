const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        friendsList:[],
        shrecount:0,
        user:{}
    },
    onLoad:function(options){
        console.log(options);
        this.getData();
    },
    // 下拉刷新
    onPullDownRefresh: function () {
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
                    title: "快来帮好友领取金币吧！",
                    path: "/pages/tree-friend/tree-friend?userId=" + that.data.user.userId
                }
        } else {
            console.log(res);
            return {
                title: "快来帮好友领取金币吧！",
                path: "/pages/tree-friend/tree-friend?userId=" + that.data.user.userId
            }
        }
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoldCoinfriendlist).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    friendsList: res.data.friendList,
                    user: res.data.user,
                    shrecount: res.data.friendMax
                })
            }
        })
    }
})