const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({
    data: {
        addressList: [],
        addressArea:"请选择地区",
        name:"",
        phone:'',
        Address:"",
        id:"",
        provinceName:"",
        cityName:"",
        countyName:"",
        AddressLength:0,
        page:""
    },
    onLoad: function (options) {
        console.log(util.getCurrentPageUrl());
        let _page = util.getCurrentPageUrl();
        let _pages = util.getCurrentPageUrlTwo();
        console.log(util.getCurrentPageUrlTwo());
        if (options.provinceName === undefined && options.cityName === undefined) {
            console.log(111111111)
            this.setData({
                addressArea: "请选择地区",
                page: _pages
            })
        } else {
            console.log(22222222222)
            this.setData({
                addressArea: options.provinceName + options.cityName + options.countyName,
                name: options.receiveName,
                phone: options.tel,
                Address: options.detail,
                id: options.addressid,
                provinceName: options.provinceName,
                cityName: options.cityName,
                countyName: options.countyName
            })
        }
    },
    getAddressList(){
        let that = this;
        util.request(api.AddressList).then(function (res) {
            console.log(res);
            that.setData({
                AddressLength: res.data.length
            })
            
        });
    },
    bindAreaChange(e) {
        console.log(e);
        console.log(e.detail.value[0] + e.detail.value[1] + e.detail.value[2]);
        this.setData({
            addressArea: e.detail.value[0] + e.detail.value[1] + e.detail.value[2],
            provinceName: e.detail.value[0],
            cityName: e.detail.value[1],
            countyName: e.detail.value[2]
        })
    },
    textAddress(e) {
        this.setData({
            Address: e.detail.value
        })
    },
    bindName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    bindPhone(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    saveAddress(){
        let that = this;
        if (that.data.name == "") {
            wx.showToast({
                title: '姓名不能为空',
                duration: 2000,
                image: "../../images/icon-err.png"
            })
            return
        } else if (!(/^1[34578]\d{9}$/.test(that.data.phone))) {
            wx.showToast({
                title: '手机号码不正确',
                duration: 2000,
                image: "../../images/icon-err.png"
            })
            return
        } else if (that.data.addressArea == "请选择地区") {
            wx.showToast({
                title: '请选择地区',
                duration: 2000,
                image: "../../images/icon-err.png"
            })
            return
        } else if (that.data.Address == "") {
            wx.showToast({
                title: '详细地址不能为空',
                duration: 2000,
                image: "../../images/icon-err.png"
            })
            return
        } else{
            wx.showLoading({
                title: '加载中...',
            });
            util.request(api.AddressSave, 
                { 
                    id: that.data.id,
                    userName:that.data.name,
                    telNumber: that.data.phone,
                    provinceName: that.data.provinceName,
                    cityName: that.data.cityName,
                    countyName: that.data.countyName,
                    detailInfo: that.data.Address,
                    isDefault:0
                }, 'POST', 'application/json'
            ).then(function (res) {
                console.log(res);
                if (res.errmsg == "执行成功"){
                    if (that.data.page.startsWith("pages/makeOrder/makeOrder")) {
                        console.log(333333333);
                        wx.setStorageSync('addressId', res.data.id);
                        console.log(wx.getStorageSync('addressId'));
                    }
                    if (res.data.is_default==0){
                        wx.setStorageSync('addressId', res.data.id);
                    }
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000
                    })
                    console.log(wx.getStorageSync('addressId'))
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1
                        })
                        console.log(wx.getStorageSync('addressId'));
                    },1000)
                    
                }
                wx.hideLoading();
            });
        }
    }
})