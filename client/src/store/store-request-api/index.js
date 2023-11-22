/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
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
        banned: false,
        editStatus: false,
        //source: "",
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
    createMap,
    deleteMapById,
    getMapById,
    getMapPairs,
    updateMapById
}

export default apis
