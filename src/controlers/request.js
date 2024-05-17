import axios from "axios";

const URL = `http://localhost:3005/`

export const userLoginReqest = async (email, uid, password) => {
    try {
        const response = await axios.post(
            URL + "login",
            {
                email: email,
                uid: uid,
                password: password
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            }
        );
        const jwt = response.data.accessToken;
        console.log("jwt: ")
        console.log(jwt)
        return jwt;
    } catch (error) {
        throw error.response;
    }
}

export const getAllMusiciansRequest = async(jwt) => {
    try {
        const { data } = await axios.get(URL + "getUsers", {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return data;
    } catch (error) {
        throw error.response;
    }
}

export const groupRequestsFunctionRequest = async (jwt) => {
    try {
        const {data} = await axios.get(URL + "getGroupRequests", {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
        });
        return data;
    } catch (error) {
        throw error.response;
    }
}

export const checkNotificationsRequest = async (jwt) => {
    try {
        const {data} = await axios.get(URL + "isNotificationAuthorized", {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return data;
    } catch (error) {
        throw error.response;
    }
}

export const joinGroupRequest = async(jwt, userUid) => {
    try {
        const response = await axios.post(
            URL + "joinGroup",
            {
                userUidTarget: userUid,
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        console.log(response.status)
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export const sendNotificationRequest = async (jwt, subscritpion, messageToSend, targetUid) => {
    
    try {
        const response = await axios.post(
            URL + "sendNotif",
            {
                subscritpion: subscritpion,
                message: messageToSend,
                targetUid: targetUid
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        console.log(response.status)
        return response.data;
    } catch (error) {
        throw error.response;
    }
}