import React, { useState } from 'react';
import { app } from "./FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth'
import coverPicture from "../assets/meet-your-soul-pic-2.jpg";
import { useNavigate } from 'react-router-dom'
import { getFirestore, setDoc, doc } from 'firebase/firestore';

function RegisterAndLogin(){
    const [login, setLogin] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [niveau, setNiveau] = useState(3);
    const [instrument, setInstrument] = useState(2);

    const handleNiveauChange = (event) => {
      setNiveau(event.target.value);
    };

    const handleInstrumentChange = (event) => {
      setInstrument(event.target.value);
    };

    const history = useNavigate()
    const db = getFirestore(app);
    const database = getAuth(app);


    const SignIn = async (e, type) => {
        e.preventDefault()
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        if (type === 'register') {
          const username = e.target.username.value;
          try {
            const userCredential = await createUserWithEmailAndPassword(database, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: username });
            const userDocRef = doc(db, 'user', user.uid);
            console.log(instrument)
            console.log(niveau)
            await setDoc(userDocRef, {
              instrument: parseInt(instrument),
              niveau: parseInt(niveau),
              username: username
            });
            history('/home')
          } catch(error) {
            setAlertMessage(`${error}`);
            setLogin(true);
          }
          
        } else {
            signInWithEmailAndPassword(database, email, password).then(data => {
              console.log(data, "authData");
              history('/home')
          }).catch((error) => {
              const errorCode = error.code;
              setAlertMessage(`${errorCode}`);
          })
        }
    }

    return (
        <div className='overflow-hidden'>
            {/* Affichage de l'alerte */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-md mx-auto my-6">
            {/* Contenu de l'alerte */}
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              {/* En-tête de l'alerte */}
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                <h3 className="text-3xl font-semibold text-red-500">
                  Erreur
                </h3>
                <button
                  onClick={() => setAlertMessage(null)}
                  className="p-1 ml-auto -mt-1 -mr-2 text-black bg-transparent border-0 text-3xl leading-none font-semibold outline-none focus:outline-none"
                >
                  <span className="text-black bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                </button>
              </div>
              {/* Contenu de l'alerte */}
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-gray-600 text-lg leading-relaxed">
                  {alertMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
            <div className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat" style={{backgroundImage: `url(${coverPicture})`}}>
                <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
                    <div className="text-white">
                        <div className="mb-8 flex flex-col items-center p-4">
                            <h1 className="mb-6 text-4xl">Meet your soul</h1>
                            <div className="flex space-x-8">
                              <div onClick={() => setLogin(false)} className="text-1xl text-[#b5b4ca] hover:text-white ease-in-out duration-300">S'enregistrer</div>
                              <div onClick={() => setLogin(true)} className="text-1xl text-[#b5b4ca] hover:text-white ease-in-out duration-300">S'authentifier</div>
                            </div>
                        </div>
                    <form onSubmit={(e) => SignIn(e, login ? 'signin' : 'register')}>
                        {
                          login ? (
                            <div>
                            </div>
                          ) :
                          (
                            <div>
                              <div className="mb-4 text-lg">
                                <input className="rounded-3xl border-none bg-[#112550] bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-gray-500 shadow-lg outline-none backdrop-blur-md" type="text" name="username" placeholder="Nom d'artiste" />
                              </div>
                              <div className="mb-4 text-lg">
                                <select
                                  value={instrument}
                                  onChange={handleInstrumentChange}
                                  className="w-full bg-[#112550] bg-opacity-50 text-center text-gray-500 text-inherit py-2 rounded-3xl shadow-lg outline-none backdrop-blur-md">
                                  <option value="2">Guitare</option>
                                  <option value="1">Batterie</option>
                                  <option value="3">Basse</option>
                                  <option value="4">Piano</option>
                                  <option value="5">Chanteur</option>
                                </select>
                              </div>
                              <div className="mb-4 text-lg">
                                <select
                                  value={niveau}
                                  onChange={handleNiveauChange}
                                  className="w-full bg-[#112550] bg-opacity-50 text-center text-gray-500 text-inherit py-2 rounded-3xl shadow-lg outline-none backdrop-blur-md">
                                  <option value="3">Débutant</option>
                                  <option value="2">Intermédiaire</option>
                                  <option value="1">Expert</option>
                                </select>
                              </div>
                            </div>
                          )
                        }
                        <div className="mb-4 text-lg">
                            <input className="rounded-3xl border-none bg-[#112550] bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-gray-500 shadow-lg outline-none backdrop-blur-md" type="email" name="email" placeholder="Email" />
                        </div>
                        <div className="mb-4 text-lg">
                            <input className="rounded-3xl border-none bg-[#112550] bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-gray-500 shadow-lg outline-none backdrop-blur-md" type="Password" name="password" placeholder="Mot de passe" />
                        </div>
                        <div className="mt-8 flex justify-center text-lg text-black">
                            <button type="submit" className="rounded-3xl bg-[#f1f1f1e8] bg-opacity-50 px-10 py-2 text-black shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-[#ffffff]">{ login ? "S'authentifier" : "S'enregistrer"}</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterAndLogin;