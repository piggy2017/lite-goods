const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        shippingNumber:"",
        shippingCompony:"",
        shippingId:0,
        refundId:0,
        index: 0,
        chooseShippingArray:"",
        chooseShippingId:"",
        array: []
    },
    onLoad:function(options){
        this.setData({
            refundId: options.refundId
        })
        this.getShippingList();
    },
    getShippingList(){
        let that=this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        })
        util.request(api.OrderExpressList).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    array:res.data,
                    chooseShippingArray: res.data[0].name,
                    chooseShippingId: res.data[0].id
                })
            }
            wx.hideLoading();
        })
    },
    bindName(e){
        this.setData({
            shippingNumber: e.detail.value
        })
    },
    bindCompony(e){
        this.setData({
            shippingCompony: e.detail.value
        })
    },
    scanning(){
        let that=this;
        wx.scanCode({
            success:function(res){
                console.log(res);
                that.setData({
                    shippingNumber: res.result
                })
            }
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        let newArr = this.data.array[e.detail.value];
        console.log(newArr);
        this.setData({
            index: e.detail.value,
            chooseShippingArray: newArr.name,
            chooseShippingId: newArr.id
        })
    },
    submitRefund(){
        let that=this;
        if (that.data.shippingNumber===""){
            wx.showToast({
                title: '请输入物流单号',
                duration: 1500,
                image: "../../../static/images/icon_error.png"
            })
            return
        } else if (that.data.chooseShippingId === ""){
            wx.showToast({
                title: '请选择物流公司',
                duration: 1500,
                image: "../../../static/images/icon_error.png"
            })
            return
        }else{
            util.request(api.PostShippingNumber,{
                refundId: that.data.refundId,  // 退货Id
                shippingId: that.data.chooseShippingId,  // 物流公司的id
                shippingNo: that.data.shippingNumber // 物流单号
            }).then(res=>{
                console.log(res);
                if(res.errno==0){
                    wx.showToast({
                        title: '提交成功',
                    })
                    setTimeout(function () { // 提交成功跳转到退货详情信息页面
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                }
            })
        }
    }
})