const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        maplist: [{type: ObjectId, ref: 'Map'}],
        role: { type: String, required: true},
    
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        resetTokenUsed: { type: Boolean, default: false }
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
