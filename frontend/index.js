import { backend } from 'declarations/backend';

const form = document.getElementById('add-item-form');
const input = document.getElementById('new-item');
const shoppingList = document.getElementById('shopping-list');

async function loadItems() {
  const items = await backend.getItems();
  shoppingList.innerHTML = '';
  items.forEach(item => {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  });
}

function createListItem(item) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
    <div>
      <button class="toggle-btn" data-id="${item.id}">
        <i class="fas fa-check"></i>
      </button>
      <button class="delete-btn" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  return li;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    await backend.addItem(text);
    input.value = '';
    loadItems();
  }
});

shoppingList.addEventListener('click', async (e) => {
  if (e.target.closest('.toggle-btn')) {
    const id = Number(e.target.closest('.toggle-btn').dataset.id);
    await backend.toggleCompleted(id);
    loadItems();
  } else if (e.target.closest('.delete-btn')) {
    const id = Number(e.target.closest('.delete-btn').dataset.id);
    await backend.deleteItem(id);
    loadItems();
  }
});

loadItems();
