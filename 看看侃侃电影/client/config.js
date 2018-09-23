/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://oj8mam2y.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 拉取热门电影列表
        movieList: `${host}/weapp/movie`,

        // 拉取电影详细
        movieDetail: `${host}/weapp/movie/`,

        // 添加影评
        addComment: `${host}/weapp/comment`,

        // 获取影评列表
        commentList: `${host}/weapp/comment`,

        // 拉取影评详细
        commentDetail: `${host}/weapp/comment/`,

        // 获取我的收藏影评列表
        //postCommentList: `${host}/weapp/commentsub`,

        // 拉取我的已发布的影评列表
        shelfCommentList: `${host}/weapp/commentsub`,

        // 拉取我的影评详细
        shelfcommentDetail: `${host}/weapp/commentsub/`,
    }
};

module.exports = config;
