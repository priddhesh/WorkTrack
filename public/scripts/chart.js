var data = [{
    values: [document.getElementById('work').innerText, document.getElementById('meeting').innerText, document.getElementById('break').innerText],
    labels: ['Work', 'Meeting', 'Break'],
    type: 'pie'
}];

var layout = {
    height: 400,
    width: 500
};

console.log(document.getElementById('work').innerText)
Plotly.newPlot('myDiv', data, layout);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

document.getElementsByName("find_task_date")[0].setAttribute('max', formatDate(yesterday));