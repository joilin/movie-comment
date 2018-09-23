// pages/edit-comment/edit-comment.js
const app = getApp()

const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'mp3',
    frameSize: 50
}
Page({

  /**
   * 页面的初始数据
   */
    data: {
        userInfo: null,
        movie: {
            id:"",
            title: "",
            image: ""
        },
        comment: {
            commentType: "",
            txtComment: "",
            tapeComment: "",
            times:0
        },
  
        tapeStartTime: null,
        tapeEndTime: null
    },
   
  /**
   * 文字影评输入事件处理
   */
    commentInput: function (e) {
        let comment = {
            commentType: "文字",
            txtComment: e.detail.value,
            tapeComment: "",
            times:null
        }
        this.setData({
            comment: comment
        })
    },

  /**
   * 音频影评输入开始事件处理
   */
    startTape(){
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000
        this.setData({
            tapeStartTime: timestamp
        })

        this.recorderManager.start(options);

    },
    
  /**
   * 音频影评输入结束事件处理
   */
    endTape() { 
        this.recorderManager.stop()
    },   

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        let commentType = options.commenttype
        let txtComment
        let tapeComment
        let times

        if (options.from === 'preview')  {
            if (commentType === '文字') { 
                txtComment = options.content
                tapeComment = ""
                times = null
            }
        } else {
            if (commentType === '文字') {
                txtComment = ""
                tapeComment = ""
            }
        }

        let movie = {
            id: options.id,
            title: options.title,
            image: options.image 
        } 
        let comment = {
            commentType: commentType,
            txtComment: txtComment,
            tapeComment: tapeComment,
            times: times
        }
   
        this.setData({
            movie: movie,
            comment: comment
        })

        var that = this;
        this.recorderManager = wx.getRecorderManager();
        this.recorderManager.onError(function () {
            that.tip("录音失败！")
        })
        this.recorderManager.onStop(function (res) {
            var timestamp = Date.parse(new Date())
            timestamp = timestamp / 1000
            that.setData({
                tapeEndTime: timestamp
            })

            let times = that.data.tapeEndTime - that.data.tapeStartTime
            let comment = {
                commentType: "音频",
                txtComment: "",
                tapeComment: res.tempFilePath,
                times: times
            }

            that.setData({
                comment: comment
            })

            that.tip("录音完成！")
        });
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

    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },

    onTapCard(event) {
        let content = this.data.comment.commentType === '文字' ? this.data.comment.txtComment : this.data.comment.tapeComment
        let index = content.indexOf("=");
        let filename = this.data.comment.commentType === '文字' ? '' : content.substring(index+1)

        wx.navigateTo({

            url: '/pages/preview-comment/preview-comment?movieId=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image + '&commenttype=' + this.data.comment.commentType + '&times=' + this.data.comment.times + '&content=' + content + '&filename=' + filename
        })
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
      app.checkSession({
          success: ({ userInfo }) => {
              this.setData({
                  userInfo: userInfo
              })
          },
          error: () => { }
      })
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