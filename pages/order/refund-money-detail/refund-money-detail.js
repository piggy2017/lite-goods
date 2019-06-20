const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        refundId:"",
        type:0,
        goodsInfo:{},
        refundReason:{},
        refundPictureList:[],
        canRefundResult:{}
    },
    onShow:function(){
        this.getDetail();
    },
    onLoad:function(options){
        console.log(options);
        this.setData({
            refundId: options.refundId
        });
        this.getDetail();
    },
    previewImage(e) {  // 图片预览
        console.log(e.target.dataset);
        let that = this;
        let _goodsList = that.data.refundPictureList;
        let _imageArray=[];
        for (let i = 0; i < _goodsList.length; i++) {
            _imageArray.push(_goodsList[i].picUrl);
        }
        wx.previewImage({
            current: e.target.dataset.src, // 当前显示图片的http链接 
            urls: _imageArray // 需要预览的图片http链接列表 
        })
    },
    getDetail(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.RefundDetail, { refundId: that.data.refundId}).then(res=>{
            console.log(res);
            if(res.errno==0){
                that.setData({
                    type: res.data.refundInfo.type,
                    goodsInfo: res.data.refundInfo,
                    refundReason: res.data.refundReason,
                    canRefundResult: res.data.canRefundResult
                })
                if (res.data.refundPictureList.length != 0 && res.data.refundPictureList!=null){
                    that.setData({
                        refundPictureList: res.data.refundPictureList
                    })
                }
            }
        })
    },
    call() {
        wx.makePhoneCall({
            phoneNumber: '028-83365953'
        })
    },
    refundArgin(e){
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../refund/refund?orderId=' + e.currentTarget.dataset.id + '&goodsId=' + e.currentTarget.dataset.goodsid + "&productId=" + e.currentTarget.dataset.productid + "&status=2" 
        })
    }
})