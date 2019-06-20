const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
//获取应用实例
const app = getApp()
Page({
  data: {
     recharges:[]
  },
  onLoad: function () {
    this.getViPackageList();
  },
  getViPackageList: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.UserRecharge).then(function (res) {
      console.log(res);
      if (res.data) {
        that.setData({
          recharges: res.data
        })
      }
      wx.hideLoading();
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getViPackageList();
    wx.stopPullDownRefresh();
  },

  goBuy(e) {
    let _id = e.currentTarget.dataset.orderid;
    console.log(_id);
    let that = this;
    util.request(api.UserRechargePay, {id:parseInt(_id)}, 'POST').then(res => {
      console.log(res);
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
           // resolve(res);
          },
          'fail': function (res) {
            //reject(res);
          },
          'complete': function (res) {
           // reject(res);
          }
        });  
      } else {
        util.showErrorToastMessage(res.errmsg);
      }
    });
  },
})