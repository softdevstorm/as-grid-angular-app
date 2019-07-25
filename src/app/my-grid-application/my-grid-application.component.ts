import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { RedComponentComponent } from "../red-component/red-component.component";
import { DataService } from "../@services/get-data.service";

@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html',
    styleUrls: ['./my-grid-application.component.scss']
})
export class MyGridApplicationComponent implements OnInit {

    private gridOptions: GridOptions;
    private gridApi;
    private gridColumnApi;
    private frameworkComponents;
    private rowData = [];

    title = 'grid app';

    columnDefs = [
        {headerName: '', field: 'thumbnails', sortable: true, filter: true},
        {headerName: 'Published on', field: 'publishedAt', sortable: true, filter: true},
        {headerName: 'Video Title', field: 'title', sortable: true, filter: true},
        {headerName: 'Description', field: 'description', sortable: true, filter: true}
    ];

    constructor(
        private http: HttpClient,
        private dataService: DataService
    ) {
    }

    onGridReady(params) {
        this.gridApi = params.api; // To access the grids API
        this.dataService.getData().subscribe(data => {
            let json_datas = data.items;
            for (var index in json_datas) {
                let row = {};
                row['thumbnails'] = json_datas[index]['snippet']['thumbnails']['default']['url'];
                row['publishedAt'] = json_datas[index]['snippet']['publishedAt'];
                row['title'] = json_datas[index]['snippet']['title'];
                row['description'] = json_datas[index]['snippet']['description'];
                this.rowData.push(row);
                this.gridApi.setRowData(this.rowData);
            }
        })
    }

    ngOnInit() {
        
    }

}