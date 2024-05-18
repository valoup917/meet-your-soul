import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'
import { groupRequestsFunctionRequest, joinGroupRequest } from "../controlers/request";
import Cookies from 'js-cookie';
import ErrorModalComponent from "../components/ErrorModal"
import OfflineComponent from "../components/OfflineModul";
import MenuIconsComponent from "../components/MenuIcon"
import { jwtDecode } from "jwt-decode";
import LoadingModalComponent from "../components/LoadingModal"

function Invitation() {
    const [myGroup, setMyGroup] = useState(null);
    const [groupRequests, setGroupRequests] = useState(null);
    const [showLoadingGroupRequests, setShowLoadingGroupRequests] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore();

    async function deconnection() {
        await database.signOut();
        Cookies.remove("jwt")
        history('/');
    }

    async function joinGroup(userUid, e) {
        e.preventDefault();
        const jwtToken = Cookies.get("jwt");
        try {
            joinGroupRequest(jwtToken, userUid)
            const data1 = await groupRequestsFunctionRequest(jwtToken);
            setGroupRequests(data1)
        } catch (e) {
            setErrorMessage("Erreur lors de l'acceptation de l'invitation")
        }
    }

    const handleClose = () => {
        setErrorMessage(null);
        setShowLoadingGroupRequests(null);
    };

    useEffect(() => {
        onAuthStateChanged(database, async (user) => {
            if (user) {
                console.log('Username de l\'utilisateur connecté:', user.displayName);
                console.log('UserUid de l\'utilisateur connecté:', user.uid);
            } else {
                console.log('Utilisateur déconnecté');
                history('/');
            }
        });

        async function fetchData() {
            setShowLoadingGroupRequests(true);
            const jwtToken = Cookies.get("jwt");
            const decodedToken = jwtDecode(jwtToken);

            try {
                const data1 = await groupRequestsFunctionRequest(jwtToken);
                setGroupRequests(data1)

                const userDocRef = doc(db, 'users', decodedToken.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();
                setMyGroup(userData.group)

                setShowLoadingGroupRequests(false);
            } catch (e) {
                console.log(e)
                setShowLoadingGroupRequests(false);
                setErrorMessage("Erreur lors de la récuperation de vos invitations")
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <MenuIconsComponent myGroup={true} home={true} invitations={false} myAccount={true} />
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
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Mes invitations
                    </h1>
                </div>
                <OfflineComponent />
                {
                    myGroup &&
                    <div className="font-regular flex w-full rounded-lg bg-red-700 mb-4 p-4 text-base text-white opacity-100" data- dismissible="alert" >
                        <div className="mr-12">
                            Attention vous avez déjà un groupe
                        </div>
                    </div >
                }
                {showLoadingGroupRequests && (
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
                        groupRequests === null ?
                            null
                            : groupRequests.length !== 0 ?
                                groupRequests?.map((data, index) => (
                                    <div key={index} className="w-full bg-white rounded-lg p-10 flex flex-col justify-center items-center" style={{ backgroundColor: '#d0d0d0' }}>
                                        <div className="text-center">
                                            <p className="text-2xl text-gray-700 font-bold mb-2">{data.username}</p>
                                            <p className="text-xl text-gray-500 mb-6">{data.message}</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button onClick={(e) => joinGroup(data.uid, e)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-16 rounded ease-in-out duration-300">
                                                Rejoindre
                                            </button>
                                        </div>
                                    </div>
                                ))
                                :
                                <div className="text-center">
                                    <p className="text-2xl text-gray-700 font-bold mb-2">Pas d'invitations :(</p>
                                </div>
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

export default Invitation;