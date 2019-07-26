import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from "ag-grid-angular";

import { MyGridApplicationComponent } from './my-grid-application/my-grid-application.component';

import { DataService } from "./@services/get-data.service";

@NgModule({
  declarations: [
    AppComponent,
    MyGridApplicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
