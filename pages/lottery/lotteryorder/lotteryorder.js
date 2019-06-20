const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        active:0,
        orderList:[],
        page:1,
        currentPage:1,
        totalPages:1,
        size:10
    },
    onShow: function (options){
        console.log(options);
        if (options != undefined && options.type != null && options.type != undefined){
            this.setData({
                active: options.type
            })
        }
        this.getData();
    },
    onLoad:function(options){
        console.log(options);
        this.setData({
            active:options.type
        })
        this.getData();
    },
    orderClass(e){
        console.log(e);
        this.setData({
            active: e.currentTarget.dataset.type
        });
        this.getData();
    },
    guang() {
        wx.switchTab({
            url: '../../index/index',
        })
    },
    goRecive(e){
        console.log(e.currentTarget.dataset);
        let _id = e.currentTarget.dataset.orderid;
        let _self = this;
        wx.showModal({
            title: '确认收货',
            content: '为保障您的售后权益，请收到货确认无误后，再点击收货哦！',
            confirmText: "确定",
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading({
                        title: '加载中...',
                        icon: 'loading'
                    });
                    util.request(api.OrderConfirm, { orderId: e.currentTarget.dataset.orderid }).then(function (res) {
                        console.log(res);
                        // 进入评价页面
                        wx.hideLoading();
                        wx.navigateTo({
                            url: '../comment/comment?orderId='+_id,
                        })
                    });
                   
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    goComment(e){
        console.log(e.currentTarget.dataset.orderid);
        wx.navigateTo({
            url: '../comment/comment?orderId=' + e.currentTarget.dataset.orderid
        })
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        let _active = that.data.active;
        console.log(_active);
        util.request(api.LotteryOrderList, { type: _active,page:that.data.page,size:that.data.size}).then(function (res) {
            console.log(res);
            that.setData({
                orderList: res.data.data,
                currentPage: res.data.currentPage,
                totalPages: res.data.totalPages
            })
            wx.hideLoading();
        });
    },
    orderDetail(e){
        console.log(e.currentTarget.dataset);
        let _id = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../order-detail/order-detail?orderId=' + e.currentTarget.dataset.orderid,
        })
    },
    orderCancel(e){  // 订单取消
        let _id = e.currentTarget.dataset.orderid;
        console.log(_id);
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.OrderCancel, { orderId: _id}).then(function (res) {
            console.log(res);
            wx.hideLoading();
            if (res.errno == 0) {  //需要后续的完善
                wx.showToast({
                    title: '取消成功!',
                })
                that.getData();
            }
        });
    },
    viewExpress(e){
        console.log(e.currentTarget.dataset);
        let _id = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../../order/express/express?orderId=' + e.currentTarget.dataset.orderid+"&type=lottery",
        })
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            console.log(res.target.dataset);
            return {
                title: "快来和我一起拼团吧！",
                path: "/pages/lottery/detail/detail?groupId=" + res.target.dataset.groupid + "&shareUserId=" + res.target.dataset.user + "&orderId=" + res.target.dataset.orderid
            }
        } else {

        }
    },
    goPay(e){
        console.log(e.currentTarget.dataset);
        let _id = e.currentTarget.dataset;
        if (e.currentTarget.dataset.status==4){
            wx.navigateTo({
                url: '../results/results?orderId=' + e.currentTarget.dataset.orderid,
            })
        }else{
            wx.navigateTo({
                url: '../detail/detail?orderId=' + e.currentTarget.dataset.orderid,
            })
        }
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: "好东西与您分享！",
                path: "/pages/index/index"
            }

        } else {
            console.log(res);
            return {
                title: "好东西与您分享！",
                path: "/pages/index/index"
            }
        }
    },
    // 上拉加载更多
    onReachBottom: function () {
        var that = this;
        if (that.data.currentPage < that.data.totalPages) {
            // 显示加载图标  
            wx.showLoading({
                title: '加载中...',
                icon: 'loading'
            })
            let nextPage = that.data.currentPage+1*1;
            let _active = that.data.active;
              util.request(api.LotteryOrderList, { type: _active, page: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                let conArr = that.data.orderList;
                that.setData({
                    orderList: conArr.concat(res.data.data) ,
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages
                })
                wx.hideLoading();
            });
        } else {
            return
        }
    }, 
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getData();
        wx.stopPullDownRefresh();
    }
})