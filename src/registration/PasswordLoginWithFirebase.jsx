import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterAndLogin from "./RegisterAndLogin"
import HomeScreen from "./Home"

function PasswordLoginWithFirebase(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<RegisterAndLogin/>}/>
                    <Route path="/home" element={<HomeScreen/>}/>
                </Routes>        
            </div> 
        </BrowserRouter>
    )
}

export default PasswordLoginWithFirebase;