const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        invite:"",
        level:1,
        bindFans:false,
        person:5,
        totalFans:0,
        fansInfo:[],
        userId:"",
        percent:0,
        invitePerson:0,
        isFocus:false,
        endTime:"",
        ruleShow:false,
        hasGet: false,
        inviteModel:false,
        invitecode:"",
        money:0,
        shareId:"",
        cashBack:"",
        coupon:{},
        showGetCoupon:false,
        hotGoods:[]
    },
    onShow:function(){
        this.getData();
        this.getNewCoupon();
        console.log(this.data.hasGet, this.data.bindFans);
        if (this.data.hasGet == false && this.data.bindFans == true) { // 绑定了上级并且还没有领取优惠券
            this.setData({
                showGetCoupon:true
            })
        }else{
            this.setData({
                showGetCoupon: false
            })
        }
    },
    onLoad:function(options){
        console.log(options);
        if (options.shareId != null && options.shareId != undefined) {
            this.setData({
                shareId: options.shareId
            })
            wx.setStorageSync('shareId', options.shareId);
        }
        this.getData();
        this.getNewCoupon();
    },
    getNewCoupon(){
        let that=this;
        util.request(api.CouponnewUser).then(res=>{
            console.log(res);
            if(res.errno==0){
                if(res.data.have==false){
                    that.setData({
                        hasGet: res.data.have,
                        money: res.data.coupon.type_money,
                        coupon: res.data.coupon
                    })
                }else{
                    that.setData({
                        hasGet: res.data.have
                    })
                }
            }
        })
    },
    goBook(){
        wx.navigateTo({
            url: '../instructions/instructions',
        })
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.UserteamGroup).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    invite: res.data.invite,
                    level: res.data.level,
                    person: res.data.person, 
                    totalFans: res.data.totalFans,
                    bindFans: res.data.bindFans,
                    userId: res.data.userId,
                    fansInfo: res.data.fansInfo,
                    invitePerson: res.data.invitePerson,
                    cashBack: res.data.cashBack,
                    vip: res.data.vip,
                    endTime: that.getTime(new Date(res.data.vipEndTime)),
                    percent: (res.data.totalFans / res.data.person)*100
                })
            }
            wx.hideLoading()
        });

        util.request(api.IndexUrlNewUserGoods).then(function (res) {  // 热卖商品
            console.log(res);
            if (res.errno === 0) {
                that.setData({
                    hotGoods: res.data.hotGoodsList
                });
            }
        });
    },
    copy() {
        let _invite = this.data.invite;
        wx.setClipboardData({
            data: _invite,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
    },
    goRights(){
        wx.navigateTo({
            url: '/pages/vip/rights/rights',
        })
    },
    closeGet(){
        this.setData({
            showGetCoupon: false
        })
    },
    showShareModel(){
        this.setData({
            inviteModel:true
        })
    },
    closeInvite(){
        this.setData({
            inviteModel:false
        })
    },
    goCharge(){
        wx.navigateTo({
            url: '/pages/vip/recharge/recharge',
        })
    },
    reciveCoupon(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.CouponnewUserReceive).then(res => {
            console.log(res);
            if (res.errno == 0) {
                util.showSuccessToast("领取成功！")
                that.setData({
                    showGetCoupon: false
                })
            } else {
                util.showErrorToastMessage(res.errmsg);
            }
            wx.hideLoading();
        })
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
    showModel(){
        this.setData({
            ruleShow:true,
            isFocus:true
        })
    },
    closeRule(){
        this.setData({
            ruleShow: false,
            isFocus:false
        })
    },
    bindcode(e){
        console.log(e);
        this.setData({
            invitecode: e.detail.value
        })
    },
    writeDone(){
        console.log(this.data.invitecode);
        let _code = this.data.invitecode;
      let that = this;
        if (_code.length!=6){
            util.showErrorToastMessage("邀请码格式不正确")
            return false
        }else{
            util.request(api.UserBindInviteNo,{code:_code}).then(res=>{
                console.log(res);
                if(res.errno==0){
                    util.showSuccessToast("领取成功！")
                    that.setData({
                        ruleShow:false,
                        isFocus:false
                    })
                }else{
                    util.showErrorToastMessage(res.errmsg);
                }
            })
        }
    },
    goFans(){
        wx.navigateTo({
            url: '../fans/fans',
        })
    },
    saveImg(){
        let downloadUrl ="http://img.tracenet.cn/bg35.jpg";
        if (!wx.saveImageToPhotosAlbum) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return;
        }
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
        wx.getSetting({
            success(res) {
                console.log("getSetting: success");
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    console.log("1-没有授权《保存图片》权限");

                    // 接口调用询问  
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log("2-授权《保存图片》权限成功");
                            util.downloadImage(downloadUrl);
                        },
                        fail() {
                            // 用户拒绝了授权  
                            console.log("2-授权《保存图片》权限失败");
                            // 打开设置页面  
                            wx.openSetting({
                                success: function (data) {
                                    console.log("openSetting: success");
                                },
                                fail: function (data) {
                                    console.log("openSetting: fail");
                                }
                            });
                        }
                    })
                } else {
                    console.log("1-已经授权《保存图片》权限");
                    util.downloadImage(downloadUrl)
                }
            },
            fail(res) {
                console.log("getSetting: success");
                console.log(res);
            }

        })  
    },
    onPullDownRefresh() {
        this.getData();
        this.getNewCoupon();
        console.log(this.data.hasGet, this.data.bindFans)
        if (this.data.hasGet == false && this.data.bindFans == true) { // 绑定了上级并且还没有领取优惠券
            this.setData({
                showGetCoupon: true
            })
        } else {
            this.setData({
                showGetCoupon: false
            })
        }
        wx.stopPullDownRefresh();
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            that.setData({
                inviteModel: false
            })
            return {
                title: "购物就能返现，快来看看吧！",
                path: "/pages/group/my-group/my-group?shareId=" + that.data.userId
            }
           
        } else {
            console.log(res);
            return {
                title: "购物就能返现，快来看看吧！",
                path: "/pages/group/my-group/my-group?shareId=" + that.data.userId
            }
        }
    },
})