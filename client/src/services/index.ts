import axios from 'axios';

const postRequest = (url: string, body: Object) => {
    return new Promise((resolve,reject) => {
        axios.post(url, body).then((response) => {
            console.log(response)
            resolve(response)
        })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

const getRequest = (url: string) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then((response) => {
            console.log(response)
            resolve(response)
        })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })

}

export { postRequest, getRequest }