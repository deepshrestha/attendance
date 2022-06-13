import { Component, OnInit, Input, Inject } from "@angular/core";
import * as $ from 'jquery';

/* document.addEventListener('click', function(event) {
    if(!(event.target instanceof HTMLButtonElement)) {
        return;
    }
    if(event.target.dataset.row) {
        console.log(JSON.parse(event.target.dataset.row));
        (<HTMLButtonElement>document.querySelector('.modal-body')).innerHTML = JSON.parse(event.target.dataset.row);
    }

    (<HTMLButtonElement>document.querySelector('#show')).style.display = "block";
    
}) */

/* $(document).on("click", ".select-row", function(event) {
    console.log(event)
    $("#show").css("display", "block");
    const selectProperty = $(this)
            .attr("id")
            .replace("showModal row-", "")
            .split("@");
    const action = selectProperty[0];
    const rowId = selectProperty[1];

    console.log(action, rowId);
    console.log($(this).data('row'));

    $('.modal-body').text(JSON.stringify($(this).data('row')))
}); */

@Component({
    selector: 'app-table',
    template: require('./table.component.html'),
})
export class TableComponent implements OnInit {

    @Input() tableHeaders: Object;
    @Input() tableData: Array<any>;
    @Input() paginationConfig: Object;
    @Input() modalTitle: String;

    tableColumns: String = '';
    tableDataColumns: String = '';
    tableHeadersKeyList = [];
    paginateData = [];
    
    generateTableHeaders(): String {
        //console.log(this.tableHeaders)
        Object.keys(this.tableHeaders).map((row, index) => {
            if(row !== 'action') {
                this.tableColumns +=  `
                        <th data-column="${row}"
                            class="table-${row}"
                            data-order="desc"
                            scope="col">
                            ${this.tableHeaders[row]}
                        </th>
                `
            }
            if (row === 'action') {
                this.tableColumns += `<th class="table-${row}">${this.tableHeaders[row]}</th>`
            }
        });
       
        return this.tableColumns;
    }

    onToggle() {
        console.log("asdasd");
        $('#show').show();
    }

    generateTableData(): String {
        Object.keys(this.tableData).map((data, index) => {
            this.tableDataColumns += '<tr>'
            Object.keys(this.tableHeaders).map((row, index) => {
                //console.log(row)
                if(row !== 'action') {
                    this.tableDataColumns +=  `
                        <td>${this.tableData[data][row]}</td>
                    `
                }
                if (row === 'action') {
                    this.tableDataColumns +=  `
                        <td class="text-center">
                            <button
                                id="showModal row-V@${this.tableData[data].id}"
                                class="btn btn-primary select-row"
                                data-toggle="modal"
                                data-target="#showModal"
                                data-row='${JSON.stringify(this.tableData[data])}'
                                onclick="test()"
                            >
                                <li class="fa fa-edit" aria-hidden="true"></li>
                                Edit
                            </button>
                        </td>`;
                }
            });
            this.tableDataColumns += '</tr>'
        });
        return this.tableDataColumns;
    }

    onClickHandler = e => {
        let column = e.target.dataset.column;
        let order = e.target.dataset.order;
        let newTableData = [...this.tableData];
        
        if (order === "desc") {
            e.target.setAttribute("data-order", "asc");
            e.target.setAttribute("class", `headerSortDown table-${column}`);
            newTableData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        } else {
            e.target.setAttribute("data-order", "desc");
            e.target.setAttribute("class", `headerSortUp table-${column}`);
            newTableData.sort((a, b) => (a[column] < b[column] ? 1 : -1));
        }
        this.tableData = newTableData;
    };

    timeout = null;
    searchHandler = event => {
        const { value } = event.target;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let data = this.tableData;
            let result = new RegExp(value, "ig");
            console.log(this.tableHeaders["searchFilter"])

            let searchKey = this.tableHeaders["searchFilter"];
            const search = data.filter(item => {
                for (let i = 0; i < searchKey.length; i++) {
                    if(item[searchKey[i]] !== null && item[searchKey[i]] !== undefined) {
                        if(item[searchKey[i]].length > 0) {
                            for (let j = 0; j < item[searchKey[i]].length; j++) {
                                if(result.test(item[searchKey[i]][j].name)) return true;
                            }
                        }
                        if (result.test(item[searchKey[i]])) return true;
                    }
                }
            });

            console.log(search)
            this.tableData = value !== '' ? search : this.tableData;
        }, 500);
    }

    ngOnInit(): void {
        /* this.generateTableHeaders(); */
        /* this.generateTableData(); */
        console.log(this.tableHeaders)
        this.tableHeadersKeyList = Object.keys(this.tableHeaders)
    }
    
}