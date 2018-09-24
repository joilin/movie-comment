// pages/movieDetail/movieDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
        movie: {},
        movieId: null,
        actionSheetHidden: true,
        actionSheetItems: ['文字', '音频']
    },

   /**
   * 获取电影详情
   */
    GetMovie(movieId) {
        wx.showLoading({
            title: '电影信息数据加载中...',
        })
        
        qcloud.request({
            url: config.service.movieDetail + movieId,
            success: result => {
                wx.hideLoading()

                if (!result.data.code) {
                    this.setData({
                        movie: result.data.data,
                        movieId: movieId
                    })
                } else {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 2000)
                }
            },
            fail: () => {
                wx.hideLoading()

                setTimeout(() => {
                    wx.navigateBack()
                }, 2000)
            }
        })
    },

   /**
   * 获取关于该电影我发布的影评详情
   */
    GetShelfComment(cb) {
         wx.showLoading({
            title: '我的影评详细数据加载中...',
        })

        qcloud.request({
            url: config.service.shelfcommentDetail + this.data.movieId,
            login: true,
            success: result => {
                wx.hideLoading()

                console.log(result.data);

                if (!result.data.code) {

                    if (result.data.data.id != -1) {
                        //如果我已对该电影发布了影评,则跳转到我对此影片的影评详情页
                        wx.navigateTo({
                            url: '/pages/commentDetail/commentDetail?id=' + result.data.data.id,
                        }) 
                       
                    } else {
                        //如果我还没有对该电影发布影评,则弹出底部菜单
                        cb && cb()
                    }
                } else {
                    this.tip("我的影评取得失败")
                    cb && cb()
                }
            },
            fail: () => {
                wx.hideLoading()
                this.tip("我的影评取得失败")
                cb && cb()
            }
        })
    },

    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },

    actionSheetTap: function (e) {
        this.GetShelfComment(() => {
            this.setData({
                actionSheetHidden: !this.data.actionSheetHidden
            })
        })

    },

    actionSheetChange: function (e) {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    
    bindItemTap: function (e) {
        wx.navigateTo({
            url: '/pages/edit-comment/edit-comment?from=movieDetail&id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image + '&commenttype=' + e.currentTarget.dataset.name,
        })
    },

    onTapLogin: function () {
        app.login({
            success: ({ userInfo }) => {

                this.setData({
                    userInfo
                })
            }
        })

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.GetMovie(options.id)
      this.setData({
          actionSheetHidden: true
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
    onShow: function () {
        this.setData({
            actionSheetHidden: true
        })
    }
})