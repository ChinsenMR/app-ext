const app = getApp();

Page(app.$page({

	data: {
		page: 0, // 分页
		limit: 4, // 每页条数
		loadMore: true, // 是否为最后一页
	},
	watch: {},
	state: {
		point: ['goodsList', 'point'],
	},
	onLoad(options) {
		this.getList(1);
		this.getMyPoint()
	},
	methods: {

		/* 加入购物车 */
		addCart(e) {
			const giftId = e.currentTarget.dataset.id;

			app.$api.PointChangeAddCart({
				giftId,
				needPoints: 1,
				isExemptionPostage: true,
			}).then((res) => {

				const {
					errorMsg
				} = res;

				app.alert.message(errorMsg)
			});
		},
		/* 查看商品详情 */
		seeDetail(e) {
			const {
				id
			} = e.currentTarget.dataset;

			app.goPage({
				url: '/subPackageD/pages/pointShop/goodsDetail',
				options: {
					goodsId: id
				}
			})
		},
		/* 获取我的积分 */
		getMyPoint() {
			app.$api.getPointDetail({
				PointType: 0,
				pageIndex: 1,
				pageSize: 8,
			}).then(res => {
				const {
					Data: {
						Points,
						Data
					},
					success,
					errorMsg
				} = res;
				if (!success) {
					return app.alert.message(errorMsg)
				}

				app.$store.point.update({
					point: Points,
					detailList: Data
				})

			})
		},
		/* 获取列表 */
		getList(currentPage) {
			let {
				page,
				loadMore,
				limit,
				goodsList
			} = this.data;

			if (currentPage) {
				page = 0;
				loadMore = true;
				this.setData({
					page,
					loadMore
				});
				goodsList = [];

				app.$store.point.update({
					goodsList
				})
			}

			if (!loadMore) {
				return;
			}

			page++;

			app.$api.getPointExchangeInfo({
				pageIndex: page,
				pageSize: limit,
				type: 0
			}).then(
				(res) => {
					const {
						Data: {
							PointProductList,
							TotalRecords
						}
					} = res;
					const maxPage = Math.ceil(Number(TotalRecords) / limit) || 1;
					goodsList = goodsList.concat(PointProductList);
					loadMore = page >= maxPage ? false : true;

					app.$store.point.update({
						goodsList
					})

					this.setData({
						page,
						loadMore
					});
					wx.stopPullDownRefresh();
				}
			);
		},
	},

	
	onPullDownRefresh() {
		this.getList(1);
		console.log("下拉刷新");
	},

	onReachBottom() {
		this.getList();

	},
}))