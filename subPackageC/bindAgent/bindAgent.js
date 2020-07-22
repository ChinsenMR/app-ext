const app = getApp();
Page({
	data: {},
	onLoad(options) {

	},
	/* 清除用户信息重新登录 */
	clearUserInfo() {
		setTimeout(() => {
			/* 授权之前清除所有用户信息 */
			wx.removeStorage({
				key: 'cookie',
				success: () => {
					wx.removeStorageSync('userInfo');
					wx.removeStorageSync('openid');
					app.goPage({
						url: app.data.auth_url,
						options: {
							fromType: 'bingAgent'
						}
					})
				}
			})
		}, 1500);
	},
	// 提交
	formSubmit(e) {
		const form = e.detail.value;

		if (!form.userName) {
			return app.alert.message('请输入用户名')

		}
		if (!form.userPass) {
			return app.alert.message('请输入密码')
		}


		app.$api.bindAgent({
			Username: form.userName, //	是	string	代理账号
			Password: form.userPass, //	是	string	代理密码
			BindType: 1,
		}).then(res => {
			const status = res.statu;
			const message = res.msg;

			if (status === 'true') {
				app.alert.message('绑定代理成功')
				this.clearUserInfo();
			} else {
				app.alert.message(message)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

});