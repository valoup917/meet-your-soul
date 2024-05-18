import React, { useEffect, useState } from 'react';
import { app } from "./FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth'
import coverPicture from "../assets/meet-your-soul-pic-2.jpg";
import { useNavigate } from 'react-router-dom'
import { getFirestore, setDoc, getDoc, deleteDoc, doc, collection, getDocs } from 'firebase/firestore';
import { userLoginReqest } from "../controlers/request";
import { jwtDecode } from "jwt-decode";
import LoadingModalComponent from "../components/LoadingModal"
import ErrorModalComponent from "../components/ErrorModal"
import Cookies from 'js-cookie';

function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
  const [niveau, setNiveau] = useState(3);
  const [instrument, setInstrument] = useState(2);
  const [loading, setLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNiveauChange = (event) => {
    setNiveau(event.target.value);
  };

  const handleInstrumentChange = (event) => {
    setInstrument(event.target.value);
  };

  const history = useNavigate()
  const db = getFirestore();
  const database = getAuth(app);

  const deleteDummyDocument = async () => {
    try {
      const dummyDocRef = doc(db, 'users', 'dummy');
      await deleteDoc(dummyDocRef);
      console.log("Le document 'dummy' a été supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du document 'dummy' :", error.message);
    }
  };

  const createUsersCollection = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const usersCollectionSnapshot = await getDocs(usersCollectionRef);

      if (usersCollectionSnapshot.empty) {
        console.log("La collection 'users' n'existe pas. Création de la collection...");
        await setDoc(doc(db, 'users', 'dummy'), {});
        console.log("La collection 'users' a été créée avec succès.");
      } else {
        console.log("La collection 'users' existe déjà.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la collection 'users' :", error.message);
    }
  };

  const createUserDocument = async (uid, userData) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, userData);
        console.log("Nouveau document utilisateur créé avec succès!");
        deleteDummyDocument();
      } else {
        console.log("Le document utilisateur existe déjà.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du document utilisateur :", error.message);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setLoading(null);
  };


  const SignIn = async (e, type) => {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (type === 'register') {
      setLoading("Création de votre compte");
      const username = e.target.username.value;
      try {
        const userCredential = await createUserWithEmailAndPassword(database, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: username });

        await createUsersCollection();

        await createUserDocument(user.uid, {
          instrument: parseInt(instrument),
          niveau: parseInt(niveau),
          username: username,
          email: email,
          notification: null,
          group: null,
          group_request: [],
          favoriteBands: null,
          age: null,
          hobbies: null,
          job: null,
          yearsPlaying: null,
          location: null
        });

        const jwt = await userLoginReqest(email, user.uid, password);
        Cookies.set("jwt", jwt, { expires: 7, secure: true });
        console.log(jwt)
        setLoading(null);
        history('/home')

      } catch (error) {
        setLoading(null);
        console.error(error);
        console.error(error.data);
        setErrorMessage("Erreur lors de la création de votre compte")
        setLogin(true);
      }

    } else {
      setLoading("Connection à votre compte");
      try {
        const data = await signInWithEmailAndPassword(database, email, password);
        const jwt = await userLoginReqest(email, data.user.uid, password);
        Cookies.set("jwt", jwt, { expires: 7, secure: true });
        console.log(jwt)
        setLoading(null);
        history('/home')
      } catch (e) {
        setLoading(null);
        console.log(e)
        setErrorMessage("Erreur lors de votre connection")
        return;
      }
    }
  }

  useEffect(() => {

    async function connection() {
      const decodedToken = jwtDecode(jwtToken);
      console.log(decodedToken.email)
      console.log(decodedToken.password)
      try {
        await signInWithEmailAndPassword(database, decodedToken.email, decodedToken.password);
      } catch (e) {
        console.log(e)
        setErrorMessage("Erreur lors de votre connection automatique")
        return;
      }
      setLoading(null);
      history('/home')
    }

    const jwtToken = Cookies.get("jwt");
    if (jwtToken != null) {
      setLoading("Récurpération de votre compte...");
      connection()
    }
  }, []);

  return (
    <div className='overflow-hidden'>
      {
        errorMessage &&
        <ErrorModalComponent Error={errorMessage} onClose={handleClose} />
      }
      {
        loading &&
        <LoadingModalComponent Text={loading} />
      }
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${coverPicture})` }}>
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
                <button type="submit" className="rounded-3xl bg-[#f1f1f1e8] bg-opacity-50 px-10 py-2 text-black shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-[#ffffff]">{login ? "S'authentifier" : "S'enregistrer"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterAndLogin;