/**
 * Author: Chinsen
 * Desc: 工具库 
 * 使用方式：
  const verifys = [
    app.verify.email('谁卡啊'),
    app.verify.name('11'),
    app.verify.idCard()
  ]
  verifys.forEach(v => !v.verify && v.error())
 */

export default {
  /* 验证姓名 */
  name(text) {
    const rule = /^[\u4E00-\u9FA5A-Za-z]{2,8}$/;
    const result = {
      error: () => wx.showToast({
        title: "请输入2-8位中文或英文名字",
        icon: "none",
      }),
      verify: rule.test(text)
    }

    return result;
  },
  /* 校验身份证号 */
  idCard(text) {
    const rule = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    const result = {
      error: () => wx.showToast({
        title: "请填写正确身份证",
        icon: "none",
      }),
      verify: rule.test(text)
    }

    return result;
  },
  /* 验证v邮箱 */
  email(text) {
    const rule = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    const result = {
      error: () => wx.showToast({
        title: "请输入正确的邮箱格式",
        icon: "none",
      }),
      verify: rule.test(text)
    }

    return result;
  },
  /* 校验银行卡号 */
  bankCardId(text) {
    const rule = /\d{15}|\d{19}/;
    const result = {
      error: () => wx.showToast({
        title: "请输入正确的银行卡号",
        icon: "none",
      }),
      verify: rule.test(text)
    }

    return result;
  },
  /* 校验手机号 */
  mobile(text) {
    const result = {
      error: () => wx.showToast({
        title: "请填写正确手机号",
        icon: "none",
      }),
      verify: /^1[3456789]\d{9}$/.test(text)
    }

    return result;
  },
  /* 校验是否为空 */
  field(text) {
    const verify = text !== "" && ![null, undefined, NaN].includes(text);

    const result = {
      error: () => wx.showToast({
        title: "您的输入有误",
        icon: "none",
      }),
      verify
    }

    return result;
  },
  /* 正整数校验 */
  isInt(text) {
    const verify = String(text) && !text.match(/[-.]/g) && Number(text) > 0;

    const result = {
      error: () => wx.showToast({
        title: "请输入正整数",
        icon: "none",
      }),
      verify
    }

    return result;
  },
  /**
   * 校验所有参数
   *  app.verify.verifyAllField(
        app.verify.name('陈静'),
        app.verify.email('2645800@qq.com'),
        app.verify.idCard(440582199607117219)
      ).then(res => {
        console.log(res 为布尔值,'参数')
      })
   * @param  {...any} args 
   */
  async verifyAllField(...args) {
    const checked = args.map(field => {
      if (!field.verify) {
        field.error()
      }
      return field.verify
    })

    return checked.indexOf(false) === -1;
  }
};