import { apiUrl } from './config.js';

let currentItems = [];
const tableBody = document.getElementById("table-body");
const totalItems = document.getElementById("total-items");
const lowStockItems = document.getElementById("low-stock-items");
const outOfStockItems = document.getElementById("out-of-stock-items");
const searchInput = document.getElementById("search-input");
const addItemForm = document.getElementById("add-item-form");
const paginationContainer = document.getElementById("pagination");

// Variável global para armazenar o ID do item a ser deletado
let itemToDelete = null;

// Função para mostrar loading
function showLoading() {
    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Carregando...</td></tr>';
}

// Função para exibir mensagem de erro
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('app').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000); // Remove a mensagem após 5 segundos
}

// Função para exibir mensagem de sucesso
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.getElementById('app').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 3000); // Remove a mensagem após 3 segundos
}

// Função para carregar produtos
async function fetchProducts(page = 1, limit = 10) {
    showLoading();
    try {
        const response = await fetch(`${apiUrl}/products?page=${page}&limit=${limit}`);
        const data = await response.json();
        currentItems = data.products;
        renderTable(data.products);
        updatePagination(data.currentPage, data.totalPages); // Atualiza a paginação
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        showError("Erro ao carregar produtos. Tente novamente mais tarde.");
    }
}

// Função para renderizar a tabela
function renderTable(items) {
    tableBody.innerHTML = items.length ? "" : '<tr><td colspan="5" class="no-data">Nenhum produto encontrado</td></tr>';

    items.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td><span class="status ${getStatusClass(item.status)}">${item.status}</span></td>
            <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="low-stock" data-id="${item._id}">Baixo Estoque</button>
                    <button class="out-of-stock" data-id="${item._id}">Fora de Estoque</button>
                    <button class="edit" data-id="${item._id}"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-id="${item._id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateSummary(items);
}

// Função para atualizar a paginação
function updatePagination(currentPage, totalPages) {
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    const createPageButton = (page, text = page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.toggle('active', page === currentPage);
        button.onclick = () => fetchProducts(page);
        return button;
    };

    // Botão anterior
    if (currentPage > 1) {
        paginationContainer.appendChild(createPageButton(currentPage - 1, 'Anterior'));
    }

    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationContainer.appendChild(createPageButton(i));
        } else if (
            i === currentPage - 2 || 
            i === currentPage + 2
        ) {
            const span = document.createElement('span');
            span.textContent = '...';
            paginationContainer.appendChild(span);
        }
    }

    // Botão próximo
    if (currentPage < totalPages) {
        paginationContainer.appendChild(createPageButton(currentPage + 1, 'Próximo'));
    }
}

// Função para abrir o modal de confirmação
function openDeleteConfirmationModal(id) {
    itemToDelete = id; // Armazena o ID do item a ser deletado
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'flex'; // Mostra o modal
}

// Função para fechar o modal de confirmação
function closeDeleteConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none'; // Esconde o modal
    itemToDelete = null; // Limpa o ID armazenado
}

// Evento para confirmar a exclusão
document.getElementById('confirm-delete').addEventListener('click', async () => {
    if (itemToDelete) {
        await deleteItem(itemToDelete); // Deleta o item
        closeDeleteConfirmationModal(); // Fecha o modal
        fetchProducts(); // Recarrega a lista de produtos
    }
});

// Evento para cancelar a exclusão
document.getElementById('cancel-delete').addEventListener('click', () => {
    closeDeleteConfirmationModal(); // Fecha o modal
});

// Função de deletar item
async function deleteItem(id) {
    try {
        const response = await fetch(`${apiUrl}/products/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            showSuccess('Produto deletado com sucesso!');
        } else {
            throw new Error('Erro ao deletar produto');
        }
    } catch (err) {
        console.error("Erro ao deletar produto:", err);
        showError("Erro ao deletar produto. Tente novamente mais tarde.");
    }
}

// Função para atualizar status do produto
async function updateProductStatus(id, status) {
    try {
        const response = await fetch(`${apiUrl}/products/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            showSuccess('Status atualizado com sucesso!');
            fetchProducts();
        } else {
            throw new Error('Erro ao atualizar status');
        }
    } catch (err) {
        console.error("Erro ao atualizar status:", err);
        showError("Erro ao atualizar status. Tente novamente mais tarde.");
    }
}

