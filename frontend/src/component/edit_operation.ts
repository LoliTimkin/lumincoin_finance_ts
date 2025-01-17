import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import flatpickr from "flatpickr";
import {DefaultResponseType} from "../../types/default-response.type";
import {OperationsResponseType} from "../../types/operations-responce.type";
import {CategoryResponseType} from "../../types/category-response.type";


export class EditOperation {
    private readonly operationId: string
    private readonly type: string
    private inputType: HTMLElement | null;
    private inputCategoryName: HTMLElement | null;
    private inputAmount: HTMLElement | null;
    private inputDate: HTMLElement | null;
    private inputComment: HTMLElement | null;
    private editButton: HTMLElement | null;
    private declineButton: HTMLElement | null;

    constructor() {
        const hash: string = window.location.hash;
        const queryString: string = hash.split('?')[1];
        const params: URLSearchParams = new URLSearchParams(queryString);
        this.operationId = params.get('id') as string;
        this.type = params.get('type') as string;
        const categoryName: string = params.get('categoryName') as string;
        //this.categoryName = params.get('categoryName');
        const amount: string = params.get('amount') as string;
        const date: string = params.get('date') as string;
        const comment: string = params.get('comment') as string;
        this.inputType = document.getElementById('type');
        (this.inputType as HTMLInputElement).value = (this.type === "income")? "Доход": "Расход";
        this.inputCategoryName = document.getElementById('categoryName');
        (this.inputCategoryName as HTMLInputElement).value = categoryName;
        //this.getCategories()
        this.inputAmount = document.getElementById('amount');
        (this.inputAmount as HTMLInputElement).value = amount;
        this.inputDate = document.getElementById('date');
        (this.inputDate as HTMLInputElement).value = date

        if (this.inputDate) {
            flatpickr(this.inputDate, {
                mode: "single",
                dateFormat: "Y-m-d",
                onClose: (selectedDate)=> {
                    if (selectedDate && this.inputDate) {
                        this.inputDate.textContent = selectedDate.toString();
                    }
                }
            });
        }

        this.inputComment = document.getElementById('comment');
        (this.inputComment as HTMLInputElement).value = comment

        this.editButton = document.getElementById('edit-button');
        this.declineButton = document.getElementById('decline-button');

        if(this.editButton) {
            this.editButton.addEventListener('click', () => {
                this.getCategoriesPreUpdate()
            })
        }

        if(this.declineButton) {
            this.declineButton.addEventListener('click', function () {
                window.location.href = "#/finances_and_expenses"
            })
        }

    }

    private async updateOperation(categoryId: number): Promise<void> {
        const amountWithoutDollar: string = ((this.inputAmount as HTMLInputElement).value).replace('$', '').trim();

        try {
            const result: DefaultResponseType | OperationsResponseType = await CustomHttp.request(config.host + `/operations/${this.operationId}`,
                'PUT',
                {
                    "type": this.type,
                    "amount": amountWithoutDollar,
                    "date": (this.inputDate as HTMLInputElement).value,
                    "comment": (this.inputComment as HTMLInputElement).value,
                    "category_id": categoryId
                }
            )
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message );
                }
                window.location.href = "#/finances_and_expenses"
            }
        } catch (error) {
            return console.log(error)
        }
    }

    private async getCategoriesPreUpdate(): Promise<void> {

        try {
            const categories: CategoryResponseType[] = await CustomHttp.request(config.host + `/categories/${this.type}`,
                'GET'
            )
            if (categories) {
                //if (categories.error) {
                //    throw new Error(result.message);
                //}
                const category: CategoryResponseType | undefined = categories.find(cat => {
                    return cat.title === (this.inputCategoryName as HTMLInputElement).value
                })
                console.log(category)

                if (category) {
                    await this.updateOperation(category.id)
                    window.location.href = "#/finances_and_expenses"
                }
            }
        } catch (error) {
            return console.log(error)
        }

    }

}