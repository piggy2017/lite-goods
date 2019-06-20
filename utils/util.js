const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 获取当前页url
 */
function getCurrentPageUrl() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    return url
}
/**
 * 获取上一页的url
 */
function getCurrentPageUrlTwo() {
    var pages = getCurrentPages() //获取加载的页面
    console.log(pages);
    if (pages.length>=2){
        var currentPage = pages[pages.length - 2] //获取上一个页面的对象
        var url = currentPage.route //当前页面url
        return url
    }
}

/** 
 * 获取当前页带参数的url
 */
function getCurrentPageUrlWithArgs() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
    //   wx.showLoading({
    //     title: '加载中...',
    //   });
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': header,
                'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function(res) {
                wx.hideLoading();
                if (res.statusCode == 200) {
                    if (res.data.errno == 401) {
                        // 如果带有参数
                        let paramsUrl = getCurrentPageUrlWithArgs();
                        console.log(paramsUrl);
                        // 不带参数
                        let noParamsUrl = getCurrentPageUrl();
                        console.log(noParamsUrl);
                        wx.setStorageSync('navUrl', paramsUrl);
                        wx.redirectTo({
                            url: '/pages/auth/auth'
                        })
                        // if (noParamsUrl ==="pages/auth/auth"){
                        //     return
                        // }else{
                        //     wx.navigateTo({
                        //         url: '/pages/auth/auth'
                        //     })
                        // }
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res.errMsg);
                }

            },
            fail: function(err) {
                reject(err)
            }
        })
    });
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function(resolve, reject) {
        wx.checkSession({
            success: function() {
                resolve(true);
            },
            fail: function() {
                reject(false);
            }
        })
    });
}
/**
 * 调用微信登录
 */
function login() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                if (res.code) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}
/**
 * 只显示文字
 */
function showErrorToastMessage(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
    })
}


function showSuccessToast(msg) {
    wx.showToast({
        title: msg
    })
}
/**
 * 只显示文字带回调
 */
function showSuccessToastMessage(msg, func) {
    wx.showToast({
        title: msg,
        icon: 'none',
        success: func
    })
}
/** 替换emoji表情 */

function filterEmoji(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
}

/** 替换空格键2 */

function filterSpace(name) {

    var str = name.replace(/\s+/g, '');
    return str;
}

/** 保存图片*/
function downloadImage(imageUrl) {
    // 下载文件  
    wx.getImageInfo({
        src: imageUrl,
        success: function (res) {
            console.log(res)
            // 保存图片到系统相册  
            wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success(res) {
                    console.log("保存图片：success");
                    console.log(res);
                    wx.showToast({
                        title: '保存成功',
                    });
                },
                fail(res) {
                    console.log("保存图片：fail");
                    console.log(res);
                }
            })
        }

    })
    // wx.downloadFile({
    //     url: imageUrl,
    //     success: function (res) {
    //         console.log("下载文件：success");
    //         console.log(res);

    //         // 保存图片到系统相册  
    //         wx.saveImageToPhotosAlbum({
    //             filePath: res.tempFilePath,
    //             success(res) {
    //                 console.log("保存图片：success");
    //                 console.log(res);
    //                 wx.showToast({
    //                     title: '保存成功',
    //                 });
    //             },
    //             fail(res) {
    //                 console.log("保存图片：fail");
    //                 console.log(res);
    //             }
    //         })
    //     },
    //     fail: function (res) {
    //         console.log("下载文件：fail");
    //         console.log(res);
    //     }
    // })
}  



module.exports = {
    formatTime: formatTime,
    request: request,
    getCurrentPageUrl: getCurrentPageUrl,
    getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
    checkSession: checkSession,
    login: login,
    showErrorToast: showErrorToast,
    showSuccessToast: showSuccessToast,
    showErrorToastMessage: showErrorToastMessage,
    showSuccessToastMessage: showSuccessToastMessage,
    filterEmoji: filterEmoji,
    getCurrentPageUrlTwo: getCurrentPageUrlTwo,
    filterSpace: filterSpace,
    downloadImage: downloadImage
}