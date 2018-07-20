const app = getApp();

Page({
  data: {
    userInfo:null
  },
  onLoad() {
    app.getUserInfo().then(user => {
      console.info(user)
      this.setData({
        userInfo:user
      })
    }
    );
  },
  coalitionRecord() {
    my.redirectTo({ url: '../recordList/recordList' });
  },
});
