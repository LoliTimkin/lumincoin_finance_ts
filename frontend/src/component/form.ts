import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import {FormFieldType} from "../../types/form-field.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {SignupResponseType} from "../../types/signup-response.type";
import {LoginResponseType} from "../../types/login-response.type";

export class Form {
    private readonly processElement: HTMLElement | null;
    private readonly page: "signup" | "login";
    private fields: FormFieldType[];

    constructor(page) {
        this.processElement = null;
        this.page = page;

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === "signup") {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+){1,2}$/,
                    valid: false,
                }
            )
        }
        const that: Form = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, this as HTMLInputElement);
                }
            }
        })
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }

    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    private validateForm() {
        const validForm: boolean = this.fields.every(item => item.valid);
        if (validForm && this.processElement) {
            this.processElement.removeAttribute('disabled');
        } else if (this.processElement) {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email: HTMLInputElement = this.fields.find(item => item.name === 'email')?.element as HTMLInputElement;
            const password: HTMLInputElement = this.fields.find(item => item.name === 'password')?.element as HTMLInputElement;

            if (this.page === 'signup') {
                try {

                    const result: DefaultResponseType | SignupResponseType = await CustomHttp.request('http://localhost:3000/api/signup', 'POST', {
                        name: (this.fields.find(item => item.name === 'name')?.element as HTMLInputElement).value,
                        lastName: "default",
                        email: email.value,
                        password: password.value,
                        passwordRepeat: password.value
                    })

                    if (result) {
                        if ((result as DefaultResponseType).error) {
                            throw new Error((result  as DefaultResponseType).message);
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }

            }

            try {
                const result: DefaultResponseType | LoginResponseType = await CustomHttp.request('http://localhost:3000/api/login', 'POST', {
                    email: email.value,
                    password: password.value,
                })

                if (result) {
                    if ((result as DefaultResponseType).error ) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                    Auth.setUserInfo({
                        userId: (result as LoginResponseType).user.id,
                        email: email.value,
                        name: (result as LoginResponseType).user.name
                    })
                    location.href = '#/'
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}


