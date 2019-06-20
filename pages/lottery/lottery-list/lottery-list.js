const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        currentPage:1,
        totalPages:1,
        size:10,
        goodsList:[],
        timer: null,
        myType: 0
    },
    onLoad:function(){
        this.getList();
    },
    getList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        clearInterval(that.data.timer);
        util.request(api.LotteryList, { page: that.data.currentPage,size:that.data.size}).then(res=>{
            console.log(res);
            if(res.errno==0){
                let _goodsList = res.data.goodsList;
                for (let i = 0; i < _goodsList.length;i++){
                    //_goodsList[i].endTime = that.getTime(new Date(_goodsList[i].endTime));
                    _goodsList[i].hours="00";
                    _goodsList[i].min = "00";
                    _goodsList[i].sec = "00";
                }
                console.log(_goodsList);
                that.setData({
                    goodsList: _goodsList,
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages
                })
                that.data.timer = setInterval(function(){
                    that.daojishi();
                },1000)
            }
            wx.hideLoading();
        })
    },
    daojishi(){
        let that=this;
        let _goodsList = that.data.goodsList;
        for (let i = 0; i < _goodsList.length;i++){
            let nowTime = new Date().getTime();// 获取当前的时间戳
            let hasTime = (_goodsList[i].endTime - nowTime)/1000;
            if (hasTime>0){
                hasTime = parseInt(hasTime) - 1;
                let hours = Math.floor(hasTime / (1 * 60 * 60));
                let minutes = Math.floor(hasTime / (1 * 60)) % 60;
                let seconds = Math.floor(hasTime / 1) % 60;
                if (minutes < 0) minutes = "00";
                if (seconds < 0) seconds = "00";
                if (minutes > 0 && minutes < 10) {
                    minutes = "0" + minutes
                }
                if (seconds > 0 && seconds < 10) {
                    seconds = "0" + seconds
                }
                _goodsList[i].hours = hours;
                _goodsList[i].min = minutes;
                _goodsList[i].sec = seconds;
                that.setData({
                    goodsList: _goodsList
                })
            }else{
                //clearInterval(that.data.timer);
                //that.getList();
                _goodsList = _goodsList.splice(i,1);
                that.setData({
                    goodsList: _goodsList
                })
            }
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
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    checkBtn(e) {
        console.log(e.currentTarget.dataset);
        this.setData({
            myType: e.currentTarget.dataset.type
        });
    },
    gHome(){
        wx.switchTab({
            url: '../../index/index',
        })
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getList();
        wx.stopPullDownRefresh();
    },
    // 上拉加载更多
    onReachBottom: function () {
        var that = this;
        clearInterval(that.data.timer);
        if (that.data.currentPage < that.data.totalPages) {
            // 显示加载图标  
            wx.showLoading({
                title: '加载中...',
                icon: 'loading'
            })
            let nextPage = that.data.currentPage + 1 * 1;
            util.request(api.LotteryList, {page: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                let conArr = that.data.orderList; 
                let _goodsList = res.data.goodsList;
                for (let i = 0; i < _goodsList.length; i++) {
                    //_goodsList[i].endTime = that.getTime(new Date(_goodsList[i].endTime));
                    _goodsList[i].hours = "00";
                    _goodsList[i].min = "00";
                    _goodsList[i].sec = "00";
                }
                console.log(_goodsList);
                that.setData({
                    goodsList: conArr.concat(_goodsList),
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages
                })
                wx.hideLoading();
            });
        } else {
            return
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