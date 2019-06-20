const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        orderId:"",
        date:"",
        goodsInfo:{},
        groupId:"",
        currentUser:"",
        shareUserId:"",
        isShowAddress:false,
        ruleShow:false,
        status:0,
        hours:"00",
        mins:"00",
        number:0,
        timer:null,
        secs:"00",
        addressList:[],
        userInfo:[],
        lotteryInfo:{},
        person:0,
        joinGroup:false
    },
    onShow:function(){
        this.getAddressList();
    },
    onLoad:function(options){
        console.log(options);
        if (options.orderId!=null){
            this.setData({
                orderId: options.orderId
            })
        }
        if (options.groupId!=null){
            this.setData({
                groupId: options.groupId
            })
        }
        if (options.shareUserId != null) {
            this.setData({
                shareUserId: options.shareUserId
            })
            wx.setStorageSync('shareId', options.shareUserId);
        }
        this.getDetail();
        this.getAddressList();
    },
    getAddressList(){
        util.request(api.AddressList).then(res => {
            console.log(res);
            if (res.errno == 0) {
                let _address = res.data;
                for (let i = 0; i < _address.length; i++) {
                    _address[i].checkd = false
                }
                console.log(_address);
                this.setData({
                    addressList: _address
                })
            }
        })
    },
    getDetail(){
        let that = this;
        clearInterval(that.data.timer);
        util.request(api.LotteryorderInfo, { orderId: that.data.orderId }).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    goodsInfo: res.data.goodsInfo,
                    groupId: res.data.groupId,
                    status: res.data.status,
                    orderId: res.data.orderId,
                    currentUser: res.data.currentUser,
                    joinGroup: res.data.joinGroup,
                    number: res.data.number,
                    person: res.data.person,
                    lotteryInfo: res.data.lotteryInfo,
                    date: that.getTime(new Date(res.data.goodsInfo.lotteryTime))
                })
                if (res.data.userInfo.length<5){
                    let _personList = res.data.userInfo;
                    let _num = res.data.userInfo.length;
                    let count = 5 - _num;
                    for (let i = 0; i < count;i++){
                        let obj={};
                        obj.userName ="待邀请";
                        obj.captain=false;
                        obj.userId="a"+i;
                        obj.userPicture ="../../../static/images/tuanyuan.png",
                        obj.fill=true;
                        _personList.push(obj);
                    }
                    that.setData({
                        userInfo: _personList
                    })
                }else{
                    that.setData({
                        userInfo: res.data.userInfo
                    })
                }
                clearInterval(that.data.timer);
                if (res.data.status == 0 || res.data.status == 1){
                    let nowTime = new Date().getTime();  // 获取当前的时间戳
                    if (res.data.goodsInfo.lotteryTime > nowTime){
                        clearInterval(that.data.timer);
                        that.data.timer = setInterval(function () {
                            that.daojishi();
                        }, 1000)
                    }else{

                    }
                   
                }
            }
        })
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getDetail();
        this.getAddressList();
        wx.stopPullDownRefresh();
    },
    chooseAddress() {
        this.setData({
            isShowAddress: true
        })
    },
    clickMode() {
        this.setData({
            isShowAddress: false
        })
    },
    goAddAddress() {
        wx.navigateTo({
            url: '../../addAddress/addAddress',
        })
    },
   
    checkAddress(e) {
        let that = this;
        console.log(e.currentTarget.dataset.id);
        util.request(api.Lotterysubmit,
            { addressId: e.currentTarget.dataset.id, lotteryId: that.data.goodsInfo.lotteryId, groupId: that.data.groupId, inviterId: that.data.shareUserId })
            .then(res => {
                console.log(res);
                if (res.errno === 0) {
                    let _address = that.data.addressList;
                    for (let i = 0; i < _address.length; i++) {
                        if (_address[i].id == e.currentTarget.dataset.id) {
                            _address[i].checkd = true
                        } else {
                            _address[i].checkd = false
                        }
                    }
                    that.setData({
                        addressList: _address,
                        isShowAddress: false
                    })
                    wx.showToast({
                        title: '参团成功',
                    })
                    setTimeout(function () {
                        that.getDetail()
                    }, 1000)
                }
            })

    },
    daojishi() {
        let that = this;
        let _goodsInfo = that.data.goodsInfo.lotteryTime;
        let nowTime = new Date().getTime();// 获取当前的时间戳
        let hasTime = (_goodsInfo - nowTime) / 1000;
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
                that.setData({
                    hours: hours,
                    mins: minutes,
                    secs: seconds
                })
            } else {
                console.log(22);
                clearInterval(that.data.timer);
                that.getDetail();
                
            }
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
        return month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    viewRule(){
        this.setData({
            ruleShow: true
        })
    },
    closeModal(e) {
        console.log(e);
        this.setData({
            ruleShow:false
        })
        console.log(this.data.ruleShow);
    },
    closeModals(e){
        console.log(e);
        this.setData({
            ruleShow: false
        })
        console.log(this.data.ruleShow);
    },
    noThing(e){

    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            if (res.target.dataset.type == "add") {
                return {
                    title: "快来和我一起拼团吧！",
                    path: "/pages/lottery/detail/detail?groupId=" + that.data.groupId + "&shareUserId=" + that.data.currentUser+"&orderId="+that.data.orderId
                }
            } else {
            }
        } else {
            console.log(res);
            return {
                title: "快来和我一起拼团吧！",
                path: "/pages/lottery/detail/detail?groupId=" + that.data.groupId + "&shareUserId=" + that.data.currentUser + "&orderId=" + that.data.orderId
            }
        }
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