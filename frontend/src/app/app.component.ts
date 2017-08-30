import { Component, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';
import { MdSidenav } from '@angular/material';
import { AppToolbarService, MenuItem } from './app-toolbar/app-toolbar.service';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    appName = 'NDVI';
    isDarkTheme = true;
    mainMenuItems;
    activeMenuItem$: Observable<MenuItem>;
    @ViewChildren("mainSideNav") sidebar: QueryList<MdSidenav>;

    constructor(private router: Router, private toolbarService: AppToolbarService) {
        this.mainMenuItems = this.toolbarService.getMenuItems();
        this.activeMenuItem$ = this.toolbarService.activeMenuItem$;

        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd && this.sidebar) {
                    this.sidebar.first.close();
                }
            });
    }

    ngAfterViewInit() {

    }
}