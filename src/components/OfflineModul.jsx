import React, { useState } from 'react';

function OfflineComponent({  }) {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const updateOnlineStatus = () => {
        if (isOffline === true) {
            caches.open("version - 2")
                .then((cache) => {
                console.log(cache)
                console.log("Execute last request on cache")
            })
        }
        setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return (
        isOffline &&
        <div className= "font-regular flex w-full rounded-lg bg-red-700 mb-4 p-4 text-base text-white opacity-100" data- dismissible= "alert" >
            <div className="mr-12">
                Mode hors ligne, vos actions seront éffectuées à votre reconnection
            </div>
        </div >
    );
}

export default OfflineComponent;