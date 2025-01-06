import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class EditFinances {
    // Находим все кнопки с классом 'edit-btn'

    constructor(page) {
         //this.typeOfCategory = ""
         this.createButton = document.getElementById('create_item')
         const that = this
         this.removeModalButton = document.getElementById('modal-remove-category')
         this.removeModalButton.addEventListener('click', function() {
             that.deleteCategory()
         })

         this.page = page

        if (this.page === "expenses") {
            this.typeOfCategory = "expense"
        } else {
            this.typeOfCategory = "income"
        }

        this.data = []
/*         this.data = [
            { "id": 1, "title": "Депозиты" },
            { "id": 2, "title": "Зарплата" },
            { "id": 3, "title": "Сбережения" },
            { "id": 4, "title": "Инвестиции" }
        ];
        //const response = CustomHttp.request(config.host + '/categories/income');
        //console.log(response)
        if (page === "expenses") {
            this.data = [
                { "id": 1, "title": "Еда" },
                { "id": 2, "title": "Жилье" },
                { "id": 3, "title": "Здоровье" },
                { "id": 4, "title": "Кафе" },
                { "id": 5, "title": "Авто" },
                { "id": 6, "title": "Одежда" },
                { "id": 7, "title": "Развлечения" },
                { "id": 8, "title": "Счета" },
                { "id": 9, "title": "Спорт" }
            ];
        }*/
         this.cardsGenerator()
    }

    editButtonHandler() {
        this.editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем стандартное действие ссылки
                const categoryCard = button.closest('.card');
                const categoryName = categoryCard.querySelector('.card-title').textContent;
                const categoryId = categoryCard.querySelector('.btn-edit').id;

                if (this.page === "expenses")  {
                    window.location.href = `#/edit_expenses?category=${categoryName}&id=${categoryId}`;
                } else {
                    window.location.href = `#/edit_finances?category=${categoryName}&id=${categoryId}`;
                }
            });
        });

        this.removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем стандартное действие ссылки
                const categoryCard = button.closest('.card');
                const categoryName = categoryCard.querySelector('.card-title').textContent;
                const categoryId = categoryCard.querySelector('.btn-remove').id;
                if (this.page === "expenses")  {
                    window.location.href = `#/expenses?category=${categoryName}&id=${categoryId}`;
                } else {
                    window.location.href = `#/finances?category=${categoryName}&id=${categoryId}`;
                }
            });
        });

        this.createButton.addEventListener('click',  (event) => {
            if (this.page === "expenses")  {
                window.location.href = '#/create_expenses';
            } else {
                window.location.href = '#/create_finances';
            }
        })
    }

    async cardsGenerator() {

        // Получаем данные с сервера и добавляем в исходный набор данных
        try {
            const result = await CustomHttp.request(config.host + `/categories/${this.typeOfCategory}`,
                'GET')
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.data = this.data.concat(result)
            }
        } catch (error) {
            return console.log(error)
            }

        // Получаем контейнер для карточек
        const cardsContainer = document.getElementById('cards-container');
        // Проходим по каждому элементу данных и добавляем карточку в контейнер
        this.data.forEach(item => {
            const card = this.createCard(item);
            cardsContainer.prepend(card);
        });

        //  только после рендеринга карточек вешаем обработчики, так как данные с сервера по ним
        // асинхронный код
        this.editButtons = document.querySelectorAll('.btn-edit');
        this.removeButtons = document.querySelectorAll('.btn-remove')

        this.editButtonHandler()
    }

    createCard(item) {
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h3 class="card-title" id="category-name">${item.title}</h3>
          <div class="d-flex justify-content-start">
            <a href="#/edit_finances?id=${item.id}" id="${item.id}" class="btn btn-primary btn-edit">Редактировать</a>
            <a id="${item.id}" class="btn btn-danger btn-remove" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Удалить
            </a>
          </div>
        </div>
      </div>
    `;
        return card;
    }

    async deleteCategory() {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        const categoryId = params.get('id');
        //document.getElementById('category-name-input').value = categoryName || '';
        const categoryName = params.get('category')

        try {
            //const result = await CustomHttp.request(config.host + `/operations?period=${period}`,
            const result = await CustomHttp.request(config.host + `/operations?period=all`,
                'GET',
            )
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                const operationsData = result
                console.log(operationsData)
                //this.operationsDataByCategory
                operationsData.forEach(operation => {
                    if (operation.category === categoryName) {this.deleteOperationById(operation.id)}
                })
                //console.log(this.operationsDataByCategory)

            }
        } catch (error) {
            return console.log(error)
        }

        try {
            const result = await CustomHttp.request(`http://localhost:3000/api/categories/${this.typeOfCategory}/${categoryId}`,
                'DELETE')
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            return console.log(error)
        }
    }

    async deleteOperationById(operationId) {

        try {
            const result = await CustomHttp.request(config.host + `/operations/${operationId}`,
                'DELETE',
            )
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

            }
        } catch (error) {
            return console.log(error)
        }
    }


}

