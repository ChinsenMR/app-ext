// packageA/pages/MyCollection/MyCollection.js

import { getCollectList, handleCollect } from '../../../utils/requestApi';

const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		imgurl: app.data.imgurl,
		collectList: [],
		checked: false,
		edit: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.initData();
	},
	initData() {
		getCollectList().then((res) => {
			const { Data } = res.data;

			Data.forEach((item) => {
				item.checked = false;
			});

			this.setData({
				collectList: Data,
			});
		});
	},
	/* 全选 */
	onChange(event) {
		const { detail } = event;

		const { collectList } = this.data;

		collectList.forEach((item) => {
			item.checked = event.detail;
		});

		this.setData({ collectList, checked: detail });
	},
	/* 单独选中 */
	checkItem(e) {
		const { collectList } = this.data;

		const {
			detail,
			currentTarget: {
				dataset: { index },
			},
		} = e;

		this.setData({ [`collectList[${index}].checked`]: detail });

		const hasCheked = collectList.find((item) => !item.checked);

		this.setData({ checked: !Boolean(hasCheked) });
	},
	/* 点击删除 */
	removeItems() {
		const { collectList } = this.data;

		const checkList = collectList.filter((item) => item.checked);

		const result = checkList.map((item) => item.ProductId);

		const resList = [];

		const asyncFn = async () => {
			return new Promise((resolve, rejcet) => {
				result.forEach((ProductId) => {
					handleCollect({ ProductId }).then((res) => {
						resList.push(res.data);

						resolve(resList);
					});
				});
			});
		};

		asyncFn().then((res) => {
			wx.showToast({ title: '操作成功' });

			this.setData({
				checked: false,
				edit: false,
			});

			this.initData();
		});
	},
	// 跳转详情
	seeDetail(e) {
		if (this.data.edit) return;

		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?prDid=${e.currentTarget.dataset.productid}`,
		});

		wx.setStorageSync('buyType', 'fightgroup');
	},
	onClickLeft() {
		wx.showToast({ title: '点击返回', icon: 'none' });
	},
	onClickRight() {
		this.setData({ edit: !this.data.edit });
	},

	
});
