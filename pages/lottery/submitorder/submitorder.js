const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    lotteryId: 0,     //活动id
    groupId: '',        //组团id
    inviterId: '',      //邀请人id
    checkedAddress: {},
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    goodsProdects: "",
    endTime: "",     //结束时间
    lotteryInfo: "",
    orderId: '',
    change: 0
  },
  onShow: function () {
    var addressId = wx.getStorageSync('addressId');
    if (addressId) {
      this.setData({
        addressId: addressId
      });
      this.getOrderInfo();
    }
  },
  onLoad: function (options) {
    console.log(options);
    if (options.lotteryId != null) {
      this.setData({
        lotteryId: options.lotteryId
      })
    }
    this.getOrderInfo();
  },
  getOrderInfo: function () {
    let that = this;
    var url = api.LotteryInfo;
    util.request(url, {
      lotteryId: that.data.lotteryId
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        that.setData({
          checkedAddress: res.data.checkedAddress,
          goodsTotalPrice: res.data.goodsInfo.market_price,
          orderTotalPrice: res.data.lotteryInfo.price,
          actualPrice: res.data.lotteryInfo.price,
          goodsProdects: res.data.goodsInfo,
          lotteryInfo: res.data.lotteryInfo,
          endTime: res.data.lotteryInfo.endTime.substring(5, 16)
        });
        //设置默认收获地址
        if (that.data.checkedAddress.id) {
          let addressId = that.data.checkedAddress.id;
          if (addressId) {
            that.setData({ addressId: addressId });
          }
        } else {
          wx.showModal({
            title: '',
            content: '请添加默认收货地址!',
            success: function (res) {
              if (res.confirm) {
                //that.selectAddress();
              }
            }
          })
        }
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '18682721627'
    })
  },
  goPay() {
    let that = this;
    if (that.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.Lotterysubmit, {
      addressId: that.data.addressId,
      groupId: that.data.groupId,
      inviterId: that.data.inviterId,
      lotteryId: parseInt(that.data.lotteryId)
    }, 'POST').then(res => {
      console.log(res);
      if (res.errno === 0) {
        const orderId = res.data.orderId;
        if (res.errno === 0) {
          wx.showToast({
            title: '参与成功',
          })
          that.setData({
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../../lottery/lotteryorder/lotteryorder?type=0'
            });
          }, 1000)
        } else {
          wx.showToast({
            title: res.errmsg,
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },
  cancelOrder(e) {  // 取消订单
    console.log(e.currentTarget.dataset);
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '取消成功',
      })
    }, 1000)
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  }
})