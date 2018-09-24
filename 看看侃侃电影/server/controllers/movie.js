const DB = require('../utils/db.js')
module.exports = {
    list: async ctx => {
        ctx.state.data = await DB.query("SELECT * FROM movies;")
    },
    detail: async ctx => {
        movieID = + ctx.params.id

        if (!isNaN(movieID)) {

            if (movieID == -1) {

                let sqlResult = await DB.query('SELECT id FROM movies')
                var min = 0
                var max = sqlResult.length - 1;

                if (max >= 0) {
                    var index = Math.floor(Math.random() * (max + 1 - min)) + min;
                    movieID = sqlResult[index].id
                }
            }

            ctx.state.data = (await DB.query("SELECT * FROM movies WHERE movies.id=?", [movieID]))[0]
        } else {
            ctx.state.data = {}
        }
    },
}