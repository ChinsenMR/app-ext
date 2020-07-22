const app = getApp();

Page(app.$page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    goodsCartList: [],
    totalPrice: 0, // 总价
    goodsTotal: 0, //商品条数
    selectAllStatus: true, // 全选

    magnitudeObj: {}, //等于判断数据
  },
  state: {
    point: ['goodsCartList', 'totalPrice', 'totalCount'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getPointCart();
  },

  methods: {

    // 初始化页面数据
    getPointCart() {

      let {
        goodsTotal,
        totalPrice
      } = this.data;

      goodsTotal = 0;
      totalPrice = 0

      app.$api.getPointCart().then((res) => {

        const {
          errorMsg,
          success,
          Data = {}
        } = res;

        if (!Data) {
          return 
        }

    
        const giftList = Data.LineGifts || []

        giftList.forEach((item) => {
          item.status = true;
          item.clearStatus = false;
          item.Quantity = parseInt(item.Quantity);
          item.ItemAdjustedPrice = parseFloat(item.ItemAdjustedPrice);
          item.MemberPrice = parseFloat(item.MemberPrice);
          totalPrice += Number(item.NeedPoint * item.Quantity);
        });

        const count = giftList.map(d => d.Quantity);

        count.forEach(t => {
          goodsTotal += t;
        })

        app.$store.point.update({
          goodsCartList: giftList,
          totalPrice,
          totalCount: goodsTotal
        })

      });
    },

    /*改变商品的数量 */
    changeNum(e) {

      const {
        goodsCartList
      } = this.data;
      const {
        currentTarget: {
          dataset: {
            id,
            num
          }
        }
      } = e;


      const currentIndex = goodsCartList.findIndex(v => v.GiftId === id);

      if (num === -1 && goodsCartList[currentIndex].Quantity === 1) {
        return
      }


      app.$api.alterPointCartItemCount({
        giftId: id,
        Quantity: num,
      }).then((res) => {

        const {
          success,
          Msg
        } = res;

        if (!success) {
          return app.alert.message(Msg)
        }

        num === -1 ? goodsCartList[currentIndex].Quantity-- : goodsCartList[currentIndex].Quantity++

        app.$store.point.update({
          goodsCartList
        })
        this.getPointCart();
      });

    },
    goBack(){
      wx.navigateBack()
    },


    //删除商品
    removeGoods(e) {
      const {
        currentTarget: {
          dataset: {
            id
          }
        },
        detail: {
          instance,
        }
      } = e;

      const {
        goodsCartList
      } = this.data;



      app.alert.confirm({
        content: '确认删除'
      }, isConf => {
        if (!isConf) {
          return instance.close();
        }

        app.$api.deletePointCartItem({
          giftId: id,
        }).then((res) => {
          if (res.success) {
            const index = goodsCartList.findIndex(v => v.GiftId === id);

            goodsCartList.splice(index, 1);

            app.$store.point.update({
              getPointCart: this.data.getPointCart
            })

            instance.close();
          }
        });
      })

    },
  },

}));