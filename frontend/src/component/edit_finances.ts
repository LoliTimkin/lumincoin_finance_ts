import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CategoryResponseType} from "../../types/category-response.type";
import {OperationsResponseType} from "../../types/operations-responce.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class EditFinances {
    private createButton: HTMLElement | null;
    private removeModalButton: HTMLElement | null;
    readonly page: "expenses" | "finances";
    readonly typeOfCategory: "expense" | "income";
    private data: any[];
    //private editButtons: NodeListOf<HTMLElement>;
    //private removeButtons: NodeListOf<HTMLElement>;

    constructor(page: "expenses" | "finances") {
         this.createButton = document.getElementById('create_item')
         const that: EditFinances = this
         this.removeModalButton = document.getElementById('modal-remove-category')

        if (this.removeModalButton) {
            this.removeModalButton.addEventListener('click', function() {
                that.deleteCategory()
            })
        }

         this.page = page

        if (this.page === "expenses") {
            this.typeOfCategory = "expense"
        } else {
            this.typeOfCategory = "income"
        }

        this.data = []
        this.cardsGenerator()
    }

    private editButtonHandler(): void {
        const editButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.btn-edit');
        const removeButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.btn-remove')

        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем стандартное действие ссылки
                const categoryCard = button.closest('.card');
                if (categoryCard) {
                    const categoryName = (categoryCard.querySelector('.card-title') as HTMLElement).textContent;
                    const categoryId = (categoryCard.querySelector('.btn-edit') as HTMLElement).id;
                    if (this.page === "expenses")  {
                        window.location.href = `#/edit_expenses?category=${categoryName}&id=${categoryId}`;
                    } else {
                        window.location.href = `#/edit_finances?category=${categoryName}&id=${categoryId}`;
                    }
                }

            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем стандартное действие ссылки
                const categoryCard = button.closest('.card');
                if (categoryCard) {
                    const categoryName = (categoryCard?.querySelector('.card-title') as HTMLElement).textContent;
                    const categoryId = (categoryCard?.querySelector('.btn-remove') as HTMLElement).id;
                    if (this.page === "expenses")  {
                        window.location.href = `#/expenses?category=${categoryName}&id=${categoryId}`;
                    } else {
                        window.location.href = `#/finances?category=${categoryName}&id=${categoryId}`;
                    }
                }
            });
        });

        if (this.createButton) {
            this.createButton.addEventListener('click',  (event) => {
                if (this.page === "expenses")  {
                    window.location.href = '#/create_expenses';
                } else {
                    window.location.href = '#/create_finances';
                }
            })
        }
    }

    private async cardsGenerator(): Promise<void> {
        // Получаем данные с сервера и добавляем в исходный набор данных
        try {
            const result: CategoryResponseType[] = await CustomHttp.request(config.host + `/categories/${this.typeOfCategory}`,
                'GET')
            if (result) {
                //if (result.error) {
                if (result.length < 0) {
                    //throw new Error(result.message);
                    console.log("категорий нет")
                }

                this.data = this.data.concat(result)
            }
        } catch (error) {
            return console.log(error)
        }

        // Получаем контейнер для карточек
        const cardsContainer: HTMLElement | null = document.getElementById('cards-container');
        if (cardsContainer) {
            // Проходим по каждому элементу данных и добавляем карточку в контейнер
            this.data.forEach(item => {
                const card: HTMLDivElement = this.createCard(item);
                cardsContainer.prepend(card);
            });
        }
        //  только после рендеринга карточек вешаем обработчики, так как данные с сервера по ним
        // асинхронный код
        //this.editButtons = document.querySelectorAll('.btn-edit');
        //this.removeButtons = document.querySelectorAll('.btn-remove')

        this.editButtonHandler()
    }

    private createCard(item: CategoryResponseType): HTMLDivElement {
        const card: HTMLDivElement = document.createElement('div');
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

    private async deleteCategory(): Promise<void> {
        const hash: string = window.location.hash;
        const queryString: string = hash.split('?')[1];
        const params: URLSearchParams = new URLSearchParams(queryString);
        const categoryId: string = params.get('id') as string;
        const categoryName: string = params.get('category') as string;

        try {
            //const result = await CustomHttp.request(config.host + `/operations?period=${period}`,
            const result: OperationsResponseType[]  = await CustomHttp.request(config.host + `/operations?period=all`,
                'GET',
            )
            if (result) {
                ///if (result.error) {
                if (result.length < 0) {
                    //throw new Error(result.message);
                        console.log("операций нет")
                }
                const operationsData: OperationsResponseType[] = result
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
            const result: DefaultResponseType = await CustomHttp.request(`http://localhost:3000/api/categories/${this.typeOfCategory}/${categoryId}`,
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

    private async deleteOperationById(operationId: number): Promise<void> {

        try {
            const result: DefaultResponseType = await CustomHttp.request(config.host + `/operations/${operationId}`,
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

