import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import singer from "../assets/instruments/singer.jpg"
import drums from "../assets/instruments/drums.jpg"
import guitar from "../assets/instruments/guitar.jpg"
import bass from "../assets/instruments/bass.jpg"
import piano from "../assets/instruments/piano.jpg"
import { getAllMusicians, checkNotifications, sendNotification } from "./request";
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
function Home(){
    const [allMusiciens, setAllMusiciens] = useState([]);
    const [userUid, setUserUid] = useState([]);
    const [userName, setUserName] = useState([]);
    const [userNameToSend, setUserNameToSend] = useState();
    const [userUidToSend, setUserUidToSend] = useState();
    const [writingMsg, setWritingMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNotificationsAccepted, setShowNotificationsAccepted] = useState(false);
    const [showLoadingMusicians, setShowLoadingMusicians] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSubscribeButton, setShowSubscribeButton] = useState(false);
    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore(app);

    async function deconnection() {
        await database.signOut();
        Cookies.remove("jwt")
        history('/');
    }

    async function callInviteMessage(uid, name ,e) {
        e.preventDefault();
        setLoading(true);
        setUserUidToSend(uid);
        setUserNameToSend(name);
        
        const isNotificationOfTargetUserActivated = await checkNotificationsActivated(uid)
        if (!isNotificationOfTargetUserActivated) {
            setLoading(false);
            setShowErrorModal(true)
            return;
        }
        setLoading(false);
        setWritingMsg(true);
    }

    async function checkNotificationsActivated(userUidToSend) {
        const userDocRef = await doc(db, 'users', userUidToSend);
        const userDocSnapshot = await getDoc(userDocRef);
        const subscritpion = userDocSnapshot.data().notification;
        if (subscritpion === null) {
            return false;
        }
        return true;
    }

    async function invite(e) {
        e.preventDefault();
        const messageToSend = document.getElementById("messageToSend").value
        setWritingMsg(false);
        setLoading(true);
        const jwtToken = Cookies.get("jwt");
        console.log("invite " + userUidToSend)
        const userDocRef = await doc(db, 'users', userUidToSend);
        const userDocSnapshot = await getDoc(userDocRef);
        const subscritpion = userDocSnapshot.data().notification;
        console.log(userUidToSend)
        await sendNotification(jwtToken, subscritpion, messageToSend, userUidToSend);
        setLoading(false);
    }

    const instruments = {
        1: drums,
        2: guitar,
        3: bass,
        4: piano,
        5: singer,
    };
    

    const niveaux = {
        1: "expert",
        2: "intermediaire",
        3: "débutant"
    };   

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
        setLoading(true);
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BE83n2_Lo4-qmPEukATYdQ8_vd0M-e17rxuNq5Fse0b4vHi7xFOMQ_9kP-E9SUeF2cg1EjJF-wc2bl8IIv6uGzc'
        })
        const notifPushString = JSON.parse(JSON.stringify(push))
        await updateNotificationField(userUid, { notification: notifPushString })
        setShowSubscribeButton(false)
        setLoading(false);
        setShowNotificationsAccepted(true);
    }

    useEffect(() => {        
        onAuthStateChanged(database, async (user) => {
            if (user) {
                console.log('Username de l\'utilisateur connecté:', user.displayName);
                console.log('UserUid de l\'utilisateur connecté:', user.uid);
                setUserUid(user.uid);
                setUserName(user.displayName);
            } else {
                console.log('Utilisateur déconnecté');
            }
        });

        async function fetchData() {
            setShowLoadingMusicians(true);
            const jwtToken = Cookies.get("jwt");
            
            const data1 = await getAllMusicians(jwtToken);
            console.log(data1)
            setAllMusiciens(data1);
            setShowLoadingMusicians(false);
            
            const data2 = await checkNotifications(jwtToken);
            if (data2 == false)
                setShowSubscribeButton(true)
        }
        fetchData();
    }, []);

    const styleArray = [
        { backgroundColor: '#a1a1a1' },
        { backgroundColor: '#d0d0d0' },
        { backgroundColor: '#e8e8e8' },
    ]

    return (
        <div>
            { writingMsg && ( 
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                <div className="max-h-full w-full max-w-2xl overflow-y-auto sm:rounded-2xl bg-white">
                    <div className="w-full flex justify-center items-center flex-col">
                        <div className="m-14">
                            <div className="">
                                <h1 className="mb-8 text-3xl font-extrabold">Envoie ton message à <span className="text-indigo-600"> {userNameToSend} </span> !</h1>
                                <div className="w-full mt-3 text-center">
                                    <input id="messageToSend" type="text" className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500" placeholder="Salut mec, ca te dirais de rejoindre notre groupe ??" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <button onClick={(e) => invite(e)} className="p-3 px-10 bg-black rounded-full text-white w-full font-semibold">Envoyer</button>
                        </div>
                    </div>
                  </div>
                </div>
            )}
            {loading && (
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                  <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                      <div className="mb-8 justify-center items-center flex">
                      <svg fill='none' className="w-16 h-16 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                        <path clipRule='evenodd'
                            d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                            fill='currentColor' fillRule='evenodd' />
                        </svg>
                        <h1 className="text-3xl font-extrabold">Chargement ...</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showNotificationsAccepted && (
              <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                  <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                      <div className="mb-8 justify-center items-center flex">
                        <h1 className="mb-4 text-3xl font-extrabold">Notifications acceptées !</h1>
                      </div>
                      <div className="space-y-4">
                        <button onClick={() => setShowNotificationsAccepted(false)} className="p-3 bg-black rounded-full text-white w-full font-semibold">Fermer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showErrorModal && (
              <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                  <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                      <div className="mb-8 justify-center items-center flex text-center">
                        <h1 className="mb-4 text-3xl font-extrabold">Malheuresement <span className="text-red-300">{userNameToSend}</span> n'a pas encore accepté les notifications...</h1>
                      </div>
                      <div className="space-y-4">
                        <button onClick={() => setShowErrorModal(false)} className="p-3 bg-black rounded-full text-white w-full font-semibold">Fermer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute m-4 top-0 right-0">
                <button onClick={() => history('/invitations')} className="p-3 bg-black rounded-lg text-white w-full font-semibold">Mes invitations</button>
            </div>
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div className="text-center pb-12">
                    <h2 className="text-base font-bold text-indigo-600">
                        Trouve tes futurs partenaire de musique
                    </h2>
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Construis le groupe de tes rêves
                    </h1>
                </div>
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
                                <div key={index} className="w-full bg-white rounded-lg p-10 flex flex-col justify-center items-center" style={styleArray[data.niveau - 1]}>
                                    <div className="mb-6">
                                        <img className="object-center object-cover rounded-full h-48 w-48" src={instruments[data.instrument]} alt="photo" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl text-gray-700 font-bold mb-2">{data.username}</p>
                                        <p className="text-xl text-gray-500 mb-6">{niveaux[data.niveau]}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={(e) => callInviteMessage(data.id, data.username, e)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-16 rounded ease-in-out duration-300">
                                            Inviter
                                        </button>
                                    </div>
                                </div>
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