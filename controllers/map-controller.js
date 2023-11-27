const Map = require('../models/map-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
*/
createMap = (req, res) => {
    const body = req.body;
    console.log("createMap body: " + JSON.stringify(body));

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
    console.log("delete Map with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Map.findById({ _id: req.params.id }, (err, map) => {
        console.log("map found: " + JSON.stringify(map));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(map) {
            User.findOne({ email: map.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Map.findOneAndDelete({ _id: req.params.id }, () => {
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
    // console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

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
                            ownerEmail: map.ownerEmail
                               
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
}

getMapList = async (req, res) => {
    await Map.find({}, (err, mapList) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!mapList.length) {
            return res
                .status(404)
                .json({ success: false, error: `MapList not found` })
        }
        else {
            console.log("Send the MapList pairs");
            return res.status(200).json({ success: true, mapList: mapList })
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
                    list.ownerEmail = body.map.ownerEmail

                    
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


module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    getMapList,
    updateMapById
}
