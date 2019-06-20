const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        goodsList: [],
        currentPage: 1,
        totalPages: 1,
        size: 10,
        tishi:"已结束，请于48小时内下单",
        end:"已失效，未在规定时限内下单",
        timer: null
    },
    onShow:function(){
        this.getList();
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
        util.request(api.BargainMyList, { page: that.data.currentPage, size: that.data.size }).then(res => {
           // console.log(res);
            if(res.errno==0){
                let _list = res.data.list;
                for (let i = 0; i < _list.length;i++){
                    _list[i].hours="00";
                    _list[i].mins = "00";
                    _list[i].secs = "00";
                }
              //  console.log(_list);
                that.setData({
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages,
                    goodsList: _list
                })
                clearInterval(that.data.timer);
                that.data.timer = setInterval(function () {
                    that.daojishi();
                }, 1000)
            }
            wx.hideLoading();
        })
    },
    guang() {
        wx.switchTab({
            url: '../../index/index',
        })
    },
    daojishi() {
        let that = this;
        let _list = that.data.goodsList;
        for (let i = 0; i < _list.length; i++) {
            let hasTime = _list[i].limitTime;
            //console.log(_list[1].limitTime);
            if (hasTime > 0 && _list[i].status==0) {
                hasTime = parseInt(hasTime) - 1;
                //console.log(hasTime);
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
                _list[i].hours = hours;
                _list[i].mins = minutes;
                _list[i].secs = seconds;
                _list[i].limitTime = hasTime;
                that.setData({
                    goodsList:_list
                })
            } else if (hasTime<=0 && _list[i].status == 0) {
                _list[i].status=1;
                that.setData({
                    goodsList: _list
                })
            }
        }
    },
    //  分享功能
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target.dataset)
            if (res.target.dataset.type == "add") {
                return {
                    title: "快来帮我砍价吧！",
                    path: "/pages/wish/detail/detail?id=" + res.target.dataset.id
                }
            } else {
                //  console.log(res);
                return {
                    title: "快来帮我砍价吧！",
                    path: "/pages/index/index"
                }
            }
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getList();
        wx.stopPullDownRefresh();
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
            let nextPage = that.data.currentPage + 1 * 1;
            util.request(api.BargainMyList, { page: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                if (res.errno == 0) {
                    let conArr = that.data.goodsList;
                    let _list = res.data.list;
                    for (let i = 0; i < _list.length; i++) {
                        _list[i].hours = "00";
                        _list[i].mins = "00";
                        _list[i].secs = "00";
                        _list[i].percent = _list[i].bargainPrice / _list[i].price
                    }
                    console.log(_list);
                    that.setData({
                        goodsList: conArr.concat(_list),
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                }
                wx.hideLoading();
            });
        } else {
            return
        }
    },

  getOrder(e) {

    wx.redirectTo({
      url: '../../order/order-detail/order-detail?orderId=' + e.currentTarget.dataset.id
    });
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