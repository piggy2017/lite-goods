const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    couponList: [],
    couponOtherList: [],
    goodsIds: "",

  },
  onLoad: function (options) {
    if (options.ids != null) {
      this.data.goodsIds = options.ids;
    }
    this.getCoupon();
  },
  getCoupon() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
   // util.request(api.CouponList).then(res => {
    util.request(api.CouponList, { goodsId: that.data.goodsIds }).then(res => {
      console.log(res);
      if (res.errno == 0) {
        let _data = res.data;
        let _array = [];
        let _arrayOther = [];
        for (let i = 0; i < _data.length; i++) {
          if (_data[i].coupon_status == 1) {
            _array.push(_data[i]);
          }else{
            _arrayOther.push(_data[i]);
          }
        }
        that.setData({
          couponList: _array,
          couponOtherList: _arrayOther
        })
      }
      wx.hideLoading()
    })
  },
  useConupon(e) {
    console.log(e.currentTarget.dataset.id);
    wx.setStorageSync('couponId', e.currentTarget.dataset.id);
    wx.setStorageSync('couponText', e.currentTarget.dataset.money);
    wx.setStorageSync('couponName', e.currentTarget.dataset.name);
    wx.setStorageSync('coupon_number', e.currentTarget.dataset.number);
    wx.navigateBack({
      delta: 1
    })
  }
})