import React from "react";

const Alert = ({ userMessage, appMessage, onClose }) => {
    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-50">
        <div className="max-h-full w-full max-w-2xl overflow-y-auto sm:rounded-2xl bg-white">
            <div className="w-full flex justify-center items-center flex-col">
                <div className="my-14 mt-10 mb-2">
                    <div className="">
                            <p className="mb-8 text-3xl font-extrabold justify-center text-center"> {appMessage}: </p>
                            <p className="text-xl font-extrabold justify-center text-center"> {userMessage} </p>
                    </div>
                </div>
                <div className="p-6 flex w-full">
                    <button
                            className="block w-full select-none mr-1 rounded-lg bg-white hover:bg-indigo-600 hover:text-white py-3 px-7 text-center align-middle font-sans text-lg font-bold uppercase duration-300 text-gray-900 shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-light="true"
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                    <button
                            className="block w-full select-none ml-1 rounded-lg bg-indigo-600 text-white hover:bg-black hover:text-white py-3 px-7 text-center align-middle font-sans text-lg font-bold uppercase duration-300 text-gray-900 shadow-md shadow-black-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-light="true"
                        onClick={onClose}
                    >
                        Invitations
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Alert;
