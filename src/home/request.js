import axios from "axios";

const URL = `http://localhost:3005/`

export const userLogin = async(email, uid, password) => {
    const options = {
        url: URL + "login",
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            email: email,
            uid: uid,
            password: password
        }
      };
    const { data } = await axios(options);
    console.log("jwt: ")
    const jwt = data.accessToken
    console.log(jwt)
    return jwt;
}

export const getAllMusicians = async(jwt) => {
      const {data} = await axios.get(URL + "getUsers", {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
    return data;
}

export const groupRequestsFunction = async(jwt) => {
    const {data} = await axios.get(URL + "getGroupRequests", {
      headers: {
          Authorization: `Bearer ${jwt}`
      }
  });
  return data;
}

export const checkNotifications = async(jwt) => {
      const {data} = await axios.get(URL + "isNotificationAuthorized", {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
    return data;
}

export const joinGroupRequest = async(jwt, userUid) => {
    const options = {
    url: URL + "joinGroup",
    method: 'POST',
    headers: {
        Authorization: `Bearer ${jwt}`
    },
    data: {
        userUidTarget: userUid
    }
};
axios(options)
    .then(response => {
    console.log(response.status);
});
return;
}

export const sendNotification = async(jwt, subscritpion, messageToSend, targetUid) => {
        const options = {
        url: URL + "sendNotif",
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        data: {
            subscritpion: subscritpion,
            message: messageToSend,
            targetUid: targetUid
        }
    };
    axios(options)
        .then(response => {
        console.log(response.status);
    });
    return;
}