const util = require('../../utils/util.js');
const api = require('../../config/api.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navUrl: '',
        code: ''
    },
    onLoad: function (options) {
        let that = this;
        wx.login({
            success: function (res) {
                console.log(res);
                if (res.code) {
                    that.setData({
                        code: res.code
                    })
                }
            }
        });
        console.log(wx.getStorageSync("navUrl"));
        if (wx.getStorageSync("navUrl")) {
            that.setData({
                navUrl: wx.getStorageSync("navUrl")
            })
        } else {
            that.setData({
                navUrl: '/pages/index/index'
            })
        }

        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');
        if (userInfo && token) {
            return;
        }
    },
    bindGetUserInfo: function (e) {
        console.log(e);
        let that = this;
        console.log(that.data.code);
        let _shareId = wx.getStorageSync('shareId');
        console.log(_shareId);
        if (e.detail.errMsg == "getUserInfo:ok"){
            //登录远程服务器
            if (that.data.code) {
                util.request(api.AuthLoginByWeixin, {
                    code: that.data.code,
                    userInfo: e.detail,
                    inviter_userId: _shareId
                }, 'POST', 'application/json').then(res => {
                    console.log(res);
                    if (res.errno === 0) {
                        wx.removeStorageSync('shareId');
                        //存储用户信息
                        wx.setStorageSync('userInfo', res.data.userInfo);
                        wx.setStorageSync('token', res.data.token);
                        wx.setStorageSync('userId', res.data.userId);
                        wx.setStorageSync('openId', res.data.openId);
                        console.log(wx.getStorageSync("navUrl"));
                        console.log(that.data.navUrl);
                        if (that.data.navUrl && that.data.navUrl.includes('pages/index/index')) {
                            wx.switchTab({
                                url: that.data.navUrl,
                            })
                        } else if (that.data.navUrl && that.data.navUrl.includes('pages/cart/cart')) {
                            console.log("cart");
                            wx.switchTab({
                                url: "/pages/cart/cart"
                            })
                        }
                        else if (that.data.navUrl && that.data.navUrl.includes('pages/center/center')) {
                            console.log("center");
                            wx.switchTab({
                                url: "/pages/center/center"
                            })
                        }
                        else if (that.data.navUrl && that.data.navUrl.includes('pages/tree/tree')) {
                            console.log("tree");
                            wx.switchTab({
                                url: "/pages/tree/tree"
                            })
                        } else if (that.data.navUrl && that.data.navUrl == 'pages/auth/auth'){
                            wx.switchTab({
                                url: "/pages/index/index"
                            })
                        }
                        else if (that.data.navUrl && that.data.navUrl.includes('pages/group/my-group/my-group')) {
                            wx.switchTab({
                                url: "/pages/group/my-group/my-group"
                            })
                        }
                        else if (that.data.navUrl) {
                            console.log(that.data.navUrl);
                            let newUrl = that.data.navUrl.substring(6);
                            console.log(newUrl);
                            wx.redirectTo({
                                url: "../" + newUrl,
                            })
                        }
                    } else {
                        // util.showErrorToast(res.errmsg)
                        wx.showModal({
                            title: '提示',
                            content: res.errmsg,
                            showCancel: false
                        });
                        wx.login({
                            success: function (res) {
                                console.log(res);
                                if (res.code) {
                                    that.setData({
                                        code: res.code
                                    })
                                }
                            }
                        });
                    }
                });
            }
        }else{
            console.log("你点了拒绝.")
        }
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})