import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'app-home',
    template: require('./home.component.html'),
})
export class HomeComponent implements AfterViewInit {

    ngAfterViewInit(): void {
        $('[data-widget="treeview"]').Treeview('init');
        $('[data-widget="sidebar-search"]').SidebarSearch('init');

        //Timepicker
        $(function () {
            $('#startTimePicker').datetimepicker({
                format: 'LT'
            })

            $('#endTimePicker').datetimepicker({
                format: 'LT'
            })
           
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
        })
    }
}