// Função para abrir o modal de edição
async function openEditModal(id) {
    const product = await fetchProductById(id);

    if (!product) {
        showError("Produto não encontrado.");
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editar Produto</h2>
            <form id="edit-item-form">
                <input type="text" id="edit-item-name" value="${product.name}" required>
                <input type="number" id="edit-item-quantity" value="${product.quantity}" required>
                <button type="submit">Salvar</button>
                <button type="button" id="cancel-edit">Cancelar</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const editForm = document.getElementById('edit-item-form');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-item-name').value;
        const quantity = parseInt(document.getElementById('edit-item-quantity').value);

        await updateProduct(id, { name, quantity });
        modal.remove();
        fetchProducts();
    });

    const cancelButton = document.getElementById('cancel-edit');
    cancelButton.addEventListener('click', () => {
        modal.remove();
    });
}

// Função para buscar produto por ID
async function fetchProductById(id) {
    try {
        const response = await fetch(`${apiUrl}/products/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produto: ${response.statusText}`);
        }
        const product = await response.json();
        return product;
    } catch (err) {
        console.error("Erro ao buscar produto:", err);
        showError("Erro ao buscar produto. Tente novamente mais tarde.");
        return null;
    }
}

// Função para atualizar produto
async function updateProduct(id, data) {
    try {
        const response = await fetch(`${apiUrl}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showSuccess('Produto atualizado com sucesso!');
        } else {
            throw new Error('Erro ao atualizar produto');
        }
    } catch (err) {
        console.error("Erro ao atualizar produto:", err);
        showError("Erro ao atualizar produto. Tente novamente mais tarde.");
    }
}

// Funções auxiliares
function getStatusClass(status) {
    const statusMap = {
        'Em Estoque': 'in-stock',
        'Baixo Estoque': 'low-stock',
        'Fora de Estoque': 'out-of-stock'
    };
    return statusMap[status] || '';
}

function updateSummary(items) {
    totalItems.textContent = items.length;
    lowStockItems.textContent = items.filter(item => item.status === 'Baixo Estoque').length;
    outOfStockItems.textContent = items.filter(item => item.status === 'Fora de Estoque').length;
}

// Função debounce para otimizar a pesquisa
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Evento de pesquisa
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = currentItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredItems);
}, 300));

// Evento para adicionar item
addItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("item-name").value;
    const quantity = parseInt(document.getElementById("item-quantity").value);

    try {
        const response = await fetch(`${apiUrl}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, quantity }),
        });

        if (response.ok) {
            const data = await response.json();
            showSuccess('Produto adicionado com sucesso!');
            addItemForm.reset();
            fetchProducts();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao adicionar produto');
        }
    } catch (err) {
        console.error("Erro ao adicionar produto:", err);
        showError(err.message || "Erro ao adicionar produto. Tente novamente mais tarde.");
    }
});

// Evento para manipular cliques nos botões de ação
document.addEventListener('click', async (event) => {
    const target = event.target;

    // Verifica se o clique foi em um botão de ação
    if (target.classList.contains('low-stock')) {
        const id = target.getAttribute('data-id');
        await updateProductStatus(id, 'Baixo Estoque'); // Atualiza para Baixo Estoque
    } else if (target.classList.contains('out-of-stock')) {
        const id = target.getAttribute('data-id');
        await updateProductStatus(id, 'Fora de Estoque'); // Atualiza para Fora de Estoque
    } else if (target.classList.contains('edit')) {
        const id = target.getAttribute('data-id');
        await openEditModal(id); // Abre o modal de edição
    } else if (target.classList.contains('delete')) {
        const id = target.getAttribute('data-id');
        openDeleteConfirmationModal(id); // Abre o modal de confirmação de deleção
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});