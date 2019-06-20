const root = '/api/';
const tra = "http://tracenet.nat300.top/platform";
const li = "http://jp2m86.natappfree.cc";
const cai = "http://md9ki6.natappfree.cc";
const test = "http://39.108.244.179:8111/platform"
const zhiwei = "http://192.168.85.211:8080/platform"
const product ="https://app.kangjiayiju.com/platform"
const zhou = "http://192.168.85.211:8080/platform"
const API_BASE_URL = product + root;
module.exports = {
    Mp3: product +"/statics/audio/222209884720190228252.mp3",
    GoldtreeInfo: API_BASE_URL + 'goldtree/info', //获取摇钱树信息
    GoldtreeShake: API_BASE_URL + 'goldtree/shake', //摇一摇
    GoldtreeSign: API_BASE_URL + 'goldtree/sign', //每日签到
    GoldtreeShareHelp: API_BASE_URL + 'goldtree/shake/help', //摇树为好友助力
    GoldRefresh: API_BASE_URL + 'goldtree/shake/refresh', //刷新摇树时间和次数
    GoldCoinZoneList: API_BASE_URL + 'goldcoin/list', //金币专区
    GoldCoinDetail: API_BASE_URL + 'goldcoin/detail', //金币xiangq
    GoldCoinfriendlist: API_BASE_URL + 'goldtree/shake/friendlist', //金币xiangq
    GoldCoinSHARESHAKE: API_BASE_URL + 'goldtree/shake/share', //金币xiangq
    GoldCoinRecord: API_BASE_URL + 'goldtree/goldRecord', //
    
    UserteamGroup: API_BASE_URL + 'userteam/group', //获取自己的团队
    UserteamGroupInfo: API_BASE_URL + 'userteam/groupInfo', //获取自己的团队详情
    UserBindInviteNo: API_BASE_URL + 'user/bindInviteNo', //输入邀请码领取优惠券
    CouponnewUser: API_BASE_URL + 'coupon/newUser', //获取新用户优惠券
    CouponnewUserReceive: API_BASE_URL + 'coupon/newUser/receive', //领取新用户优惠券

    SpecialTopic: API_BASE_URL + 'index/specialTopic', //专题商品列表
    IndexUrlNewGoods: API_BASE_URL + 'index/newGoods', //新品首发
    IndexUrlHotGoods: API_BASE_URL + 'index/hotGoods', //热卖商品
    IndexUrlNewUserGoods:API_BASE_URL +'index/newUserGoods', //新用户商品
    IndexUrlTopic: API_BASE_URL + 'index/topic', //专题精选
    IndexUrlBrand: API_BASE_URL + 'index/brand', //品牌制造商
    IndexUrlCategory: API_BASE_URL + 'index/category', //首页底部的分类及商品列表
    IndexUrlBanner: API_BASE_URL + 'index/banner', //首页banner
    IndexUrlChannel: API_BASE_URL + 'index/channel', //banner下的分类
    CatalogList: API_BASE_URL + 'catalog/index',  //分类目录全部分类数据接口
    CatalogCurrent: API_BASE_URL + 'catalog/current',  //分类目录当前分类数据接口

    AuthLoginByWeixin: API_BASE_URL + 'auth/login_by_weixin', //微信登录
    GetRefundList: API_BASE_URL + 'pay/refund/list',// 获取退货退款列表信息
    SingleGoodsInfo: API_BASE_URL + 'order/getOrderGoods' ,// 获取单个商品退货退款信息
    RefundGoods: API_BASE_URL + 'pay/refundGoods',// 提交退货信息
    RefundMoney: API_BASE_URL + 'pay/refundOrderGoods',// 提交退款信息
    PostShippingNumber: API_BASE_URL + 'pay/refundGoods/shippingInfo',// 提交退货的物流信息信息
    RefundDetail: API_BASE_URL + 'pay/refund/detail', //获取退货退款详情
    RefundExpress: API_BASE_URL + 'order/express', //获取退货物流详情
    OrderGoodsDetail: API_BASE_URL + 'order/goods/detail', //获取评价的订单信息
    OrderExpressList: API_BASE_URL + 'order/express/list', //获取所有的物流公司
    UploadUpload: API_BASE_URL + 'upload/upload', //图片上传
    PostComment: API_BASE_URL + 'comment/postComment', //提交评论


    GoodsCount: API_BASE_URL + 'goods/count',  //统计商品总数
    GoodsList: API_BASE_URL + 'goods/list',  //获得商品列表
    GoodsCategory: API_BASE_URL + 'goods/category',  //获得分类数据
    GoodsDetail: API_BASE_URL + 'goods/detail',  //获得商品的详情
    GoodsHot: API_BASE_URL + 'goods/hot',  //人气推荐
    GoodsRelated: API_BASE_URL + 'goods/related',  //商品详情页的关联商品（大家都在看）
    UserPay: API_BASE_URL + 'user/pay',  //支付测试

    BrandList: API_BASE_URL + 'brand/list',  //品牌列表
    BrandDetail: API_BASE_URL + 'brand/detail',  //品牌详情

    CartList: API_BASE_URL + 'cart/index', //获取购物车的数据
    CartAdd: API_BASE_URL + 'cart/add', // 添加商品到购物车
    BuyAdd: API_BASE_URL + 'buy/add', // 直接购买    
    CartUpdate: API_BASE_URL + 'cart/update', // 更新购物车的商品
    CartDelete: API_BASE_URL + 'cart/delete', // 删除购物车的商品
    CartChecked: API_BASE_URL + 'cart/checked', // 选择或取消选择商品
    CartGoodsCount: API_BASE_URL + 'cart/goodscount', // 获取购物车商品件数
    CartCheckout: API_BASE_URL + 'cart/checkout', // 下单前信息确认

    OrderSubmit: API_BASE_URL + 'order/submit', // 提交订单
    PayPrepayId: API_BASE_URL + 'pay/prepay', //获取微信统一下单prepay_id
    PayNotify: API_BASE_URL + 'pay/notify', //混合支付的回调
    PostageZoneList: API_BASE_URL + 'goods/postageZoneList', //混合支付的回调

    CollectList: API_BASE_URL + 'collect/list',  //收藏列表
    CollectAddOrDelete: API_BASE_URL + 'collect/addordelete',  //添加或取消收藏

    CommentList: API_BASE_URL + 'comment/list',  //评论列表
    CommentCount: API_BASE_URL + 'comment/count',  //评论总数
    CommentPost: API_BASE_URL + 'comment/post',   //发表评论

    TopicList: API_BASE_URL + 'topic/list',  //专题列表
    TopicDetail: API_BASE_URL + 'topic/detail',  //专题详情
    TopicRelated: API_BASE_URL + 'topic/related',  //相关专题
    PayWallet: API_BASE_URL +"pay/wallet",      // 零钱全额抵扣

    SearchIndex: API_BASE_URL + 'search/index',  //搜索页面数据
    SearchHelper: API_BASE_URL + 'search/helper',  //搜索帮助
    SearchClearHistory: API_BASE_URL + 'search/clearhistory',  //搜索帮助

    AddressList: API_BASE_URL + 'address/list',  //收货地址列表
    AddressDetail: API_BASE_URL + 'address/detail',  //收货地址详情
    AddressSave: API_BASE_URL + 'address/save',  //保存收货地址
    AddressDelete: API_BASE_URL + 'address/delete',  //删除收货地址
    AddressSetDefault: API_BASE_URL + 'address/updateDefault',  //设置默认地址

    RegionList: API_BASE_URL + 'region/list',  //获取区域列表

    OrderList: API_BASE_URL + 'order/list',  //订单列表
    OrderDetail: API_BASE_URL + 'order/detail',  //订单详情
    OrderCancel: API_BASE_URL + 'order/cancelOrder',  //取消订单
    OrderConfirm: API_BASE_URL + 'order/confirmOrder',  //确认收货
    ExpressInfo: API_BASE_URL + 'order/expressInfo',  //获取物流信息

    FootprintList: API_BASE_URL + 'footprint/list',  //足迹列表
    FootprintDelete: API_BASE_URL + 'footprint/delete',  //删除足迹

    FeedbackAdd: API_BASE_URL + 'feedback/save', //添加反馈
    SmsCode: API_BASE_URL + 'user/smscode', //发送短信
    BindMobile: API_BASE_URL + 'user/bindMobile', //绑定手机
    Login: API_BASE_URL + 'auth/login', //账号登录
    Register: API_BASE_URL + 'auth/register', //注册
    CouponList: API_BASE_URL + 'coupon/list', // 优惠券列表
    GoodsCouponList: API_BASE_URL + 'coupon/listByGoods', // 商品优惠券列表   
    OrderQuery: API_BASE_URL + 'pay/query',//微信查询订单状态

    HelpTypeList: API_BASE_URL + 'helpissue/typeList', //查看帮助类型列表
    HelpIssueList: API_BASE_URL + 'helpissue/issueList', //查看问题列表
    GetUserInfo: API_BASE_URL + 'user/getUserInfo',//获取当前会员等级
    WithdrawList: API_BASE_URL + 'user/wallet/withdraw/list',//获取提现明细
    Withdraw: API_BASE_URL + 'user/wallet/withdraw', //提现
    WalletRecord: API_BASE_URL + 'user/wallet/walletRecord',//获取钱包收益明细
    UserteamList: API_BASE_URL + 'userteam/list',//获取我的团队
    RechargeList: API_BASE_URL + 'user/recharge/list',//获取会员充值记录
    UsercashbackList: API_BASE_URL + 'usercashback/allCash',//团队收益
	
	LotteryOrderList: API_BASE_URL + 'lottery/orderList',//抽奖订单
    LotteryList: API_BASE_URL + 'lottery/list',//抽奖商品列表
    LotteryGoodsDetail: API_BASE_URL + 'lottery/detail',//抽奖商品详情
    LotteryInfo: API_BASE_URL + 'lottery/info',//抽奖下单获取数据
    Lotterysubmit: API_BASE_URL + 'lottery/submit',//抽奖下单
    LotteryorderInfo: API_BASE_URL + 'lottery/orderInfo',//抽奖详情
    LotterysendGoods: API_BASE_URL + 'lottery/sendGoods',//查看物流

    BargainList: API_BASE_URL + 'bargain/list',//愿望清单商品列表
    BargainMyList: API_BASE_URL + 'bargain/myList',//我的愿望清单列表
    BargainSubmit: API_BASE_URL + 'bargain/submit',//发起愿望
    BargainDetail: API_BASE_URL + 'bargain/detail',//愿望详情
    BargainHelp: API_BASE_URL + 'bargain/help',//愿望砍价
    BargainSettlement: API_BASE_URL + 'bargain/settlement',//愿望结算
    BargainGoods: API_BASE_URL + 'bargain/goods/info',//愿望商品详情
    PostageList: API_BASE_URL + 'postage/list',//付邮得物列表
    PostageDetail: API_BASE_URL + 'postage/detail',//付邮得物商品详情

    UserRecharge: API_BASE_URL + 'user/recharge', //获取充值套餐列表
    UserRechargePay: API_BASE_URL + 'user/recharge/pay', //充值会员
};

