import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import flatpickr from "flatpickr";


export class EditOperation {
    constructor() {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        this.operationId = params.get('id');
        this.type = params.get('type');
        const categoryName = params.get('categoryName');
        //this.categoryName = params.get('categoryName');
        const amount = params.get('amount');
        const date = params.get('date');
        const comment = params.get('comment');

        this.inputType = document.getElementById('type')
        this.inputType.value = (this.type === "income")? "Доход": "Расход";
        this.inputCategoryName = document.getElementById('categoryName')
        this.inputCategoryName.value = categoryName
        //this.getCategories()
        this.inputAmount = document.getElementById('amount')
        this.inputAmount.value = amount
        this.inputDate = document.getElementById('date')
        this.inputDate.value = date
        flatpickr(this.inputDate, {
            mode: "single",
            dateFormat: "Y-m-d",
            onClose: (selectedDate)=> {
                if (selectedDate) {
                    this.inputDate.textContent = selectedDate;
                }
            }
        });
        this.inputComment = document.getElementById('comment')
        this.inputComment.value = comment

        this.editButton = document.getElementById('edit-button');
        this.declineButton = document.getElementById('decline-button');

        this.editButton.addEventListener('click', () => {
            this.getCategoriesPreUpdate()
            //this.updateOperation(this.inputCategoryName.value)
        })

        this.declineButton.addEventListener('click', function() {
                window.location.href = "#/finances_and_expenses"
        })
    }

    async updateOperation(categoryId) {
        const amountWithoutDollar = (this.inputAmount.value).replace('$', '').trim();

        try {
            const result = await CustomHttp.request(config.host + `/operations/${this.operationId}`,
                'PUT',
                {
                    "type": this.type,
                    "amount": amountWithoutDollar,
                    "date": this.inputDate.value,
                    "comment": this.inputComment.value,
                    "category_id": categoryId
                }
            )
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                window.location.href = "#/finances_and_expenses"
            }
        } catch (error) {
            return console.log(error)
        }
    }

    async getCategoriesPreUpdate(){

        try {
            const categories = await CustomHttp.request(config.host + `/categories/${this.type}`,
                'GET'
            )
            if (categories) {
                if (categories.error) {
                    throw new Error(result.message);
                }

                const category = categories.find(cat => {
                    return cat.title === this.inputCategoryName.value
                })
                console.log(category)

                if (category.id) {
                    await this.updateOperation(category.id)
                    window.location.href = "#/finances_and_expenses"
                }
            }
        } catch (error) {
            return console.log(error)
        }
    }

   /* async getCategories(){
        const typeOfCategory = this.type

        try {
            const options = await CustomHttp.request(config.host + `/categories/${typeOfCategory}`,
                'GET'
            )
            if (options) {
                if (options.error) {
                    throw new Error(result.message);
                }

                if (options.length > 0) {
                    options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.id;
                        optionElement.textContent = option.title;
                        if(option.title === this.categoryName) {optionElement.selected=true}
                        this.inputCategoryName.appendChild(optionElement);
                    });
                } else {
                    this.inputCategoryName.innerHTML = '<option value="">Нет доступных вариантов</option>';
                }
            }
        } catch (error) {
            return console.log(error)
        }
    }*/
}