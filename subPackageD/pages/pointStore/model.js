const app = getApp()
const connect = app.mapToData(function (state, opt) {
  const {
    goodsCartList,
    totalPrice,
    totalCount
  } = state.point;

  return {
    goodsCartList,
    totalPrice,
    totalCount
  }
})

export default connect