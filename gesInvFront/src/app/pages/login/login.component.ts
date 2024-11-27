import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  isAuthenticated = false;
  userData$ = this.oidcSecurityService.userData$;

  configuration$ = this.oidcSecurityService.getConfiguration();
  constructor(private oidcSecurityService: OidcSecurityService,private router: Router) {}

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        // Redirige al inventario tras autenticación
        this.router.navigate(['/inventory']);
      }
    });
  }
  login(): void {
    this.oidcSecurityService.authorize();
  }

}
