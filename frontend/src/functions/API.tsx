import { sha256 } from "js-sha256";

export async function login({username, password}) {
    const {_id: userId} = await post("http://localhost:3001/login", {
        username,
        password: sha256(password)
    });

    localStorage.setItem("synesthizeUserData", JSON.stringify({
        userId,
        username
    }));

    return {userId};
}

export async function register({username, password}) {
    const {_id: userId} = await post("http://localhost:3001/register", {
        username,
        password: sha256(password)
    });

    localStorage.setItem("synesthizeUserData", JSON.stringify({
        userId,
        username
    }));

    return {userId};
}

async function post(url: string, body: object) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const {message} = await response.json();
        throw new Error(message);
    }

    const responseBody = await response.json();
    return responseBody;
}