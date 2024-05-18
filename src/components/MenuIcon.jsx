import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPeopleGroup, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'

function MenuIconsComponent({ myGroup, home, invitations, myAccount }) {
    const history = useNavigate()
    function redirect(e, destination) {
        e.preventDefault();
        history(destination)
    }

    return (
        <div className='flex justify-center items-center mt-8 space-x-8'>
            <FontAwesomeIcon icon={faPeopleGroup}
                className='h-7 hover:text-indigo-600 duration-300 ease-in-out cursor-pointer'
                style={myGroup ? { visibility: "visible" } : { visibility: "hidden" }}
                onClick={(e) => redirect(e, "/myGroup")}
            />
            <FontAwesomeIcon icon={faHouse}
                className='h-7 hover:text-indigo-600 duration-300 ease-in-out cursor-pointer'
                style={home ? { visibility: "visible" } : { visibility: "hidden" }}
                onClick={(e) => redirect(e, "/home")}
            />
            <FontAwesomeIcon icon={faEnvelope}
                className='h-7 hover:text-indigo-600 duration-300 ease-in-out cursor-pointer'
                style={invitations ? { visibility: "visible" } : { visibility: "hidden" }}
                onClick={(e) => redirect(e, "/invitations")}
            />
            <FontAwesomeIcon icon={faUser}
                className='h-7 hover:text-indigo-600 duration-300 ease-in-out cursor-pointer'
                style={myAccount ? { visibility: "visible" } : { visibility: "hidden" }}
                onClick={(e) => redirect(e, "/myAccount")}
            />
        </div>
    );
}

export default MenuIconsComponent;