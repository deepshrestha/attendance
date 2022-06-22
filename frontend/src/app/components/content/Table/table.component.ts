import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject } from "@angular/core";
import { Modal } from "bootstrap";
import * as $ from "jquery";

@Component({
    selector: 'app-table',
    template: require('./table.component.html'),
})
export class TableComponent implements OnInit, OnChanges {

    modal: Modal;
    @Input() type: string;
    @Input() options: string;
    @Input() tableHeaders: object;
    @Input() tableData: Array<any>;
    @Input() paginationConfig: object;
    @Input() modalTitle: string;
    @Input() modalBody: any;
    @Output() onAddHandler = new EventEmitter<string>();
    @Output() onDisplayModalData = new EventEmitter<string>();
    @Output() onSaveHandler = new EventEmitter<{event: any, obj: any}>();
    @Output() onCancelModalHandler = new EventEmitter<string>();
    @Output() onCheckboxClick = new EventEmitter<{event: any, id: any}>();
    @Output() onActionRequestClick = new EventEmitter<{id: any}>();
    @Output() onFilterOptionChange = new EventEmitter<{id: any}>();

    tableColumns: string = '';
    tableDataColumns: string = '';
    tableHeadersKeyList = [];
    paginateData = [];
    
    isBoolean(val): any { 
        return (val === 'true' || val === 'false') ? 'boolean' : 'string';
    }

    onToggle(id) {
        //$('#showModal').modal('show');
        this.modal?.show();
        console.log(id)
        this.onDisplayModalData.emit(id);
    }

    onSaveInfoDetail(event) {
        this.onSaveHandler.emit(event);
    }

    onCancelModal(){
        this.onCancelModalHandler.emit();
    }

    onCheckboxClickHandler(event, id){
        this.onCheckboxClick.emit({event, id});
    }

    onActionRequestHandler(id, status_name){
        let requestObj = {
            id,
            status_name
        }
        this.onActionRequestClick.emit(requestObj);
    }

    onFilterOptionChangeHandler(event){
        if(event.target.value !== '0') 
            $('.table-action_request, .table-action_my_leave').hide();
        else 
            $('.table-action_request, .table-action_my_leave').show();
            
        this.onFilterOptionChange.emit(event.target.value);
    }

    getTableData(tableData: any[]) : any[] {
        let indexOfFirstRecord = (this.paginationConfig["currentPage"] - 1) * this.paginationConfig["recordPerPage"];
        let indexOfLastRecord = this.paginationConfig["currentPage"] * this.paginationConfig["recordPerPage"];
        const data = tableData?.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );

        return this.paginateData = data;
    }

    onClickHandler = e => {
        let column = e.target.dataset.column;
        let order = e.target.dataset.order;
        let newTableData = [...this.paginateData];
        
        if (order === "desc") {
            e.target.setAttribute("data-order", "asc");
            e.target.setAttribute("class", `headerSortDown table-${column}`);
            newTableData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        } else {
            e.target.setAttribute("data-order", "desc");
            e.target.setAttribute("class", `headerSortUp table-${column}`);
            newTableData.sort((a, b) => (a[column] < b[column] ? 1 : -1));
        }
        this.paginateData = newTableData;
    };

    timeout = null;
    searchHandler = event => {
        const { value } = event.target;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let data = this.tableData;
            console.log(data)
            let result = new RegExp(value, "ig");

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
            
            this.paginationConfig = {
                ...this.paginationConfig,
                data: search,
                currentPage: 1,
                totalRecordsCount: search.length
            }

            this.paginateData = this.getTableData(search);
        }, 500);
        
    }

    paginateHandler = () => {
        this.getTableData(this.paginationConfig["data"].length > 0 ? this.paginationConfig["data"] : this.tableData);
    }

    showForm = () => {
        this.onAddHandler.emit();
    }

    ngOnInit(): void {
        /* console.log(this.tableData)
        this.getTableData(this.tableData); */
        this.tableHeadersKeyList = Object.keys(this.tableHeaders)
    }

    ngOnChanges(changes: SimpleChanges): void {
        //if(changes.tableData){
            console.log(changes)
            this.getTableData(changes.tableData?.currentValue);
        //}
    }
    
}