'use strict';

const container_table = document.querySelector('.container-table');

const submitBtn = document.querySelector('.submit-btn');

const countries_div = document.querySelector('.countries .inner-wrap');
const countries_btn = document.querySelector('.country-btn');

const products_div = document.querySelector('.products .inner-wrap');
const products_btn = document.querySelector('.product-btn');

const storages_div = document.querySelector('.storages .inner-wrap');
const storages_btn = document.querySelector('.storage-btn');

function addValuesToBtn({ arr: arr, btn: btn, div_class: div_class, div: div }) {
    arr.forEach((name, index) => {
        if (index == 0) {
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Search..');
            input.setAttribute('id', 'myInput' + div_class.split(".")[1]);
            input.setAttribute('onkeyup', "filterFunction('" + div_class.split(".")[1] + "')");
            input.classList.add('myInput');
            div.appendChild(input);
        }
        let name_1 = name;
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');

        label.setAttribute('for', name_1);
        input.setAttribute('type', 'radio');
        input.setAttribute('id', name_1);
        input.setAttribute('name', div_class.split(".")[1]);
        input.setAttribute('value', name_1);
        span.textContent = name_1;

        label.appendChild(input);
        label.appendChild(span);
        div.appendChild(label);
    });

    btn.addEventListener('click', (e) => {
        let check = document.querySelector(div_class + " .radios");
        check.classList.toggle('active');
    });

    // btn.addEventListener('mouseover', (e) => {
    //     let check = document.querySelector(div_class + " .radios");
    //     check.classList.add('active');
    // });

    // document.querySelector(div_class + " .radios").addEventListener('mouseleave', (e) => {
    //     let check = document.querySelector(div_class + " .radios");
    //     check.classList.remove('active');
    // });

}
//-------------------------------------------------------------------------------------------------------------//
function filterFunction(className) {
    var input, div, filter, label, i, txtValue;
    input = document.querySelector(`#myInput${className}`);
    filter = input.value.toUpperCase();
    div = document.querySelector(`.${className} #Categories .inner-wrap`);
    label = div.querySelectorAll("label");
    for (i = 0; i < label.length; i++) {
        txtValue = label[i].textContent || label[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            label[i].style.display = "";
        } else {
            label[i].style.display = "none";
        }
    }
}
//-------------------------------------------------------------------------------------------------------------//
const file_path = "./no.csv";
//-------------------------------------------------------------------------------------------------------------//
fetch(file_path).then(res => res.text()).then(data => {
    const dataArr = data.trim().split("\n").map(row => row.replace("\r", "").split(",")).slice(1);

    const countries = ["Norway", "Sweden"];
    addValuesToBtn({ arr: countries, btn: countries_btn, div_class: '.countries', div: countries_div });

    const product = [...new Set(dataArr.map(row => row[3].toLowerCase()))];
    addValuesToBtn({ arr: product, btn: products_btn, div_class: '.products', div: products_div });

    products_btn.addEventListener('click', (e) => {
        const product = document.querySelectorAll('.products #Categories .inner-wrap input:checked');
        var val = product[0]?.value;
        if (val) {
            const storage = [...new Set(dataArr.filter(row => row[3].toLowerCase() == val).map(row => row[4]).sort())];
            storages_div.innerHTML = "";
            addValuesToBtn({ arr: storage, btn: storages_btn, div_class: '.storages', div: storages_div });
        }
    });
    // const storage = [...new Set(dataArr.map(row => row[4]).sort())];
    // addValuesToBtn({ arr: storage, btn: storages_btn, div_class: '.storages', div: storages_div });

    submitBtn.addEventListener('click', (e) => {
        // container_table.innerHTML = "";
        const country = document.querySelectorAll('.countries #Categories .inner-wrap input:checked');
        const product = document.querySelectorAll('.products #Categories .inner-wrap input:checked');
        const storage = document.querySelectorAll('.storages #Categories .inner-wrap input:checked');

        const countryArr = [];
        const productArr = [];
        const storageArr = [];

        country.forEach((c) => countryArr.push(c.value));
        product.forEach((p) => productArr.push(p.value));
        storage.forEach((s) => storageArr.push(s.value));

        console.log(countryArr);
        console.log(productArr);
        console.log(storageArr);
        // console.clear();

        drawTable({
            dataArr: dataArr,
            country: countryArr,
            product: productArr,
            storage: storageArr,
            countries_filter: countries,
            products_filter: product,
            storages_filter: storage
        });
    });
});
//-------------------------------------------------------------------------------------------------------------//

