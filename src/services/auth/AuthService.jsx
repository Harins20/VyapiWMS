
import Constants, {appApi} from "../../misc/Constants";


export async function authenticate(formBody){
    try {
        let res = await fetch(`${appApi}${Constants.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })

        let response = await res.json()

        if(res.status === 200){

            let token = response.access_token
            console.log(response);
            window.localStorage.setItem("selfToken", token)

            return response
        }else{
            return response.error_description
        }
    }catch (e) {
        return "Invalid_Credentials";
    }

}

export async function authenticateToken() {
    const token = window.localStorage.getItem("selfToken")

    if (token === "undefined" || token === "" || token === null) {
        return false;
    } else if (
        token !== undefined &&
        token !== "undefined" &&
        token !== "" &&
        token !== null
    ) {
        return token
    } else {
        return token
    }
}


