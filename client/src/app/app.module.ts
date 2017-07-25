import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { IndexComponent } from './layouts/index/index.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './layouts/about/about.component';
import { LoginComponent } from './layouts/login/login.component';
import { SurveyComponent } from './layouts/survey/survey.component';

import { RegistrationService } from './services/registration.service'

const ROUTES = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'survey',
    component: SurveyComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    IndexComponent,
    FooterComponent,
    AboutComponent,
    LoginComponent,
    SurveyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [RegistrationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
