import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import "./Home.css";
import { getAllMusiciansRequest, checkNotificationsRequest, sendNotificationRequest } from "../controlers/request";
import { getFirestore, doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import ErrorModalComponent from "../components/ErrorModal"
import LoadingModalComponent from "../components/LoadingModal"
import WrittingTextModalComponent from "../components/WrittingTextModal"
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import ShowMessageModalComponent from "../components/ShowMessageModal";
import OfflineComponent from "../components/OfflineModul";
import MenuIconsComponent from "../components/MenuIcon"
import Card from "../components/Card";

function Home() {
    const [allMusiciens, setAllMusiciens] = useState([]);
    const [userUid, setUserUid] = useState(null);
    const [userUidToSend, setUserUidToSend] = useState();
    const [writingText, setWritingText] = useState(false);
    const [loading, setLoading] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoadingMusicians, setShowLoadingMusicians] = useState(false);
    const [showSubscribeButton, setShowSubscribeButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore(app);

    async function deconnection() {
        await database.signOut();
        Cookies.remove("jwt")
        history('/');
    }

    async function callInviteMessage(uid, name, e) {
        e.preventDefault();
        setLoading("Chargement ...");
        setUserUidToSend(uid);

        const isNotificationOfTargetUserActivated = await checkNotificationsActivated(uid)
        if (!isNotificationOfTargetUserActivated) {
            setLoading(null);
            setErrorMessage("Malheuresement " + name + " n'a pas encore accepté les notifications...")
            return;
        }
        setLoading(null);
        setWritingText("Envoie ton message à " + name + " !");
    }

    async function checkNotificationsActivated(userUidToSend) {
        try {
            const userDocRef = await doc(db, 'users', userUidToSend);
            const userDocSnapshot = await getDoc(userDocRef);
            const subscritpion = userDocSnapshot.data().notification;
            if (subscritpion === null) {
                return false;
            }
            return true;
        } catch (e) {
            console.log(e);
            return true;
        }
    }

    async function invite(e) {
        e.preventDefault();
        const messageToSend = document.getElementById("messageToSend").value
        setWritingText(null);
        setLoading("Envoie de l'invitation...");
        const jwtToken = Cookies.get("jwt");
        console.log("invite " + userUidToSend)
        try {
            const userDocRefGroup = await doc(db, 'users', userUid);
            const userDocSnapshotGroup = await getDoc(userDocRefGroup);
            if (userDocSnapshotGroup.data().group === null) {
                const docRef = await addDoc(collection(db, 'groups'), {
                    users: [userUid] // Ajouter l'utilisateur initial au tableau "users"
                });
                const userDocRefUser = await doc(db, 'users', userUid);
                await updateDoc(userDocRefUser, {
                    group: docRef.id
                });
            }
                
            const userDocRef = await doc(db, 'users', userUidToSend);
            const userDocSnapshot = await getDoc(userDocRef);
            const subscritpion = userDocSnapshot.data().notification;
            await sendNotificationRequest(jwtToken, subscritpion, messageToSend, userUidToSend);
        } catch (e) {
            console.log(e)
            setErrorMessage("Error while sending notification request")
        }
        setLoading(null);
    }

    const updateNotificationField = async (uid, notificationData) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            await updateDoc(userDocRef, notificationData);
            console.log("Champ 'notification' mis à jour avec succès pour l'utilisateur", uid);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du champ 'notification' :", error.message);
        }
    };

    async function subscribe() {
        setLoading("Souscription aux notifications");
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BE83n2_Lo4-qmPEukATYdQ8_vd0M-e17rxuNq5Fse0b4vHi7xFOMQ_9kP-E9SUeF2cg1EjJF-wc2bl8IIv6uGzc'
        })
        const notifPushString = JSON.parse(JSON.stringify(push))
        await updateNotificationField(userUid, { notification: notifPushString })
        setShowSubscribeButton(false)
        setLoading(null);
        setShowMessage("Notifications acceptées !");
    }

    const handleClose = () => {
        setErrorMessage(null);
        setShowMessage(null);
    };

    useEffect(() => {
        onAuthStateChanged(database, async (user) => {
            if (user) {
                console.log('Username de l\'utilisateur connecté:', user.displayName);
                console.log('UserUid de l\'utilisateur connecté:', user.uid);
                setUserUid(user.uid);
            } else {
                console.log('Utilisateur déconnecté');
                history('/');
            }
        });

        async function fetchData() {
            setShowLoadingMusicians(true);
            const jwtToken = Cookies.get("jwt");
            if (!jwtToken)
                history('/');

            setUserUid(jwtDecode(jwtToken).uid);

            try {
                const data1 = await getAllMusiciansRequest(jwtToken);
                console.log(data1)
                setAllMusiciens(data1);
                setShowLoadingMusicians(false);
            } catch (e) {
                setShowLoadingMusicians(false);
                console.log(e)
                setErrorMessage("Erreur lors de la récuperation des autres musiciens")
            }

            try {
                const data2 = await checkNotificationsRequest(jwtToken);
                if (data2 == false)
                    setShowSubscribeButton(true)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <MenuIconsComponent myGroup={true} home={false} invitations={true} myAccount={true} />
            {
                writingText &&
                <WrittingTextModalComponent text={writingText} invite={invite} />
            }
            {
                showMessage &&
                <ShowMessageModalComponent text={showMessage} onClose={handleClose} />
            }
            {
                loading &&
                <LoadingModalComponent Text={loading} />
            }
            {
                errorMessage &&
                <ErrorModalComponent Error={errorMessage} onClose={handleClose} />
            }
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div className="text-center pb-12">
                    <h2 className="text-base font-bold text-indigo-600">
                        Trouve tes futurs partenaire de musique
                    </h2>
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Construis le groupe de tes rêves
                    </h1>
                </div>
                <OfflineComponent/>
                <div className="flex items-center justify-center">
                    {showSubscribeButton && (
                        <button onClick={subscribe} id="subscribe-button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-8">
                            Souscrire aux notifications
                        </button>
                    )}
                </div>
                {showLoadingMusicians && (
                    <div className="flex items-center justify-center">
                        <svg fill='none' className="w-16 h-16 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                            <path clipRule='evenodd'
                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                                fill='currentColor' fillRule='evenodd' />
                        </svg>
                    </div>
                )}
                <div className="flex flex-col space-y-8">

                    {
                        Array.isArray(allMusiciens) ?
                            allMusiciens.map((data, index) => (
                                console.log(data),
                                console.log(index),
                                data.id === userUid ?
                                    null
                                    :
                                    <Card index={index} data={data} callInviteMessage = { callInviteMessage }/>
                            ))
                            : null
                    }
                </div>
            </section>
            <div className="flex items-center justify-center">
                <button onClick={deconnection} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-8">
                    Déconnexion
                </button>
            </div>
        </div>
    )
}

export default Home;