
const app = getApp();
Page(app.$page({
	/**
	 * 页面的初始数据
	 */
	data: {
		title: [{
			name: '明细'
		}, {
			name: '积分收入'
		}, {
			name: '积分支出'
		}, ],
		checkIndex: 0,
		page: 0, // 分页
		limit: 12, // 每页条数
		loadMore: true, // 是否为最后一页
	},
	state: {
		point: ['detailList'],
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad (options) {
		this.getList(1);
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow () {


	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh () {
		this.getList(1);
		console.log("下拉刷新");
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom () {
		this.getList();

	},


	methods: {
		/* 切换选项 */
		selectTab(event){

			this.setData({checkIndex: event.detail.index})
			this.getList(1)
		},
		/* 获取数据 */
		getList(currentPage) {
			let {
				page,
				detailList,
				loadMore,
				checkIndex,
				limit
			} = this.data;

			if (currentPage) {
				page = 0;
				loadMore = true;
				this.setData({
					page,
					loadMore
				});
				detailList = []
				app.$store.point.update({detailList})
			}

			if (!loadMore) {
				return;
			} else {
				page++;
			}

			this.setData({
				isLoading: true
			});
			app.$api.getPointDetail({
				pageIndex: page,
				pageSize: limit,
				pointType: checkIndex,
			}).then(
				(res) => {
					console.log(res)

					const {
						Data: {
							Data,
							Total
						},
						success,
						errorMsg
					} = res;
					if (!success) {
						return app.alert.message(errorMsg)
					}


					const maxPage = Math.ceil(Number(Total) / limit) || 1;

					detailList = detailList.concat(Data);
					app.$store.point.update({detailList})

					loadMore = page >= maxPage ? false : true;

					this.setData({
						page,
						loadMore
					});

					wx.stopPullDownRefresh();


				}
			);
		},

	},

}));