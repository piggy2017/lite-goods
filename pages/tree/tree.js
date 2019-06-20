const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
    data: {
        logs: [],
        signRules:[],
        goldSingInfo:{},
        shakeTreeInfo:{},
        continuousDay:1,
        treeInfo:{},
        userGold:{},
        allSignRules:{},
        hasShake:false,
        ruleShow:false,
        goldCount:0,
        addNum:0,
        dataTime:0,
        getShareId:"",
        currentUserId:"",
        min:"00",
        miao:"00",
        timer:null,
        complete:true,
        shakeCount:0,
        clicktime:1,
        canClick:true
    },
    onLoad: function (options) {
        console.log(options);
        if (options.userId!=null){
            this.setData({
                getShareId: options.userId
            })
        }
        this.getData();
        this.refresh();
        //let _num = 0.02999999
        //console.log(_num.toFixed(2));
    },
    onShow:function(){
        this.getData();
        this.refresh();
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoldtreeInfo).then(res => {
            console.log(res);
            if (res.errno==0){
                that.setData({
                    allSignRules: res.allSignRules,
                    signRules: res.allSignRules,
                    shakeTreeInfo: res.shakeTreeInfo,
                    treeInfo: res.treeInfo,
                    userGold: res.userGold,
                    goldSingInfo: res.goldSingInfo,
                    goldCount: res.userGold.goldCount,
                    currentUserId: res.userGold.userId,
                    continuousDay: res.goldSingInfo.continuousDay,
                    shakeCount: res.shakeTreeInfo.shakeCount
                })
            }
            wx.hideLoading();
        })
    },
    shake() {
        let that = this;
        that.setData({
            hasShake: false
            //timer:null
        })
        clearInterval(that.data.timer);
        console.log(that.data.timer);
        that.setData({
            timer: null
        })
        console.log(that.data.canClick);
        if(that.data.canClick==true){
            util.request(api.GoldtreeShake).then(res => {
                console.log(res);
                if (res.errno == 0) {
                    if (res.errmsg == "用户剩余摇钱次数不足") {
                        util.showErrorToast("等会儿再来吧！")
                        //that.refresh();
                        return
                    } else if (res.errmsg == "执行成功") {
                        that.countAdd(res.addGoldCount);
                        that.setData({
                            hasShake: true,
                            canClick: false,
                            addNum: res.addGoldCount
                        })
                        let backgroundAudioManager = wx.getBackgroundAudioManager();
                        backgroundAudioManager.startTime = 0;
                        backgroundAudioManager.title = "金币音效";
                        backgroundAudioManager.src = api.Mp3;
                        backgroundAudioManager.play()
                        that.refresh();
                        setTimeout(function () {
                            that.setData({
                                canClick: true
                            })
                        }, 1000)
                    } else {
                        util.showErrorToast(res.errmsg);
                    }
                }
                //wx.hideLoading();
            })
        }else{
            console.log("disabled");
        }

    },
    refresh(){
        let that = this;
        clearInterval(that.data.timer);
        console.log(that.data.timer);
        that.setData({
            timer:null
        })
        console.log(that.data.timer);
        util.request(api.GoldRefresh).then(res=>{
            console.log(res);
            if (res.errno==0){
                if (res.data.countDonwSec > 0 && res.data.shakeCount < 5) { // 恢复一次领取
                    that.setData({
                        complete: false,
                        dataTime: res.data.countDonwSec,
                        shakeCount: res.data.shakeCount
                    })
                    clearInterval(that.data.timer);
                    that.data.timer = setInterval(function () {
                        that.daojishi()
                    }, 1000)
                }
                else if (res.data.countDonwSec == 0 && res.data.shakeCount == 5) { // 满血
                    that.setData({
                        complete: true,
                        dataTime: 0,
                        shakeCount: res.data.shakeCount
                    })
                    clearInterval(that.data.timer);
                }else{
                    that.setData({
                        shakeCount: res.data.shakeCount
                    })
                }
            }
        })
    },
    clickTime() {
    },
    goGoldList(){
        wx.navigateTo({
            url: '../gold/list/list',
        })
    },
    viewRule() {
        this.setData({
            ruleShow: true
        })
    },
    closeRule() {
        this.setData({
            ruleShow: false
        })
    },
    closerules() {
        this.setData({
            ruleShow: false
        })
    },
    goShare(){
        wx.navigateTo({
            url: '../tree-share/tree-share'
        })
    },


    daojishi(){
        let that=this;
        let hasTime = that.data.dataTime;
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
                miao: seconds,
                dataTime: hasTime
            })
        }else{
            console.log("倒计时结束");
            clearInterval(that.data.timer);
            that.refresh();
        }
    },
    signDay(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoldtreeSign).then(res=>{
            console.log(res);
            if (res.errno == 0) {
                if (res.errmsg == "今日已签到"){
                    util.showErrorToast("今日已签到")
                }else{
                    that.countAdd(res.signDetail.goldCount);
                    let _goldSingInfo = that.data.goldSingInfo;
                    _goldSingInfo.sign=true
                    that.setData({
                        continuousDay: res.signDetail.continuousDay,
                        goldSingInfo: _goldSingInfo
                    })
                }
            }
            wx.hideLoading();
        })
    },
    onPullDownRefresh() {
        // 增加下拉刷新数据的功能
        var self = this;
        self.refresh();
        self.getData();
        wx.stopPullDownRefresh();
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that=this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            if (res.target.dataset.type=="add"){
                return{
                    title:"快来帮好友助力领取金币吧！",
                    path: "/pages/tree/tree?userId=" + that.data.userGold.userId
                }
            }else{
            }
        }else{
            console.log(res);
            return {
                title: "快来帮好友助力领取金币吧！",
                path: "/pages/index/index?userId=" + that.data.userGold.userId
            }
        }
    },
    countAdd(num){
        let that=this;
        let _count = that.data.goldCount;
        let _num = num;             
        for (let i = 0; i < _num; i++) {
            setTimeout(function () {
                _count += 1;
                that.setData({
                    goldCount: _count
                })
            }, 100 * i);
        }
    }
})