function drawTable({
    dataArr: dataArr,
    country: countryArr,
    product: productArr,
    storage: storageArr,
    countries_filter: countries,
    products_filter: product,
    storages_filter: storage
}) {

    container_table.innerHTML = "";
    const table_data = {};
    const filteredData = dataArr.filter((row) => {
        return productArr.includes(row[3].toLowerCase()) && storageArr.includes(row[4]);
    });

    const years = [...new Set(filteredData.map(row => row[0]).sort())];
    const last_year = years[years.length - 1];
    const rest_years = years.slice(0, years.length - 1);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", 'Nov', 'Dec'];

    const yoyDelta = ["YoY Delta1", "YoY Delta2"];
    //-------------------------------------------------------------------------------------------------------------//

    years.forEach((year) => {
        table_data[year] = {};
        months.forEach((month) => {
            table_data[year][month] = 0;
            filteredData.forEach((row) => {
                if (row[0] == year && row[1] == month) {
                    table_data[year][month] = parseInt(row[7]);
                }
            });
        });
    });

    console.log(table_data);

    if (Object.keys(table_data).length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const tr = document.createElement('tr');
        let th = document.createElement('th');
        th.textContent = "Month";
        tr.appendChild(th);
        for (var year of rest_years) {
            th = document.createElement('th');
            th.textContent = year;
            tr.appendChild(th);
        }
        th = document.createElement('th');
        th.textContent = yoyDelta[0];
        tr.appendChild(th);
        th = document.createElement('th');
        th.textContent = last_year;
        tr.appendChild(th);
        th = document.createElement('th');
        th.textContent = yoyDelta[1];
        tr.appendChild(th);

        months.forEach((month) => {
            const up = `<span class="material-symbols-outlined arrow">arrow_upward_alt</span>`;
            const down = `<span class="material-symbols-outlined arrow">arrow_downward_alt</span>`;
            const tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = month;
            tr.appendChild(td);

            let dif = 0;
            let old = 0;
            let color = "", arrow = "";
            for (var year of rest_years) {
                td = document.createElement('td');
                td.textContent = table_data[year][month];
                if (table_data[year][month] > old) {
                    dif = table_data[year][month] - old;
                    color = "green";
                    arrow = up;
                } else if (table_data[year][month] < old) {
                    dif = old - table_data[year][month];
                    color = "red";
                    arrow = down;
                } else if (table_data[year][month] == old) {
                    dif = 0;
                    // color = "black";
                    arrow = "";
                }
                else {
                    dif = 0;
                }
                tr.appendChild(td);
            }

            // for (let i = 0; i < rest_years.length - 1; i++) {
            //     td = document.createElement('td');
            //     td.textContent = table_data[rest_years[i]][month];
            //     console.log(table_data[rest_years[i]][month]);
            //     tr.appendChild(td);
            //     if (table_data[rest_years[i]][month] > table_data[rest_years[i + 1]][month]) {
            //         dif = table_data[rest_years[i]][month] - table_data[rest_years[i + 1]][month];
            //     } else if (table_data[rest_years[i]][month] < table_data[rest_years[i + 1]][month]) {
            //         dif = table_data[rest_years[i + 1]][month] - table_data[rest_years[i]][month];
            //     } else {
            //         dif = 0;
            //     }
            // }

            td = document.createElement('td');
            td.style.position = "relative";
            td.textContent = dif;
            td.style.color = color;
            td.innerHTML += arrow;
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = table_data[last_year][month];
            tr.appendChild(td);

            td = document.createElement('td');
            td.style.position = "relative";
            if (rest_years.length > 0) {
                if (table_data[last_year][month] > table_data[rest_years[rest_years.length - 1]][month]) {
                    td.textContent = table_data[last_year][month] - table_data[rest_years[rest_years.length - 1]][month];
                    td.style.color = "green";
                    td.innerHTML += up;
                } else if (table_data[last_year][month] < table_data[rest_years[rest_years.length - 1]][month]) {
                    td.textContent = table_data[rest_years[rest_years.length - 1]][month] - table_data[last_year][month];
                    td.style.color = "red";
                    td.innerHTML += down;
                } else {
                    td.textContent = 0;
                }
            }
            else {
                td.textContent = 0;
            }
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        thead.appendChild(tr);
        table.appendChild(thead);
        table.appendChild(tbody);

        container_table.innerHTML = "";
        container_table.appendChild(table);
    }
}   
