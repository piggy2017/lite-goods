const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        refundList:[],
        page: 1,
        currentPage: 1,
        totalPages: 1,
        size: 10
    },
    onLoad:function(options){
        console.log(options);
        this.getList();
    },
    onShow:function(){
        this.getList();
    },
    getList(){
        let that=this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GetRefundList, { pageNo: that.data.currentPage, pageSize: that.data.size}).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    refundList:res.data.list,
                    currentPage: res.data.currPage,
                    totalPages: res.data.totalPage
                })
            }
            wx.hideLoading();
        })
    },
    orderDetail(e) {
        console.log(e.currentTarget.dataset);
        if (e.currentTarget.dataset.type==1){
            wx.navigateTo({
                url: '../refund-detail/refund-detail?refundId=' + e.currentTarget.dataset.id,
            })
        } else if (e.currentTarget.dataset.type==0){
            wx.navigateTo({
                url: '../refund-money-detail/refund-money-detail?refundId=' + e.currentTarget.dataset.id,
            })
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
            let nextPage = that.data.currentPage + 1 * 1;
            util.request(api.OrderList, { pageNo: nextPage, size: that.data.size }).then(function (res) {
                console.log(res);
                let conArr = that.data.refundList;
                that.setData({
                    refundList: conArr.concat(res.data.list),
                    currentPage: res.data.currPage,
                    totalPages: res.data.totalPage
                })
                wx.hideLoading();
            });
        } else {
            return
        }
    }, 
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getList();
        wx.stopPullDownRefresh();
    }
})