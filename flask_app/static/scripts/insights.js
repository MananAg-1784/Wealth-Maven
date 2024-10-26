

function updateStocks() {
const selectedIndice = document.getElementById('indiceSelect').value;
const stocksUl = document.getElementById('stocksUl');
stocksUl.innerHTML = ''; // Clear previous stocks

if (selectedIndice && indiceStocks[selectedIndice]) {
    indiceStocks[selectedIndice].forEach(company => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        // Create an anchor tag with the stock name
        const a = document.createElement('a');
        a.href = `/stocks/${encodeURIComponent(company)}`; // Use encodeURIComponent to safely encode the stock name
        a.textContent = company;

        // Append the anchor tag to the list item
        li.appendChild(a);
        stocksUl.appendChild(li);
    });
}
}
