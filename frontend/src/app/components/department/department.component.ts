import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";
import { DepartmentService } from './department.service';
import * as $ from "jquery";

@Component({
    selector: 'app-department',
    template: require('./department.component.html'),
    providers: [DepartmentService]
})
export class DepartmentComponent implements OnInit, OnDestroy {
    
    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    @Input() isLoggedIn: Boolean;
    @ViewChild('dname') dname: ElementRef;
    @ViewChild('modalBody') modalBody: ElementRef;

    options: any[] = [
        {id: false, value: 'Option 1'},
        {id: true, value: 'Option 2'}
    ];

    departmentService: DepartmentService;
    constructor(@Inject(DepartmentService) departmentService: DepartmentService){
        this.departmentService = departmentService;
    }

    departments: any = {};

    tableHeaders = {
        sn: "#",
        department_name: "Department Name",
        created_at: "Created At",
        created_by: "Created By",
        action: "Action",
        searchFilter: ["department_name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 2,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        department_id: "",
        department_name: "",
        errors: {
            department_name: "",
        }
    };

    initializeFormValidation() {
        const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);

        this.onHandleSubmit = onHandleSubmit;
        this.onHandleBlur = onHandleBlur;
        this.onHandleChange = onHandleChange;
        this.fields = fields;
        this.errors = fields.errors;
    }

    //RxBneS%5wH6M

    showForm(){
        this.showTable = false;
        this.showAddForm = true;
        this.departments = {};
    }

    editInfo(modalEvent) {
        let { event } = modalEvent;
        let formObject = {
            id: event.target.elements['department_id'].value,
            department_name: event.target.elements['department_name'].value
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
            this.subscribeData = this.departmentService.editDataFromService(formObject)
            .subscribe(
                {
                    next: data => {
                        console.log(data);
                        if(data.success) {
                            $('#showModal').modal('hide');
                            this.getAll();
                        }
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
        } 
    }

    saveInfo(event: any, obj: any){
        console.log(obj)
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            console.log("fields", obj.value);
            /* this.subscribeData = this.departmentService.postDataFromService(obj.value)
            .subscribe(
                {
                    next: data => {
                        console.log(data);
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            ) */
            obj.resetForm();
            this.dname.nativeElement.focus();
        }   
    }

    onCancelModal(){
        this.showTable = true;
        this.showAddForm = false;
        this.initialState = {
            ...this.initialState,
            department_name: '',
            errors: {
                department_name: ''
            }
        }
        this.initializeFormValidation();
    }

    onDisplayModalData(id){
        console.log(id)
        this.subscribeData = this.departmentService.getDataByIdFromService(id)
        .subscribe(            
            {
                next: data => {
                    console.log(data);
                    this.departments = data;
                    this.initialState = {
                        ...this.initialState,
                        department_id: data.id,
                        department_name: data.department_name
                    }
                    this.initializeFormValidation();
                },
                error: err => {
                    console.log(err)
                }
            }
        )
    }

    getAll(): void {
        this.subscribeData = this.departmentService.getDataFromService()
        .subscribe(            
            {
                next: data => {
                    this.tableData = data;
                    this.paginationConfig = {
                        ...this.paginationConfig,
                        totalRecordsCount: data.length
                    }
                },
                error: err => {
                    console.log(err)
                },
                complete: () => {
                    console.log("completed!")
                }
            }
        )
    }

    ngOnInit(): void {

        this.initializeFormValidation();
        this.getAll();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}