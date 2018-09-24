// pages/preview-comment/preview-comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
        userInfo: null,
        movie: {
            id: "",
            title: "",
            image: ""
        },
        comment: {
            commentType: "",
            txtComment: "",
            tapeComment: "",
            times: "",
        }
    },

  /**
   * 上传音评影评数据
   */
    uploadVoice(cb) {
        let tapeComment = this.data.comment.tapeComment
        let voice = ""

        if (tapeComment) {            
            wx.uploadFile({
                url: config.service.uploadUrl,
                filePath: tapeComment,
                name: 'file',
                success: res => {
                    let data = JSON.parse(res.data)
                    console.log(data)
                    if (!data.code) {
                        voice=data.data.imgUrl
                    }  
                    cb && cb(voice)
                },
                fail: () => {       
                }
            }) 
        }
    }, 

  /**
   * 发布文字影评数据
   */
    addTxtComment(event) {
        let txtComment = this.data.comment.txtComment
        if (!txtComment) return

        wx.showLoading({
            title: '正在发布影评'
        })

        qcloud.request({
            url: config.service.addComment,
            login: true,
            method: 'PUT',
            data: {
                txtComment: txtComment,
                tapeComment: null,
                movie_id: this.data.movie.id,
            },
            success: result => {
                wx.hideLoading()

                let data = result.data

                if (!data.code) {
                    wx.showToast({
                        title: '发表影评成功'
                    })
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/commentList/commentList?movieId=' + this.data.movie.id
                        })
                    }, 1500)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '发表影评失败'
                    })
                }
            },
            fail: () => {
                wx.hideLoading()

                wx.showToast({
                    icon: 'none',
                    title: '发表影评失败'
                })
            }
        })
    },

  /**
   * 发布音频影评数据
   */
    addTapeComment(event) {

        wx.showLoading({
            title: '正在发表评论'
        })

        this.uploadVoice(voice => {
            console.log('voice:' + voice)
             qcloud.request({
                url: config.service.addComment,
                login: true,
                method: 'PUT',
                data: {
                    txtComment: '',
                    tapeComment: voice,
                    movie_id: this.data.movie.id,
                    times: this.data.comment.times
                },
                success: result => {
                    wx.hideLoading()

                    let data = result.data

                    if (!data.code) {
                        wx.showToast({
                            title: '发表评论成功'
                        })
                        setTimeout(() => {
                            wx.navigateTo({
                                url: '/pages/commentList/commentList?movieId=' + this.data.movie.id
                            })
                        }, 1500)
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '发表评论失败'
                        })
                    }
                },
                fail: () => {
                    wx.hideLoading()

                    wx.showToast({
                        icon: 'none',
                        title: '发表评论失败'
                    })
                }
            })
        })
    },

  /**
   * 发布影评(文字,音频)按钮事件处理
   */
    addComment(event){
 
        if (this.data.comment.commentType==='文字'){
            this.addTxtComment(event)
        } else {
            this.addTapeComment(event)
        }
    },


  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        let movie = {
            id: options.movieId,
            title: options.title,
            image: options.image,
        }
        let txtComment=""
        let tapeComment=""
        if (options.commenttype==='文字') {
            txtComment = options.content
        } else {
            tapeComment = options.content + '=' + options.filename
        }

        let comment = {          
            commentType: options.commenttype,
            txtComment: txtComment,
            tapeComment: tapeComment,
            times: options.times
        }

        this.setData({
            movie: movie,
            comment: comment,
        })

        var that = this
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            console.log(res)
            that.tip("播放录音失败！")
        })
        this.innerAudioContext.onPlay((res) => {
            that.tip("开始播放")
        })
    },

  /**
   * 播放音频影评
   */
    playRecord: function () {
        var that = this;
        let src = this.data.comment.tapeComment;
        if (src == '') {
            this.tip("请先录音！")
            return;
        }
        this.innerAudioContext.src = src;
        this.innerAudioContext.play()
    },

    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
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

  }
})