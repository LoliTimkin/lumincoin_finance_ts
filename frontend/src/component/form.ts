import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";

export class Form {
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
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        })
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {

                    const result = await CustomHttp.request('http://localhost:3000/api/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: "default",
                        email: email,
                        password: password,
                        passwordRepeat: password
                    })

                    if (result) {
                        if (result.error || !result.user.id) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }

            }

            try {
                const result = await CustomHttp.request('http://localhost:3000/api/login', 'POST', {
                    email: email,
                    password: password,
                })

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.id || !result.user.name) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        userId: result.user.id,
                        email: email,
                        name: result.user.name
                    })
                    location.href = '#/'
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}


