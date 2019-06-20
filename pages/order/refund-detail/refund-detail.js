const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        address:"四川省成都市天府三街腾讯大厦B座1005腾讯大厦B座",
        refundId:"",
        refundReason:{},
        goodsInfo:{},
        refundPictureList:[],
        type: 0,
        refundAddress:{},
        shippingList:[],
        canRefundResult:{}
    },
    onLoad: function (options){
        console.log(options);
        this.setData({
            refundId: options.refundId
        });
        this.getDetail();
    },
    onShow:function(){
        this.getDetail();
    },
    copy(){
        let _address = this.data.address;
        wx.setClipboardData({
            data: _address,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
    },
    getDetail() {
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.RefundDetail, { refundId: that.data.refundId }).then(res => {
            console.log(res);
            if (res.errno == 0) {
                that.setData({
                    type: res.data.refundInfo.type,
                    goodsInfo: res.data.refundInfo,
                    refundReason: res.data.refundReason,
                    canRefundResult: res.data.canRefundResult
                })
                if (res.data.shippingList != null && res.data.shippingList.length != 0) {
                    that.setData({
                        shippingList: res.data.shippingList
                    })
                }
                if (res.data.refundPictureList != null && res.data.refundPictureList.length != 0) {
                    that.setData({
                        refundPictureList: res.data.refundPictureList
                    })
                }
                if (res.data.refundAddress!=null){
                    that.setData({
                        refundAddress: res.data.refundAddress
                    })
                }
            }
        })
    },
    viewExpress(e) {  //查看物流
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../express/express?shippingNo=' + e.currentTarget.dataset.no + "&isRefund=true&shippingId=" + e.currentTarget.dataset.id
        })
    },
    previewImage(e) {  // 图片预览
        console.log(e.target.dataset);
        let that = this;
        let _goodsList = that.data.refundPictureList;
        let _imageArray = [];
        for (let i = 0; i < _goodsList.length; i++) {
            _imageArray.push(_goodsList[i].picUrl);
        }
        wx.previewImage({
            current: e.target.dataset.src, // 当前显示图片的http链接 
            urls: _imageArray // 需要预览的图片http链接列表 
        })
    },
    writeNo(){ // 填写物流单号
        wx.navigateTo({
            url: '../shipping/shipping?refundId=' + this.data.refundId,
        })
    },
    refundArgin(e) {
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../refund/refund?orderId=' + e.currentTarget.dataset.id + '&goodsId=' + e.currentTarget.dataset.goodsid + "&productId=" + e.currentTarget.dataset.productid + "&status=3"
        })
    },
    call(){
        wx.makePhoneCall({
            phoneNumber: '028-83365953'
        })
    },
    // 下拉刷新
    onPullDownRefresh: function () {
      this.getDetail();
      wx.stopPullDownRefresh();
    }
})