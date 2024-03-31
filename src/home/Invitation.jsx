import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { groupRequestsFunction, joinGroupRequest } from "./request";
import { getFirestore } from 'firebase/firestore';
import Cookies from 'js-cookie';

function Invitation(){
    const [userUid, setUserUid] = useState([]);
    const [userName, setUserName] = useState([]);
    const [groupRequests, setGroupRequests] = useState(null);
    const [showLoadingGroupRequests, setShowLoadingGroupRequests] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore(app);

    async function deconnection() {
        await database.signOut();
        Cookies.remove("jwt")
        history('/');
    }

    async function joinGroup(userUid, e) {
        const jwtToken = Cookies.get("jwt");
        joinGroupRequest(jwtToken, userUid)
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
            setShowLoadingGroupRequests(true);
            const jwtToken = Cookies.get("jwt");

            const data1 = await groupRequestsFunction(jwtToken);
            setGroupRequests(data1)
            setShowLoadingGroupRequests(false);
        }
        fetchData();
    }, []);

    return (
        <div>
            {showErrorModal && (
              <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                  <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                      <div className="mb-8 justify-center items-center flex text-center">
                        <h1 className="mb-4 text-3xl font-extrabold">Malheuresement n'a pas encore accepté les notifications...</h1>
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
                <button onClick={() => history('/home')} className="p-3 bg-black rounded-lg text-white w-full font-semibold">Home</button>
            </div>
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div className="text-center pb-12">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Mes invitations
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                </div>
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
                                <div key={index} className="w-full bg-white rounded-lg p-10 flex flex-col justify-center items-center" style={{backgroundColor: '#d0d0d0'}}>
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