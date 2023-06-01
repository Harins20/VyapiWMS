import axios from "axios";
import {appApi} from "../misc/Constants";
const loc = window.location;

// dev server
let url;
if (loc.hostname === "localhost") {
    url = appApi
}else {
    url = appApi
}
const axiosInstance = axios.create({
    baseURL: url,
});

axiosInstance.interceptors.request.use((request) => {
    let token;
    if (window.localStorage) {
        // local storage available
        token = localStorage.getItem("selfToken");
    }
    request.headers["xauthToken"] = token;
    return request;
});

axiosInstance.interceptors.response.use((response) => response, function error(error) {
    if (error.response && error.response.status === 401) {
        window.location.replace("/not-found");
    }
    console.log("Error received from server: ", error);
    return Promise.reject(error);
});
// interceptor
export default axiosInstance;