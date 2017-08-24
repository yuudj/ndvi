import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {'class': 'full-height layout-column'}
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
