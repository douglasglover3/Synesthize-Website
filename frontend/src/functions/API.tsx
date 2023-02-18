export async function login(credentials : {username: string, password: string})
{
    return await post("http://localhost:3001/login", credentials);
}

async function post(url: string, body: object)
{
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}