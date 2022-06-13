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
        })
    }
}