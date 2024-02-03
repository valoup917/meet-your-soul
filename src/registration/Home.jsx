import React, { useState, useEffect } from "react";
import { app } from "./FirebaseConfig";
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import singer from "../assets/instruments/singer.jpg"
import drums from "../assets/instruments/drums.jpg"
import guitar from "../assets/instruments/guitar.jpg"
import bass from "../assets/instruments/bass.jpg"
import piano from "../assets/instruments/piano.jpg"
import { getAllMusicians } from "./musicians";
import axios from "axios";

function Home(){
    const [allMusiciens, setAllMusiciens] = useState([]);
    const [userUid, setUserUid] = useState([]);
    const [userName, setUserName] = useState([]);

    const database = getAuth(app);
    const history = useNavigate()

    const handleClick = () => {
        signOut(database).then(val => {
            history('/')
        })
    }

    function invite(uid, e) {
        e.preventDefault();
        console.log("invite " + uid)
        sendNotif()
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

    async function subscribe() {
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BE-C8n3HUtNZdDnjLHSSrGpJ8OFb5jG-nhaYGOjXWRra7WBTRiRcO6S-BN2IqRComcpaXKQKJ6Uw2zdknhweOM8'
        })
        console.log(JSON.stringify(push));
      }

    async function sendNotif() {
        const options = {
            url: 'http://localhost:3005/sendNotif',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
              username: userName,
              userId: userUid
            }
          };
        axios(options)
          .then(response => {
            console.log(response.status);
          });
    }
    

    useEffect(() => {        
        
        onAuthStateChanged(database, async (user) => {
            if (user) {
                const username = user.displayName;
                console.log('Username de l\'utilisateur connecté:', username);
                console.log('UserUid de l\'utilisateur connecté:', user.uid);
                setUserUid(user.uid);
                setUserName(username);
            } else {
                console.log('Utilisateur déconnecté');
            }
        });
        
        async function fetchData() {
            const data = await getAllMusicians();
            console.log(data)
            setAllMusiciens(data);
        }
        fetchData(); 
    }, []);

    const styleArray = [
        { backgroundColor: '#a1a1a1' },
        { backgroundColor: '#d0d0d0' },
        { backgroundColor: '#e8e8e8' },
    ]

    return (
        <div class="bg-gray-200/50">
            <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div class="text-center pb-12">
                    <h2 class="text-base font-bold text-indigo-600">
                        Trouve tes futurs partenaire de soul
                    </h2>
                    <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Construis le groupe de tes rêves
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                    <button onClick={subscribe} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-8">
                    Souscrire aux notifications
                    </button>
                </div>
                <div class="flex flex-col space-y-8">

                    {
                        Array.isArray(allMusiciens) ?
                            allMusiciens.map((data) => (
                                data.id == userUid ?
                                null :
                                <div class="w-full bg-white rounded-lg p-10 flex flex-col justify-center items-center" style={styleArray[data.niveau - 1]}>
                                    <div class="mb-6">
                                        <img class="object-center object-cover rounded-full h-48 w-48" src={instruments[data.instrument]} alt="photo" />
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl text-gray-700 font-bold mb-2">{data.username}</p>
                                        <p class="text-xl text-gray-500 mb-6">{niveaux[data.niveau]}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={(e) => invite(data.id, e)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-16 rounded ease-in-out duration-300">
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
                <button onClick={handleClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-8">
                Déconnexion
                </button>
            </div>
        </div>
    )
}

export default Home;