import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
//import {Chart} from "chart.js";
import {
    Chart,
    PieController,
    ArcElement,
    Tooltip,
    Legend,
    Title, ChartConfiguration
} from 'chart.js';
import {OperationsResponseType} from "../../types/operations-responce.type";
import flatpickr from "flatpickr";

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

export class Main {
    private dateRangeBtn: HTMLElement | null;
    private incomeCategoryToPercent: any
    private expenseCategoryToPercent: any
    private data: OperationsResponseType[];
    //private myChart: Chart;
    //private myChart2: Chart;

    constructor() {

        let calendarDateFrom: HTMLElement | null = document.getElementById('calendarFrom')
        let calendarDateTo: HTMLElement | null = document.getElementById('calendarTo')
        this.dateRangeBtn = document.getElementById('range-calendar')

        const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".filter-button"); // Все кнопки
        let activeButton: HTMLButtonElement | null = document.querySelector(".filter-button.btn-secondary"); // Кнопка по умолчанию

        this.incomeCategoryToPercent = {} // свойство для обработанных данных - доходы
        this.expenseCategoryToPercent = {} // свойство для обработанных данных - расходы
        this.data = [];

        if (this.dateRangeBtn) {
            flatpickr(this.dateRangeBtn, {
                mode: "range", // Режим выбора диапазона
                dateFormat: "Y-m-d",
                onClose: (selectedDates: any)=> {
                    if (selectedDates.length === 2 && calendarDateFrom && calendarDateTo) {
                        // Если выбраны обе даты, обновляем кнопки
                        const startDate = selectedDates[0].toLocaleDateString("ru-RU"); // Первая дата
                        const endDate = selectedDates[1].toLocaleDateString("ru-RU");   // Вторая дата

                        calendarDateFrom.textContent = startDate;
                        calendarDateTo.textContent = endDate;

                        this.getOperationsByFilter("interval", selectedDates[0], selectedDates[1])
                    }
                }
            });
        }

// Установить фильтр для активной кнопки по умолчанию
        if (activeButton) {
            this.getOperationsByFilter(activeButton.dataset.filter as string);
        }

// Назначить обработчик для всех кнопок
        buttons.forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", () => {
                if (button !== activeButton) {
                    if (activeButton) {
                        activeButton.classList.remove("btn-secondary"); // Удаление класса у предыдущей кнопки
                        activeButton.classList.add("btn-outline-secondary")
                    }
                    button.classList.add("btn-secondary"); // Установка класса для текущей кнопки
                    button.classList.remove("btn-outline-secondary") //  Удаление неактивного состояния
                    activeButton = button; // Обновление активной кнопки
                    if (button !== this.dateRangeBtn) {
                        this.getOperationsByFilter(button.dataset.filter as string);// Применение фильтра
                    }
                }
            });
        });
    }

    private async getOperationsByFilter(period: string, startDate?: string, endDate?: string ): Promise<void> {
        const queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("period", period)

        if (period === "interval" && startDate && endDate) {
            queryParams.append("dateFrom", startDate)
            queryParams.append("dateTo", endDate)
        }

        try {
            const result: OperationsResponseType[] = await CustomHttp.request(config.host + `/operations?${queryParams}`,
                'GET',
            )
            if (result) {
                //if (result.error) {
                //    throw new Error(result.message);
                //}
                this.data = result
                console.log(this.data)
                this.calculateStatistics(this.data)
            }
        } catch (error) {
            return console.log(error)
        }

    }

    private calculateStatistics(testData: OperationsResponseType[]): void {
        console.log(testData)
        const dataIncome: OperationsResponseType[] = testData.filter(item  => {
            return item.type === "income"
        })
        console.log(dataIncome)
        const dataExpense: OperationsResponseType[] = testData.filter(item => {
            return item.type === "expense"
        })
        console.log(dataExpense)

        //const incomeCategoryCount: {[key: string]: number} = {};
        //const expenseCategoryCount: {[key: string]: number} = {};
        const incomeCategoryCount: any = {};
        const expenseCategoryCount: any = {};

        dataIncome.forEach(item => {
            incomeCategoryCount[item.category] = (incomeCategoryCount[item.category] || 0) + 1;
        });

        dataExpense.forEach(item => {
            expenseCategoryCount[item.category] = (expenseCategoryCount[item.category] || 0) + 1;
        });

        console.log(incomeCategoryCount)
        console.log(expenseCategoryCount)

        this.incomeCategoryToPercent = {}

        for (let category in incomeCategoryCount) {
            this.incomeCategoryToPercent[category] = ((incomeCategoryCount[category] / dataIncome.length) * 100).toFixed(2) ;
        }

        this.expenseCategoryToPercent = {}

        for (let category in expenseCategoryCount) {
            this.expenseCategoryToPercent[category] = ((expenseCategoryCount[category] / dataExpense.length) * 100).toFixed(2);
        }
        console.log(this.incomeCategoryToPercent)
        console.log(this.expenseCategoryToPercent)

            this.createCharts()
    }

    createCharts() {
        const ctx: HTMLElement | null = document.getElementById('myChart');
        const ctx2: HTMLElement | null = document.getElementById('myChart2');

        console.log(Object.values(this.incomeCategoryToPercent))
        const incomeData = {
            labels: Object.keys(this.incomeCategoryToPercent),
            datasets: [
                {
                    label: "Доходы",
                    data: Object.values(this.incomeCategoryToPercent),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)'
                    ]
                }
            ]
        } ;

        const expenseData = {
            labels: Object.keys(this.expenseCategoryToPercent),
            datasets: [
                {
                    label: "Расходы",
                    data: Object.values(this.expenseCategoryToPercent),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)'
                    ]
                }
            ]
        };

         let myChart: Chart<"pie", number[], string>;
         let myChart2: Chart<"pie", number[], string>;

        //if (this.myChart) {
        //    this.myChart.destroy(); // Удаляем предыдущий график
        //}

        myChart = new Chart(ctx as HTMLCanvasElement, {
            type: 'pie',
            data: incomeData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Доходы' }
                }
            }
        } as ChartConfiguration<"pie", number[], string>);

         //if (this.myChart2) {
         //   this.myChart2.destroy(); // Удаляем предыдущий график
        //}
        myChart2 = new Chart(ctx2 as HTMLCanvasElement, {
            type: 'pie',
            data: expenseData,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {display: true, text: 'Расходы'}
                }
            }
        } as ChartConfiguration<"pie", number[], string>);
    }

}

const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

export const testData = [
    {
        "id": 8,
        "type": "income",
        "amount": 50000,
        "date": "2024-12-19",
        "comment": "новые технологии",
        "category": "Роботы"
    },
    {
        "id": 9,
        "type": "expense",
        "amount": 20000,
        "date": "2024-12-19",
        "comment": "аренда",
        "category": "Офис"
    },
    {
        "id": 10,
        "type": "expense",
        "amount": 20000,
        "date": "2024-12-19",
        "comment": "разово",
        "category": "Реклама"
    },
    {
        "id": 11,
        "type": "income",
        "amount": 30000,
        "date": "2024-12-19",
        "comment": "обучение",
        "category": "Роботы"
    },
    {
        "id": 12,
        "type": "income",
        "amount": 30000,
        "date": "2024-12-19",
        "comment": "обучение",
        "category": "Графика"
    }
];





