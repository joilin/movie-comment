//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    checkSession({ success, error }) {
        wx.checkSession({
            success: () => {
                this.getUserInfo({ success, error })
            },
            fail: () => {
                error && error()
            }
        })
    },
    login({ success, error }) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo'] === false) {
                    console.log('login UNAUTHORIZED')
                    wx.showModal({
                        title: '提示',
                        content: '请授权我们获取您的用户信息',
                        showCancel: false,
                    })
                } else {
                    console.log('login AUTHORIZED')
                    this.doQcloudLogin({ success, error })
                }
            }
        })
    },
    doQcloudLogin({ success, error }) {
        
        qcloud.login({
            success: result => {
                if (result) {
                    let userInfo = result
                    success & success({
                        userInfo
                    })
                } else {
                    this.getUserInfo({ success, error })
                }
            },
            fail: () => {
                error && error()
            }
        })
    },

    getUserInfo({ success, error }) {
        if (userInfo) {
            return userInfo
        }
        qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success: result => {
                let data = result.data
                console.log(result)
                if (!data.code) {
                    let userInfo = data.data
                    userInfo = data.data
                    success && success({
                        userInfo
                    })
                } else {
                    error && error()
                }
            },
            fail: () => {
                error && error()
            }
        })
    },
})