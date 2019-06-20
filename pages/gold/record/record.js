const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        recordList:[],
        goldCount:0
    },
    onLoad:function(){
        this.getData();
    },
    goGold(){
        wx.navigateTo({
            url: '../list/list',
        })
    },
    getData(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.GoldCoinRecord).then(res => {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    goldCount: res.data.goldCount
                })
                if (res.data.goldList.length>0){
                    let _list = res.data.goldList;
                    for(let i=0;i<_list.length;i++){
                        _list[i].createDate = _list[i].createDate.substring(0,16);
                    }
                    console.log(_list);
                    that.setData({
                        goldCount: res.data.goldCount,
                        recordList: _list
                    })
                }
               
            } 
            wx.hideLoading()
        })
    }
})