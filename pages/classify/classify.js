const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        navList: [],
        goodsList:[],
        cateId: "",
        search:"",
        currentPage: 1,
        totalPages: 1,
        size: 10,
        sortTye:2,
        priceSort:0
    },
    onLoad:function(options){
        console.log(options);
        this.setData({
            cateId:options.id
        })
        this.getCartList();
        this.getGoodsList(options.id);
    },
    getCartList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.CatalogList).then(function (res) {  // 顶部分类导航栏
            console.log(res);
            that.setData({
                navList: res.data.categoryList
            });
            wx.hideLoading();
        });
    },
    inputFoucs(){
        console.log(2);
        wx.navigateTo({
            url: '../search/search',
        })
    },
    gosearch(){
        wx.navigateTo({
            url: '../search/search',
        })
    },
    switchCate(event) {
        console.log(event);
        var that = this;
        var currentTarget = event.currentTarget;
        that.setData({
            cateId: event.currentTarget.dataset.id,
            sortTye:2,
            priceSort: 0
        })
        if (event.currentTarget.dataset.id==1){
            util.request(api.GoodsList, { page: that.data.currentPage, size: that.data.size, name: that.data.search, isHot: 1 }).then(function (res) {  // 热卖商品
                console.log(res);
                if (res.errno === 0) {
                    that.setData({
                        goodsList: res.data.goodsList,
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    });
                }
            });
        }else{
            this.getGoodsList(event.currentTarget.dataset.id);
        }
    },
    getGoodsList: function (id) {
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request(api.GoodsList, { categoryId: id, page: that.data.currentPage, size: that.data.size, name: that.data.search, sort: "sell_volume", order:"desc"})
        .then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    goodsList: res.data.goodsList,
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages
                })
            }
            wx.hideLoading();
        })
    },
    sortFunction(id, sort,order){  // 普通商品的排序
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request(api.GoodsList, { categoryId: id, page: 1, size: that.data.size, name: that.data.search, sort: sort, order: order})
            .then(res => {
                console.log(res);
                if (res.errno == 0) {
                    that.setData({
                        goodsList: res.data.goodsList,
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                }
                wx.hideLoading()
            })
    },
    loadmore(id, sort, order){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        let nextpage=that.data.currentPage*1+1*1;
        console.log(nextpage);
        util.request(api.GoodsList, { categoryId: id, page: nextpage, size: that.data.size, name: that.data.search, sort: sort, order: order })
            .then(res => {
                console.log(res);
                if (res.errno == 0) {
                    let _goodsList = that.data.goodsList;
                    that.setData({
                        goodsList: _goodsList.concat(res.data.goodsList),
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                }
                wx.hideLoading()
            })
    },
    sortHot(sort, order,_isHot) {  // 热门商品的分类
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request(api.GoodsList, { page: that.data.currentPage, size: that.data.size, name: that.data.search, sort: sort, order: order, isHot: _isHot})
            .then(res => {
                console.log(res);
                if (res.errno == 0) {
                    that.setData({
                        goodsList: res.data.goodsList,
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    })
                }
                wx.hideLoading()
            })
    },
    sort(e){
        if (this.data.cateId==1){  // 热门商品排序
            if (this.data.sortTye == 2 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 0) {
                this.setData({
                    priceSort: 1
                })
                this.sortHot( "retail_price", "asc",1);
            } 
            else if (this.data.sortTye == 3 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 1) {
                this.setData({
                    priceSort: 2
                })
                let that = this;
                this.sortHot("retail_price", "desc",1);
            } else if (this.data.sortTye == 3 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 2) {
                this.setData({
                    priceSort: 1
                })
                this.sortHot("retail_price", "asc",1);
            } else if (e.currentTarget.dataset.type == 2){
                console.log(2);
                this.setData({
                    priceSort: 0
                })
                this.sortHot("sell_volume", "desc", 1);
            }else{
                this.setData({
                    priceSort: 0
                })
            }
        }else{
            if (this.data.sortTye == 2 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 0) {
                this.setData({
                    priceSort: 1
                })
                this.sortFunction(this.data.cateId, "retail_price", "asc");
            } 
            else if (this.data.sortTye == 3 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 1) {
                this.setData({
                    priceSort: 2
                })
                let that = this;
                this.sortFunction(this.data.cateId, "retail_price", "desc");
            } else if (this.data.sortTye == 3 && e.currentTarget.dataset.type == 3 && this.data.priceSort == 2) {
                this.setData({
                    priceSort: 1
                })
                this.sortFunction(this.data.cateId, "retail_price", "asc");
            } else if (e.currentTarget.dataset.type == 2) {
                console.log(2);
                this.setData({
                    priceSort: 0
                })
                this.sortFunction(this.data.cateId, "sell_volume", "desc");
            }
            else {
                this.setData({
                    priceSort: 0
                })
            }
        }
        this.setData({
            sortTye: e.currentTarget.dataset.type
        })
    },
        // 下拉刷新
    onPullDownRefresh: function () {
        //this.getList();
        if(this.data.cateId==1){
            if (this.data.sortTye == 2) {
                this.sortHot("sell_volume", "desc", 1);
            }
            else if (this.data.sortTye == 3 && this.data.priceSort == 1) {
                this.sortHot("retail_price", "asc", 1);
            } else if (this.data.sortTye == 3 && this.data.priceSort == 2) {
                this.sortHot("retail_price", "desc", 1);
            } 
        }else{
            if (this.data.sortTye == 2) {
                this.sortFunction(this.data.cateId, "sell_volume", "desc");
            }
            else if (this.data.sortTye == 3 && this.data.priceSort == 1) {
                this.sortFunction(this.data.cateId, "retail_price", "asc");
            } else if (this.data.sortTye == 3 && this.data.priceSort == 2) {
                this.sortFunction(this.data.cateId, "retail_price", "desc");
            }
        }
        wx.stopPullDownRefresh();
    },
    // 上拉加载更多
    onReachBottom: function () {
        let that=this;
        console.log("load more")
        if (that.data.currentPage < that.data.totalPages) {
            // let nextPage = that.data.currentPage + 1 * 1;
            // console.log(nextPage);
            // that.setData({
            //     currentPage: nextPage
            // })
            setTimeout(function(){
                if (that.data.cateId == 1) {
                    if (that.data.sortTye == 2) {
                        that.sortHot("sell_volume", "desc", 1);
                    }
                    else if (that.data.sortTye == 3 && that.data.priceSort == 1) {
                        that.sortHot("retail_price", "asc", 1);
                    } else if (that.data.sortTye == 3 && that.data.priceSort == 2) {
                        that.sortHot("retail_price", "desc", 1);
                    } 
                } else {
                    if (that.data.sortTye == 2) {
                        //that.sortFunction(that.data.cateId, "sell_volume", "desc");
                        that.loadmore(that.data.cateId, "sell_volume", "desc");
                    }
                    else if (that.data.sortTye == 3 && that.data.priceSort == 1) {
                        //that.sortFunction(that.data.cateId, "retail_price", "asc");
                        that.loadmore(that.data.cateId, "retail_price", "asc");
                    } else if (that.data.sortTye == 3 && that.data.priceSort == 2) {
                        //that.sortFunction(that.data.cateId, "retail_price", "desc");
                        that.loadmore(that.data.cateId, "retail_price", "desc");
                    }
                }
            },20)
           
        }
    }
})