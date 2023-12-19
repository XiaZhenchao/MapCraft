const Map = require('../models/map-model')
const User = require('../models/user-model');
const db = require('../db')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
*/
createMap = (req, res) => {
    const body = req.body;
    console.log("createMap body: " + JSON.stringify(body));
    console.log("Request method: ", req.method);
    console.log("Request URL: ", req.url);
    console.log("Request headers: ", req.headers);
    console.log("Request params: ", req.params);
    console.log("Request query: ", JSON.stringify(req.query));
    console.log("Request body: ", req.body);


    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        })
    }

    const map = new Map(body);
    console.log("map: " + map.toString());
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.maplist.push(map._id);
        console.log("maplist" + user.maplist);
        console.log("map  id" + map._id);
        user
            .save()
            .then(() => {
                console.log(map);
                map
                    .save()
                    .then(() => {
                        console.log("map-----" );
                        return res.status(201).json({
                            map: map
                        })
                    })
                    .catch(error => {
                        console.log("map-----1111" );
                        console.error("Save error:", error);
                        return res.status(400).json({
                            errorMessage: 'Map Not Created!'
                        })
                    })
            });
    })
}

deleteMap = async (req, res) => {
    Map.findById({ _id: req.params.id }, (err, map) => {
        if (err) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(map) {
            User.findOne({ email: map.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    Map.findOneAndDelete({ _id: req.params.id }, () => {
                        // Remove the map ID from the user's maplist
                        user.maplist = user.maplist.filter(mapId => mapId.toString() !== req.params.id);
                        // Save the updated user
                        user.save();
                        return res.status(200).json({success: true});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(map);
    })
 }
 
getMapById = async (req, res) => {
    await Map.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        else {
            return res.status(200).json({ success: true, map: list });
        }
    }).catch(err => console.log(err))    
}



getMapPairs = async (req, res) => {
                    await Map.find({}, (err, maps) => {
                        if (err) {
                            return res.status(400).json({ success: false, error: err})
                        }
                        else {
                    let pairs = [];
                    for (let key in maps) {
                        let map = maps[key];
                        let pair = {
                            _id: map._id,
                            name: map.name,
                            publishStatus: map.publishStatus,
                            publishDate: map.publishDate,
                            likes: map.likes,
                            disLikes: map.disLikes,
                            commentObject : map.commentObject,
                            authorName: map.authorName,
                            banned: map.banned,
                            editStatus: map.editStatus,
                            //source: map.source,
                            renderStatus: map.renderStatus,
                            ownerEmail: map.ownerEmail,
                           // mapTemplate:map.mapTemplate,
                            createdAt: map.createdAt,

                            mapTemplate: map.mapTemplate,
                            mapObjects: map.mapObjects,
                            layers: map.layers,
                            heatArray:map.heatArray,
                            dotDensityArray:map.dotDensityArray,
                               
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
}



updateMapById = async (req, res) => {
    const body = req.body
    console.log("updateMap: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);
    console.log("req.body.map.name: " + req.body.map.name);
    console.log("req.body.map: " + req.body.map);
    console.log("req.body.map.comment: " + req.body.map.commentObject);
    console.log("req.body.map.comment: " + req.body.map.layers);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Map.findOne({ _id: req.params.id },(err,list) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Map not found!',
            })
        }

                    list.name = body.map.name;
                    list.publishStatus = body.map.publishStatus;
                    list.publishDate = body.map.publishDate;
                    list.likes = body.map.likes;
                    list.disLikes = body.map.disLikes;
                    list.commentObject = body.map.commentObject;
                    list.authorName = list.authorName;
                    list.banned = body.map.banned,
                    list.editStatus = body.map.editStatus,
                    list.source = body.map.source,
                    list.renderStatus = body.map.renderStatus,
                    list.ownerEmail = body.map.ownerEmail,
                    list.mapTemplate=body.map.mapTemplate,
                    list.mapObjects= body.map.mapObjects,
                    list.layers= body.map.layers,
                    list.heatArray= body.map.heatArray,
                    list.dotDensityArray= body.map.dotDensityArray,

                    
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Map updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Map not updated!',
                            })
                        })
                    });
    }

    storeGeoFile = async (req, res) => {
        console.log(req);
        const { mapId } = req.body;
        const { selectedFile } = req.body;
        const collection = db.collection("DataMap");
        await collection.insertOne({ mapId, selectedFile });
        res.status(200).json({ success: true, message: 'GeoJSON data stored successfully' });
    }


module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    updateMapById,
    storeGeoFile
}
