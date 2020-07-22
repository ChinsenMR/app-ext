// import Create from '../../utils/store/common/create';


const app = getApp()
const connect = app.mapToData(function (state, opt) {
  return {
    myName: state.user.name,
    goodsCount: state.cart.goodsCount
  }
})

export default connect