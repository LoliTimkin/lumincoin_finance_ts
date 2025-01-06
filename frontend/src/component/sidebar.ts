import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";

export class Sidebar {
    constructor() {
        this.balance = document.getElementById('balance-value');
        const userElement = document.querySelector('.custom-user span');
        userElement.innerText = (Auth.getUserInfo()).name
        this.getBalance();
        this.buttons = document.querySelectorAll('.nav-link')
        //const that = this.buttons
        this.buttonCategory = document.getElementById('category');

        this.buttonCategory.addEventListener('click', () => {
            this.buttons.forEach(button => button.classList.remove('active'));
            this.buttonCategory.classList.add('active');
            document.querySelectorAll('.nav-link svg path').forEach((path) => {
                path.setAttribute('fill', '#052C65');
            });
            document.querySelector('.custom-dropdown-toggle path').setAttribute('fill', 'white');
        })
    }

    async getBalance() {
        try {
            const result = await CustomHttp.request('http://localhost:3000/api/balance', 'GET')
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.balance.innerText = result.balance + "$"
            }
        } catch (error) {
            return console.log(error)
        }
    }



}


