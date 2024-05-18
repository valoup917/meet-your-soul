import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import singer from "../assets/instruments/singer.jpg"
import drums from "../assets/instruments/drums.jpg"
import guitar from "../assets/instruments/guitar.jpg"
import bass from "../assets/instruments/bass.jpg"
import piano from "../assets/instruments/piano.jpg"

function Card({ index, data, callInviteMessage }) {
    const [flipped, setFlipped] = useState(false);
    const [animating, setAnimating] = useState(false);

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

    const styleArray = [
        { backgroundColor: '#a1a1a1' },
        { backgroundColor: '#d0d0d0' },
        { backgroundColor: '#e8e8e8' },
    ]

    function handleFlip() {
        if (!animating) {
            setFlipped(!flipped);
            setAnimating(true);
        }
    }

    return (
        Error && (
            <div className='flip-card' onClick={handleFlip} key={index}>
                <motion.div
                    className='flip-card-inner '
                    initial={false}
                    animate={{ rotateY: flipped ? 180 : 360 }}
                    transition={{ duration: 0.6, animationDirection: "normal" }}
                    onAnimationComplete={() => setAnimating(false)}
                >



                    <div className="flip-card-front w-full bg-white rounded-2xl p-10 flex flex-col justify-center items-center h-[450px]" style={styleArray[data.niveau - 1]}>
                        <div className="mb-6">
                            <img className="object-center object-cover rounded-full h-48 w-48" src={instruments[data.instrument]} alt="photo" />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl text-gray-700 font-bold mb-2">{data.username}</p>
                            <p className="text-xl text-gray-500 mb-6">{niveaux[data.niveau]}</p>
                        </div>
                        {
                            callInviteMessage &&
                            <div className="flex items-center justify-center">
                                <button onClick={(e) => callInviteMessage(data.id, data.username, e)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-16 rounded ease-in-out duration-300">
                                    Inviter
                                </button>
                            </div>
                        }
                    </div>




                    <div className="absolute flip-card-back w-full bg-white rounded-2xl top-0 p-10 flex flex-col justify-center items-center h-[450px]" style={styleArray[data.niveau - 1]}>
                        <div className='grid grid-cols-2 gap-4 px-4 w-full'>
                            <div className="flex flex-col items-start justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Age</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.age === null ? "Pas d'informations" : data.age
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Groupe(s) Favori(s)</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.favoriteBands === null ? "Pas d'informations" : data.favoriteBands
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col items-start justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Hobbies</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.hobbies === null ? "Pas d'informations" : data.hobbies
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Travail</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.job === null ? "Pas d'informations" : data.job
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col items-start justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Années de pratique</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.yearsPlaying === null ? "Pas d'informations" : data.yearsPlaying
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl bg-gray-200 bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                <p className="text-sm text-indigo-600">Localisation</p>
                                <p className="text-base font-medium text-black">
                                    {
                                        data.location === null ? "Pas d'informations" : data.location
                                    }
                                </p>
                            </div>
                        </div>
                    </div>




                </motion.div>
            </div>
        )
    );
}

export default Card;