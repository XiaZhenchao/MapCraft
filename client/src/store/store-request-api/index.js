/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://mapcraft-55160ee4aae1.herokuapp.com/auth'
  : 'http://localhost:4000/auth';
const api = axios.create({
    baseURL,
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createComment = (comment_content,username, like, disLike, id) => {
    return api.post(`/comment/`, {
        // SPECIFY THE PAYLOAD
        userName: username, 
        comment: comment_content,
        like: 0, 
        disLike: 0, 
        mapId: id
    })
}

export const deleteCommentById = (id) => api.delete(`/comment/${id}`)
export const getCommentById = (id) => api.get(`/comment/${id}`)
export const getcommentPairs = () => api.get(`/commentpairs/`)
export const updateCommentById = (id, comment) => {
    return api.put(`/comment/${id}`, {
         //SPECIFY THE PAYLOAD
        comment : comment
    })
}

export const createMap = (newMapName, userEmail, username) => {
    const currentDate = new Date();
    return api.post(`/map/`, {
        // SPECIFY THE PAYLOAD
        name: newMapName,
        ownerEmail: userEmail,
        publishDate: currentDate.toISOString(),
        publishStatus: false,
        renderStatus: false,
        likes: 0,
        disLikes: 0,
        authorName: username,
        commentObject: [],
        layerObject: [],
        banned: false,
        editStatus: false,
        mapTemplate:"null",
        mapObjects:{ "type": "FeatureCollection",
        "features": []},
    })
}
export const deleteMapById = (id) => api.delete(`/map/${id}`)
export const getMapById = (id) => api.get(`/map/${id}`)
export const getMapPairs = () => api.get(`/mapairs/`)
export const updateMapById = (id, map) => {
    return api.put(`/map/${id}`, {
         //SPECIFY THE PAYLOAD
        map : map
    })
}

const apis = {
    createComment,
    deleteCommentById,
    getCommentById,
    getcommentPairs,
    updateCommentById,
    createMap,
    deleteMapById,
    getMapById,
    getMapPairs,
    updateMapById,
}

export default apis
