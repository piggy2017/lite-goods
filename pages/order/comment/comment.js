const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        orderId:"",
        postList:[],
        goodsList:[
            // { "id": "1", "name": "aa", "picList": [], "value": "", "score": 5,
            //     "goodsStars": [
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false }  
            //     ],
            //     "starNum": 0, "goodsId": 101,"productId":240
            //  },
            // { "id": "2", "name": "bb", "picList": [], "value": "", "score": 5, 
            //     "goodsStars": [
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false },
            //         { "src": "../../../static/images/gray-star.png", "active": false }  
            //     ],
            //     "starNum": 0, "goodsId": 102, "productId": 241
            //  }
        ]
    },
    onLoad:function(options){
        console.log(options);
        this.setData({
            orderId: options.orderId
        })
        //this.getData();
        this.getList();
    },
    getList(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        util.request(api.OrderGoodsDetail, { orderId: that.data.orderId}).then(res=>{
            console.log(res);
            if(res.errno==0){
                let _array=res.data;
                for (let i = 0; i < _array.length;i++){
                    _array[i].picList=[];
                    _array[i].score = 5;
                    _array[i].starNum=0;
                    _array[i].id = _array[i].productId;
                    _array[i].value="";
                    _array[i].goodsStars = [
                        { "src": "../../../static/images/gray-star.png", "active": false },
                        { "src": "../../../static/images/gray-star.png", "active": false },
                        { "src": "../../../static/images/gray-star.png", "active": false },
                        { "src": "../../../static/images/gray-star.png", "active": false },
                        { "src": "../../../static/images/gray-star.png", "active": false }
                    ]
                }
                console.log(_array);
                that.setData({
                    goodsList: _array
                })
            }
            wx.hideLoading();
        })
    },
    getData(){
        let _goodsList = this.data.goodsList;
        for (let i = 0; i < _goodsList.length;i++){
            _goodsList[i].goodsStars = this.data.stars
        }
        console.log(_goodsList)
        this.setData({
            goodsList: _goodsList
        })
    },
    checkStar(e){
        console.log(e.currentTarget.dataset.id);
        console.log(e.currentTarget.dataset.index);
        let _goodsList = this.data.goodsList;
        for (let i = 0; i < _goodsList.length;i++){
            if (_goodsList[i].id === e.currentTarget.dataset.id){
                console.log(_goodsList[i].id, e.currentTarget.dataset.id)
                let _idx = e.currentTarget.dataset.index+1;
                let total = _goodsList[i].goodsStars.length;

                if (_goodsList[i].starNum==0){   // 当前还没有选中，第一次选择
                    _goodsList[i].starNum = _idx;
                    _goodsList[i].score=_idx;
                    for (var j = 0; j < _idx; j++) {
                        _goodsList[i].goodsStars[j].src = "../../../static/images/full-star.png";
                        _goodsList[i].goodsStars[j].active = true;
                    }
                    console.log(_goodsList);
                    this.setData({
                        goodsList:_goodsList,
                    })
                } else{  
                    if (_idx == _goodsList[i].starNum) { // 如果再次点击当前选中的星级-仅取消掉当前星级
                        _goodsList[i].starNum = _idx-1;
                        _goodsList[i].score = _idx-1;
                        _goodsList[i].goodsStars[_idx - 1].src ="../../../static/images/gray-star.png";
                        _goodsList[i].goodsStars[_idx - 1].active=false;
                        console.log(_goodsList);
                        this.setData({
                            goodsList: _goodsList,
                        })
                    } else if (_idx < _goodsList[i].starNum) { //如果小于当前最高星级，则直接保留当前星级
                        console.log(_idx);
                        _goodsList[i].starNum = _idx;
                        _goodsList[i].score = _idx;
                        for (let j = _idx; j < _goodsList[i].goodsStars.length;j++){
                            _goodsList[i].goodsStars[j].src ="../../../static/images/gray-star.png";
                            _goodsList[i].goodsStars[j].active=false;
                        }
                        console.log(_goodsList)
                        this.setData({
                            goodsList: _goodsList
                        })
                    } else if (_idx > _goodsList[i].starNum) {  //如果大于当前星级，则直接选到该星级
                        _goodsList[i].starNum = _idx;
                        _goodsList[i].score = _idx;
                        for (var j = 0; j < _idx; j++) {
                            _goodsList[i].goodsStars[j].src = "../../../static/images/full-star.png";
                            _goodsList[i].goodsStars[j].active = true;
                        }
                        console.log(_goodsList);
                        this.setData({
                            goodsList: _goodsList,
                        })
                    }
                }
            }
        }
    },
    chooseImg(e){
        console.log(e.currentTarget.dataset.id);
        let that = this;
        let _goodsList = that.data.goodsList;
        for (let i = 0; i < _goodsList.length;i++){
            if (_goodsList[i].id == e.currentTarget.dataset.id){
                if (_goodsList[i].picList.length<3){
                    wx.chooseImage({
                        count: 1,
                        success: function (res) {
                            console.log(res);
                            let tempFilePaths = res.tempFilePaths[0];
                            console.log(tempFilePaths);
                            wx.uploadFile({
                                url: api.UploadUpload,
                                filePath: tempFilePaths,
                                name: 'file',
                                success:function(res){
                                    console.log(res);
                                    let newData = JSON.parse(res.data);
                                    console.log(newData);
                                    _goodsList[i].picList.push(newData.data.trim());
                                    console.log(_goodsList);
                                    that.setData({
                                        goodsList: _goodsList
                                    })
                                }
                            })
                        }
                    })
                }else{
                    util.showErrorToast("最多可选择三张图片");
                }
            }
        }
    },
    previewImage(e) {  // 图片预览
        console.log(e.target.dataset);
        let that=this;
        let _goodsList = that.data.goodsList;
        for (let i = 0; i < _goodsList.length;i++){
            if (_goodsList[i].id == e.target.dataset.id){
                wx.previewImage({
                    current: e.target.dataset.src, // 当前显示图片的http链接 
                    urls: _goodsList[i].picList // 需要预览的图片http链接列表 
                })
            }
        }
    },
    getValue(e){
        let goodsList = this.data.goodsList;
        for (let i = 0; i < goodsList.length;i++){
            if (goodsList[i].id == e.currentTarget.dataset.id){
                goodsList[i].value = e.detail.value
            }
        };
        console.log(goodsList);
        this.setData({
            goodsList: goodsList
        })
    },
    submitComment(){
        let that=this;
        wx.showLoading({
            title: '加载中...',
            icon: 'loading'
        });
        let _orderId=that.data.orderId;
        let goodsList = that.data.goodsList;
        let _postList=[];
        for (let i = 0; i < goodsList.length;i++){
            let postObj = {};
            postObj.goodsId = goodsList[i].goodsId;
            postObj.productId = goodsList[i].productId;
            postObj.starts = goodsList[i].score;
            postObj.content = goodsList[i].value;
            postObj.images = goodsList[i].picList;
            _postList.push(postObj);
        }
        console.log(_postList);
        util.request(api.PostComment, { orderId: that.data.orderId, comments: _postList }, 'POST', 'application/json')
        .then(res=>{
            console.log(res);
            if(res.errno==0){
                wx.showToast({
                    title: '提交成功',
                })
                setTimeout(function(){
                    wx.redirectTo({
                        url: '../myorder/myorder?type=5',
                    })
                },1000)
            }
        })
    }
})