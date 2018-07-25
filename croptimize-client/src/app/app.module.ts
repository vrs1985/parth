import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ROUTES } from './app.routes';


import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { AuthService } from './auth/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { CallbackComponent } from './callback/callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PerformanceComponent } from './dashboard/performance/performance.component';
import { OptimizationComponent } from './dashboard/optimization/optimization.component';
import { AlertsComponent } from './dashboard/alerts/alerts.component';
import { LiveComponent } from './dashboard/live/live.component';
import { UsageByCategoryComponent } from './dashboard/usage-by-category/usage-by-category.component';
import { PeakDemandComponent } from './dashboard/peak-demand/peak-demand.component';
import { ModalHistogramComponent } from './dashboard/usage-by-category/modal-histogram/modal-histogram.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    CallbackComponent,
    DashboardComponent,
    PerformanceComponent,
    OptimizationComponent,
    AlertsComponent,
    LiveComponent,
    UsageByCategoryComponent,
    PeakDemandComponent,
    ModalHistogramComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
