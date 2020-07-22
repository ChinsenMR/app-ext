const app = getApp();
Component({
  properties: {
    wallet: {
      type: Number,
      value: 0
    }
  },
  methods: {
    lost() {
      if (this.data.wallet < 3) {
        return app.alert.message('你没钱了')
      }
      app.$store.user.update({
        wallet: this.data.wallet - 3
      })
    },

  }
})