const app = getApp();
Page({
  data: {
    receiptCodelist: [
      {
        'icon': './../../assets/alipay.png',
        'text': '扫描/相册中选择支付宝收款码',
        'type': 'alipay',
        'getPath': '如何获取支付宝收款码'
      },
      {
        'icon': './../../assets/weichat.png',
        'text': '扫描/相册中选择微信收款码',
        'type': 'weichat',
        'getPath': '如何获取微信收款码'
      },
      {
        'icon': './../../assets/qq.png',
        'text': '扫描/相册中选择QQ收款码',
        'type': 'qq',
        'getPath': '如何获取支QQ收款码'
      }
    ],
    alipayCode: '',
    weichatCode: '',
    qqCode: '',
    regList: {
      'alipay': {
        'reg': /HTTPS\:\/\/QR\.ALIPAY\.COM\/*?/,
        'text': '不是有效的支付宝付款码!'
      },
      'weichat': {
        'reg': /wxp\:\/\/*?/,
        'text': '不是有效的微信付款码!'
      },
      'qq': {
        'reg': /https\:\/\/i\.qianbao\.qq\.com\/wallet\/sqrcode\.htm/,
        'text': '不是有效的QQ付款码!'
      }
    },
    codeUrl: ''
  },
  onLoad() {
  },
  onSelectPayCode(event) {
    let codeType = event.currentTarget.dataset.type;
    my.scan({
      type: 'qr',
      success: (res) => {
        let regItem = this.data.regList[codeType];
        if (regItem.reg.test(res.qrCode)) {
          switch (codeType) {
            case 'alipay':
              this.setData({ alipayCode: res.qrCode });
              break;
            case 'weichat':
              this.setData({ weichatCode: res.qrCode });
              break;
            case 'qq':
              this.setData({ qqCode: res.qrCode });
              break;
          }
        } else {
          my.alert({
            title: '提示',
            content: regItem.text,
            buttonText: '我知道了',
          });
        }
      },
      fail(res) {
        if (res.code == 10) {
          my.showToast({
            type: 'fail',
            content: '你取消了操作!',
            duration: 2000,
          });
        } else {
          my.showToast({
            type: 'fail',
            content: '操作失败!',
            duration: 2000,
          });
        }
      }
    });
  },
  onShareAppMessage() {
    return {
      title: '收款码三合一',
      desc: '三合一收款码合并，目前支持三种收款二维码合并，技术合并，让商家收款更快捷',
    };
  },
  pay() {
    let _this = this;
    if (_this.data.alipayCode == '' && _this.data.weichatCode == '' && _this.data.qqCode == '') {
      my.showToast({
        type: 'none',
        content: '请选择付款码',
        duration: 2000,
      });
      return;
    }
    app.getUserInfo().then(user => {
      this.setData({
        user,
      })
      my.httpRequest({
        url: 'http://www.yndxz.com/index/index/index/getJsAliPayAppParams',
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          my.tradePay({
            orderStr: res.data.data, //完整的支付参数拼接成的字符串，从服务端获取
            success: (res) => {
              console.log(JSON.stringify(res));
              switch (res.resultCode) {
                case '9000':
                  my.httpRequest({
                    url: 'http://www.yndxz.com/index/index/index/coalition',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                      alipaycode: _this.data.alipayCode,
                      weichatcode: _this.data.weichatCode,
                      qqcode: _this.data.qqCode,
                    },
                    success: function (res) {
                      if (res.data.status == 1) {
                        _this.setData({ 'codeUrl': 'http://qr.liantu.com/api.php?text=http://www.yndxz.com?codeId=' + res.data.data })
                        my.showToast({
                          type: 'none',
                          content: '合并成功',
                          duration: 2000,
                        });
                        _this.setData({ alipayCode: '' });
                        _this.setData({ alipayCode: '' });
                        _this.setData({ qqCode: '' });
                      } else {
                        my.showToast({
                          type: 'none',
                          content: '合并失败，请重新选择付款码进行合并',
                          duration: 2000,
                        });
                      }
                    },
                    fail(res) {
                      my.showToast({
                        type: 'none',
                        content: '合并失败，请重新选择付款码进行合并',
                        duration: 2000,
                      });
                    }
                  });
                  break;
                case '6001':
                  my.showToast({
                    type: 'none',
                    content: '您取消了支付',
                    duration: 2000,
                  });
                  break;
                case '4000':
                  my.showToast({
                    type: 'none',
                    content: '订单支付失败',
                    duration: 2000,
                  });
              }
            },
            fail: (res) => {
              my.showToast({
                type: 'none',
                content: '支付失败',
                duration: 2000,
              });
            }
          });
        },
        fail(res) {
          my.showToast({
            type: 'none',
            content: '支付失败',
            duration: 2000,
          });
        }
      });
    }
    ).catch(res => {
      my.showToast({
        type: 'fail',
        content: res,
        duration: 2000,
      });
    });
  },
  saveCode(event) {
    let codeUrl = event.currentTarget.dataset.url;
    my.showActionSheet({
      items: ['保存到手机'],
      success: (res) => {
        if (res.index == 0) {
          my.saveImage({
            showActionSheet: false,
            url: codeUrl,
            success(res) {

            },
            fail(res) {
              my.showToast({
                type: 'none',
                content: '付款码保存失败',
                duration: 2000,
              });
            }
          });
        }
      },
    });
  }
});
