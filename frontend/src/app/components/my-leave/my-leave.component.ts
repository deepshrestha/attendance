import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy, AfterViewInit } from "@angular/core";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { formValidator } from "../../helpers/form-validator";
import { MyLeaveService } from './my-leave.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { LeaveMasterService } from "../leave-master/leave-master.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";

@Component({
    selector: 'app-my-leave',
    template: require('./my-leave.component.html'),
    providers: [MyLeaveService]
})
export class MyLeaveComponent implements OnInit, OnDestroy, AfterViewInit {

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    @Input() isLoggedIn: Boolean;
    @ViewChild('modalBody') modalBody: ElementRef;

    options: any[] = [
        { id: false, value: 'Option 1' },
        { id: true, value: 'Option 2' }
    ];

    myLeaveService: MyLeaveService;
    tokenStorageService: TokenStorageService;
    leaveMasterService: LeaveMasterService;
    notification: Notification;
    constructor(
        @Inject(MyLeaveService) myLeaveService: MyLeaveService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(LeaveMasterService) leaveMasterService: LeaveMasterService,
        @Inject(Notification) notification: Notification
    ) {
        this.myLeaveService = myLeaveService;
        this.tokenStorageService = tokenStorageService;
        this.leaveMasterService = leaveMasterService;
        this.notification = notification;
    }

    my_leaves: any = {};

    leaveTypeOptions: any[] = [];
    approversOptions: any[] = [];

    tableHeaders = {
        sn: "#",
        leave_type: "Leave Type",
        requested_by: "Requested By",
        start_date: "Start Date",
        end_date: "End Date",
        requested_to: "Requested To",
        requested_at: "Requested Date",
        remarks: "Remarks",
        action: "Action",
        searchFilter: ["leave_type", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        leave_request_id: "",
        leave_master_id: "",
        requested_by: "",
        leave_request_date: "",
        requested_to: [],
        requested_at: "",
        remarks: "",
        errors: {
            leave_master_id: "",
            requested_by: "",
            leave_request_date: "",
            requested_to: "",
            requested_at: "",
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
        this.my_leaves = {};
        $('.select2').select2({
            placeholder: "Select approver/s"
        })
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            leave_request_id: "",
            leave_master_id: "",
            requested_by: "",
            leave_request_date: "",
            requested_to: [],
            requested_at: "",
            remarks: "",
            errors: {
                leave_master_id: "",
                requested_by: "",
                leave_request_date: "",
                requested_to: "",
                requested_at: "",
            }
        }
    }
    editInfo(modalEvent) {
        let { event } = modalEvent;
        let requestedDateRange = event.target.elements['leave_request_date'].value;
        let startDateVal = requestedDateRange.split(' - ')[0].trim();
        let endDateVal = requestedDateRange.split(' - ')[1].trim();
        //let requestedToVal = $('select[name="requested_to[]"]').val();
        let requestedToVal = '';
        if(event.target.elements['requested_to'] !== undefined)
            requestedToVal = Array.from<HTMLInputElement>(event.target.elements['requested_to'].selectedOptions).map(option => option.value.split(':')[1]).join(',').trim();
        
        $('.select2-modal').change( event => {
            event.preventDefault();
            if (event.target && event.target.matches("select")) {
                this.onHandleChange(event)
            }
        });

        let formObject = {
            id: event.target.elements['leave_request_id'].value,
            leave_master_id: event.target.elements['leave_master_id'].value,
            start_date: startDateVal,
            end_date: endDateVal,
            requested_to: requestedToVal,
            remarks: event.target.elements['remarks'].value
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
            this.subscribeData = this.myLeaveService.editDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            //console.log(data);
                            if (data.success) {
                                this.notification.showMessage("success", data.message);
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

    saveInfo(event: any, obj: any) {
        event.preventDefault();

        let requestedDateRange = event.target.elements['leave_request_date'].value;
        let startDateVal = requestedDateRange.split(' - ')[0].trim();
        let endDateVal = requestedDateRange.split(' - ')[1].trim();
        
        let requestedToVal = '';
        if(event.target.elements['requested_to'] !== undefined)
            requestedToVal = Array.from<HTMLInputElement>(event.target.elements['requested_to'].selectedOptions).map(option => option.value.split(':')[1]).join(',').trim();
        
        $('.select2').change( event => {
            event.preventDefault();
            if (event.target && event.target.matches("select")) {
                this.onHandleChange(event);
            }
        });
        let formObject = {
            leave_master_id: event.target.elements['leave_master_id'].value,
            start_date: startDateVal,
            end_date: endDateVal,
            requested_to: requestedToVal,
            remarks: event.target.elements['remarks'].value,
            requested_by: this.tokenStorageService.getUser()["id"]
        }
        
        if (this.onHandleSubmit(event)) {
            console.log(formObject)
            this.subscribeData = this.myLeaveService.postDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            let date = new Date();
                            date.setDate(date.getDate());
                            $("#daterangepicker").data('daterangepicker').setStartDate(formatDate(date, 'yyyy-MM-dd', 'en-us'));
                            $("#daterangepicker").data('daterangepicker').setEndDate(formatDate(date, 'yyyy-MM-dd', 'en-us'));
                            $('.select2').val(null).trigger('change');
                            this.reInitializeState();
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

    onCancelModal() {
        this.showTable = true;
        this.showAddForm = false;
        this.reInitializeState();
        this.initializeFormValidation();
        this.getAll();
        $('#daterangepicker').data('daterangepicker').remove();
    }

    onDisplayModalData(id) {
        console.log(id)

        $('.select2-modal').select2();
        
        $('#daterangepicker').daterangepicker(
            {
                opens: "left",
                autoUpdateInput: true,
                locale: {
                    format: "YYYY-MM-DD",
                    cancelLabel: "Clear"
                }
            }
        );

        this.subscribeData = this.myLeaveService.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        console.log(data);
                        $("#daterangepicker").data('daterangepicker').setStartDate(data.start_date);
                        $("#daterangepicker").data('daterangepicker').setEndDate(data.end_date);
                        /* $('.select2-modal').val(['1: 4','2: 5']).trigger('change'); */
                        $('.select2-modal').val(data.requested_to).trigger('change');
                        this.my_leaves = data;
                        this.initialState = {
                            ...this.initialState,
                            leave_request_id: data.id,
                            leave_master_id: data.leave_master_id,
                            requested_by: data.requested_by,
                            leave_request_date: data.start_date + " - " + data.end_date,
                            // start_date: data.start_date,
                            // end_date: data.end_date,
                            remarks: data.remarks,
                            requested_to: data.requested_to,
                            requested_at: data.requested_at,
                        }
                        console.log(this.initialState);
                        this.initializeFormValidation();
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
    }

    getAll(): void {
        this.subscribeData = this.myLeaveService.getDataFromService()
            .subscribe(
                {
                    next: data => {
                        console.log(data)
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
        this.leaveMasterService.getLeavesData().subscribe(
            data => {
                this.leaveTypeOptions = data;
            }
        )
        this.myLeaveService.getSeniorApproversData().subscribe(
            data => {
                this.approversOptions = data;
            }
        )
    }

    ngAfterViewInit(): void {
        $('.select2').select();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}