const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    pic: "",
    name: "",
    noamlVip: 0,
    hasJoin: false,
    text: "",
    vipNmae: "普通用户",
    money: 0
  },
  onLoad: function() {
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
    this.getVipInfo();

  },
  getVipInfo: function() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.GetUserInfo).then(function(res) { // 顶部分类导航栏
      console.log(res);
      that.setData({
        money: res.data.userWallet.amount
      })
      if (res.data.userInfo.vipStatus === 0) {
        that.setData({
          noamlVip: 0,
          vipNmae: res.data.userInfo.userLevelName
        })
      } else if (res.data.userInfo.vipStatus === 1) {
        that.setData({
          noamlVip: 1,
          vipNmae: res.data.userInfo.userLevelName
        })
      }else{
        that.setData({
          noamlVip: 2,
          vipNmae: res.data.userInfo.userLevelName
        })
      }
      if (res.data.userInfo.userVip === "") {
        that.setData({
          hasJoin: false,
          text: ""
        })
      } else {
        that.setData({
          hasJoin: true,
          text: res.data.userInfo.userVip
        })
      }
      wx.hideLoading();
    });
  },
  viewRights() {
    wx.navigateTo({
      url: '../rights/rights',
    })
  },
  towithdrawal() {
    wx.navigateTo({
      url: '../withdrawal/withdrawal',
    })
  },
  withdraw: function() {
    let that = this;
    wx.showModal({
      title: '提现提示',
      content: '确定要提交提现？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.Withdraw).then(function(res) {
            console.log(res);
            if (res.errno == 0) {
              util.showSuccessToastMessage(res.data,that.getVipInfo());
            } else {
              util.showErrorToastMessage(res.errmsg);
            }
          });
        }
      }

    })

  },
  joinVip:function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.getVipInfo();
    wx.stopPullDownRefresh();
  }
})