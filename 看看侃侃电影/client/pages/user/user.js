// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

      userInfo: null,
      currentTab: 0,
      commentSort: [{id:0, title:'已收藏的'},
                    {id:1, title: '已发布的'}],
      indicatorDots: false,
      autoplay: false,
      interval: 0,
      duration: 0,

      postcommentList: [],
      shelfcommentList: [],
      allCommentList: [{ id: 0, commentList: []},
                        { id: 1, commentList: []}],
      collection: [],

  },

    GetPostCommentList(cb) {
        let postcommentList = []
 
        qcloud.request({
            url: config.service.commentList,
            data: {
                movie_id: null,
                comment_id_list: this.data.collection
            },
            success: result => {
                let data = result.data
                console.log(result)

                if (!data.code) {
                    postcommentList = result.data.data
                    cb && cb(postcommentList)
                }
            },
            fail: () => {
                console.log("GetPostCommentList, fail")
            }
        })
    },

    GetShelfCommentList(cb) {
        let shelfcommentList = []
        qcloud.request({
            url: config.service.shelfCommentList,
            login: true,
            success: result => {
                let data = result.data
                console.log(result)
                if (!data.code) {
                    shelfcommentList = result.data.data
                    cb && cb(shelfcommentList)
                }                
            },
            fail: () => {
                console.log("GetShelfCommentList, fail")
            }
        })
    },

    GetAllCommentList(){
        let multiCommentList = []

        //取得我已收藏的
        this.GetPostCollection()
        if (this.data.collection.length > 0) {
            this.GetPostCommentList(postcommentList => {
                this.setData({
                    postcommentList: postcommentList
                })
                multiCommentList.push({
                    id: 0,
                    commentList: this.data.postcommentList
                })
            })
        } else {
            multiCommentList.push({
                id: 0,
                commentList: this.data.postcommentList
            })
        }

        //取得我已发布的
        this.GetShelfCommentList(shelfcommentList => {
            this.setData({
                shelfcommentList: shelfcommentList
            })
            multiCommentList.push({
                id: 1,
                commentList: this.data.shelfcommentList
            })
            this.setData({
                allCommentList: multiCommentList,
                currentTab: 0
            })
        })
    },

    swiperChange: function (e) {
        this.setData({
            currentTab: e.detail.current,
        });

    },

    swichNav: function (e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: e.target.dataset.current,
            })
        }
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        this.GetAllCommentList()
    },

    GetPostCollection(){
        let collection = []
        let collectionnew =1
        let collectionMap = wx.getStorageSync('posts_collection')

        for (let k of Object.keys(collectionMap)) {
            if (collectionMap[k]) {
                collection.push(parseInt(k))
            }
        }

        this.setData({
            collection: collection
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

      this.GetAllCommentList()

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