import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent {
  products = [
    { code: 'P001', name: 'Laptop', description: 'Laptop HP', category: 'Electrónica', quantity: 10, price: 2500 },
    { code: 'P002', name: 'Silla', description: 'Silla ergonómica', category: 'Hogar', quantity: 5, price: 150 },
    { code: 'P003', name: 'Pantalón', description: 'Pantalón de algodón', category: 'Ropa', quantity: 20, price: 50 }
  ];
  
}
