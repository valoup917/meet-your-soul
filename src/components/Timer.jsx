import React, { useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { sendGroupNotificationRequest } from "../controlers/request";
import Cookies from 'js-cookie';

const Timer = (userData) => {
    const [targetDate, setTargetDate] = useState(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        setTargetDate(selectedDate);
    };

    const handleStart = () => {
        if (targetDate) {
            const now = new Date();
            const timeDiff = targetDate - now;
            const durationInSeconds = Math.max(0, Math.floor(timeDiff / 1000));
            setDuration(durationInSeconds);
            setIsPlaying(true);
        }
    };

    async function handleComplete() {
        const jwtToken = Cookies.get("jwt");

        const tab = userData.userDate;
        const notificationsArray = tab.map(item => item.notification);
        console.log(jwtToken)
        notificationsArray.forEach(async (subscritpion) => {
            if (subscritpion === null)
                return;
            await sendGroupNotificationRequest(jwtToken, "C'est l'heure de la réunion !", subscritpion);
        });

        setIsPlaying(false)
        return { shouldRepeat: false };
    };

    return (
        <div className="flex flex-col items-center py-16">
            <h1 className="mb-8 text-lg font-semibold">Fixe une date pour le prochain rendez-vous</h1>
            <input
                type="datetime-local"
                onChange={handleDateChange}
                className="mb-8 px-2 py-1 border border-gray-300 rounded"
            />
            <button
                onClick={handleStart}
                className="mb-8 px-6 py-2 bg-indigo-600 text-white rounded"
            >
                Lancer le Timer
            </button>
            {isPlaying && (
                <CountdownCircleTimer
                    isPlaying={isPlaying}
                    duration={duration}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[50, 30, 10, 0]}
                    onComplete={handleComplete}
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
            )}
        </div>
    );
};

export default Timer;
