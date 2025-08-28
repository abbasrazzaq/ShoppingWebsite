export default async function apiFetch(path,
    token, 
    { method = "GET", body, headers = {} } = {}) {
    if (token) {
        headers = { ...headers, Authorization: `Bearer ${token}` };
    }

    let fetchBody = body;
    if (body && !(body instanceof FormData)) {
        headers = { "Content-Type": "application/json", ...headers };
        fetchBody = JSON.stringify(body);
    }

    const res = await fetch(path, {
        method,
        headers,
        body: fetchBody,
        // credentials: 'include' // uncomment if use cookie-based auth
    });

    if (res.status === 401) {
        //navigate("/login");
        throw new Error("Unauthorized");
    }

    return res;
}