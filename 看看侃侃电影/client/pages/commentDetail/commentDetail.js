// pages/commentDetail/commentDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
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
            tapeComment: null,
            times: ""

        },
        actionSheetHidden: true,
        actionSheetItems: ['文字', '音频'],
        collected: false
    },

   /**
   * 获取指定影评ID的影评详情
   */
    GetComment(id) {
        wx.showLoading({
            title: '影评详细数据加载中...',
        })

        qcloud.request({
            url: config.service.commentDetail + id,
            success: result => {
                wx.hideLoading()

                console.log(result.data);
               
                if (!result.data.code) {
                    let movie = {
                        id: result.data.data.movieid,
                        title: result.data.data.title,
                        image: result.data.data.image
                    }
                    let comment = {
                        id: id,
                        username: result.data.data.username,
                        avatar: result.data.data.avatar,
                        commentType: result.data.data.txtComment === null ? '音频' : '文字',
                        txtComment: result.data.data.txtComment,
                        tapeComment: result.data.data.tapeComment,
                        times: result.data.data.times
                    }
                    this.setData({
                        movie: movie,
                        comment: comment
                    })
                    this.isCollected()
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
            url: config.service.shelfcommentDetail + this.data.movie.id,
            login: true,
            success: result => {
                wx.hideLoading()

                console.log(result.data);

                if (!result.data.code) {
                    //如果我已对该电影发布了影评,则通过更新Data,使页面自动刷新
                    if (result.data.data.id != -1){
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
                            comment: comment
                        })
                        //更新当前影评的收藏情况
                        this.isCollected()
                    } else {
                        //如果我还没有对该电影发布影评,则弹出底部菜单
                        cb && cb() }
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
        this.GetShelfComment(()=>{
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
            url: '/pages/edit-comment/edit-comment?from=commentDetail&id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image + '&commenttype=' + e.currentTarget.dataset.name,
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
    * 获取当前影评的收藏情况
    */
    isCollected(){
        var postsCollection = wx.getStorageSync('posts_collection')
        if (postsCollection) {
            var postCollected = postsCollection[this.data.comment.id]
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            } else {
                this.setData({
                    collected: false
                })
            }
        } else {
            var postsCollection = {}
            postsCollection[this.data.comment.id] = false
            wx.setStorageSync('posts_collection', postsCollection)
            this.setData({
                collected: false
            })
        }
    },

    /**
    * 变更当前影评的收藏情况
    */
    onCollectionTap(event) {
        var postsCollection = wx.getStorageSync('posts_collection')
        let postCollected = postsCollection[this.data.comment.id]

        postCollected = !postCollected
        postsCollection[this.data.comment.id] = postCollected

        wx.setStorageSync('posts_collection', postsCollection)

        this.setData({
            collected: postCollected
        })

    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var commentID = options.id

        this.GetComment(commentID)   

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
      this.setData({
          actionSheetHidden: true
      })

  }

})