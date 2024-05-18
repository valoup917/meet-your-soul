import React from 'react';

function WrittingTextModalComponent({ text, invite }) {
    return (
        <div className="z-50 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
            <div className="max-h-full w-full max-w-2xl overflow-y-auto sm:rounded-2xl bg-white">
                <div className="w-full flex justify-center items-center flex-col">
                    <div className="m-14">
                        <div className="">
                            <h1 className="mb-8 text-3xl font-extrabold">{text}</h1>
                            <div className="w-full mt-3 text-center">
                                <input id="messageToSend" type="text" className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500" placeholder="Salut mec, ca te dirais de rejoindre notre groupe ??" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <button onClick={(e) => invite(e)} className="p-3 px-10 bg-black rounded-full text-white w-full font-semibold">Envoyer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WrittingTextModalComponent;