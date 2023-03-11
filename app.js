const form = document.querySelector("form");
const input = document.querySelector("input");
const errorText = document.querySelector(".errorText");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  if (!input.value === "") {
    errorText.textContent = "Wops, veuillez remplir l'input";
    return;
  } else {
    errorText.textContent = "";
    wikiApiCall(input.value);
  }
}

async function wikiApiCall(searchInput) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`
  );

  const data = await response.json();
  createCards(data.query.search);
}

const resultsDisplay = document.querySelector(".resultsDisplay");

function createCards(data) {
  if (!data.length) {
    errorText.textContent = "Pas de résultat";
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
        <span class="result-snippet">${el.snippet}</span>
        <br>
        `;

    resultsDisplay.appendChild(card);
  });
}
