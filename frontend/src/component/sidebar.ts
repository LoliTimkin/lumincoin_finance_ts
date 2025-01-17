import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import {DefaultResponseType} from "../../types/default-response.type";
import {BalanceResponseType} from "../../types/balance-response.type";
import {Defaults} from "chart.js/dist/core/core.defaults";
import {UserInfoType} from "../../types/user-info.type";

export class Sidebar {
    private balance: HTMLElement | null;
    private buttons: NodeListOf<HTMLAnchorElement>;
    private buttonCategory: HTMLElement | null;

    constructor() {
        this.balance = document.getElementById('balance-value');
        const userElement: HTMLSpanElement | null = document.querySelector('.custom-user span');
        if (Auth.getUserInfo() && userElement) {
            userElement.innerText = (Auth.getUserInfo() as UserInfoType).name
        }
        this.getBalance();
        this.buttons = document.querySelectorAll('.nav-link')
        //const that = this.buttons
        this.buttonCategory = document.getElementById('category');

        if(this.buttonCategory) {
            const buttonCategory: HTMLAnchorElement = this.buttonCategory as HTMLAnchorElement;
            buttonCategory.addEventListener('click', () => {
                this.buttons.forEach(button => button.classList.remove('active'));
                if ("classList"  in buttonCategory) {
                    buttonCategory.classList.add('active');
                }
                document.querySelectorAll('.nav-link svg path').forEach((path) => {
                    path.setAttribute('fill', '#052C65');
                });
                document.querySelector('.custom-dropdown-toggle path')?.setAttribute('fill', 'white');
            })
        }
    }

    private async getBalance(): Promise<void> {
        try {
            const result: DefaultResponseType | BalanceResponseType = await CustomHttp.request('http://localhost:3000/api/balance', 'GET')
            if (result) {
                if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message);
                }
                (this.balance as HTMLSpanElement).innerText = (result as BalanceResponseType).balance + "$"
            }
        } catch (error) {
            return console.log(error)
        }
    }
}


