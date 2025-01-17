import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import { DefaultResponseType} from "../../types/default-response.type";

export class CreateCategory {
    private typeOfCategory: string;
    private page: string;
    private createButton: HTMLElement | null;
    private declineButton: HTMLElement | null;
    private inputButton: HTMLInputElement | null;


    constructor(page: string) {
        this.typeOfCategory = ''
        this.page = page
        this.createButton = document.getElementById('create-category');
        this.declineButton = document.getElementById('decline-button');
        this.inputButton = document.getElementById('input-create-category') as HTMLInputElement;

        const urlRoute: string = window.location.hash.split('?')[0];

        if (!this.createButton || !this.declineButton ||
            !this.inputButton) {
            if (urlRoute === '#/') {
                return
            } else {
                window.location.href = '#/'
                return
            }
        }

        this.createButton.addEventListener('click', () => {
            if(page==="finances") {
                this.createCategory()
                window.location.href = "#/finances"
            } else if(page === "expenses") {
                this.createCategory()
                window.location.href = "#/expenses"
            } else {
                window.location.href = "#/"
            }
        })

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

    private async createCategory(): Promise<void> {
        //const categoryName: string = this.inputButton.value;
        //let result: DefaultResponseType
        if (this.page === "expenses") {
            this.typeOfCategory = "expense"
        } else {
            this.typeOfCategory = "income"
        }
        try {
            if (!this.inputButton) return
            if ("value" in this.inputButton) {
                const result: DefaultResponseType = await CustomHttp.request(config.host + `/categories/${this.typeOfCategory}/`,
                    'POST',
                    {
                        title: this.inputButton.value,
                    }
                )
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                }
            }

        } catch (error) {
            return console.log(error)
        }
    }
}