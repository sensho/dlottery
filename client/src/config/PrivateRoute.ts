const useAuth = () => {
    const account = localStorage.getItem("account")
    if(account) return true;

    return false;
}

export { useAuth }