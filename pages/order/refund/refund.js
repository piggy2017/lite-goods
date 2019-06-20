const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    orderId: "",
    goodsId: "",
    productId: "",
    status: "",
    orderGoodsInfo: {},
    orderInfo: {},
    num: 1,
    refundNum: 1,
    chooseReasonArray: "质量问题",
    array: ["质量问题", "与商品描述不符", "卖家发错货", "假冒品牌", "少件或者破损"],
      array1: ["拍错", "多拍", "不喜欢","不想要了", "未按规定时间发货",  "其他"],
    index: 0,
    index1:0,
    refundmoney: 0,
    instructValue: '',
    wallet_price: 0,
    gold_coin_price: 0,
    imageList: [],
    information: {},
    hasFahuo: true,
      order_price:0,
      retail_price:0,
    singlePrice: 0 // 单个商品的实付价格
  },
  onLoad: function(options) {
    console.log(options);
    this.setData({
      orderId: options.orderId,
      goodsId: options.goodsId,
      productId: options.productId,
      status: options.status
    })
    if (options.status == 2) {
      this.setData({
        hasFahuo: false
      })
    } else {
      this.setData({
        hasFahuo: true
      })
    }
    this.getDetail();
  },
  getDetail() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
    util.request(api.SingleGoodsInfo, {
        orderId: that.data.orderId,
        goodsId: that.data.goodsId,
        productId: that.data.productId
      })
      .then(function(res) {
        console.log(res);
        if (res.errno == 0) {
          that.setData({
            orderGoodsInfo: res.data.orderGoodsInfo,
            orderInfo: res.data.orderInfo,
            num: res.data.orderGoodsInfo.number,
            //refundNum:res.data.orderGoodsInfo.number,
            wallet_price: res.data.orderInfo.wallet_price,
            gold_coin_price: res.data.orderInfo.gold_coin_price,
              order_price: res.data.orderInfo.order_price,
              retail_price: res.data.orderGoodsInfo.retail_price,
              refundmoney: res.data.orderGoodsInfo.retail_price,
            singlePrice: (res.data.orderInfo.actual_price * 1) / (res.data.orderGoodsInfo.number * 1)
          })
        }
        wx.hideLoading();
      });
  },
  getValue(e) { //获取输入的说明
    console.log(e.detail.value);
    this.setData({
      instructValue: e.detail.value
    })
  },
  changeImg(e) { // 选择图片
    let that = this;
    let _imageList = that.data.imageList;
    if (_imageList.length < 3) {
      let that = this;
      wx.chooseImage({
        count: 1,
        success: function(res) {
          console.log(res);
          let tempFilePaths = res.tempFilePaths[0];
          console.log(tempFilePaths);
          wx.uploadFile({
            url: api.UploadUpload,
            filePath: tempFilePaths,
            name: 'file',
            success: function(res) {
              console.log(res);
              let newData = JSON.parse(res.data);
              console.log(newData);
              _imageList.push(newData.data.trim());
              console.log(_imageList);
              that.setData({
                imageList: _imageList
              })
            }
          })
        }
      })
    } else {
      util.showErrorToast("最多可选择三张图片");
    }
  },
  previewImage(e) { // 图片预览
    console.log(e.target.dataset);
    let that = this;
    let _imageList = that.data.imageList;
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接 
      urls: _imageList // 需要预览的图片http链接列表 
    })
  },
  submitRefund() { // 提交退款申请
    let that = this;
    console.log(that.data.status);
    if (that.data.status == 2) { // 未发货的状态下，仅退款
      wx.showLoading({
        title: '加载中...',
        icon: 'loading'
      });
      util.request(api.RefundMoney, {
          orderId: that.data.orderId,
          goodsId: that.data.goodsId,
          productId: that.data.productId,
          description: that.data.instructValue,
          reason: that.data.chooseReasonArray
        })
        .then(function(res) {
          console.log(res);
          if (res.errno == 0) {
            wx.showToast({
              title: '提交成功'
            })
            setTimeout(function() { // 提交成功跳转到退货详情页面
              wx.redirectTo({
                url: "../after-sales/after-sales"
              })
            }, 1000)
          } else {
            util.showErrorToast(res.errmsg)
          }
          wx.hideLoading();
        });
    } else { // 发货了，退货退款
      wx.showLoading({
        title: '加载中...',
        icon: 'loading'
      });
      util.request(api.RefundGoods, {
          orderId: that.data.orderId,
          goodsId: that.data.goodsId,
          productId: that.data.productId,
          number: that.data.refundNum,
          type: 1,
          description: that.data.instructValue,
          reasonArr: that.data.chooseReasonArray,
          imagesListArray: that.data.imageList
        }) // , 'POST', 'application/json'
        .then(function(res) {
          console.log(res);
          if (res.errno == 0) {
            wx.showToast({
              title: '提交成功'
            })
            setTimeout(function() { // 提交成功跳转到退货列表页面
              wx.redirectTo({
                url: "../after-sales/after-sales"
              })
            }, 1000)
          }
          wx.hideLoading();
        });
    }
  },
  reduceNum() {
    if (this.data.refundNum <= 1) {
      this.setData({
        refundNum: 1,
          refundmoney: this.data.retail_price * 1
      })
    } else {
      let afterNum = this.data.refundNum - 1;
      this.setData({
        refundNum: afterNum,
          refundmoney: this.data.retail_price * afterNum
      })
    }
  },
  addNum() {
    if (this.data.refundNum < this.data.num) {
      let afterNum = this.data.refundNum + 1;
        if (afterNum == this.data.num){
            this.setData({
                refundNum: afterNum,
                refundmoney: this.data.order_price
            })
        }else{
            this.setData({
                refundNum: afterNum,
                refundmoney: this.data.retail_price * afterNum
            })
        }
     
    } else {
      this.setData({
        refundNum: this.data.num,
          refundmoney: this.data.order_price
      })
    }
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let newArr = this.data.array[e.detail.value]
    this.setData({
      index: e.detail.value,
      chooseReasonArray: newArr
    })
  },
    bindPickerChange1(e){
        console.log('picker发送选择改变，携带值为', e.detail.value);
        let newArr = this.data.array1[e.detail.value]
        this.setData({
            index1: e.detail.value,
            chooseReasonArray: newArr
        })
    }
})