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

            $('#leaveRequestDateRangePicker').daterangepicker({
                // autoUpdateInput: false,
            });

            // $('#leaveRequestDateRangePicker').on('apply.daterangepicker', function(ev, picker) {
            //     $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
            // });

            $(`select[name='requested_to']`).select2({
                placeholder: "Select approver/s",
                allowClear: true
            });
        })

    }
}