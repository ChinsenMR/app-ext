const app = getApp();

Page(app.$page({
  data: {},
  state: {
    user: ['name', 'wallet'],
    cart: ['goodsCount']
  },
  methods: {
    buyGoods() {
      if (this.data.wallet < 20) {
        return app.alert.message('你儿子没钱了')
      }
      app.$store.user.update({
        wallet: this.data.wallet - 20
      })
    },
    onChangeCount(e) {
      app.$store.cart.update({
        goodsCount: this.data.goodsCount += 1
      })

    },
  },
}))