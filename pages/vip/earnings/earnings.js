const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    eraningList: [],
    money: ""
  },
  onLoad: function(options) {
    console.log(options);
    if (options.money != null) {
      this.setData({
        money: options.money
      })
    }
    this.getData();
  },
  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.WalletRecord).then(function(res) {
      console.log(res);
      that.setData({
        eraningList: res.data
      })
      wx.hideLoading();
    });
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
              that.setData({
                money: 0
              })
              util.showSuccessToastMessage(res.data, that.getData());
            } else {
              util.showErrorToastMessage(res.errmsg);
            }
          });
        }
      }

    })

  },
  onPullDownRefresh: function() {
    this.getData();
    wx.stopPullDownRefresh();
  }

})