import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy, AfterViewInit } from "@angular/core";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { formValidator } from "../../helpers/form-validator";
import { MyLeaveService } from './my-leave.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { LeaveMasterService } from "../leave-master/leave-master.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";
import { LeaveStatusService } from "../leave-status/leave-status.service";

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
        { id: false, value: 'Pending' },
        { id: true, value: 'Approved' },
        { id: true, value: 'Rejected' }
    ];

    remainingLeaveDays = 0;
    selectedLeaveType = '';

    myLeaveService: MyLeaveService;
    tokenStorageService: TokenStorageService;
    leaveMasterService: LeaveMasterService;
    leaveStatusService: LeaveStatusService;
    notification: Notification;
    constructor(
        @Inject(MyLeaveService) myLeaveService: MyLeaveService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(LeaveMasterService) leaveMasterService: LeaveMasterService,
        @Inject(LeaveStatusService) leaveStatusService: LeaveStatusService,
        @Inject(Notification) notification: Notification
    ) {
        this.myLeaveService = myLeaveService;
        this.tokenStorageService = tokenStorageService;
        this.leaveMasterService = leaveMasterService;
        this.leaveStatusService = leaveStatusService;
        this.notification = notification;
    }

    my_leaves: any = {};
    leaveTypeOptions: any[] = [];
    approversOptions: any[] = [];
    tableData: any = [];

    tableHeaders = {
        sn: "#",
        leave_type: "Leave Type",
        requested_by: "Requested By",
        start_date: "Start Date",
        end_date: "End Date",
        requested_to: "Requested To",
        requested_at: "Requested Date",
        remarks: "Remarks",
        // action_my_leave: "Action",
        action_my_leave: {
            title: 'Action',
        },
        searchFilter: ["leave_type", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

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
        this.selectedLeaveType = '';
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
        let appliedLeaveDays = this.calculateAppliedLeaveDays(startDateVal, endDateVal);

        let requestedToVal = '';
        if (event.target.elements['requested_to'] !== undefined)
            requestedToVal = Array.from<HTMLInputElement>(event.target.elements['requested_to'].selectedOptions).map(option => option.value.split(':')[1]).join(',').trim();

        $('.select2-modal').change(event => {
            event.preventDefault();
            if (event.target && event.target.matches("select")) {
                this.onHandleChange(event)
            }
        });
        console.log(event.target.elements['requested_to'].value);
        let formObject = {
            id: event.target.elements['leave_request_id'].value,
            leave_master_id: event.target.elements['leave_master_id'].value,
            start_date: startDateVal,
            end_date: endDateVal,
            requested_to: requestedToVal,
            remarks: event.target.elements['remarks'].value
        }
        if (this.onHandleSubmit(event)) {
            console.log("fields", formObject)
            if (appliedLeaveDays <= this.remainingLeaveDays) {

                this.subscribeData = this.myLeaveService.editDataFromService(formObject)
                    .subscribe(
                        {
                            next: data => {
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
            } else {
                this.notification.showMessage('error', `Your leave request of ${appliedLeaveDays} days of ${this.selectedLeaveType} is not applicable!!`);
            }
        }

    }

    saveInfo(event: any, obj: any) {
        event.preventDefault();
        let requestedDateRange = event.target.elements['leave_request_date'].value;
        let startDateVal = requestedDateRange.split(' - ')[0].trim();
        let endDateVal = requestedDateRange.split(' - ')[1].trim();

        let requestedToVal = '';
        if (event.target.elements['requested_to'] !== undefined)
            requestedToVal = Array.from<HTMLInputElement>(event.target.elements['requested_to'].selectedOptions).map(option => option.value.split(':')[1]).join(',').trim();


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

            let appliedLeaveDays = this.calculateAppliedLeaveDays(startDateVal, endDateVal);

            if (appliedLeaveDays <= this.remainingLeaveDays) {
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
                                this.selectedLeaveType = '';
                            },
                            error: err => {
                                console.log(err)
                            }
                        }
                    )
                obj.resetForm();
            }
            else {
                this.notification.showMessage('error', `Your leave request of ${appliedLeaveDays} days of ${this.selectedLeaveType} is not applicable!!`);
            }
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
        $('.select2-modal').select2();

        // $('.select2-modal option').each(function () {
        //     $(this).val($(this).attr('ng-reflect-value'));
        // })

        $(document).on('change', '.select2-modal', (event) => {
            console.log("hello")
            event.preventDefault();
            if (event.target && event.target.matches("select")) {
                this.onHandleChange(event);
            }
        });

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
                        $("#daterangepicker").data('daterangepicker').setStartDate(data.start_date);
                        $("#daterangepicker").data('daterangepicker').setEndDate(data.end_date);

                        // $('.select2-modal').val(['1: 3','2: 4']).trigger('change');
                        let requestedToSelect2Val = [];
                        let requestedToSelect2FormElementVal = [];
                        $('.select2-modal option').each(function () {
                            let requestedToVal = $(this).attr('ng-reflect-value');
                            let requestedToSelectVal = $(this).val();
                            console.log(data.requested_to.split(','))
                            console.log(requestedToVal)
                            data.requested_to.split(',').forEach(function (requested_to) {
                                if(requested_to.trim() == requestedToVal){
                                    requestedToSelect2Val.push(requestedToSelectVal);
                                    requestedToSelect2FormElementVal.push(parseInt(requestedToVal));
                                }
                            })
                        })

                        console.log(requestedToSelect2Val);
                        console.log(requestedToSelect2FormElementVal)
                        data.requested_to = requestedToSelect2FormElementVal;
                        this.my_leaves = data;
                        $('.select2-modal').val(requestedToSelect2Val).trigger('change');
                        this.initialState = {
                            ...this.initialState,
                            leave_request_id: data.id,
                            leave_master_id: data.leave_master_id,
                            requested_by: data.requested_by,
                            leave_request_date: data.start_date + " - " + data.end_date,
                            remarks: data.remarks,
                            requested_to: data.requested_to,
                            requested_at: data.requested_at,
                        }

                        this.remainingLeaveDays = parseInt($(`.select-leave-type-edit option[value='${data.leave_master_id}']`).data('remaining-leave-days')) + this.calculateAppliedLeaveDays(data.start_date, data.end_date);
                        this.selectedLeaveType = $(`.select-leave-type-edit option[value='${data.leave_master_id}']`).text();
                        this.initializeFormValidation();
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
    }

    onFilterOptionChange(id) {
        this.myLeaveService.getDataFromService(id).
            subscribe(data => {
                console.log(data)
                this.tableData = data;
                this.paginationConfig = {
                    ...this.paginationConfig,
                    currentPage: 1,
                    totalRecordsCount: data.length
                }
            })
    }

    getAll(): void {
        this.subscribeData = this.myLeaveService.getDataFromService(0)
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

        this.leaveMasterService.getLeavesDataWithRemainingLeavesFromService().subscribe(
            data => {
                this.leaveTypeOptions = data;
            }
        )
    }

    showRemainingLeaveInfo(event) {
        this.remainingLeaveDays = $(event.target).find(':selected').data('remaining-leave-days');
        this.selectedLeaveType = $(event.target).find(':selected').text();
    }

    calculateAppliedLeaveDays(startDateVal, endDateVal) {
        let startDate = new Date(startDateVal);
        let endDate = new Date(endDateVal);
        var milli_secs = startDate.getTime() - endDate.getTime();

        // Convert the milli seconds to Days 
        var days = milli_secs / (1000 * 3600 * 24);
        return Math.round(Math.abs(days)) + 1;
    }


    ngOnInit(): void {

        this.initializeFormValidation();
        this.leaveStatusService.getLeaveStatusData().subscribe(
            data => {
                this.options = data;
            }
        );
        this.getAll();

        this.myLeaveService.getSeniorApproversData().subscribe(
            data => {
                this.approversOptions = data;
            }
        )

        $(document).on('change', '.select2', (event) => {
            console.log("hello")
            event.preventDefault();
            if (event.target && event.target.matches("select")) {
                this.onHandleChange(event);
            }
        });
    }

    ngAfterViewInit(): void {
        $('.select2').select();
        // $(function() {
        //     $('#daterangepicker').on('apply.daterangepicker', function(ev, picker) {
        //         // picker.startDate and picker.endDate are already Moment.js objects.
        //         // You can use diff() method to calculate the day difference.
        //         console.log(picker.endDate.diff(picker.startDate, "days"))
        //         // $('#numberdays').val(picker.endDate.diff(picker.startDate, "days"));
        //     });
        // })

    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}