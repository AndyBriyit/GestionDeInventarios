import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service'; // Asegúrate de que la ruta sea correcta
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})

export class ProductViewComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error('Error al cargar el producto:', error);
        }
      );
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Información del Producto', 10, 10);
    
    // Añadir datos del producto al PDF
    doc.setFontSize(12);
    doc.text(`Código: ${this.product.product_id}`, 10, 30);
    doc.text(`Nombre: ${this.product.product_name}`, 10, 40);
    doc.text(`Descripción: ${this.product.product_description}`, 10, 50);
    doc.text(`Categoría: ${this.product.product_category}`, 10, 60);
    doc.text(`Cantidad: ${this.product.product_quantity}`, 10, 70);
    doc.text(`Precio: ${this.product.product_price}`, 10, 80);

    // Descargar el archivo PDF
    doc.save(`${this.product.product_name}.pdf`);
  }
}
