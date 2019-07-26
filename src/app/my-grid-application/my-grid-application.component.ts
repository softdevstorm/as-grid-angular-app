import { Component, OnInit } from "@angular/core";
import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../@services/get-data.service";
import * as $ from 'jquery';

@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html',
    styleUrls: ['./my-grid-application.component.scss']
})
export class MyGridApplicationComponent implements OnInit {

    private gridOptions: GridOptions;
    private gridApi;
    private gridColumnApi;
    private overlayLoadingTemplate;
    private columnDefs;
    private defaultColDef;
    private getRowHeight;
    private rowData = [];

    private recordCount = 0;
    private selectedCount = 0;

    title = 'grid app';

    constructor(
        private http: HttpClient,
        private dataService: DataService
    ) {
        this.columnDefs = [
            {
                headerName: '',
                field: 'id',
                width: 50,
                cellRenderer: this.customCheckBox,
                autoHeight: true
            },
            {
                headerName: '', 
                field: 'thumbnails',
                cellRenderer: this.tuhmbnails,
                autoHeight: true
            },
            {
                headerName: 'Published on', 
                field: 'publishedAt',
                autoHeight: true
            },
            {
                headerName: 'Video Title', 
                field: 'title', 
                cellRenderer: this.customCellRendererFunc,
                autoHeight: true
            },
            {
                headerName: 'Description', 
                field: 'description',
                autoHeight: true
            }
        ];

        this.defaultColDef = {
            resizable: true
        };

        this.getRowHeight = function(params) {
            if (params.node.level === 0) {
                return 98;
            } else {
                return 25;
            }
        };

        this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    }

    onGridReady(params) {
        this.gridApi = params.api; // To access the grids API
        this.gridColumnApi = params.columnApi;
        this.gridApi.showLoadingOverlay();
        this.loadData();
    }

    ngOnInit() {
        let self = this;
        setTimeout(() => {
            $(document).ready(function() {
                var checkboxHeaderColumn = $('.ag-header-cell-text')[0];
                $(checkboxHeaderColumn).html(self.customHeaderCheckBox());
            });
        }, 700);

        // toogle row checkbox
        $(document)
            .off("click", ".ag-custom-checkbox input[type='checkbox']")
            .on("click", ".ag-custom-checkbox input[type='checkbox']", function() {
                var checkboxId = $(this).prop('id');
                var rowDataIndex = checkboxId.replace('checkbox', '');
                rowDataIndex = parseInt(rowDataIndex);
                 if ($(this).prop('checked') == true) {
                    self.selectedCount += 1;
                    self.rowData[rowDataIndex]['id']['checkbox'] = true;
                } else if ($(this).prop('checked') == false) {
                    if (self.selectedCount > 0) {
                        self.rowData[rowDataIndex]['id']['checkbox'] = false;
                        self.selectedCount -= 1;
                    }
                }

                if (self.selectedCount == self.recordCount) {
                    $('.ag-custom-checkbox-header input[type="checkbox"]').prop('checked', 1);
                } else {
                    $('.ag-custom-checkbox-header input[type="checkbox"]').prop('checked', 0);
                }
            })

        // toogle header checkbox
        $(document)
            .off("click", ".ag-custom-checkbox-header input[type='checkbox']")
            .on("click", ".ag-custom-checkbox-header input[type='checkbox']", function() {
                var i;
                if ($(this).prop('checked') == true) {
                    for (i = 0; i < self.rowData.length; i++) {
                        self.rowData[i]['id']['checkbox'] = true;
                    }
                    $('.ag-custom-checkbox input[type="checkbox"]').prop('checked', 1);
                    self.selectedCount = self.recordCount;
                } else if ($(this).prop('checked') == false) {
                    for (i = 0; i < self.rowData.length; i++) {
                        self.rowData[i]['id']['checkbox'] = false;
                    }
                    $('.ag-custom-checkbox input[type="checkbox"]').prop('checked', 0);
                    self.selectedCount = 0;
                }
            })
    }

    // load data from json link
    public loadData() {
        this.dataService.getData().subscribe(data => {
            let json_datas = data.items;
            this.recordCount = json_datas.length;
            for (var index in json_datas) {
                let row = {};
                row['id'] = {};
                row['id']['value'] = index;
                row['id']['checkbox'] = false;
                row['thumbnails'] = json_datas[index]['snippet']['thumbnails']['default']['url'];
                row['publishedAt'] = json_datas[index]['snippet']['publishedAt'];
                row['title'] = {};
                row['title']['value'] = json_datas[index]['snippet']['title'];
                row['title']['id'] = json_datas[index]['id']['videoId'];
                row['description'] = json_datas[index]['snippet']['description'];
                this.rowData.push(row);
            }
            setTimeout(() => {
                this.gridApi.setRowData(this.rowData);
            }, 100);

            setTimeout(() => {
                this.autoSizeAll();
            }, 700);

        })
    }

    // video title with link
    public customCellRendererFunc(params) {
        let videoTitle = params.value.value;
        let videoId = params.value.id;
        return "<a href='https://www.youtube.com/watch?v=" + videoId + "'>" + videoTitle+ "</a>";
    }

    // custom context to add open in new tab
    public getContextMenuItems(params) {
        var result: any = [
            "copy",
            "copyWithHeaders",
            "paste"
        ];
        if (params.column.colId == "title") {
            result = [
                {
                    name: "Open in new tab",
                    action: function() {
                        window.open("https://www.youtube.com/watch?v=" + params.value.id);
                    },
                },
                "copy",
                "copyWithHeaders",
                "paste"
            ]
        } 
        return result;
    }

    // row checkbox
    public customCheckBox(params) {
        let Id = "checkbox" + params.value;
        if (params.value.checkbox) {
            return `<div class="custom-checkbox custom-control ag-custom-checkbox">
                        <input id="checkbox${params.value.value}" type="checkbox" class="custom-control-input" checked>
                        <label for="checkbox${params.value.value}" class="custom-control-label"></label>
                </div>`;
        } else {
            return `<div class="custom-checkbox custom-control ag-custom-checkbox">
                        <input id="checkbox${params.value.value}" type="checkbox" class="custom-control-input">
                        <label for="checkbox${params.value.value}" class="custom-control-label"></label>
                </div>`;
        }
    }

    // header checkbox
    public customHeaderCheckBox() {
         return `<div class="custom-checkbox custom-control ag-custom-checkbox-header">
                    <input id="header_checkbox" type="checkbox" class="custom-control-input">
                    <label for="header_checkbox" class="custom-control-label"></label>
                </div>`;   
    }

    // thumbnail image
    public tuhmbnails(params) {
        return `<img src="${params.value}" alt="thumbnail">`; 
    }

    // column resize
    public autoSizeAll() {
        var allColumnIds = [];
        this.gridColumnApi.getAllColumns().forEach(function(column) {
            allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds);
    }

}