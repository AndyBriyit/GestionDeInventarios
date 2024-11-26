import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'; 
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';  // Asegúrate de que esté importado correctamente

declare var bootstrap: any;
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  dataSource: any[] = [];

  product: any = {
    product_id: '',
    product_name: '',
    product_description: '',
    product_category: '',
    product_quantity: 0,
    product_price: 0
  };
  categories = ['Electrónica', 'Ropa', 'Muebles', 'Juguetes'];

  constructor(private productService: ProductService,private inventoryTable: InventoryTableComponent) {}

    
  onSubmit(): void {
    // Verificar que todos los campos obligatorios están completos
    if (this.product.product_id && this.product.product_name && this.product.product_quantity && 
        this.product.product_price && this.product.product_category) {
      
      // Validar que la cantidad y el precio sean mayores a 0
      if (this.product.product_quantity <= 0 || this.product.product_price <= 0) {
        alert('La cantidad y el precio deben ser mayores que cero.');
        return; // Evita mostrar el modal si la validación falla
      }
  
      // Si la validación es correcta, mostrar el modal de confirmación
      const modal = new bootstrap.Modal(document.getElementById('confirmModal') as HTMLElement);
      modal.show();
  
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
  }
  openModal() {
    const modalElement = document.getElementById('confirmModal');
    const modal = new bootstrap.Modal(modalElement); 
    modal.show();  // Abre el modal
  }

  closeModal() {
    const modalElement = document.getElementById('confirmModal');
    const modal = bootstrap.Modal.getInstance(modalElement); 
    modal.hide();  // Cierra el modal
  }
  // Método para crear un producto
  addProduct(): void {
    // Llamar al servicio para agregar el producto
    this.productService.addProduct(this.product).subscribe({
      next: (response) => {
        alert('Producto registrado exitosamente');
        console.log('Respuesta del servidor:', response);
        
        // Opcional: Reinicia el formulario
        this.product = {
          product_id: '',
          product_name: '',
          product_description: '',
          product_category: '',
          product_quantity: 0,
          product_price: 0
        };
        // Actualizar la lista de productos en la tabla
        this.inventoryTable.loadProducts();
        this.closeModal();
        
      },
      error: (err) => {
        alert('Ocurrió un error al registrar el producto');
        console.error('Error:', err);
      }
    });
  }
  // Método para cancelar y resetear el formulario
  resetForm(): void {
    this.product = {
      product_id: '',
      product_name: '',
      product_description: '',
      product_category: '',
      product_quantity: 0,
      product_price: 0
    };
  }
  
  
}

