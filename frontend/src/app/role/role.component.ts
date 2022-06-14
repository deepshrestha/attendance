import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from "@angular/core";
import { formatDate } from "@angular/common";
import { formValidator } from "./../../helpers/form-validator";
import { ShiftService } from './shift.service'

@Component({
    selector: 'app-shift',
    template: require('./shift.component.html'),
    providers: [ShiftService]
})
export class ShiftComponent implements OnInit {
    
    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any;
    errors: any;
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;

    @Input() isLoggedIn: Boolean;

    //@ViewChild('name') name: ElementRef;

    shiftService: ShiftService;
    constructor(@Inject(ShiftService) shiftService: ShiftService){
        this.shiftService = shiftService;
    }

    shifts: any = {};
    shiftOptions: any[] = [
        {id: 'Regular', value: 'Regular'},
        {id: 'Morning', value: 'Morning'},
        {id: 'Evening', value: 'Evening'},
        {id: 'Night', value: 'Night'},
    ];

    startWeekDayOptions: any[] = [
        {id: 'Sunday', value: 'Sunday'},
        {id: 'Monday', value: 'Monday'},
    ];

    tableHeaders = {
        sn: "#",
        shift_name: "Shift Name",
        start_week_day: "Start Week Day",
        allow_overtime: "Allow Overtime",
        start_overtime: "Start Overtime (Hours)",
        created_at: "Created At",
        action: "Action",
        searchFilter: ["shift_name"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 3,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        mode: "I",
        shiftName: "",
        startWeekDay: "",
        allowOverTime: "",
        startOverTime: "",
        errors: {
            shiftName: "",
            startWeekDay: "",
            allowOverTime: "",
            startOverTime: "",
        }
    };

    showForm(){
        this.showTable = false;
        this.showAddForm = true;
    }

    saveInfo(event, obj){
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            console.log("fields", obj)
            /* this.shiftService.postDataFromService(obj)
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
            //obj.resetForm();
            //this.name.nativeElement.focus();
        }
    }

    onCancel(){
        this.showTable = true;
        this.showAddForm = false;
        this.shiftService.getDataFromService()
        .subscribe(            
            {
                next: data => {
                    console.log(data);
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
        const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);

        this.onHandleSubmit = onHandleSubmit;
        this.onHandleBlur = onHandleBlur;
        this.onHandleChange = onHandleChange;
        this.fields = fields;
        this.errors = fields.errors;
        
        // call apiHandler to fetch data

        this.shiftService.getDataFromService()
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
}