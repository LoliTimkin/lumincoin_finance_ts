import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {DefaultResponseType} from "../../types/default-response.type";

export class UpdateCategory {
    private typeOfCategory: "expense" | "income" | "";
    private readonly page: "expenses" | "finances";
    private editButton: HTMLElement | null;
    private declineButton: HTMLElement | null;
    private inputButton: HTMLElement | null;
    private readonly categoryName: string;

    constructor(page) {
        this.typeOfCategory = ''
        this.page = page

        this.editButton = document.getElementById('edit-category');
        this.declineButton = document.getElementById('decline-button');
        this.inputButton = document.getElementById("edit-category-name");

        const hash: string = window.location.hash;
        const queryString: string = hash.split('?')[1];
        const params: URLSearchParams = new URLSearchParams(queryString);
        //this.categoryId = params.get('id');
        this.categoryName = params.get('category');
        (this.inputButton as HTMLInputElement).value= this.categoryName;

        if (this.editButton) {
            this.editButton.addEventListener('click', () => {
                if(page==="finances") {
                    this.editCategory()
                    window.location.href = "#/finances"
                } else if(page === "expenses") {
                    this.editCategory()
                    window.location.href = "#/expenses"
                } else {
                    window.location.href = "#/"
                }
            })
        }

        if (this.declineButton) {
            this.declineButton.addEventListener('click', function() {
                if(page==="finances") {
                    window.location.href = "#/finances"
                } else if(page === "expenses") {
                    window.location.href = "#/expenses"
                } else {
                    window.location.href = "#/"
                }
            })
        }

    }

    private async editCategory(): Promise<void> {
        const categoryName: string = (this.inputButton as HTMLInputElement).value;
        const hash: string = window.location.hash;
        const queryString: string = hash.split('?')[1];
        const params: URLSearchParams = new URLSearchParams(queryString);
        const categoryId: string = params.get('id');

        if (this.page === "expenses") {
            this.typeOfCategory = "expense"
        } else {
            this.typeOfCategory = "income"
        }

        try {
            const result: DefaultResponseType = await CustomHttp.request(config.host + `/categories/${this.typeOfCategory}/${categoryId}`,
                'PUT',
                {
                    title: categoryName
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