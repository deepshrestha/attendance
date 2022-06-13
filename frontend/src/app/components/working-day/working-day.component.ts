import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from "@angular/core";
import { formValidator } from "./../../helpers/form-validator";
import { WorkingDayService } from './working-day.service'
import * as $ from "jquery";

@Component({
    selector: 'app-working-day',
    template: require('./working-day.component.html'),
    providers: [WorkingDayService]
})
export class WorkingDayComponent implements OnInit {

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any;
    errors: any;
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;

    @Input() isLoggedIn: Boolean;
    @ViewChild('wname') wname: ElementRef;
    
    workingDayService: WorkingDayService;
    constructor(@Inject(WorkingDayService) workingDayService: WorkingDayService){
        this.workingDayService = workingDayService;
    }

    workingDays: any = {};
    
    workingDayOptions: any[] = [
        {id: 'Sunday', value: 'Sunday'},
        {id: 'Monday', value: 'Monday'},
        {id: 'Tuesday', value: 'Tuesday'},
        {id: 'Wednesday', value: 'Wednesday'},
        {id: 'Thursday', value: 'Thursday'},
        {id: 'Friday', value: 'Friday'},
    ];

    tableHeaders = {
        sn: "#",
        working_day: "Working Day",
        start_time: "Start Time",
        end_time: "End Time",
        created_at: "Created At",
        action: "Action",
        searchFilter: ["working_day", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        mode: "I",
        workingDay: "",
        startTime: "",
        endTime: "",
        errors: {
            workingDay: "",
            startTime: "",
            endTime: "",
        }
    };

    showForm(){
        this.showTable = false;
        this.showAddForm = true;
    }

    editInfo() {
        $('#showModal').modal('hide');
    }

    saveInfo(event, obj){
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            console.log("fields", obj.value)
            this.workingDayService.postDataFromService(obj.value)
            .subscribe(
                {
                    next: data => {
                        console.log(data);
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
            obj.resetForm();
            this.wname.nativeElement.focus();
        }
    }

    onCancelModal(){
        this.showTable = true;
        this.showAddForm = false;
        this.workingDayService.getDataFromService()
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

        const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);

        this.onHandleSubmit = onHandleSubmit;
        this.onHandleBlur = onHandleBlur;
        this.onHandleChange = onHandleChange;
        this.fields = fields;
        this.errors = fields.errors;

        // call apiHandler to fetch data

        this.workingDayService.getDataFromService()
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

        /* this.tableData.push(
            {
                id: 1,
                name: "Deep Shrestha",
                city: "Kumaripati, Lalitpur",
                email: "deepshrestha83@gmail.com",
                telephone_no: "9851181046",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
            {
                id: 2,
                name: "Deepak Shrestha",
                city: "Kupondole, Lalitpur",
                email: "deepak.shrestha@gmail.com",
                telephone_no: "984123212",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
            {
                id: 3,
                name: "Pranaya Bahadur Raghubanshi",
                city: "Kupondole, Lalitpur",
                email: "pranaya.raghubanshi@gmail.com",
                telephone_no: "9841323423",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
            {
                id: 4,
                name: "Dolma Gurung",
                city: "Kumaripati, Lalitpur",
                email: "dolma.gurung@gmail.com",
                telephone_no: "9851181046",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
            {
                id: 5,
                name: "Dawa Sherpa",
                city: "Kupondole, Lalitpur",
                email: "dawa.sherpa@gmail.com",
                telephone_no: "9849056935",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
            {
                id: 6,
                name: "Binayak Dhungel",
                city: "Kupondole, Lalitpur",
                email: "binayak.dhunel@gmail.com",
                telephone_no: "9861245267",
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            }
        ) */
    }
}