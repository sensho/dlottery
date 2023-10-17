import random from "random-string-generator"

const getRaffleId = () => {
    return Math.floor(Math.random() * 100000)
}

export { getRaffleId }