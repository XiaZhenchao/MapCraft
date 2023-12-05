import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_MAP_NAME: "CHANGE_MAP_NAME",
    CLOSE_CURRENT_MAP: "CLOSE_CURRENT_MAP",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    SET_MAP_NAME_EDIT_ACTIVE: "SET_MAP_NAME_EDIT_ACTIVE",
    HIDE_MODALS: "HIDE_MODALS",
    STORE_FILE: "STORE_FILE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_MAP : "DELETE_MAP",
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentMap: null,
        mapCounter: 0,
        mapNameActive: false,
        mapIdMarkedForDeletion: null,
        mapMarkedForDeletion: null,
        isEdition: false,
        isDeleting: false,
        currentmapName: ""
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_MAP_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentMap: null,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: store.currentmapName
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentMap: null,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: ""
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_MAP: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentMap: payload.map,
                    mapCounter: store.mapCounter+1,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: store.currentmapName
                })
            }
            // GET ALL THE MAPS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentMap: null,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: "",
                    // mapTemplate:store.mapTemplate,
                    // mapObjects:store.mapObjects
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_MAP,
                    idNamePairs: store.idNamePairs,
                    currentMap: null,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: payload.id,
                    mapMarkedForDeletion: payload.map,
                    currentmapName: ""
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentMap: payload,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: store.currentmapName
                });
            }

            
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_MAP_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentMap: store.currentMap,
                    mapCounter: store.mapCounter,
                    mapNameActive: true,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: store.currentmapName
                });
            }
           
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentMap: store.currentMap,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    isEdition: payload.isEdition,
                    isDeleting: payload.isDeleting,
                    currentmapName: store.currentmapName
                });
            }

            case GlobalStoreActionType.STORE_FILE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentMap: payload.map,
                    mapCounter: store.mapCounter,
                    mapNameActive: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    currentmapName: store.currentmapName
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentMap = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_MAP,
            payload: {}
        });
        //tps.clearAllTransactions();
       // history.push("/")
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewMap = async function () {
        let newMapName = "Map" + store.mapCounter;
        let username = auth.user.firstName+" " + auth.user.lastName;
        const response = await api.createMap(newMapName, auth.user.email, username);
        console.log("createNewMap response: " + response);
        // store.loadIdNamePairs();
        if (response.status === 201) {
            //tps.clearAllTransactions();
            let newMap = response.data.map;
            async function asyncLoadIdNamePairs() {
                const response = await api.getMapPairs();
                if (response.data.success) {
                    let array = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_MAP,
                        payload: {
                            map: newMap,
                            idNamePairs: array
                        }
                    });
                    return newMap._id;
                }
                else{
                    console.log("API FAILED TO GET THE MAP PAIRS");
                }
            }asyncLoadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW MAP");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE MAPS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getMapPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE MAP PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }


    store.selectMap = function(id){
        async function asyncSetSelectedMap(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map1 = response.data.map;
                async function updateMap(map){
                    response = await api.updateMapById(map._id, map);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_MAP,
                            payload: map

                        });
                    }
                }
                updateMap(map1);
            }
        }
        asyncSetSelectedMap(id);
    }

    //handle publish for designated map
    store.publishMap = function (id) {
        // get the id of unpublished map and publish it
        async function asyncPublishMap(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                //record the publish date and make it state to true
                map.publishStatus=true;
                map.publishDate=new Date();
                async function updateMap(map) {
                    response = await api.updateMapById(map._id, map);
                    if (response.data.success) {
                        async function getMapPairs(map) {
                            response = await api.getMapPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(map);
                    }
                }
                updateMap(map);
            }
        }
        asyncPublishMap(id);
    }

    store.forkMap = function (id) {
        async function asyncForkMap(id) {
            let newId="1"
            let response = await api.getMapById(id);
            if (response.data.success) {
                let mapToCopy = response.data.map;
                async function createForkedMap() {
                    // let createNewMapResponse = await store.createNewMap();
                    let newMapName = "Map" + store.mapCounter;
                    let username = auth.user.firstName + " " + auth.user.lastName;
                    try {
                        const response = await api.createMap(newMapName, auth.user.email, username);
                        console.log("createNewMap response: ", response);
                        if (response.status === 201) {
                            let newMap = response.data.map;
                            newId = newMap._id;
                            console.log("newId: "+ newId)
                            const idNamePairsResponse = await api.getMapPairs();
                            if (idNamePairsResponse.data.success) {
                                let array = idNamePairsResponse.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CREATE_NEW_MAP,
                                    payload: {
                                        map: newMap,
                                        idNamePairs: array
                                    }
                                });
                            } else {
                                console.log("API FAILED TO GET THE MAP PAIRS");
                                // Handle the failure case here
                            }
                        } else {
                            console.log("API FAILED TO CREATE A NEW MAP");
                            // Handle the failure case here
                        }
                    } catch (error) {
                        console.error("Error creating a new map: ", error);
                        // Handle errors here
                    }
                    console.log("newId: "+ newId)




                    let newresponese = await api.getMapById(newId);
                    if (newresponese.data.success) {
                        let newMap = newresponese.data.map;
                        newMap.mapTemplate = mapToCopy.mapTemplate;
                        console.log("newMap.mapTemplate: "+ newMap.mapTemplate)
                        newMap.mapObjects = mapToCopy.mapObjects;
                        console.log("newMap.mapObjects: "+ newMap.mapObjects)
                        async function updateMap(newMap) {
                            response = await api.updateMapById(newId, newMap);
                            if (response.data.success) {
                                async function getMapPairs(newMap) {
                                    response = await api.getMapPairs();
                                    if (response.data.success) {
                                        let pairsArray = response.data.idNamePairs;
                                        storeReducer({
                                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                            payload: pairsArray
                                        });
                                    }
                                }
                                getMapPairs(newMap);
                            }
                        }
                        updateMap(newMap);
                    }

                }
                createForkedMap();
            } else {
                console.log("Failed to retrieve the map to fork.");
            }
        }
        asyncForkMap(id);

    };


    store.setComment = function (id, comment, username) {
        async function asyncSetComment(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                
                const singleComment = {
                    userName: username,
                    comment: comment,
                  };
                  map.commentObject.push(singleComment);
                //map.commentObject.push({username,comment});
                async function updateMap(map) {
                    console.log("map._id: "+map._id);
                    console.log("id: "+id);
                    response = await api.updateMapById(map._id, map);
                    if (response.data.success) {
                        async function getMapPairs(map) {
                            response = await api.getMapPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(map);
                    }
                }
                updateMap(map);
            }
        }
        asyncSetComment(id);
    }

    store.storeFile = function (id, geojsonData,mapType) {
        async function asyncStoreFile(id, geojsonData,mapType) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                
                map.mapObjects = geojsonData;
                map.mapTemplate = mapType;
                async function updateMap(map) {
                    console.log("map._id: "+map._id);
                    console.log("id: "+id);
                    response = await api.updateMapById(map._id, map);
                    if (response.data.success) {
                        async function getMapPairs(map) {
                            response = await api.getMapPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.STORE_FILE,
                                    payload: {
                                        idNamePairs:pairsArray,
                                        map:map
                                    }
                                });
                            }
                        }
                        getMapPairs(map);
                    }
                }
                updateMap(map);
            }
        }
        asyncStoreFile(id, geojsonData,mapType);
    }

    store.markMapForDeletion = function (id) {
        async function getMapToDelete(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                storeReducer({
                    type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
                    payload: {id: id, map: map}
                });
            }
        }
        getMapToDelete(id);
    }

    store.deleteMap = function (id) {
        async function processDelete(id) {
            let response = await api.deleteMapById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
            }
        }
        processDelete(id);
    }

    store.deleteMarkedMap = function() {
        store.deleteMap(store.mapIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.changeMapName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeMapName(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                map.name = newName;
                async function updateMap(map) {
                    response = await api.updateMapById(map._id, map);
                    if (response.data.success) {
                        async function getMapPairs(map) {
                            response = await api.getMapPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_MAP_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        map: map
                                    }
                                });
                            }
                        }
                        getMapPairs(map);
                    }
                }
                updateMap(map);
            }
        }
        asyncChangeMapName(id);
    }

    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {isEdition: false, isDeleting: false}
        });    
    }

    store.isDeleteMapModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_MAP;
    }

    store.isEditMapName = () => {
        return store.mapNameActive === true || store.isDeleteMapModalOpen() === true;
    }

    store.setMapNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_MAP_NAME_EDIT_ACTIVE,
            payload: null
        });
    }



    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
   
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };