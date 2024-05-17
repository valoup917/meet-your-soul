import React from 'react';

function ShowMessageModalComponent({ text, onClose }) {
    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
            <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                        <div className="mb-8 justify-center items-center flex">
                            <h1 className="mb-4 text-3xl font-extrabold">{text}</h1>
                        </div>
                        <div className="space-y-4">
                            <button onClick={onClose} className="p-3 bg-black rounded-full text-white w-full font-semibold">Fermer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowMessageModalComponent;