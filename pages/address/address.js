const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({
    data: {
        addressList:[],
        myAddress:1,
        choose:0
    },
    onLoad: function () {
        this.getAddressList();
    },
    onShow:function(){
        this.getAddressList();
    },
    getAddressList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.AddressList).then(function (res) {
            console.log(res);
            that.setData({
                addressList: res.data
            })
            for (var i = 0; i < res.data.length;i++){
                if (res.data[i].is_default==1){
                    console.log(i);
                    let _index=i;
                    that.setData({
                        choose: _index
                    }) 
                }
            }
            wx.hideLoading();
        });
    },
    addAddress(){
        wx.navigateTo({
            url:"../addAddress/addAddress"
        })
    },
    setDefault(e){
        console.log(e.currentTarget.dataset);
        let defaultAddress = e.currentTarget.dataset.id;
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.AddressSetDefault, { id: defaultAddress }).then(function (res) {
            console.log(res);
            if (res.data == "修改成功"){
                that.setData({
                    choose: e.currentTarget.dataset.index
                })
                wx.setStorageSync('addressId', defaultAddress);
            }
            wx.hideLoading();
        });
    },
    deleteAddress(e){
        console.log(e.currentTarget.dataset);
        let deleteId = e.currentTarget.dataset.id;
        let _id = wx.getStorageSync('addressId');
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.AddressDelete, { id: deleteId }).then(function (res) {
            console.log(res);
            if (res.errmsg == "执行成功"){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
                var newList = [];
                for (var i = 0; i < that.data.addressList.length; i++) {
                    if (that.data.addressList[i].id != e.currentTarget.dataset.id) {
                        newList.push(that.data.addressList[i])
                    }
                }
                console.log(newList);
                if (deleteId==_id){
                    wx.removeStorageSync('addressId')
                }
                that.setData({
                    addressList: newList
                })
            }
            wx.hideLoading();
        });
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.getAddressList();
        wx.stopPullDownRefresh();
    }
})