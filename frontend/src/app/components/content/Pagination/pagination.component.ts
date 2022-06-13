import { Component, OnInit, Input, Output, Inject, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pagination',
    template: require('./pagination.component.html'),
})
export class PaginationComponent implements OnInit, OnChanges {

    activatedRoute: ActivatedRoute;
    constructor(@Inject(ActivatedRoute) ActivatedRoute){
        this.activatedRoute = ActivatedRoute;
    }

    @Input() paginationConfig: Object;
    @Output() onPaginationHandler: EventEmitter<any>  = new EventEmitter<any>();
    @Output() onSearchHandler : EventEmitter<any>  = new EventEmitter<any>();

    pageNumber = 0;
    totalRecordsCount = 0;
    totalPages = 0;
    startRecord = 0;
    endRecord = 0;
    pageNumbers = [];
    pathname = '';

    init(): void {
        this.pageNumbers = [];
        this.totalPages = Math.ceil(this.paginationConfig["totalRecordsCount"] / this.paginationConfig["recordPerPage"]);
        this.totalRecordsCount = this.paginationConfig["totalRecordsCount"];
        this.pageNumber = parseInt(this.paginationConfig["currentPage"] || 1);

        /* Checking if the pageNumber is out of range */
        if(this.pageNumber > this.totalPages)
            this.pageNumber = this.totalPages;

        /* Calculating the start and end records */
        this.startRecord = ((this.pageNumber - 1) * this.paginationConfig["recordPerPage"]) + 1;
        this.endRecord = this.pageNumber * this.paginationConfig["recordPerPage"];
        
        /* Checking if the end record is out of range */
        if(this.endRecord > this.totalRecordsCount)
            this.endRecord = this.totalRecordsCount;
        
        for(let pageNumber2 = 1; pageNumber2 <= this.totalPages; pageNumber2++) {
            this.pageNumbers = [...this.pageNumbers, pageNumber2];
        }
            
    }

    ngOnInit(): void{
        this.pathname = `/${this.activatedRoute.snapshot.url[0].path}`;

        /* this.activatedRoute.queryParams   // for getting url parameters
            .subscribe(params => {
            console.log(params);
            }
        ); */
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.init();
        //console.log(changes.paginationConfig.currentValue)
        if(changes.paginationConfig.currentValue.totalRecordsCount === 0) {
            this.pageNumbers = [];
        }
    }

    doPaginate(pageNumber) {
        this.pageNumbers = [];
        this.paginationConfig["currentPage"] =  pageNumber;
        this.init();
        this.onPaginationHandler.emit(pageNumber);
    }
}