const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        orderId:"",
        winner:{},
        goodsInfo:{},
        ruleShow: false,
    },
    onLoad:function(options){
        console.log(options);
        if (options.orderId != null) {
            this.setData({
                orderId: options.orderId
            })
        }
        this.getData();
    },
    viewRule(){
        this.setData({
            ruleShow: true
        })
    },
    closeModal(e) {
        console.log(e);
        this.setData({
            ruleShow: false
        })
        console.log(this.data.ruleShow);
    },
    closeModals(e) {
        console.log(e);
        this.setData({
            ruleShow: false
        })
        console.log(this.data.ruleShow);
    },
    goGroup(){
        wx.navigateTo({
            url: '../lottery-list/lottery-list',
        })
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.LotteryorderInfo, { orderId: that.data.orderId }).then(res => {
            console.log(res);
            if (res.errno == 0) {
               that.setData({
                   winner: res.data.winner,
                   goodsInfo: res.data.goodsInfo
               })
            }
        })
    }
})