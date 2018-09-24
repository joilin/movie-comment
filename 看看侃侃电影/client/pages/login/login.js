// client/pages/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
        userInfo: null,
    },

    onTapLogin: function () {
        app.login({
            success: ({ userInfo }) => {

                this.setData({
                    userInfo
                })
                wx.navigateBack()
            }
        })

    }
})