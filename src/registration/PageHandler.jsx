import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterAndLogin from "./RegisterAndLogin"
import HomeScreen from "../home/Home"
import InvitationScreen from "../home/Invitation"

function PageHandler(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<RegisterAndLogin/>}/>
                    <Route path="/home" element={<HomeScreen/>}/>
                    <Route path="/invitations" element={<InvitationScreen/>}/>
                </Routes>        
            </div> 
        </BrowserRouter>
    )
}

export default PageHandler;