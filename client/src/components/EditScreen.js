import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';

const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    let appBanner = <AppBanner />

    
    return (
        <div >
        
        </div>)
}


export default EditScreen;