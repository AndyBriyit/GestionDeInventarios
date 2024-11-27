import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Gestion De Inventario';
  

  ngOnInit(): void {
    // Verifica si hay una sesión activa en sessionStorage.
    //this.isLoggedIn = !!window.sessionStorage.getItem('authToken');
  }

  
}
