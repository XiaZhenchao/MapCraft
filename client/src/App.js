import './App.css';
import { React, useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    CommunityScreen,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    HomeScreen,
    ForgotPassword,
    ResetPassword,
    EditScreen,
    Setting,
    AdminHome,
    AdminCommunity
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {   

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider> 
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/home/" exact component={HomeScreen} />
                        <Route path="/forgot-password/" exact component={ForgotPassword} />
                        <Route path="/reset-password/" exact component={ResetPassword} />
                        <Route path="/edit/" exact component={EditScreen} />
                        <Route path="/community/" exact component={CommunityScreen} />
                        <Route path="/setting/" exact component={Setting} />
                        <Route path="/admin-home/" exact component={AdminHome} />
                        <Route path="/admin-community/" exact component={AdminCommunity} />
                    </Switch>
                 </GlobalStoreContextProvider> 
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
