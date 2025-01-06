import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class UpdateCategory {
    constructor(page) {
        this.typeOfCategory = ''
        this.page = page

        this.editButton = document.getElementById('edit-category');
        this.declineButton = document.getElementById('decline-button');
        this.inputButton = document.getElementById("edit-category-name");

        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        //this.categoryId = params.get('id');
        this.categoryName = params.get('category');
        this.inputButton.value= this.categoryName;

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

    async editCategory() {
        const categoryName = this.inputButton.value;
        //const categoryId = 5;

        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        const categoryId = params.get('id');

        if (this.page === "expenses") {
            this.typeOfCategory = "expense"
        } else {
            this.typeOfCategory = "income"
        }

        try {
            const result = await CustomHttp.request(config.host + `/categories/${this.typeOfCategory}/${categoryId}`,
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