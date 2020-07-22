import {
  observe,
} from '../utils/store/index'

class CartStore {
  constructor() {
    this.goodsCount = 15
  }

  /* 通用修改值的方法 */
  update(obj) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key]
    })
  }
}

export default observe(new CartStore(), 'cart')