import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import flatpickr from "flatpickr";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoryResponseType} from "../../types/category-response.type";

export class CreateOperation {

    private createButton: HTMLElement | null;
    private declineButton: HTMLElement | null;
    private inputTypeOperation: HTMLElement | null;
    private inputCategoryOperation: HTMLElement | null;
    private inputSumOperation: HTMLElement | null;
    private inputDateOperation: HTMLElement | null;
    private inputCommentOperation: HTMLElement | null;

    constructor() {
        //this.page = page
        const hash: String = window.location.hash
        const queryString: String = hash.split("?")[1]
        const params: URLSearchParams = new URLSearchParams(queryString)
        const type: String = params.get("type")

        this.createButton = document.getElementById('create-operation');
        this.declineButton = document.getElementById('decline-button');
        this.inputTypeOperation = document.getElementById('input-category-type');
        (this.inputTypeOperation as HTMLInputElement).value = type
        this.inputCategoryOperation = document.getElementById('input-category-name')
        this.inputSumOperation = document.getElementById('input-sum-operation')
        this.inputDateOperation = document.getElementById('input-date-operation')

        flatpickr(this.inputDateOperation, {
            mode: "single",
            dateFormat: "Y-m-d",
            onClose: (selectedDate)=> {
                if (selectedDate && this.inputDateOperation) {
                    this.inputDateOperation.textContent = selectedDate;
                }
            }
        });
        this.inputCommentOperation = document.getElementById('input-comment-operation')

        this.getCategories()

        if (this.inputTypeOperation) {
            this.inputTypeOperation.addEventListener("change", (event) => {
                this.getCategories()
            })
        }

        if (this.createButton) {
            this.createButton.addEventListener("click", (event) => {
                this.createOperation()
                window.location.href = "#/finances_and_expenses"

            })
        }

        if (this.declineButton) {
            this.declineButton.addEventListener('click', function() {
                window.location.href = "#/finances_and_expenses"
            })
        }

    }

    private async getCategories(): Promise<void> {
        const typeOfCategory: String = (this.inputTypeOperation as HTMLInputElement).value

        try {
            const options: DefaultResponseType | CategoryResponseType[] = await CustomHttp.request(config.host + `/categories/${typeOfCategory}`,
                'GET'
            )
            if (options) {
                if ((options as DefaultResponseType).error) {
                    throw new Error((options as DefaultResponseType).message);
                }

                if ((options as CategoryResponseType[]).length > 0) {
                    (options as CategoryResponseType[]).forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.id.toString();
                        optionElement.textContent = option.title;
                        (this.inputCategoryOperation as HTMLInputElement).appendChild(optionElement);
                    });
                } else {
                    (this.inputCategoryOperation as HTMLInputElement).innerHTML = '<option value="">Нет доступных вариантов</option>';
                }
            }
        } catch (error) {
            return console.log(error)
        }
    }

    private async createOperation(): Promise<void> {
        const typeOfCategory: String = (this.inputTypeOperation as HTMLInputElement).value
        //const categoryName = this.inputCategoryOperation.textContent;
        const categoryId: Number = parseInt((this.inputCategoryOperation as HTMLInputElement).value)
        const sum: Number = parseInt((this.inputSumOperation as HTMLInputElement).value)
        const comment: String = (this.inputCommentOperation as HTMLInputElement).value
        const date: String = (this.inputDateOperation as HTMLInputElement).value

        try {
            const result = await CustomHttp.request(config.host + `/operations/`,
                'POST',
                {
                    "type": typeOfCategory,
                    "amount": sum,
                    "date": date, //"2022-01-01"
                    "comment": comment,
                    "category_id": categoryId
                }
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