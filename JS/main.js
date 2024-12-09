import { pokemonList } from "./data.js";

const pokemonGrid = document.getElementById("pokemon-grid");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const caughtList = document.getElementById("caught-list");
const noCaughtMessage = document.getElementById("no-caught-message");
const clearListButton = document.getElementById("clear-list-button");
const caughtCount = document.getElementById("caught-count");

const getCaughtPokemon = () =>
  JSON.parse(localStorage.getItem("caughtPokemon")) || [];
const saveCaughtPokemon = (pokemon) => {
  const caught = getCaughtPokemon();
  if (!caught.find((p) => p.number === pokemon.number)) {
    localStorage.setItem(
      "caughtPokemon",
      JSON.stringify([...caught, pokemon])
    );
    renderCaughtList();
    renderPokemonGrid(pokemonList);
  }
};
const removeCaughtPokemon = (pokemonNumber) => {
  const caught = getCaughtPokemon().filter((p) => p.number !== pokemonNumber);
  localStorage.setItem("caughtPokemon", JSON.stringify(caught));
  renderCaughtList();
  renderPokemonGrid(pokemonList);
};
const clearCaughtPokemon = () => {
  localStorage.clear("caughtPokemon");
  renderCaughtList();
  renderPokemonGrid(pokemonList);
};

function renderPokemonGrid(pokemonArray) {
  pokemonGrid.innerHTML = "";
  if (pokemonArray.length === 0) {
    pokemonGrid.innerHTML = `<p>Quién es ese Pokémon? Parece que no existe!</p>`;
    return;
  }
  const caught = getCaughtPokemon();
  pokemonArray.forEach(({ number, name, type }) => {
    const isCaught = caught.some((p) => p.number === number);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png" alt="${name}">
      <h3>${name}</h3>
      <p>Tipo: ${type}</p>
      <button class="${isCaught ? "Atrapado" : ""}">
        ${isCaught ? "Atrapado!" : "Atrapar"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (!isCaught) saveCaughtPokemon({ number, name, type });
    });
    pokemonGrid.appendChild(card);
  });
}

function renderCaughtList() {
  const caught = getCaughtPokemon();
  caughtList.innerHTML = "";
  noCaughtMessage.style.display = caught.length ? "none" : "block";

  caught.forEach(({ number, name }) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${name} (#${number})`;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Quitar";
    removeButton.addEventListener("click", () => removeCaughtPokemon(number));
    listItem.appendChild(removeButton);
    caughtList.appendChild(listItem);
  });

  caughtCount.textContent = `Atrapados: ${caught.length} / ${pokemonList.length}`;
}

function searchPokemon(query) {
  const lowerQuery = query.toLowerCase();
  const results = pokemonList.filter(
    ({ name, number, type }) =>
      name.toLowerCase().includes(lowerQuery) ||
      type.toLowerCase().includes(lowerQuery) ||
      number.toString() === lowerQuery
  );

  return results.length ? results : [];
}

searchBar.addEventListener("input", () => {
  const results = searchPokemon(searchBar.value.trim());
  renderPokemonGrid(results);
});

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const results = searchPokemon(searchBar.value.trim());
    renderPokemonGrid(results);
  }
});

searchButton.addEventListener("click", () => {
  const results = searchPokemon(searchBar.value.trim());
  renderPokemonGrid(results);
});

clearListButton.addEventListener("click", clearCaughtPokemon);

renderPokemonGrid(pokemonList);
renderCaughtList();
