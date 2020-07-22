// import Create from '../../utils/store/common/create';


const app = getApp()
const connect = app.mapToData(function (state, opt) {
  const {
    point,
    detailList,
    goodsList
  } = state.point;
  
  return {
    point,
    detailList,
    goodsList
  }
})

export default connect