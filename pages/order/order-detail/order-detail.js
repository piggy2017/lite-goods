const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
//index.js
//获取应用实例
let timerr;
const app = getApp()

Page({
    data: {
        orderId: "",
        userInfo: {},
        productInfo: [],
        orderInfo: {},
        payInfo: {},
        express: {},
        status: 1,
        min: "00",
        miao: "00",
        createTime: "",
        payTime: '',
        expressTime: '',
        orderKind: "",
        refundInfo: {},
        timer: null
    },
    onShow: function() {
        this.getDetail();
    },
    onLoad: function(options) {
        console.log(options);
        this.setData({
            orderId: options.orderId
        })
        this.getDetail();
    },
    getTime(now) {
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        if (month < 10) {
            month = "0" + month
        }
        if (date < 10) {
            date = "0" + date
        }
        if (hour < 10) {
            hour = "0" + hour
        }
        if (minute < 10) {
            minute = "0" + minute
        }
        if (second < 10) {
            second = "0" + second
        }
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    getDetail() {
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        clearInterval(that.data.timer);
        that.setData({
            timer: null
        })
        util.request(api.OrderDetail, {
            orderId: that.data.orderId
        }).then(function(res) {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    userInfo: res.data.userInfo,
                    productInfo: res.data.productInfo,
                    orderInfo: res.data.orderInfo,
                    payInfo: res.data.payInfo,
                    status: res.data.orderInfo.orderStatus,
                    orderKind: res.data.orderKind,
                    createTime: that.getTime(new Date(res.data.orderInfo.createDate)),
                    createData: res.data.orderInfo.createDate,
                    refundInfo: res.data.refundInfo
                })
                if (res.data.express != null) {
                    that.setData({
                        express: res.data.express,
                    })
                }
                if (res.data.orderInfo.payDate != null) {
                    that.setData({
                        payTime: that.getTime(new Date(res.data.orderInfo.payDate))
                    })
                }
                if (res.data.orderInfo.expressDate != null) {
                    that.setData({
                        expressTime: that.getTime(new Date(res.data.orderInfo.expressDate))
                    })
                }
                clearInterval(timerr);
                if (res.data.orderInfo.orderStatus === 1) {
                    timerr = setInterval(()=> {
                        let nowTime = new Date().getTime(); // 获取当前的时间戳
                        let hasTime = (1800000 - (nowTime - that.data.createData)) / 1000;  //1800000
                        if (hasTime > 0) {
                            //console.log(hasTime);
                            hasTime = parseInt(hasTime) - 1;
                            let minutes = Math.floor(hasTime / (1 * 60)) % 60;
                            let seconds = Math.floor(hasTime / 1) % 60;
                            if (minutes <= 0) minutes = "00";
                            if (seconds <= 0) seconds = "00";
                            if (minutes > 0 && minutes < 10) {
                                minutes = "0" + minutes
                            }
                            if (seconds > 0 && seconds < 10) {
                                seconds = "0" + seconds
                            }
                            that.setData({
                                min: minutes,
                                miao: seconds
                            })
                        }else{
                            console.log("倒计时结束");
                            clearInterval(timerr);
                            let _orderInfo = that.data.orderInfo;
                            _orderInfo.orderStatus = 6;
                            that.setData({
                                orderInfo: _orderInfo
                            })
                            clearInterval(timerr);
                            timerr=null;
                            console.log(timerr);
                        }
                    }, 1000)
                }
                // that.data.timer=setInterval(function(){
                //     that.daojishi()
                // },100)
            }
            wx.hideLoading();
        });
    },
    goDetail(e) {
        console.log(e.currentTarget.dataset);
        if (this.data.orderKind == 1) {
            wx.navigateTo({
                url: '../../goods/goods?id=' + e.currentTarget.dataset.id + '&gold=1'
            })
        } else {
            wx.navigateTo({
                url: '../../goods/goods?id=' + e.currentTarget.dataset.id
            })
        }
    },
    daojishi() {
        let nowTime = new Date().getTime(); // 获取当前的时间戳
        let hasTime = (1800000 - (nowTime - this.data.createData)) / 1000;
        if (hasTime > 0) {
            hasTime = parseInt(hasTime) - 1;
            let minutes = Math.floor(hasTime / (1 * 60)) % 60;
            let seconds = Math.floor(hasTime / 1) % 60;
            if (minutes < 0) minutes = "00";
            if (seconds < 0) seconds = "00";
            if (minutes >= 0 && minutes < 10) {
                minutes = "0" + minutes
            }
            if (seconds >= 0 && seconds < 10) {
                seconds = "0" + seconds
            }
            this.setData({
                min: minutes,
                miao: seconds
            })
        } else {
            console.log("倒计时结束")
            let _orderInfo = this.data.orderInfo;
            _orderInfo.orderStatus = 6;
            console.log(_orderInfo);
            this.setData({
                orderInfo: _orderInfo
            })
            clearInterval(this.data.timer);
            console.log(this.data.timer);
            this.setData({
                timer: null
            })
            console.log(this.data.timer);
            //this.getDetail();
        }
    },
    viewExpress(e) { //查看物流
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../express/express?orderId=' + e.currentTarget.dataset.id
        })
    },
    call() {
        wx.makePhoneCall({
            phoneNumber: '028-83365953'
        })
    },
    reqRefund(e) { // 退货退款
        console.log(e.currentTarget.dataset);
        wx.navigateTo({

            url: '../refund/refund?orderId=' + e.currentTarget.dataset.id + '&goodsId=' + e.currentTarget.dataset.goodsid + "&productId=" + e.currentTarget.dataset.productid + "&status=" + this.data.status
        })
    },
    toPay() { // 支付
        let that = this;
        let orderId = that.data.orderId;
        if (that.data.payInfo.payPrice === 0 && that.data.payInfo.walletPrice != 0) { // 只使用钱包支付
            console.log("123");
            util.request(api.PayWallet, {
                orderId: orderId
            }).then(res => {
                console.log(res);
                if (res.errno === 0) {
                    wx.showToast({
                        title: '零钱支付成功',
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '../../payResult/payResult?orderId=' + orderId
                        });
                    }, 1000)
                } else {
                    // 跳转到订单未付款页面
                    util.showErrorToastMessage(res.errmsg);
                    // wx.showToast({
                    //     title: '零钱支付失败',
                    //     icon: 'none',
                    //     duration: 1000
                    // })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '../order-detail/order-detail?orderId=' + orderId
                        });
                    }, 1000)
                }
            })
        } else if (that.data.payInfo.walletPrice === 0 && that.data.payInfo.payPrice != 0) { //只使用微信支付
            console.log(222);
            pay.payOrder(parseInt(orderId)).then(res => {
                console.log(res);
                if (res.errMsg == "requestPayment:ok") { // 支付成功
                    wx.redirectTo({
                        url: '../../payResult/payResult?orderId=' + orderId
                    });
                } else { //支付失败
                    util.showErrorToastMessage(res.errmsg);
                    setTimeout(function(){
                        wx.redirectTo({
                            url: '../order-detail/order-detail?orderId=' + orderId
                        });
                    },1000)
                }

            }).catch(res => {
                util.showErrorToastMessage(res.errmsg);
                // wx.showToast({
                //     title: res.errmsg,
                //     icon: 'none',
                //     duration: 1000
                // })
            });
        } else {
            wx.showModal({
                title: '',
                content: '零钱不足以抵扣，剩余部分使用微信支付',
                success: function(res) {
                    if (res.confirm) {
                        pay.payOrder(parseInt(orderId)).then(res => {
                            console.log(res);
                            if (res.errMsg == "requestPayment:ok") {
                                wx.redirectTo({
                                    url: '../../payResult/payResult?orderId=' + orderId
                                });
                            } else {
                                util.showErrorToastMessage(res.errmsg);
                                setTimeout(function(){
                                    wx.redirectTo({
                                        url: '../order-detail/order-detail?orderId=' + orderId
                                    });
                                },1000)
                            }
                        }).catch(res => {
                          util.showErrorToastMessage(res.errmsg);
                        });
                    }
                }
            })
        }
    },
    goRecive(e) { //确认收货
        console.log(e.currentTarget.dataset);
        console.log(e.currentTarget.dataset.id);
        let _id = e.currentTarget.dataset.id;
        let _self = this;
        wx.showModal({
            title: '确认收货',
            content: '为保障您的售后权益，请收到货确认无误后，再点击收货哦！',
            confirmText: "确定",
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading({
                        title: '加载中...',
                        icon: 'loading'
                    });
                    util.request(api.OrderConfirm, {
                        orderId: e.currentTarget.dataset.id
                    }).then(function(res) {
                        console.log(res);
                        // 进入评价页面
                        wx.hideLoading();
                        wx.navigateTo({
                            url: '../comment/comment?orderId=' + _id,
                        })
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    goComment(e) { //去评价
        console.log(e.currentTarget.dataset);
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '../comment/comment?orderId=' + e.currentTarget.dataset.id
        })
    },
    cancelOrder(e) { //取消订单
        console.log(e.currentTarget.dataset);
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });

        util.request(api.OrderCancel, {
            orderId: e.currentTarget.dataset.id
        }).then(function(res) {
            console.log(res);
            if (res.errno == 0) { //需要后续的完善
                if (that.data.status == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            }
            wx.hideLoading();
        });
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        this.getDetail();
        wx.stopPullDownRefresh();
    },
    onHide: function() {
        // 页面隐藏
        console.log("onHide");
        // this.setData({
        //     timer:null
        // })
        // clearInterval(this.data.timer)
        timerr = null;
        clearInterval(timerr);
    },
    onUnload: function() {
        // 页面关闭
        console.log("onUnload");
        // this.setData({
        //     timer: null
        // })
        // clearInterval(this.data.timer);
        timerr = null;
        clearInterval(timerr);
    },

})