import React, { useState, useEffect } from "react";
import { app } from "../registration/FirebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import ErrorModalComponent from "../components/ErrorModal"
import OfflineComponent from "../components/OfflineModul";
import MenuIconsComponent from "../components/MenuIcon"
import Card from "../components/Card";
import LoadingModalComponent from "../components/LoadingModal"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Timer from '../components/Timer';

function MyGroup() {

    const [usersData, setUsersData] = useState([]);

    const [loading, setloading] = useState(true);
    const [points, setPoints] = useState([
        { lat: 48.8566, lng: 2.3522, label: "paris" },
    ]);
    const [errorMessage, setErrorMessage] = useState(null);
    const database = getAuth(app);
    const history = useNavigate()
    const db = getFirestore();

    const handleClose = () => {
        setErrorMessage(null);
        setloading(null);
    };

    const extractCoordinates = (locationString, username) => {
        if (locationString === null)
            return null;
        const latLng = locationString.match(/Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/);
        if (latLng) {
            const lat = parseFloat(latLng[1]);
            const lng = parseFloat(latLng[2]);
            console.log(lat)
            console.log(lng)
            console.log(username)
            return { lat: lat, lng: lng, label: username };
        }
        return null;
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
            setloading(true);
            const jwtToken = Cookies.get("jwt");
            if (jwtToken == "undefined")
                history('/');
            const decodedToken = jwtDecode(jwtToken);
            var tmpPoints = [
                { lat: 48.8566, lng: 2.3522, label: "paris" },
            ]
            try {
                console.log("Étape 1")
                // Étape 1: Récupérer le champ "group" du document utilisateur
                const userDoc1 = await doc(db, 'users', decodedToken.uid);
                const userDoc2 = await getDoc(userDoc1);
                if (userDoc2.exists) {
                    const userData = userDoc2.data();
                    const group = userData.group;
                    console.log("Étape 2")
                    // Étape 2: Récupérer l'array "users" du document du groupe
                    const groupDoc1 = await doc(db, 'groups', group);
                    const groupDoc2 = await getDoc(groupDoc1);
                    if (groupDoc2.exists) {
                        const groupData = groupDoc2.data();
                        const groupUsersArray = groupData.users;
                        console.log("Étape 3")
                        // Étape 3: Récupérer les documents utilisateurs
                        const usersDataArray = [];
                        for (const userId of groupUsersArray) {
                            const userSnapshot1 = await doc(db, 'users', userId);
                            const userSnapshot2 = await getDoc(userSnapshot1);
                            if (userSnapshot2.exists) {
                                usersDataArray.push(userSnapshot2.data());
                                const pointLocation = (extractCoordinates(userSnapshot2.data().location, userSnapshot2.data().username))
                                if (pointLocation) {
                                    tmpPoints.push(pointLocation)
                                }
                            }
                        }
                        setUsersData(usersDataArray);
                        console.log(usersDataArray)
                        console.log(points);
                        setPoints(tmpPoints);
                    }
                }
            } catch (e) {
                console.log(e)
                setloading(false);
                setErrorMessage("Erreur lors de la récuperation de votre groupe")
            }
            setloading(false)
        }
        fetchData();
    }, []);

    const center = { lat: 48.8566, lng: 2.3522 };

    const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    if (loading) {
        return <div><LoadingModalComponent Text={loading} /></div>;
    }


    return (
        <div>
            <MenuIconsComponent myGroup={false} home={true} invitations={true} myAccount={true} />
            {
                errorMessage &&
                <ErrorModalComponent Error={errorMessage} onClose={handleClose} />
            }
            {
                loading &&
                <LoadingModalComponent Text={loading} />
            }
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div className="text-center pb-12">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        Mon groupe
                    </h1>
                </div>
                <OfflineComponent />
                <div className="flex flex-col space-y-8">
                    {
                        usersData === null ?
                            <div className="flex justify-center text-center text-2xl text-red-400">
                                Vous n'avez pas encore rejoins de groupe
                            </div>
                            :
                            Array.isArray(usersData) ?
                                usersData.map((data, index) => (
                                    <Card index={index} data={data} callInviteMessage={null} />
                                ))
                                : null
                    }
                </div>
            </section>

            <Timer userDate={usersData} />

            <div className="flex w-[100%] justify-center items-center z-0">
                <MapContainer center={center} zoom={7} style={{ height: '400px', width: '80%', zIndex: '0' }} className="">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {points.map((point, index) => (
                        console.log(point),
                        <Marker key={index} position={[point.lat, point.lng]} icon={customIcon}>
                            <Popup>{point.label}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}

export default MyGroup;