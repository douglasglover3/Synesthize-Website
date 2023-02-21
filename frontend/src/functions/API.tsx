import { sha256 } from "js-sha256";

export async function login({username, password}) {
    const {_id: userId} = await post("/login", {
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
    const {_id: userId} = await post("/register", {
        username,
        password: sha256(password)
    });

    localStorage.setItem("synesthizeUserData", JSON.stringify({
        userId,
        username
    }));

    return {userId};
}

export async function getValidSchemes({userId}) {
    const validSchemes = await post("/getValidSchemes", {
        userId: userId
    });

    return {validSchemes};
}

export async function getInvalidSchemes({userId}) {
    const invalidSchemes = await post("/getInvalidSchemes", {
        userId: userId
    });

    return invalidSchemes;
}

export async function addScheme({userId, name, notes}) {
    const {name: schemeName, notes: schemeNotes} = await post("/addScheme", {
        userId: userId,
        name: name,
        notes: notes
    });

    return {schemeName, schemeNotes};
}

export async function editScheme({userId, name, newName, notes}) {
    const {name: schemeName, notes: schemeNotes} = await post("/editScheme", {
        userId: userId,
        name: name,
        newName: newName,
        notes: notes
    });

    return {schemeName, schemeNotes};
}

export async function deleteScheme({userId, name}) {
    await post("/deleteScheme", {
        userId: userId,
        name: name
    });
}

export async function shareScheme({username, name, notes}) {
    await post("/shareScheme", {
        username: username,
        name: name,
        notes: notes
    });
}

// Send POST request and return body
async function post(path: string, body: object) {
    const response = await fetch("http://localhost:3001" + path, {
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