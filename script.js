async function fetchData() {
    const characterName = document.getElementById("characterName").value.toLowerCase();

    try {
        const response = await fetch(`https://api.disneyapi.dev/character?name=${characterName}`);
        
        if (!response.ok) {
            throw new Error("Character not found");
        }

        const data = await response.json();

        const exactMatch = data.data.find(character =>
            character.name.toLowerCase() === characterName
        );

        if (exactMatch) {
            const characterImage = exactMatch.imageUrl;
            const imgElement = document.getElementById("characterImage");

            imgElement.src = characterImage;
            imgElement.style.display = "block";
        } else {
            console.error("No exact match found for that character name.");
        }

    } catch (error) {
        console.error("Error fetching character data:", error);
    }
}
