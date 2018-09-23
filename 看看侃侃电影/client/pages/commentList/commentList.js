// pages/commentList/commentList.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
    data: {
        commentList: []
    },

  /**
   * 获取指定电影ID的影评列表
   */
    GetCommentList(movieId) {
        qcloud.request({
            url: config.service.commentList,
            data: {
                movie_id: movieId,
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
      this.GetCommentList(options.movieId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})