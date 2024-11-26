import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion De Inventario';

  // Función para cerrar sesión
  logout(): void {
    // Limpiar el almacenamiento de sesión
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    // Redirigir a la URL de logout de Amazon Cognito
    window.location.href = "https://us-east-2izzi1jexi.auth.us-east-2.amazoncognito.com/logout?client_id=eibr62etv3s45b55gd05hpihk&logout_uri=<logout uri>"; 
  }
}
