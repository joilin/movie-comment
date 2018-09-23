// pages/movieList/movieList.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
    data: {
        movieList:[]
    },

  /**
   * 获取热门电影列表
   */
    GetMovieList(){
        wx.showLoading({
            title: '热门电影数据加载中...',
        })

        qcloud.request({
            url: config.service.movieList,
            success: result => {
                wx.hideLoading()
                console.log(result)
                if (!result.data.code) {
                    this.setData({
                        movieList: result.data.data
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '热门电影数据数据加载错误',
                    })
                }
            },

            fail: result => {
                wx.hideLoading()

                wx.showToast({
                    icon: 'none',
                    title: '热门电影数据数据加载错误',
                })
            }
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.GetMovieList()
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