const form = document.querySelector("form");
const input = document.querySelector("input");
const errorText = document.querySelector(".errorText");
const resultsDisplay = document.querySelector(".resultsDisplay");
const loader = document.querySelector(".loader");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  if (!input.value === "") {
    errorText.textContent = "Wops, veuillez remplir l'input";
    return;
  } else {
    errorText.textContent = "";
    loader.style.display = "flex";
    resultsDisplay.textContent = "";
    wikiApiCall(input.value);
  }
}

async function wikiApiCall(searchInput) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    createCards(data.query.search);
  } catch (error) {
    errorText.textContent = `${error}`;
    loader.style.display = "none";
  }
}

function createCards(data) {
  if (!data.length) {
    errorText.textContent = "Pas de résultat";
    loader.style.display = "none";
    return;
  }
  data.map((el) => {
    const url = `https://en.wikipedia.org/?curid=${el.pageid}`;
    const card = document.createElement("div");
    card.className = "result-item";
    card.innerHTML = `
        <h3 class="result-tile">
            <a href=${url} target="_blank">${el.title}</a>
        </h3>
        <a href=${url} class="result-link" target="_blank">${url}</a>
        <br>
        <p class="result-snippet">${el.snippet}</p>
        `;

    resultsDisplay.appendChild(card);
  });
  loader.style.display = "none";
}
