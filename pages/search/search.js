const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        search:"",
        hotGoods:[],
        currentPage: 1,
        totalPages: 1,
        size: 10
    },
    recharge() {
        wx.navigateTo({
            url: '../recharge/recharge',
        })
    },
    
    bindKeyInput(e){
        console.log(e.detail.value);
        let str = util.filterEmoji(e.detail.value);
        this.setData({
            search: util.filterSpace(str)
        })
    },
    goback(){
        wx.navigateBack({
            delta: 1
        })
    },
    search(){
        let that = this;
        if (that.data.search==''){
            return
        }else{
            wx.showLoading({
                title: '加载中...',
                icon: 'loading'
            });
            util.request(api.GoodsList, { name: that.data.search, page: that.data.currentPage, size: that.data.size })
            .then(res => {
                console.log(res);
                if (res.errno == 0) {
                    that.setData({
                        hotGoods: res.data.goodsList,
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                }
                wx.hideLoading();
            })
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.search();
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
            util.request(api.GoodsList, { name: that.data.search,page: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                let conArr = that.data.hotGoods;
                let _goodsList = res.data.goodsList;
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
    back(){
        wx.navigateBack({
            delta:1
        })
    }
})