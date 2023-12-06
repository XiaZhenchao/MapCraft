const Map = require('../models/map-model')
const Comment = require('../models/comment-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
*/
createComment = (req, res) => {
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
            error: 'You must provide a Comment',
        })
    }

    const comment = new Comment(body);
    console.log("comment: " + comment.toString());
    if (!comment) {
        return res.status(400).json({ success: false, error: err })
    }

    Map.findById({ _id: body.mapId }, (err, map) => {
        console.log("map found: " + JSON.stringify(map));
        map.commentObject.push(comment);
       
        map
            .save()
            .then(() => {
                console.log(comment);
                comment
                    .save()
                    .then(() => {
                        console.log("comment-----" );
                        return res.status(201).json({
                            comment: comment
                        })
                    })
                    .catch(error => {
                        console.log("comment-----1111" );
                        console.error("Save error:", error);
                        return res.status(400).json({
                            errorMessage: 'Comment Not Created!'
                        })
                    })
            });
    })
}


 
getCommentById = async (req, res) => {
    // console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Comment.findById({ _id: req.params.id }, (err, comment) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        else {
            return res.status(200).json({ success: true, comment: comment });
        }
    }).catch(err => console.log(err))
    
}


getCommentPairs = async (req, res) => {
                    await Comment.find({}, (err, comments) => {
                        if (err) {
                            return res.status(400).json({ success: false, error: err})
                        }
                        else {
                    console.log("comments" + comments);
                    let pairs = [];
                    for (let key in comments) {
                        let comment = comments[key];
                        let pair = {
                            _id: comment._id,
                            likes: comment.like,
                            disLikes:comment.disLike,
                            comment: comment.comment,
                            userName: comment.userName,
                            mapId: comment.mapId
                               
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
}


updateCommentById = async (req, res) => {
    const body = req.body
    // console.log("updateMap: " + JSON.stringify(body));
    // console.log("req.body.name: " + req.body.name);
    // console.log("req.body.map.name: " + req.body.map.name);
    // console.log("req.body.map: " + req.body.map);
    // console.log("req.body.map.comment: " + req.body.map.commentObject);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Comment.findOne({ _id: req.params.id },(err,list) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Comment not found!',
            })
        }

                    list.like = body.comment.like;
                    list.disLike = body.comment.disLike;
                    list.userName = list.userName;
                    list.mapId = list.mapId;

                    
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Comment updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Comment not updated!',
                            })
                        })
                    });
    }

    deleteCommentById = async (req, res) => {
        const body = req.body;
        console.log(JSON.stringify(body));
        console.log(req.body.id);
        // Comment.findById({ _id: req.params.id }, (err, comment) => {
        //     if (err) {
        //         return res.status(404).json({
        //             errorMessage: 'Comment not found!',
        //         })
        //     }
    
        //     // DOES THIS LIST BELONG TO THIS USER?
        //     async function asyncFindMap() {
        //         Map.findById({ _id: body.mapId }, (err, map) => {
        //             if (map) {
        //                 Comment.findOneAndDelete({ _id: req.params.id }, () => {
        //                     // Remove the comment ID from the map's commentObject
        //                     map.commentObject = map.commentObject.filter(id => id.toString() !== req.params.id);
        //                     // Save the updated user
        //                     map.save();
        //                     return res.status(200).json({success: true});
        //                 }).catch(err => console.log(err))
        //             }
        //             else {
        //                 return res.status(400).json({
        //                     errorMessage: "map found error"
        //                 });
        //             }
        //         });
        //     }
        //     asyncFindMap();
        // })

        Comment.findOneAndDelete({ _id: req.params.id }, () => {
            // Remove the map ID from the user's maplist
           // user.maplist = user.maplist.filter(mapId => mapId.toString() !== req.params.id);
            // Save the updated user
           // user.save();
            return res.status(200).json({success: true});
        }).catch(err => console.log(err))
    }


module.exports = {
    createComment,
    getCommentById,
    getCommentPairs,
    updateCommentById,
    deleteCommentById,
}
