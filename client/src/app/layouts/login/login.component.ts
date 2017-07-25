import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import { FooterComponent } from '../../components/footer/footer.component'
import { RegistrationService } from '../../services/registration.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string;
  password: string;
  time: Date;

  constructor(private RegService: RegistrationService, private router: Router) { }

      authenticate(event) {
        event.preventDefault();
        // var time = new Date();
        var user = {
          email: this.email,
          password: this.password,
          // created_at: time.toString()
        }
         this.RegService.login(user)
          .subscribe(user => {
            this.router.navigate(['/'], {})
          })
      }

   


  }
  
