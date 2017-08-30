import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from './app-common/app-common.module';

import { AppRoutingModule } from './app-routing.module';
import { AppToolbarService } from './app-toolbar/app-toolbar.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HexGridComponent } from './hex-grid/hex-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HexGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AppCommonModule,
    AppRoutingModule
  ],
  providers: [AppToolbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
