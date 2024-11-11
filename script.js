
function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    return Promise.race([
        fetch(resource, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
        )
    ]);
}

async function fetchData() {
    const characterName = document.getElementById("characterName").value.toLowerCase();
    const imgElement = document.getElementById("characterImage");

    try {
        const response = await fetchWithTimeout(`https://api.disneyapi.dev/character?name=${characterName}`, {
            timeout: 8000
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Character not found (404)");
            } else if (response.status === 503) {
                throw new Error("Server is temporarily unavailable (503)");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }

        const data = await response.json();

        const exactMatch = data.data.find(character =>
            character.name.toLowerCase() === characterName
        );

        if (exactMatch) {
            imgElement.src = exactMatch.imageUrl;
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
            alert("No match found for that character name. Type something else :)");
        }

    } catch (error) {
        imgElement.style.display = "none";

        if (error.message === "Request timed out") {
            alert("The request took too long. Please try again.");
        } else if (error.message.includes("404")) {
            alert("Character not found. Please check the name and try again.");
        } else if (error.message.includes("503")) {
            alert("The server is temporarily unavailable. Please try again later.");
        } else {
            alert("An unexpected error occurred. Please try again.");
        }

        console.error("Error fetching character data:", error);
    }
}
