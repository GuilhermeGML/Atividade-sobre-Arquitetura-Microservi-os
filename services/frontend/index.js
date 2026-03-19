function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

function bindBookActions() {
    document.querySelectorAll('.button-shipping').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
            calculateShipping(id, cep);
        });
    });

    document.querySelectorAll('.button-buy').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
        });
    });
}

function renderBooks(booksElement, booksData) {
    booksElement.innerHTML = '';
    booksData.forEach((book) => {
        booksElement.appendChild(newBook(book));
    });
    bindBookActions();
}

function fetchAllBooks(booksElement) {
    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                renderBooks(booksElement, data);
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
}

function fetchBookById(booksElement, id) {
    fetch('http://localhost:3000/products/' + id)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((book) => {
            if (!book || !book.id) {
                swal('Livro não encontrado', 'Não foi encontrado livro com esse ID', 'warning');
                booksElement.innerHTML = '';
                return;
            }

            renderBooks(booksElement, [book]);
        })
        .catch((err) => {
            swal('Erro', 'Erro ao buscar o livro por ID', 'error');
            console.error(err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');
    const bookIdInput = document.getElementById('book-id-input');
    const searchBookButton = document.getElementById('search-book-btn');
    const clearSearchButton = document.getElementById('clear-search-btn');

    fetchAllBooks(books);

    searchBookButton.addEventListener('click', () => {
        const id = bookIdInput.value.trim();

        if (!id) {
            swal('Atenção', 'Digite um ID para buscar', 'warning');
            return;
        }

        fetchBookById(books, id);
    });

    clearSearchButton.addEventListener('click', () => {
        bookIdInput.value = '';
        fetchAllBooks(books);
    });

    bookIdInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchBookButton.click();
        }
        });
});
