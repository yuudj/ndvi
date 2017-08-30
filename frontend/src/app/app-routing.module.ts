import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { HexGridComponent } from './hex-grid/hex-grid.component';
import { AboutComponent } from "./about/about.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent, data: {
      title: 'Home'
    }
  },
  {
    path: 'grid', component: HexGridComponent, data: {
      title: 'Grid'
    }
  },
  {
    path: 'about', component: AboutComponent, data: {
      title: 'About'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
