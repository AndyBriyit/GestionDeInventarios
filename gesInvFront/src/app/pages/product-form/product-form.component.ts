import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'; 

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
  categories = ['Electrónica', 'Hogar', 'Ropa'];

  constructor(private productService: ProductService) {}

    
  onSubmit(): void {
    if (this.product.product_id && this.product.product_name && this.product.product_quantity && 
        this.product.product_price && this.product.product_category) {
      // Mostrar el modal de confirmación
      const modal = new bootstrap.Modal(document.getElementById('confirmModal') as HTMLElement);
      modal.show();
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
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

