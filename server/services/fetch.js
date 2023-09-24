import fetch from "node-fetch";

export async function fetchData(url, data = null) {
    const response = await fetch(url);
    return await response.json()
}