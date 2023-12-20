const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const MapCraftSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        publishDate: {type: String, required: true},
        publishStatus: {type: Boolean, required: true},
        renderStatus: {type: Boolean, required: true},
        likes: {type: Number, required: true},
        disLikes: {type: Number, required: true},
        authorName: {type:String, required: true},
        commentObject: [{type: ObjectId, ref: 'Comment'}],
        layers: {
            type: [{
                coordinates: { type: [Number], required: false },
                regionName: { type: [String], required: false }
            }]
        },
        heatArray:{type:Array, required:false},
        customLabel:{type:Array, required:false},
        //dotArray:{type:Array, required:false},
        dotDensityArray:{
            type:[{
                dotArray:[], population: Number, GDP: Number, color: String, dotCounts: Number
            }], required: false},
        banned: {type: Boolean, required: true},
        editStatus: {type: Boolean, required: true},
        //source: {type: String, required: true}
        //dot density map, symbol map, choropleth map, heat map, flow map
        mapTemplate:{type:String, required:true},
        mapObjects:{type:Object,required:true}

    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapCraftSchema)