import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterAndLogin from "./RegisterAndLogin"
import HomeScreen from "../pages/Home"
import InvitationScreen from "../pages/Invitation"
import Alert from "../components/alert";
import Page404 from "../pages/Page404";
import notifSound from '../assets/sound/notificationSound.mp3';

function PageHandler() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertUserMessage, setAlertUserMessage] = useState("This is your initial message!");
    const [alertAppMessage, setAlertAppMessage] = useState("This is your initial message!");

    const [newVersionAvailable, setNewVersionAvailable] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    
    const updateServiceWorker = () => {
        waitingWorker && waitingWorker.postMessage({ action: 'skipWaiting' });
        window.location.reload();
    };

    useEffect(() => {
        console.log("recharge")

        if ('serviceWorker' in navigator) {
            
            navigator.serviceWorker.addEventListener('message', event => {
                const audio = new Audio(notifSound);
                audio.play().catch(error => console.log('Error playing audio:', error));
                const data = event.data;

                console.log("message ---------------------------------------")
                console.log(data)

                if (data.message === 'newVersionAvailable') {
                    console.log("newVersionAvailable")
                    setNewVersionAvailable(true)
                    setWaitingWorker(navigator.serviceWorker.controller);
                }
                else if (data.message === 'Vous avez reçu une nouvelle invitation') {
                    const userMessage = data.data.body;
                    const appMessage = data.message;
                    setAlertUserMessage(userMessage);
                    setAlertAppMessage(appMessage);
                    handleShowAlert();
                }
            });
        }

    }, []);

    return (
        <BrowserRouter>
            <div>
                {showAlert && (
                    <Alert
                        userMessage={alertUserMessage}
                        appMessage={alertAppMessage}
                        onClose={handleCloseAlert}
                    />
                )}
                {newVersionAvailable && (
                    <div onClick={updateServiceWorker}>
                        Une nouvelle version est disponible. Cliquez pour mettre à jour.
                    </div>
                )}
                <Routes>
                    <Route path="/" element={<RegisterAndLogin />} />
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/invitations" element={<InvitationScreen />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default PageHandler;