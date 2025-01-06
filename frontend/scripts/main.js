const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const data = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [10, 20, 30, 15, 25],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)'
            ],
        }
    ]
};

const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');

const config = {
    type: 'pie',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Доходы"
            }
        }
    },
};

const myChart = new Chart(ctx, config);

const config2 = {
    type: 'pie',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Расходы"
            }
        }
    },
};

const myChart2 = new Chart(ctx2, config2);
