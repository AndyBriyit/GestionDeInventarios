import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Gestion De Inventario';
  isLoggedIn: boolean = false; // Indicador de estado de autenticación.

  ngOnInit(): void {
    // Verifica si hay una sesión activa en sessionStorage.
    this.isLoggedIn = !!window.sessionStorage.getItem('authToken');
  }

  logout(): void {
    // Limpiar el almacenamiento de sesión.
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    // Redirigir a la URL de logout de Amazon Cognito.
    window.location.href = "https://us-east-2izzi1jexi.auth.us-east-2.amazoncognito.com/logout?client_id=eibr62etv3s45b55gd05hpihk&logout_uri=<logout uri>";
  }
}
