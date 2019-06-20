const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        shakeUser:{},
        shakeUserId:"",
        hasShake:false,
        user:{}
    },
    onLoad:function(options){
        console.log(options);
        if (options.userId != null && options.userId !=undefined){
            this.setData({
                shakeUserId: options.userId
            })
            wx.setStorageSync('shareId', options.userId);
        }
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoldCoinSHARESHAKE, { shakeUserId: that.data.shakeUserId}).then(res => {// that.data.shakeUserId
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    shakeUser: res.data.shakeUser,
                    user:res.data.user
                })
            }
        })
    },
    help(){
        let that = this;
        that.setData({
            hasShake: false
        })
        util.request(api.GoldtreeShareHelp, { shakeUserId: that.data.shakeUserId }).then(res => {// that.data.shakeUserId
            console.log(res);
            if (res.errno == 0) {
                util.showSuccessToast("帮好友助力成功！")
                that.setData({
                    hasShake: true
                })
            }else{
                util.showErrorToast(res.errmsg);
            }
        })
    },
    goTree(){
        wx.switchTab({
            url: '../tree/tree',
        })
    }
})