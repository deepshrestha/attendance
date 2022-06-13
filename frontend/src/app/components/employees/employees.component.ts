import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";

@Component({
    selector: "app-employees",
    template: require("./employees.component.html")
})

export class EmployeesComponent implements OnInit{

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    employees: any = {};

    shiftOptions: any[] = [
        {id: '1', value: 'Regular'},
        {id: '2', value: 'Morning'},
        {id: '3', value: 'Evening'},
        {id: '4', value: 'Night'},
    ];

    tableHeaders = {
        sn: "#",
        full_name: "Full Name",
        email_id: "Email Address",
        address: "Address",
        contact_no: "Contact No",
        dob: "Date of Birth",
        shift_id: "Shift",
        action: "Action",
        searchFilter: ["full_name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 2,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        employee_id: '',
        full_name: '',
        email_id: '',
        address: '',
        contact_no: '',
        dob: '',
        shift_id: '',
        errors: {
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
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

    showForm(){
        this.showTable = false;
        this.showAddForm = true;
        this.employees = {};
    }

    saveInfo(event: any, obj: any){
        console.log(obj)
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            console.log("fields", obj.value);
            /* this.subscribeData = this.employeeService.postDataFromService(obj.value)
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
        }   
    }

    onCancelModal(){
        this.showTable = true;
        this.showAddForm = false;
        this.initialState = {
            ...this.initialState,
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
            errors: {
                full_name: '',
                email_id: '',
                address: '',
                contact_no: '',
                dob: '',
                shift_id: '',
            }
        }
        this.initializeFormValidation();
    }

    ngOnInit(): void {
        this.initializeFormValidation();
    }
}