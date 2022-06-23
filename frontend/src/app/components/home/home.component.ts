import { formatDate } from '@angular/common';
import { Component, AfterViewInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { MyHolidayService } from '../my-holiday/my-holiday.service';

@Component({
    selector: 'app-home',
    template: require('./home.component.html'),
})
export class HomeComponent implements AfterViewInit {
    myHolidayService: MyHolidayService;

    constructor(
        @Inject(MyHolidayService) myHolidayService: MyHolidayService
    ) {
        this.myHolidayService = myHolidayService;
    }

    ngAfterViewInit(): void {
        $('[data-widget="treeview"]').Treeview('init');
        $('[data-widget="sidebar-search"]').SidebarSearch('init');

        this.myHolidayService.getDataFromService()
            .subscribe(data => {
                let comingHolidayDates = [];
                data.forEach(holiday => {
                    if (holiday.remaining_days > 0) comingHolidayDates.push(holiday.holiday_date);
                });
                $(document).ready(function () {
                    $('#startTimePicker').datetimepicker({
                        format: 'LT'
                    })

                    $('#endTimePicker').datetimepicker({
                        format: 'LT'
                    })
                    
                    $('#daterangepicker').daterangepicker(
                        {
                            isInvalidDate: function (date) {
                                return comingHolidayDates.includes(date.format('YYYY-MM-DD'))
                            },
                            minDate: new Date(),
                            opens: "left",
                            autoUpdateInput: true,
                            locale: {
                                format: "YYYY-MM-DD",
                                cancelLabel: "Clear"
                            }
                        }
                    );



                    // $('#daterangepicker').on('apply.daterangepicker', function(ev, picker) {
                    //     // picker.startDate and picker.endDate are already Moment.js objects.
                    //     // You can use diff() method to calculate the day difference.
                    //     console.log(picker.endDate.diff(picker.startDate, "days"))
                    //     // $('#numberdays').val(picker.endDate.diff(picker.startDate, "days"));
                    // });

                    /* $('#daterangepicker').on("apply.daterangepicker", function(ev, picker) {
                        $(this).val(
                            picker.startDate.format("YYYY-MM-DD") +
                            " - " +
                            picker.endDate.format("YYYY-MM-DD")
                        );
                        let start_date = picker.startDate.format("YYYY-MM-DD");
                        let end_date = picker.endDate.format("YYYY-MM-DD");
                        console.log(start_date, end_date);
                    }); */

                    /* $('#daterangepicker').on('apply.daterangepicker', function(ev, picker) {
                        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                    }); */

                    $('.select2').select2();
                    $('.select2-modal').select2();
                    // $('.select2-modal').change(event => {
                    //     console.log("hello")
                    //     event.preventDefault();
                    //     if (event.target && event.target.matches("select")) {
                    //         this.onHandleChange(event)
                    //     }
                    // });
                })
            })
    }


    //Timepicker
    // $(function () {
    //     $('#startTimePicker').datetimepicker({
    //         format: 'LT'
    //     })

    //     $('#endTimePicker').datetimepicker({
    //         format: 'LT'
    //     })
    //     // $('#daterangepicker').daterangepicker(
    //     //     {
    //     //         minDate: new Date(),
    //     //         opens: "left",
    //     //         autoUpdateInput: true,
    //     //         locale: {
    //     //             format: "YYYY-MM-DD",
    //     //             cancelLabel: "Clear"
    //     //         }
    //     //     }
    //     // );


    //     this.myHolidayService.getDataFromService()
    //         .subscribe(data => {
    //             let comingHolidayDates = [];
    //             data.forEach(holiday => {
    //                 if (holiday.remaining_days > 0) comingHolidayDates.push(holiday.holiday_date);
    //             });
    //             console.log(comingHolidayDates)
    //             $('#daterangepicker').daterangepicker(
    //                 {
    //                     isInvalidDate: function (date) {
    //                         return comingHolidayDates.includes(date.format('YYYY-MM-DD'))
    //                     },
    //                     minDate: new Date(),
    //                     opens: "left",
    //                     autoUpdateInput: true,
    //                     locale: {
    //                         format: "YYYY-MM-DD",
    //                         cancelLabel: "Clear"
    //                     }
    //                 }
    //             );
    //         })


    //     // $('#daterangepicker').on('apply.daterangepicker', function(ev, picker) {
    //     //     // picker.startDate and picker.endDate are already Moment.js objects.
    //     //     // You can use diff() method to calculate the day difference.
    //     //     console.log(picker.endDate.diff(picker.startDate, "days"))
    //     //     // $('#numberdays').val(picker.endDate.diff(picker.startDate, "days"));
    //     // });

    //     /* $('#daterangepicker').on("apply.daterangepicker", function(ev, picker) {
    //         $(this).val(
    //             picker.startDate.format("YYYY-MM-DD") +
    //             " - " +
    //             picker.endDate.format("YYYY-MM-DD")
    //         );
    //         let start_date = picker.startDate.format("YYYY-MM-DD");
    //         let end_date = picker.endDate.format("YYYY-MM-DD");
    //         console.log(start_date, end_date);
    //     }); */

    //     /* $('#daterangepicker').on('apply.daterangepicker', function(ev, picker) {
    //         $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    //     }); */

    //     $('.select2').select2();
    //     $('.select2-modal').select2();
    //     // $('.select2-modal').change(event => {
    //     //     console.log("hello")
    //     //     event.preventDefault();
    //     //     if (event.target && event.target.matches("select")) {
    //     //         this.onHandleChange(event)
    //     //     }
    //     // });
    // })
}