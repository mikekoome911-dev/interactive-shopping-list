let shoppingItems = [];

const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const addBtn = document.getElementById('add-btn');
const shoppingListEl = document.getElementById('shopping-list');
const totalCostEl = document.getElementById('total-cost');
const clearBtn = document.getElementById('clear-btn');


function init() {
    const storedItems = localStorage.getItem('shoppingList');
    if (storedItems) {
        shoppingItems = JSON.parse(storedItems);
    }
    renderList();
}

function saveToLocalStorage () {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingItems));
}

function renderList() {
    shoppingListEl.innerHTML = ''
    let totalCost = 0;

    shoppingItems.forEach((item, index) => {
        const li = document.createElement('li');
        if (item.purchased) {
            li.classList.add('purchased');
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = `${item.name} - ksh${item.price.toFixed(2)}`;
        li.appendChild(textSpan);

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('item-actions');

        const purchaseBtn = document.createElement('button');
        purchaseBtn.textContent = item.purchased ? 'Unmark' : 'Bought';
        purchaseBtn.classList.add('purchase-btn');
        purchaseBtn.addEventListener('click', () => togglePurchased(index));
        actionDiv.appendChild(purchaseBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => editItem(index));
        actionDiv.appendChild(editBtn);

        li.appendChild(actionDiv);
        shoppingListEl.appendChild(li);

        totalCost += item.price;
        
    })
    totalCostEl.textContent = totalCost.toFixed(2);
}


function addItem () {
    const name = itemInput.value.trim();
    const price = parseFloat(priceInput.value) || 0;

    if (name === '') {
        alert('please enter a valid item name.');
        return;
    }

    const newItem = {
        name: name,
        price: price,
        purchased: false
    };

    shoppingItems.push(newItem);
    saveToLocalStorage();
    renderList();

    itemInput.value ='';
    priceInput.value= '';
}

function editItem(index) {
    const currentItem = shoppingItems[index];
    const newName = prompt("Edit item name:", currentItem.name);
    if (newName === null) return;

    const newPriceStr = prompt("Edit item Price:", currentItem.price);
    if (newPriceStr === null) return;

    const newPrice = parseFloat(newPriceStr) || 0;

    if (newName.trim() !== '') {
        shoppingItems[index].name = newName.trim();
        shoppingItems[index].price = newPrice;
        saveToLocalStorage();
        renderList();
    }
}

function clearList() {
    if (confirm('are you sure you want to clear your entire list')) {
        shoppingItems = [];
        saveToLocalStorage();
        renderList();
    }
}

function togglePurchased(index) {
    shoppingItems[index].purchased = !shoppingItems[index].purchased;

    saveToLocalStorage();

    renderList();
}

addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearList);

itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

init();