const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isBuy: false,
    buyType: '',
    checkedGoodsList: [],
    checkedAddress: {
      userName: "请添加联系人",
      telNumber: "",
      full_region: "请添加收货地址",
      detailInfo: ""
    },
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    walletDeductionPrice: 0,
    goldCoinDeductionPrice: 0,
    addressId: 0,
    useWallet: false,
    wallet: 0,
    couponId: 0,
    couponList: [],
    couponText: "选择优惠券",
    couponPrice: 0,
    payPrize: 0,
    goodsProdects: "",
    orderKind: "",
    orderId: '',
    change: 0,
    price1: 0,
    price2: 0,
    price3: 0,
    linkId: "",
    coupon_number: "",
    types: "", // 是否是金币专区和付邮得物商品
    type: "", // 是否是付邮得物的商品，为空表示不是
    offerPrice: 0, //砍价金额
    inviterId: ""//分享者id
  },
  onShow: function () {
    let couponId = wx.getStorageSync('couponId');
    let couponReduce = wx.getStorageSync('couponText');
    let coupon_number = wx.getStorageSync('coupon_number');
    let couponText = wx.getStorageSync('couponName');
    let addressId = wx.getStorageSync('addressId');
    console.log(addressId);
    if (addressId) {
      this.setData({
        addressId: addressId
      });
      this.getCheckoutInfoShow();
      //this.getCheckoutInfo();
      let that = this;
      util.request(api.AddressList).then(function (res) {
        console.log(res);
        let _list = res.data;
        for (let i = 0; i < _list.length; i++) {
          if (_list[i].id == addressId) {
            that.setData({
              checkedAddress: _list[i]
            })
          }
        }
      });
    }
    console.log(couponId, coupon_number, wx.getStorageSync('couponText'), couponText);

    if (couponId != '' && couponId != null && couponId != undefined) {  // 选择了优惠券
      this.setData({
        couponId: couponId,
        couponText: couponText,
        coupon_number: coupon_number
      })
      if (this.data.useWallet == true) {  // 使用了零钱
        if (this.data.actualPrice >= couponReduce) { // 实际支付的金额大于优惠券金额
          console.log(1)
          console.log(this.data.price1, couponReduce, this.data.actualPrice);
          let _numFiexd = this.data.actualPrice - couponReduce;
          this.setData({
            actualPrice: _numFiexd.toFixed(2) * 1
          })
        } else {// 实际支付的金额小于优惠券金额
          if ((this.data.price2 + this.data.actualPrice) <= couponReduce) {
            console.log(2)
            this.setData({
              actualPrice: 0,
              walletDeductionPrice: 0
            })
          } else {
            console.log(3)
            let _pro = this.data.actualPrice;
            this.setData({
              walletDeductionPrice: (this.data.price2 + _pro) - couponReduce,
              actualPrice: 0
              //walletDeductionPrice: 0

            })
          }
        }
      } else {  // 没有用零钱
        if (this.data.price1 >= couponReduce) {  // 实际支付的金额大于优惠券金额
          console.log(4)
          let _num = this.data.price1 - couponReduce;
          this.setData({
            actualPrice: _num.toFixed(2) * 1
          })
        } else {
          console.log(5)
          this.setData({
            actualPrice: 0
          })
        }
      }
    } else {
      console.log(6)
    }
  },
  changeUseWallet(e) {
    let that = this;
    console.log(e.detail.value);
    // 判断是否使用优惠券
    let couponId = wx.getStorageSync('couponId');
    let couponReduce = wx.getStorageSync('couponText');
    console.log(couponId, wx.getStorageSync('couponText'), couponReduce);
    if (e.detail.value) {  // 钱包true
      let _numFiexd = that.data.price1 - that.data.price2;
      that.setData({
        useWallet: true,
        actualPrice: _numFiexd.toFixed(2) * 1
      });
      if (couponId != '' && couponId != null && couponId != undefined) { // 有优惠券 并且使用钱包抵扣
        console.log(11)
        if (that.data.price1 >= couponReduce) { // 实际支付的金额大于优惠券金额
          console.log(22)
          let _price2 = that.data.price2 + couponReduce
          if (_price2 <= that.data.price1) {  // 实际支付的金额大于优惠券金额+抵扣
            console.log(23)
            let _numP = that.data.price1 - that.data.price2 - couponReduce;
            that.setData({
              actualPrice: _numP.toFixed(2) * 1
            })
          } else {
            console.log(24)
            that.setData({
              actualPrice: 0,
              walletDeductionPrice: that.data.price1 - couponReduce
            })
          }
        } else {// 实际支付的金额小于优惠券金额
          console.log(33)
          that.setData({
            actualPrice: 0
          });
        }
      } else {
        console.log(44)
        let _numFi = that.data.price1 - that.data.price2;
        that.setData({
          actualPrice: _numFi.toFixed(2) * 1
        });
      }
    } else {//  关闭钱包抵扣
      console.log(55)
      that.setData({
        useWallet: false
      });
      if (couponId != '' && couponId != null && couponId != undefined) { // 有优惠券
        console.log(66)
        if (this.data.price1 >= couponReduce) {  // 实际支付的金额大于优惠券金额
          console.log(77)
          let _priceFiexd = this.data.price1 - couponReduce;
          this.setData({
            actualPrice: _priceFiexd.toFixed(2) * 1
          })
        } else {
          console.log(88)
          this.setData({
            actualPrice: 0
          })
        }
      } else {
        console.log(99)
        that.setData({
          actualPrice: that.data.price3
        });
      }
    }

  },

  onLoad: function (options) {
    let couponId = wx.getStorageSync('couponId');
    console.log(options);
    if (options.isBuy != null) {
      this.data.isBuy = options.isBuy
    }
    if (options.type != null && options.type != undefined) {
      this.setData({
        type: options.type,
        types: options.type
      })
    }
    if (options.inviterId != null && options.inviterId != undefined) {
      this.setData({
        inviterId: options.inviterId
      })
    }
    if (options.linkId != null && options.linkId != undefined) {
      this.setData({
        linkId: options.linkId
      })
    }
    if (options.goodsProdects != null) {
      this.setData({
        goodsProdects: options.goodsProdects
      })
    }
    this.data.buyType = this.data.isBuy ? 'buy' : 'cart';
    this.getCheckoutInfo();
    this.getCoupon();

  },
  godetail(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  checkCoupon() {
    let goods = this.data.checkedGoodsList;
    let ids = "";
    for (var i = 0; i <goods.length; i++) {
      ids += goods[i].goods_id + ",";
    }
    console.log(ids);
    wx.navigateTo({
      url: '../coupon/coupon?ids=' + ids,
    })
  },
  getCheckoutInfo: function () { // 获取信息
    let that = this;
    console.log(that.data.addressId);
    var url = api.CartCheckout;
    let buyType = that.data.isBuy ? 'buy' : 'cart';
    util.request(url, {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      type: buyType,
      goodsProdects: that.data.goodsProdects,
      zoneType: that.data.type,
      linkId: that.data.linkId
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        if (res.data.offerPrice) {
          that.setData({
            offerPrice: res.data.offerPrice
          });
        };
        if (res.data.orderKind) {
          that.setData({
            orderKind: res.data.orderKind
          });
        };
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          actualPrice: res.data.actualPrice,
          wallet: res.data.walletPrice, // 钱包余额
          couponPrice: res.data.couponPrice,
          payPrize: res.data.payPrize,
          goldCoinDeductionPrice: res.data.goldCoinDeductionPrice,
          walletDeductionPrice: res.data.walletDeductionPrice,
          price1: res.data.actualPrice,
          price2: res.data.walletDeductionPrice, // 接口返回钱包能抵扣的价钱
          price3: res.data.actualPrice
        });
        console.log(that.data.checkedAddress.id)

        //设置默认收获地址
        if (res.data.checkedAddress.id) {
          console.log(77777)
          let addressId = res.data.checkedAddress.id;
          if (addressId) {
            that.setData({
              addressId: addressId,
              checkedAddress: res.data.checkedAddress,
            });
          }
        } else {
          console.log(8888)
          wx.showModal({
            title: '',
            content: '请添加默认收货地址!',
            success: function (res) {
              if (res.confirm) {
                that.selectAddress();
              }
            }
          })
        }
      }
      wx.hideLoading();
    });
  },

  getCheckoutInfoShow: function () { // 获取信息
    let that = this;
    console.log(that.data.addressId);
    var url = api.CartCheckout;
    let buyType = that.data.isBuy ? 'buy' : 'cart';
    util.request(url, {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      type: buyType,
      goodsProdects: that.data.goodsProdects,
      zoneType: that.data.type,
      linkId: that.data.linkId
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        if (res.data.offerPrice) {
          that.setData({
            offerPrice: res.data.offerPrice
          });
        };
        if (res.data.orderKind) {
          that.setData({
            orderKind: res.data.orderKind
          });
        };
        // that.setData({
        //     checkedGoodsList: res.data.checkedGoodsList,
        //     freightPrice: res.data.freightPrice,
        //     goodsTotalPrice: res.data.goodsTotalPrice,
        //     orderTotalPrice: res.data.orderTotalPrice,
        //     actualPrice: res.data.actualPrice,
        //     wallet: res.data.walletPrice, // 钱包余额
        //     couponPrice: res.data.couponPrice,
        //     payPrize: res.data.payPrize,
        //     goldCoinDeductionPrice: res.data.goldCoinDeductionPrice,
        //     walletDeductionPrice: res.data.walletDeductionPrice,
        //     price1: res.data.actualPrice,
        //     price2: res.data.walletDeductionPrice, // 接口返回钱包能抵扣的价钱
        //     price3: res.data.actualPrice
        // });
        console.log(that.data.checkedAddress.id)

        //设置默认收获地址
        if (res.data.checkedAddress.id) {
          console.log(77777)
          let addressId = res.data.checkedAddress.id;
          if (addressId) {
            that.setData({
              addressId: addressId,
              checkedAddress: res.data.checkedAddress,
            });
          }
        } else {
          console.log(8888)

        }
      }
      wx.hideLoading();
    });
  },




  selectAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  chooseAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  getCoupon() {
    let that = this;

    util.request(api.CouponList).then(res => {
      console.log(res);
      if (res.errno == 0) {
        that.setData({
          couponList: res.data
        })
      }
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '028-83365953'
    })
  },
  goPay() {
    let that = this;
    if (that.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      coupon_number: that.data.coupon_number,
      type: that.data.buyType,
      zoneType: that.data.types,
      useWallet: that.data.useWallet,
      linkId: that.data.linkId,
      inviterId: that.data.inviterId

    }, 'POST', 'application/json').then(res => {
      console.log(res);
      if (res.errno === 0) {
        wx.removeStorageSync('couponId');
        wx.removeStorageSync('couponText');
        wx.removeStorageSync('coupon_number');
        const orderId = res.data.orderInfo.id;
        let wallet = res.data.orderInfo.wallet_price;
        let actual = res.data.orderInfo.actual_price;
        if (actual == 0) { //零钱抵扣完了订单的价格
          util.request(api.PayWallet, {
            orderId: orderId
          }).then(res => {
            console.log(res);
            if (res.errno === 0) {
              wx.showToast({
                title: '零钱支付成功',
              })
              that.setData({
                payPrize: 0
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '../payResult/payResult?orderId=' + orderId
                });
              }, 1000)
            } else {
              // 跳转到订单未付款页面
              wx.showToast({
                title: '零钱支付失败',
                icon: 'none',
                duration: 500
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '..order/order-detail/order-detail?orderId=' + orderId
                });
              }, 500)
            }
          })
        } else {
          pay.payOrder(parseInt(orderId)).then(res => {
            console.log(res);
            if (res.errMsg == "requestPayment:ok") { // 支付成功
              wx.redirectTo({
                url: '../payResult/payResult?orderId=' + orderId
              });
            } else { //支付失败
              wx.redirectTo({
                url: '..order/order-detail/order-detail?orderId=' + orderId
              });
            }
          }).catch(res => {
            console.log(res);
            if (res.errMsg == "requestPayment:fail cancel") {
              wx.redirectTo({
                url: '../order/myorder/myorder?type=1'
              })
            }
          });
        }
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },

  cancelOrder(e) { // 取消订单
    console.log(e.currentTarget.dataset);
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
    setTimeout(() => {
      //wx.hideLoading();
      wx.showToast({
        title: '取消成功',
      })
    }, 1000)
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  },
})