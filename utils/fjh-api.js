export default {
    fp(data) {
        const app = getApp();
        return new Promise((resolve, reject) => {
            wx.request({
                url: app.data.url + data.url,
                data: data,
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                header: {
                    Cookie: wx.getStorageSync('cookie') || _app.data.cookie
                },
                success(res) {
                    resolve(res)
                },
                fail(res) {
                    resolve(res)
                }
            })
        })
    },

    fg(Data) {
        const app = getApp();
        let {
            url,
            data
        } = Data

        return new Promise((reslove, reject) => {
            wx.request({
                url: app.data.url + url,
                data: data ? data : '',
                header: {
                    Cookie: wx.getStorageSync('cookie') || app.data.cookie
                },
                success(res) {
                    reslove(res)
                }
            })
        })
    },

    // post请求
    Fnpost(Data) {
        let {
            url,
            data
        } = Data
        let _this = this
        return new Promise((reslove, reject) => {
            wx.request({
                url: this.data.url + url,
                data: data ? data : '',
                header: {
                    Cookie: wx.getStorageSync('cookie') || _this.data.cookie
                },
                success(res) {
                    reslove(res)
                }
            })
        })
    },

    // 弹窗提示
    fa(data, time) {
        let title = '没有更多的了'
        let timeA = 1500
        if (data) title = data
        if (time) timeA = time
        wx.showToast({
            icon: 'none',
            title: title,
            mask: true,
            duration: timeA
        })
    },

    // 加载中
    fl(data) {
        let title = '加载中...'
        if (data) title = data
        wx.showLoading({
            icon: 'loading',
            title: title,
            mask: true,
        })
    },

    // 关闭加载
    fh() {
        wx.hideLoading()
    },

    // 跳转
    goTo(url, type) {
        let num = type || 0; //默认采用第一种方式跳转
        if (num == 0) {
            wx.navigateTo({
                url: url,
            });
        } else if (num == 1) { //关闭当前
            wx.redirectTo({
                url: url,
            });
        } else if (num == 2) { //关闭所有
            wx.reLaunch({
                url: url,
            });
        } else if (num == 3) { //跳转小程序底部tab
            wx.switchTab({
                url: url
            });
        }
    },

    getUrl(t) { //http://192.168.3.32:8091/
        const app = getApp()
        return app.data.url + "/API/WeChatApplet.ashx?action=" + t;
    },

    //多图片上传方法
    uploadimg(data) {
        const app = getApp();
        let i = data.i ? data.i : 0, //当前上传的哪张图片
            success = data.success ? data.success : 0, //上传成功的个数
            fail = data.fail ? data.fail : 0; //上传失败的个数
        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            name: 'file', //这里根据自己的实际情况改
            formData: null, //这里是上传图片时一起上传的数据
            success: (resp) => {
                success++; //图片上传成功，图片上传成功的变量+1
                console.log(resp)
                console.log(i);
                //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
            },
            fail: (res) => {
                fail++; //图片上传失败，图片上传失败的变量+1
                console.log('fail:' + i + "fail:" + fail);
            },
            complete: () => {
                console.log(i);
                i++; //这个图片执行完上传后，开始上传下一张            
                if (i == data.path.length) { //当图片传完时，停止调用          
                    console.log('执行完毕');
                    console.log('成功：' + success + " 失败：" + fail);
                } else { //若图片还没有传完，则继续调用函数                
                    console.log(i);
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    app.uploadimg(data);
                }
            }
        });
    },

    // 获取图片临时路径
    getImgPath(img) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: `${img}`,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    reject(e)
                }
            })
        })
    },
    // 获取手机信息
    getSystemInfo() {
        return new Promise((resolve, reject) => {
            wx.getSystemInfo({
                success: (res) => {
                    resolve(res)
                }
            })
        })
    },

    // 登录
    goLogin(referralUserId) {
        const app = getApp();
        goLogin({
            openId: app.data.openid, //this.data.openid
            openType: 'hmeshop.plugins.openid.wxapplet',
            referralUserId: referralUserId ? referralUserId : ''
        }).then(res => {
            app.data.userInfo = res.data.Data;
            app.data.cookie = res.data.Cookie
            app.getUserInfo();
            app.getDefaultModel();
        })
    },

}