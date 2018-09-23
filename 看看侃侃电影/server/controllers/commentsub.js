const DB = require('../utils/db.js')

module.exports = {
    /**
     * 获取收藏影评列表
     * 
     */
    /*postCommentlist: async ctx => {
        let commentIds = ctx.request.query.comment_id_list
        commentIds = commentIds.substring(1, commentIds.length-1)
        
        if (commentIds!='') {
            ctx.state.data = await DB.query('SELECT movieComment.movieID as `movieid`, movieComment.username as `username`, movieComment.avatar as `avatar`, movieComment.txtComment as `txtComment`, movieComment.tapeComment as `tapeComment`, movieComment.times as `times`, movies.title as `title`, movies.image as `image` FROM movieComment LEFT JOIN movies ON movieComment.movieID = movies.id WHERE movieComment.id in (' + commentIds + ')')
        } else {
            ctx.state.data = {}
        }
    },*/

/**
 * 获取我已发布的影评列表
 * 
 */
    shelfCommentList: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId

        var sql = 'SELECT movieComment.id as `id`, movieComment.movieID as `movieid`, movieComment.username as `username`, movieComment.avatar as `avatar`, movieComment.txtComment as `txtComment`, movieComment.tapeComment as `tapeComment`, movieComment.times as `times`, movies.title as `title`, movies.image as `image` FROM movieComment LEFT JOIN movies ON movieComment.movieID = movies.id WHERE movieComment.user = ? '

        ctx.state.data = await DB.query(sql, [user])

    
    },

/**
 * 获取我的影评详细
 * 
 */
    shelfCommentDetail: async ctx => {
        var movieId = + ctx.params.movieid
        let user = ctx.state.$wxInfo.userinfo.openId

        var sql = 'SELECT movieComment.id as `id`, movieComment.movieID as `movieid`, movieComment.username as `username`, movieComment.avatar as `avatar`, movieComment.txtComment as `txtComment`, movieComment.tapeComment as `tapeComment`, movieComment.times as `times`, movies.title as `title`, movies.image as `image` FROM movieComment LEFT JOIN movies ON movieComment.movieID = movies.id WHERE movieComment.movieID = ? and movieComment.user = ? '

        if (!isNaN(movieId)) {

            let sqlResult = await DB.query(sql, [movieId, user])

            if (sqlResult.length > 0){
                ctx.state.data = sqlResult[0]
            } else {
                let ret = []

                ret.push({
                    id: -1
                })

                ctx.state.data = ret[0]
            }

        } else {
            ctx.state.data = {}
        }
    }

}