export function setJWTToken(value) {
    const now = new Date().getTime();
    const expiryTime = now + (24 * 60 * 60 * 1000);
    const item = {
        token: value,
        expiry: expiryTime,
    };
    localStorage.setItem('token', JSON.stringify(item));
}

export function getJWTToken() {
    const itemString = localStorage.getItem('token');
    if (!itemString) {
        return null;
    }

    const item = JSON.parse(itemString);
    const now = new Date().getTime();

    if (now >= item.expiry) {
        localStorage.removeItem('token');
        return null;
    }

    return item.token;
}
