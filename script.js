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

    document.querySelector(div_class + " .inner-wrap").addEventListener('mouseleave', (e) => {
        let check = document.querySelector(div_class + " .radios");
        check.classList.remove('active');
    });

    // btn.addEventListener('mouseover', (e) => {
    //     let check = document.querySelector(div_class + " .radios");
    //     check.classList.add('active');
    // });

    // document.querySelector(div_class + " .radios").addEventListener('mouseout', (e) => {
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
const file_path = "./data.csv";
//-------------------------------------------------------------------------------------------------------------//
fetch(file_path).then(res => res.text()).then(data => {
    const dataArr = data.trim().split("\n").map(row => row.replace("\r", "").split(",")).slice(1);

    // const countries = ["Norway", "Sweden"];
    const countries = [...new Set(dataArr.map(row => row[0]).sort())];
    addValuesToBtn({ arr: countries, btn: countries_btn, div_class: '.countries', div: countries_div });

    const product = [...new Set(dataArr.map(row => row[5].toLowerCase()))];
    addValuesToBtn({ arr: product, btn: products_btn, div_class: '.products', div: products_div });

    products_btn.addEventListener('click', (e) => {
        const product = document.querySelectorAll('.products #Categories .inner-wrap input:checked');
        var val = product[0]?.value;
        if (val) {
            const storage = [...new Set(dataArr.filter(row => row[5].toLowerCase() == val).map(row => row[6]).sort())];
            storages_div.innerHTML = "";
            addValuesToBtn({ arr: storage, btn: storages_btn, div_class: '.storages', div: storages_div });
        }
    });
    products_div.addEventListener('mouseleave', (e) => {
        const product = document.querySelectorAll('.products #Categories .inner-wrap input:checked');
        var val = product[0]?.value;
        if (val) {
            const storage = [...new Set(dataArr.filter(row => row[5].toLowerCase() == val).map(row => row[6]).sort())];
            storages_div.innerHTML = "";
            addValuesToBtn({ arr: storage, btn: storages_btn, div_class: '.storages', div: storages_div });
        }
    });
    // products_div.addEventListener('mouseover', (e) => {
    //     const product = document.querySelectorAll('.products #Categories .inner-wrap input:checked');
    //     var val = product[0]?.value;
    //     if (val) {
    //         const storage = [...new Set(dataArr.filter(row => row[5].toLowerCase() == val).map(row => row[6]).sort())];
    //         storages_div.innerHTML = "";
    //         addValuesToBtn({ arr: storage, btn: storages_btn, div_class: '.storages', div: storages_div });
    //     }
    // });
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
        return countryArr.includes(row[0]) && productArr.includes(row[5].toLowerCase()) && storageArr.includes(row[6]);
    });

    const years = [...new Set(filteredData.map(row => row[1]).sort())];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", 'Nov', 'Dec'];
    //-------------------------------------------------------------------------------------------------------------//
    const up = `<span class="material-symbols-outlined arrow">arrow_upward_alt</span>`;
    const down = `<span class="material-symbols-outlined arrow">arrow_downward_alt</span>`;
    //-------------------------------------------------------------------------------------------------------------//

    years.forEach((year) => {
        table_data[year] = {};
        months.forEach((month) => {
            table_data[year][month] = 0;
            filteredData.forEach((row) => {
                if (row[1] == year && row[2] == month) {
                    table_data[year][month] = parseInt(row[11]);
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
        let count = 1;
        for (let i = 0; i < years.length; i++) {
            th = document.createElement('th');
            th.textContent = years[i];
            tr.appendChild(th);
            if (count % 2 == 0) {
                th = document.createElement('th');
                th.textContent = "YoY%";
                tr.appendChild(th);
            }
            if (years.length == i + 1 && years.length % 2 != 0) {
                th = document.createElement('th');
                th.textContent = "YoY%";
                tr.appendChild(th);
            }
            count++;
        }

        months.forEach((month, index) => {
            const tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = month;
            tr.appendChild(td);

            count = 1;
            let color = "", arrow = "";
            for (let i = 0; i < years.length; i++) {
                td = document.createElement('td');
                td.textContent = table_data[years[i]][month] == 0 ? "-" : table_data[years[i]][month];
                tr.appendChild(td);
                if (count % 2 == 0) {
                    td = document.createElement('td');
                    let data1 = table_data[years[i - 1]][month];
                    let data2 = table_data[years[i]][month];
                    if (data2 == 0) {
                        td.textContent = "-";
                        // color = "red";
                        // arrow = down;
                    }
                    else {
                        let per = ((data2 - data1) / data2 * 100).toFixed(0);
                        td.textContent = per + "%";
                        if (per == 100) {
                            td.textContent = "-";
                        } else if (per > 0) {
                            color = "green";
                            arrow = up;
                        } else if (per < 0) {
                            color = "red";
                            arrow = down;
                        } else {
                            color = "black";
                            arrow = "";
                        }
                    }
                    td.style.position = "relative";
                    td.style.color = color;
                    td.innerHTML += arrow;
                    tr.appendChild(td);
                }
                if (years.length == i + 1 && years.length % 2 != 0) {
                    td = document.createElement('td');
                    if (years.length > 1) {
                        let data1 = table_data[years[i - 1]][month];
                        let data2 = table_data[years[i]][month];
                        if (data2 == 0) {
                            td.textContent = "-";
                            // color = "red";
                            // arrow = down;
                        }
                        else {
                            let per = ((data2 - data1) / data2 * 100).toFixed(0);
                            td.textContent = per + "%";
                            if (per == 100) {
                                td.textContent = "-";
                            } else if (per > 0) {
                                color = "green";
                                arrow = up;
                            } else if (per < 0) {
                                color = "red";
                                arrow = down;
                            } else {
                                color = "black";
                                arrow = "";
                            }
                        }
                    } else {
                        td.textContent = "-";
                    }
                    td.style.position = "relative";
                    td.style.color = color;
                    td.innerHTML += arrow;
                    tr.appendChild(td);
                }
                count++;
            }
            tbody.appendChild(tr);
        });

        thead.appendChild(tr);
        table.appendChild(thead);
        table.appendChild(tbody);

        container_table.innerHTML = "";
        container_table.appendChild(table);
    }
}   
