const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      wlad: {
          adData: {},
          ad: {
              banner: ["banner"], //是否展示banner⼴广告，如不不需展示删掉该字段即可
              insert: "insert", //是否展示插屏⼴广告，如不不需展示删掉该字段即可
              fixed: "fixed" //是否展示右下⻆角悬浮⼴广告，如不不需展示删掉该字段即可
          }
      },
      motto: 'Hello World',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      navList:[],
      currentCategory:{},
      banner:[],
      activity_one:{},
      activity_two:{},
      hotGoods:[]
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  linkTo:function(e){
     console.log(e.currentTarget.dataset);
     if(e.currentTarget.dataset.type==1){
       //固定跳转
       wx.switchTab({
         url: "../"+e.currentTarget.dataset.link
       })
     }else{
       wx.navigateTo({
         url: "../"+e.currentTarget.dataset.link,
       })
     }
 
  },


  onShow:function(){

    this.getCatalog();
  },
  onLoad: function (options) {
      console.log(options);
      if (options.userId != null && options.userId != undefined && options.userId != ""){
          wx.setStorageSync('shareId', options.userId);
      }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
      this.getCatalog();
  },
    getCurrentCategory: function (id) {
        let that = this;
        util.request(api.CatalogCurrent, { id: id })
            .then(function (res) {
                console.log(res);
                that.setData({
                    currentCategory: res.data.currentCategory
                });
            });
    },
    onPullDownRefresh() {
        // 增加下拉刷新数据的功能
        var self = this;
        self.getCatalog();
        wx.stopPullDownRefresh();
    },
    getCatalog: function () {
        //CatalogList
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.CatalogList).then(function (res) {  // 顶部分类导航栏
            console.log(res);
            that.setData({
                navList: res.data.categoryList,
                currentCategory: res.data.currentCategory
            });
            wx.hideLoading();
        });
        util.request(api.IndexUrlBanner).then(function (res) {  // banner 
            console.log(res)
            if (res.errno === 0) {
            
                that.setData({
                    banner: res.data.banner
                });
              if (res.data.activity_one){
                that.setData({
                  activity_one: res.data.activity_one,
                  activity_two: res.data.activity_two,
                });
              }
            }
        });
        util.request(api.IndexUrlHotGoods).then(function (res) {  // 热卖商品
            console.log(res);
            if (res.errno === 0) {
                that.setData({
                    hotGoods: res.data.hotGoodsList
                });
            }
        });
    },
    switchCate(event){
        console.log(event);
        var that = this;
        var currentTarget = event.currentTarget;
        // if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
        //     return false;
        // }else{

        // }
         this.getCurrentCategory(event.currentTarget.dataset.id);
         setTimeout(function(){
            wx.navigateTo({
                url: '../classify/classify?id=' + event.currentTarget.dataset.id,
            })
         },50)
    },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
