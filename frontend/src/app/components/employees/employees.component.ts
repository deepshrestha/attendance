import { Component, Inject, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ShiftService } from "../shift/shift.service";
import { formValidator } from "./../../helpers/form-validator";
import { EmployeeService } from "./employee.service";
import * as $ from "jquery";
import { RoleService } from "../../role/role.service";
import { DepartmentService } from "../department/department.service";

@Component({
    selector: "app-employees",
    template: require("./employees.component.html")
})

export class EmployeesComponent implements OnInit {

    service: EmployeeService;
    shiftService: ShiftService;
    roleService: RoleService;
    departmentService: DepartmentService;
    constructor(@Inject(EmployeeService) service: EmployeeService, @Inject(ShiftService) shiftService: ShiftService,
        @Inject(RoleService) roleService: RoleService,
        @Inject(DepartmentService) departmentService: DepartmentService) {
        this.service = service;
        this.shiftService = shiftService;
        this.roleService = roleService;
        this.departmentService = departmentService;
    }

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    employees: any = {};

    // shiftOptions: any[] = [
    //     {id: '1', value: 'Regular'},
    //     {id: '2', value: 'Morning'},
    //     {id: '3', value: 'Evening'},
    //     {id: '4', value: 'Night'},
    // ];
    shiftOptions: any[] = [];
    roleOptions: any[] = [];
    departmentOptions: any[] = [];

    tableHeaders = {
        sn: "#",
        full_name: "Full Name",
        email_id: "Email Address",
        address: "Address",
        contact_no: "Contact No",
        dob: "Date of Birth",
        shift_name: "Shift",
        role_name: "Role",
        department_name: "Department",
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
        department_id: '',
        role_id: '',
        errors: {
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
            department_id: '',
            role_id: '',
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

    showForm() {
        this.showTable = false;
        this.showAddForm = true;
        this.employees = {};
    }

    clearForm() {
        this.initialState = {
            ...this.initialState,
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
            department_id: '',
            role_id: '',
            errors: {
                full_name: '',
                email_id: '',
                address: '',
                contact_no: '',
                dob: '',
                shift_id: '',
                department_id: '',
                role_id: '',
            }
        }
    }

    saveInfo(event: any, obj: any) {
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.service.postDataFromService(obj.value)
                .subscribe(
                    {
                        next: data => {
                            this.clearForm();
                            this.initializeFormValidation();
                        },
                        error: err => {
                            console.log(err)
                        }
                    }
                )
            obj.resetForm();
        }
    }

    editInfo(modalEvent) {
        let { event } = modalEvent;
        let formObject = {
            id: event.target.elements['employee_id'].value,
            address: event.target.elements['address'].value,
            contact_no: event.target.elements['contact_no'].value,
            dob: event.target.elements['dob'].value,
            email_id: event.target.elements['email_id'].value,
            full_name: event.target.elements['full_name'].value,
            shift_id: event.target.elements['shift_id'].value,
            role_id: event.target.elements['role_id'].value,
            department_id: event.target.elements['department_id'].value,
        }
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.service.editDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            if (data.success) {
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

    onCancelModal() {
        this.showTable = true;
        this.showAddForm = false;
        this.clearForm();
        this.initializeFormValidation();
        this.getAll();
    }

    onDisplayModalData(id) {
        this.subscribeData = this.service.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.employees = data;
                        this.initialState = {
                            ...this.initialState,
                            employee_id: data.id,
                            full_name: data.full_name,
                            email_id: data.email_id,
                            address: data.address,
                            contact_no: data.contact_no,
                            dob: data.dob,
                            shift_id: data.shift_id,
                            role_id: data.role_id,
                            department_id: data.department_id,
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
        this.subscribeData = this.service.getDataFromService()
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
        this.shiftService.getShiftData().subscribe(
            data => {
                this.shiftOptions = data;
            }
        );
        this.roleService.getRoleData().subscribe(
            data => {
                this.roleOptions = data;
            }
        );
        this.departmentService.getDepartmentData().subscribe(
            data => {
                this.departmentOptions = data;
            }
        );

        /* this.shiftService.getDataFromService().subscribe(
            {
                next: data => {
                    // this.shiftOptions = data;
                    console.log(data)
                    data.forEach(element => {
                        this.shiftOptions = [...this.shiftOptions, { id: element.id, value: element.shift_name }]
                    });
                },
                error: err => {
                    console.log(err)
                },
                complete: () => {
                    console.log("completed!")
                }
            }
        ); */
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}