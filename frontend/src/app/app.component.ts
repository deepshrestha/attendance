import { Component } from "@angular/core";

import "@fortawesome/fontawesome-free/css/fontawesome.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/popper/popper.min";
import "admin-lte/plugins/bootstrap/js/bootstrap.bundle.min";
import "admin-lte/dist/js/adminlte.min";
import "admin-lte/plugins/jquery/jquery.min";
import "jquery/dist/jquery.min";
import "jquery-ui-dist/jquery-ui.css";
import "jquery-ui-dist/jquery-ui.min"

// Datetimepicker
global.moment = require('moment');
require('tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min');
require('tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css');
import 'fullcalendar';
import 'moment-timezone';
// Datetimepicker

import 'daterangepicker/daterangepicker.js';
import 'daterangepicker/daterangepicker.css';

import "/public/dist/app.css";    // custom css

@Component({
    selector: 'app-root',
    template: require('./app.component.html'),
    styleUrls: [
        require('./app.component.css'), 
        require('./test.component.css')
    ]
})
export class AppComponent {
    title = 'CIBT Attendance'
}