const DB = require('../utils/db.js')

module.exports = {
    /**
     * 添加影评
     * 
     */
    add: async ctx => {
        let user = ctx.state.$wxInfo.userinfo.openId
        let username = ctx.state.$wxInfo.userinfo.nickName
        let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

        let movieId = +ctx.request.body.movie_id
        let txtComment = ctx.request.body.txtComment || null
        let tapeComment = ctx.request.body.tapeComment || null
        let times = ctx.request.body.times || null
        

        if (!isNaN(movieId)) {
            await DB.query('INSERT INTO movieComment(movieID, user, username, avatar, txtComment, tapeComment, times) VALUES (?, ?, ?, ?, ?, ?, ?)', [movieId, user, username, avatar, txtComment, tapeComment, times])
        }

        ctx.state.data = {}
    },

/**
 * 获取影评列表
 * 
 */
    list: async ctx => {
        let movieId = +ctx.request.query.movie_id
        let commentIds = ctx.request.query.comment_id_list

        if (commentIds!="") {
            commentIds = commentIds.substring(1, commentIds.length - 1)
        }

        if (!isNaN(movieId)) {
            ctx.state.data = await DB.query('SELECT * FROM movieComment WHERE movieComment.movieID = ?', [movieId])
        } else if (commentIds != "") {
            ctx.state.data = await DB.query('SELECT movieComment.id as `id`, movieComment.movieID as `movieid`, movieComment.username as `username`, movieComment.avatar as `avatar`, movieComment.txtComment as `txtComment`, movieComment.tapeComment as `tapeComment`, movieComment.times as `times`, movies.title as `title`, movies.image as `image` FROM movieComment LEFT JOIN movies ON movieComment.movieID = movies.id WHERE movieComment.id in (' + commentIds + ')')
        } else {
            ctx.state.data = {}
        }
    },

    /**
 * 获取影评详细
 * 
 */
    detail: async ctx => {
        var commentId = + ctx.params.id

        var sql = 'SELECT movieComment.id as `id`, movieComment.movieID as `movieid`, movieComment.username as `username`, movieComment.avatar as `avatar`, movieComment.txtComment as `txtComment`, movieComment.tapeComment as `tapeComment`, movieComment.times as `times`, movies.title as `title`, movies.image as `image` FROM movieComment LEFT JOIN movies ON movieComment.movieID = movies.id WHERE movieComment.id = ? '

        if (!isNaN(commentId)) {            

            if (commentId == -1){
 
                let sqlResult = await DB.query('SELECT id FROM movieComment')
                var min = 0
                var max = sqlResult.length - 1;

                if (max >= 0){
                    var index = Math.floor(Math.random() * (max + 1 - min)) + min;
                    commentId = sqlResult[index].id
                }
            }
            if (commentId >= 0){
                ctx.state.data = (await DB.query(sql, [commentId]))[0]
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
    },



}