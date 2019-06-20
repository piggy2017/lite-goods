const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        currentPage: 1,
        totalPages: 1,
        postAgeList:[],
        size: 10
    },
    onLoad:function(){
        this.getList();
    },
    getList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.PostageList,{ page: that.data.currentPage, size: that.data.size }).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages,
                    postAgeList: res.data.goodsList
                })
            }
        })
    },
    gHome() {
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
        if (that.data.currentPage < that.data.totalPages) {
            // 显示加载图标  
            wx.showLoading({
                title: '加载中...',
                icon: 'loading'
            })
            let nextPage = that.data.currentPage + 1 * 1;
            util.request(api.PostageZoneList, { page: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                let conArr = that.data.postAgeList;
                that.setData({
                    goodsList: conArr.concat(res.data.goodsList),
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages
                })
                wx.hideLoading();
            });
        } else {
            return
        }
    },
})