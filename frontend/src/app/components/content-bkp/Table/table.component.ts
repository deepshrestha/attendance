import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: 'app-table',
    template: require('./table.component.html'),
})
export class TableComponent implements OnInit {

    @Input() tableHeaders: Object;
    @Input() tableData: Object;
    tableColumns: String = '';

    generateTableData(): String {
        //console.log(this.tableHeaders)
        Object.keys(this.tableHeaders).map((row, index) => {
            if (index !== Object.keys(this.tableHeaders).length - 1) {
                this.tableColumns +=  `
                        <th data-column="${row}"
                            class="table-${row}"
                            data-order="desc"
                            scope="col">
                            ${this.tableHeaders[row]}
                        </th>
                `
            }
            
        });
       
        return this.tableColumns;
    }

    ngOnInit(): void {
        this.generateTableData();
    }
}