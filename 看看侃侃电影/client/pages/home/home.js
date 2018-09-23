// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
    data: {
        movie: {
            id: "",
            title: "",
            image: ""
        },
        comment: {
            id: "",
            username: "",
            avatar: "",
            commentType: "",
            txtComment: "",
            tapeComment: "",
            times: ""
        },
        curCommentID:null
  
    },
    
  /**
   * 获取随机影评数据
   */
    GetRandomComment(){
        wx.showLoading({
            title: '随机影评数据加载中...',
        })

        qcloud.request({
            url: config.service.commentDetail + -1, //将影评ID 设置成 -1 
            success: result => {
                wx.hideLoading()
                console.log(result);

                if (!result.data.code) {
  
                    //还没有影评的情况
                    if (result.data.data.id == -1){
                        this.setData({
                            curCommentID: -1
                        })
                    } else {
                        //获取到随机影评数据
                        let movie = {
                            id: result.data.data.movieid,
                            title: result.data.data.title,
                            image: result.data.data.image
                        }
                        let comment = {
                            id: result.data.data.id,
                            username: result.data.data.username,
                            avatar: result.data.data.avatar,
                            commentType: result.data.data.txtComment === null ? '音频' : '文字',
                            txtComment: result.data.data.txtComment,
                            tapeComment: result.data.data.tapeComment,
                            times: result.data.data.times
                        }

                        this.setData({
                            movie: movie,
                            comment: comment,
                            curCommentID: result.data.data.id
                        })
                    }                    
                } else {
                     wx.showToast({
                        icon: 'none',
                        title: '随机影评数据加载失败'
                    })
                }
            },
            fail: () => {
                wx.hideLoading()

                wx.showToast({
                    icon: 'none',
                    title: '随机影评数据加载失败'
                })
            }
        })
    },

  /**
   * 点击海报图需跳转至电影详情页
   */
    onTapMovie(e) {
        wx.navigateTo({
            url: '/pages/movieDetail/movieDetail?id=' + this.data.movie.id,
        })
    },

  /**
   * 点击 "XX给你推荐了一部电影"跳转至该推荐人对此影片的影评详情页
   */
    onTapComment(e){
        wx.navigateTo({
            url: '/pages/commentDetail/commentDetail?id=' + this.data.comment.id,
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        this.GetRandomComment()
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