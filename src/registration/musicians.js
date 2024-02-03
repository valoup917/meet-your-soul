import axios from "axios";

const URL = `http://localhost:3005/getUsers`

export const getAllMusicians = async() => {
    const {data} = await axios.get(URL);
    return data;
}