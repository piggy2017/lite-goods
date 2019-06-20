const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        bargainListId:"",
        nowStatus:"“我正在许愿这个商品，快来帮我达成愿望”",
        bargainTotalPrice:0,
        goodsInfo:{},
        bargainUserInfo:{},
        percent:0,
        userList:[],
        productId:"",
        join:false,
        toastShow:false,// 是否显示toast提示弹框
        ruleShow: false,
        status:0,
        myInfo:{},
        shareId:"",
        timer:null,
        reduce:0,
        endTime:0,
        hours:"00",
        mins:"00",
        srcs:"00",
        currentUserId:""
    },
    onShow:function(){
        console.log(11111)
        this.getData();
    },
    onLoad:function(options){
        console.log(options);
        if (options.shareId != null && options.shareId != undefined && options.shareId !=""){
            wx.setStorageSync('shareId', options.shareId);
            this.setData({
                shareId: options.shareId
            })
        }
        this.setData({
            bargainListId:options.id
        })
        console.log(22222)
        this.getData();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        clearInterval(that.data.timer)
        util.request(api.BargainDetail, { bargainListId: that.data.bargainListId}).then(res=>{
            console.log(res);
            if(res.errno==0){
                let _persent = res.data.bargainTotalPrice*100/res.data.goodsInfo.goodsPrice;
                console.log(_persent);
                that.setData({
                    goodsInfo: res.data.goodsInfo,
                    bargainUserInfo: res.data.bargainUserInfo,
                    myInfo: res.data.myInfo,
                    bargainTotalPrice: res.data.bargainTotalPrice,
                    status: res.data.status,
                    join: res.data.join,
                    endTime:res.data.time,
                    productId: res.data.productId,
                    userList: res.data.userList,
                    currentUserId: res.data.myInfo.userId,
                    percent: _persent
                })
                clearInterval(that.data.timer);
                if (res.data.status == 0 && res.data.time>0){
                    clearInterval(that.data.timer);
                    that.data.timer = setInterval(function () {
                        that.daojishi()
                    }, 1000)
                }
                if (res.data.status == 0){
                    that.setData({
                        nowStatus:"“我正在许愿这个商品，快来帮我达成愿望”"
                    })
                }else{
                    that.setData({
                        nowStatus: "“谢谢大家的支持，我已低价拿到该商品”"
                    })
                }
            }
            wx.hideLoading()
        })
    },
    byMySelf(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.BargainHelp, { bargainListId: that.data.bargainListId}).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    reduce: res.data.price,
                    toastShow:true
                })
                setTimeout(function(){
                    that.getData()
                },1500)
            }else{
                util.showErrorToastMessage(res.errmsg);
            }
            wx.hideLoading()
        })
    },
    joinArgen(){
        wx.navigateTo({
            url: '../wish-list/wish-list',
        })
    },
    viewRule() {
        this.setData({
            ruleShow: true
        })
    },
    helpReduce(){
        let that = this;
        // wx.showLoading({
        //     title: '加载中...',
        //     icon: 'loading'
        // });
        util.request(api.BargainHelp, { bargainListId: that.data.bargainListId }).then(res => {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    reduce: res.data.price,
                    toastShow: true
                })
                setTimeout(function () {
                    that.getData()
                }, 1500)
            }else{
                util.showErrorToastMessage(res.errmsg);
            }
            //wx.hideLoading()
        })
    },
    closeModals(){
        this.setData({
            toastShow:false
        })
    },
    goDetail(){
        wx.navigateBack({
            delta:1
        })
    },
    closeRule(){
        this.setData({
            ruleShow: false
        })
    },
    closerules(){
        this.setData({
            ruleShow: false
        })
    },
    goBuy(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.BargainSettlement, { bargainListId: that.data.bargainListId}).then(res=>{
            console.log(res);
            if(res.errno==0){
                wx.navigateTo({
                  url: '../../makeOrder/makeOrder?isBuy=true&type=bargain&goodsProdects=' + that.data.productId + '&linkId=' +           that.data.bargainListId,
                })
            }
        })
    },
    closeModal(){
        this.setData({
            toastShow: false
        })
    },

    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
                return {
                    title: "快来帮我砍价吧！",
                    path: "/pages/wish/detail/detail?id=" + that.data.bargainListId + "&shareId=" + this.data.currentUserId
                    //path: "/pages/wish/detail/detail?bargainListId=" + that.data.bargainListId 
                }
        } else {
            console.log(res);
            return {
                title: "快来帮我砍价吧！",
                path: "/pages/wish/detail/detail?id=" + that.data.bargainListId + "&shareId=" + this.data.currentUserId
                //path: "/pages/wish/detail/detail?bargainListId=" + that.data.bargainListId 
            }
        }
    },
    daojishi() {
        let that = this;
        let hasTime = that.data.endTime;
        if (hasTime > 0) {
            hasTime = parseInt(hasTime) - 1;
            let hours = Math.floor(hasTime / (1 * 60 * 60));
            let minutes = Math.floor(hasTime / (1 * 60)) % 60;
            let seconds = Math.floor(hasTime / 1) % 60;
            if (minutes <= 0) minutes = "00";
            if (seconds <= 0) seconds = "00";
            if (hours <= 0) hours = "00";
            if (minutes > 0 && minutes < 10) {
                minutes = "0" + minutes
            }
            if (seconds > 0 && seconds < 10) {
                seconds = "0" + seconds
            }
            this.setData({
                hours: hours,
                mins: minutes,
                secs: seconds,
                endTime: hasTime
            })
        } else {
            console.log("倒计时结束");
            clearInterval(that.data.timer);
            this.getData();
            //that.refresh();
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getData();
        wx.stopPullDownRefresh();
    },
    onHide: function () {
        // 页面隐藏
        console.log("onHide")
        clearInterval(this.data.timer)
    },
    onUnload: function () {
        // 页面关闭
        console.log("onUnload")
        clearInterval(this.data.timer);
    }
})