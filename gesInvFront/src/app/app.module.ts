import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { InventoryTableComponent } from './pages/inventory-table/inventory-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductFormComponent,
    InventoryTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
