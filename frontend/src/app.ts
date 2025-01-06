import {Router} from "./router";

class App {
    private router: Router;

    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded',
            this.handleRouterChanging.bind(this)
        )
        window.addEventListener('popstate',
            this.handleRouterChanging.bind(this)
        )
    }

    private handleRouterChanging(): void {
        this.router.openRoute();
    }
}

(new App());