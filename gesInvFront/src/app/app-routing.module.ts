import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // Importar el componente de login
import { InventoryTableComponent } from './pages/inventory-table/inventory-table.component'; // Importar componente de consulta
import { ProductFormComponent } from './pages/product-form/product-form.component'; // Importar componente de creación de productos
import { ProductViewComponent } from './pages/product-view/product-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Ruta por defecto redirige al login
  { path: 'login', component: LoginComponent }, // Ruta para el login
  { path: 'inventory', component: InventoryTableComponent }, // Ruta para consulta del inventario
  { path: 'product-form', component: ProductFormComponent }, // Ruta para registrar productos
  { path: 'product-view/:id', component: ProductViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
