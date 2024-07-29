import axios from 'axios'

const apiURL = "https://ecommerce-assignment-nu.vercel.app"

export const Login = async(email,password) =>{
    const body={
            "email": email,
            "password":password
    }
    const res = await axios.post(`${apiURL}/login`,body)
    return res
}