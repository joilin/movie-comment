// pages/commentList/commentList.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
    data: {
        commentList: [],
        movieId: ""
    },

  /**
   * 获取指定电影ID的影评列表
   */
    GetCommentList(cb) {
        qcloud.request({
            url: config.service.commentList,
            data: {
                movie_id: this.data.movieId,
                comment_id_list: null
            },
            success: result => {
                let data = result.data

                if (!data.code) {
                    this.setData({
                        commentList: result.data.data
                    })
                }
            },
            complete: () => {
                cb && cb()
            }
        })
    },

  /**
   * 跳转到指定影评ID的影评详细页面
   */
    onTapCard(event) {
        wx.navigateTo({
            url: '/pages/commentDetail/commentDetail?id=' + event.currentTarget.dataset.id ,
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          movieId: options.movieId
      })
      this.GetCommentList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.GetCommentList(() => {
          wx.stopPullDownRefresh()
      })
  }

})