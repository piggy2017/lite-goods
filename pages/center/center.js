const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({
  data: {
    logs: [],
    userInfo:{},
    userWallet:{},
    refund:0,
    unGet:0,
    unPay:0,
    unSend:0,
    pic: "",
    name: ""
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
  onShow() {
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
  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
    util.request(api.GetUserInfo, {}).then(function (res) {
      console.log(res);
      that.setData({
        userInfo: res.data.userInfo,
          refund: res.data.orderNumber.refund,
          unGet: res.data.orderNumber.unGet,
          unPay: res.data.orderNumber.unPay,
          unSend: res.data.orderNumber.unSend,
        userWallet: res.data.userWallet
      })
      wx.hideLoading();
    });
  },
  viewRights() {
    wx.navigateTo({
      url: '../vip/rights/rights',
    })
  },
  viewInfo() {
    wx.navigateTo({
      url: '../vip/vipInfo/vipInfo',
    })
  },
    call(){
        wx.makePhoneCall({
            phoneNumber: '028-83365953'
        })
    },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getData();
    wx.stopPullDownRefresh();
  }
})