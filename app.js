App({
  getUserInfo() {
    return new Promise((resove, reject) => {
      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          my.getAuthUserInfo({
            success: res => {
              let userInfo = res;
              userInfo.id = authcode.authCode
              my.httpRequest({
                url: 'http://www.yndxz.com/index/index/index/getAuthUserInfo',
                method: 'POST',
                data:userInfo,
                dataType: 'json',
                success: function (res) {
                     resove(userInfo);
                },
                fail(res){
                   reject('获取用户信息失败!')
                }
              });
            },
            fail: () => {
              reject('获取用户信息失败!')
            },
          });
        },
        fail: () => {
          reject('获取用户信息失败!');
        },
      });
    })
  },
});
