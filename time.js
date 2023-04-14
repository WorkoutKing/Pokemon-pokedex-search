// Get form and search input
const form = document.querySelector("form");
const searchInput = document.querySelector("#searchInput");

// Add event listener to form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get search term
  const searchTerm = searchInput.value;

  // Make request to PokeAPI to get Pokemon data
  fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      // Extract relevant information from Pokemon data
      const name = data.name;
      const image = data.sprites.front_default;
      const types = data.types.map((type) => type.type.name);
      const abilities = data.abilities.map((ability) => ability.ability.name);
      const stats = data.stats.map(
        (stat) => `${stat.stat.name}: ${stat.base_stat}`
      );
      const height = data.height;
      const weight = data.weight;

      // Make request to PokeAPI to get type data
      const typeUrls = data.types.map((type) => type.type.url);
      Promise.all(typeUrls.map((url) => fetch(url)))
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((typeData) => {
          const weaknesses = typeData
            .map((data) => data.damage_relations.double_damage_from)
            .flat()
            .map((weakness) => weakness.name);

          const strengths = typeData
            .map((data) => data.damage_relations.double_damage_to)
            .flat()
            .map((strength) => strength.name);

          // Display search results
          const searchResults = document.querySelector("#searchResults");
          searchResults.innerHTML = `
            <div class="col-md-6 mx-auto">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">${name}</h3>
                </div>
                <div class="card-body">
                  <img src="${image}" alt="${name}" class="img-fluid mb-3">
                  <p><strong>Types:</strong> ${types.join(", ")}</p>
                  <p><strong>Abilities:</strong> ${abilities.join(", ")}</p>
                  <p><strong>Weaknesses:</strong> ${weaknesses.join(", ")}</p>
                  <p><strong>Strengths:</strong> ${strengths.join(", ")}</p>
                  <p><strong>Stats:</strong></p>
                  <ul>
                    ${stats.map((stat) => `<li>${stat}</li>`).join("")}
                  </ul>
                  <p><strong>Height:</strong> ${height} decimetres</p>
                  <p><strong>Weight:</strong> ${weight} hectograms</p>
                </div>
              </div>
            </div>
          `;
        })
        .catch((error) => {
          // Display error message
          const searchResults = document.querySelector("#searchResults");
          searchResults.innerHTML = `
            <div class="col-md-6 mx-auto">
              <div class="alert alert-danger" role="alert">
                Pokemon not found. Please try again.
              </div>
            </div>
          `;
        });
    });
});
