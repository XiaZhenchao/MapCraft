const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const commentSchema = new Schema(
    {
        userName: {type: String, required: true},
        comment: {type: String, required: true},
        like: {type: Number, required: true},
        disLike: {type: Number, required: true},
        //banned: {type: Boolean, required: true}
        mapId: {type:String, required: true}

    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)