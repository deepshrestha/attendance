import { Component, OnInit, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-search',
    template: require('./search.component.html'),
    outputs: ['onSearchHandler'],
})
export class SearchComponent implements OnInit {

    ngOnInit(): void {}
    
    onSearchHandler = new EventEmitter<string>();

    handleSearch(event){
        this.onSearchHandler.emit(event);
    }
}