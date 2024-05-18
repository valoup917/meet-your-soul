import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import ErrorModalComponent from "../components/ErrorModal"
import OfflineComponent from "../components/OfflineModul";
import MenuIconsComponent from "../components/MenuIcon"
import singer from "../assets/instruments/singer.jpg"
import drums from "../assets/instruments/drums.jpg"
import guitar from "../assets/instruments/guitar.jpg"
import bass from "../assets/instruments/bass.jpg"
import piano from "../assets/instruments/piano.jpg"
import LoadingModalComponent from "../components/LoadingModal"

function MyAccount() {
    
    const [userUid, setUserUid] = useState(true);
    const [loading, setloading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [instrument, setInstrument] = useState('');
    const [instrumentNbr, setInstrumentNbr] = useState(1);
    const [level, setLevel] = useState('');
    const [age, setAge] = useState('');
    const [yearsPlaying, setYearsPlaying] = useState('');
    const [job, setJob] = useState('');
    const [favoriteBands, setFavoriteBands] = useState('');
    const [hobbies, setHobbies] = useState('');


    async function deconnection() {
        await database.signOut();
        Cookies.remove("jwt")
        history('/');
    }

    const handleClose = () => {
        setErrorMessage(null);
        setloading(null);
    };

    async function saveInfo(e) {
        e.preventDefault();
        console.log(userUid)
        const userDocRefUser = await doc(db, 'users', userUid);
        await updateDoc(userDocRefUser, {
            age: age,
            yearsPlaying: yearsPlaying,
            job: job,
            favoriteBands: favoriteBands,
            hobbies: hobbies,
            username: username,
            location: location
        });
        window.location.reload();
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }

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
            setloading(true);
            const jwtToken = Cookies.get("jwt");
            if (jwtToken == "undefined")
                history('/');
            const decodedToken = jwtDecode(jwtToken);

            try {
                const userDocRef = doc(db, 'users', decodedToken.uid);
                setUserUid(decodedToken.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();
                console.log(userData);
                setEmail(userData.email);
                setUsername(userData.username);
                setInstrument(instruments[userData.instrument]);
                setInstrumentNbr(userData.instrument);
                setLevel(niveaux[userData.niveau]);
                setAge(userData.age);
                setYearsPlaying(userData.yearsPlaying)
                setJob(userData.job);
                setFavoriteBands(userData.favoriteBands);
                setHobbies(userData.hobbies);
                
            } catch (e) {
                console.log(e)
                setloading(false);
                setErrorMessage("Erreur lors de la récuperation de votre groupe")
            }
            setloading(false);
        }
        fetchData();
    }, []);

    const instrumentsPix = {
        1: drums,
        2: guitar,
        3: bass,
        4: piano,
        5: singer,
    };
    
    const instruments = {
        1: "drums",
        2: "guitar",
        3: "bass",
        4: "piano",
        5: "singer",
    };

    const niveaux = {
        1: "expert",
        2: "intermediaire",
        3: "débutant"
    };

    return (
        <div className="">
            <MenuIconsComponent myGroup={true} home={true} invitations={true} myAccount={false} />
            {
                errorMessage &&
                <ErrorModalComponent Error={errorMessage} onClose={handleClose} />
            }
            {
                loading &&
                <LoadingModalComponent Text={loading} />
            }
            <section className="max-w-6xl mx-auto p-x-4 sm:px-6 lg:px-4 pt-12">
                <div className="text-center pb-12">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Mon compte
                    </h1>
                </div>
                <OfflineComponent />
            </section>
            <div className="flex items-center justify-center p-10">
                <div className="bg-gray-100 w-[80%]">
                    <div className="bg-white p-8 rounded-3xl shadow-lg">
                        <div className="flex justify-center mb-4">
                            <img className="object-center object-cover rounded-full h-32 w-32" src={instrumentsPix[instrumentNbr]} alt="photo" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="text"
                                value={email}
                                readOnly
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nom</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Instrument</label>
                            <input
                                type="text"
                                value={instrument}
                                readOnly
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Niveau</label>
                            <input
                                type="text"
                                value={level}
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Localisation</label>
                            <input
                                type="text"
                                value={location}
                                readOnly
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Âge</label>
                            <input
                                type="number"
                                placeholder="36"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Depuis combien de temps tu joues (en années)</label>
                            <input
                                type="number"
                                placeholder="4"
                                value={yearsPlaying}
                                onChange={(e) => setYearsPlaying(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Travail</label>
                            <input
                                type="text"
                                placeholder="Plombier"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Hobbies</label>
                            <input
                                type="text"
                                placeholder="Les cartes pokemons"
                                value={hobbies}
                                onChange={(e) => setHobbies(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Groupes préférés</label>
                            <input
                                type="text"
                                placeholder="AC/DC Daft Punk"
                                value={favoriteBands}
                                onChange={(e) => setFavoriteBands(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={(e) => { saveInfo(e) }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-16 rounded my-4">
                                Enregister
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button onClick={deconnection} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-8">
                    Déconnexion
                </button>
            </div>
        </div>
    )
}

export default MyAccount;