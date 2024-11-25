import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Ajusta la ruta si es necesario

declare var bootstrap: any; 

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})

export class InventoryTableComponent implements OnInit, AfterViewInit {
  products: any[] = [];
  displayedColumns: string[] = ['product_id', 'product_name', 'product_description', 'product_category', 'product_quantity', 'product_price', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Agregado '!'
  @ViewChild(MatSort) sort!: MatSort;  // Agregado '!'

  constructor(private productService: ProductService,private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
    this.getProducts();
    
  }

  ngAfterViewInit(): void {
    // Después de la inicialización de la vista, asignamos paginator y sorter a la dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data.products;
      this.dataSource.data = this.products;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Función para abrir el modal
  openAddProductModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('productModal') as HTMLElement);
    modal.show();
  }
  viewProduct(product: any) {
    console.log('Ver producto:', product);
    // Implementar lógica para ver el producto
  }
  
  editProduct(product: any) {
    console.log('Editar producto:', product);
    // Implementar lógica para editar el producto
  }
  
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data.products;
        this.dataSource.data = this.products;
        
        // Restablecer el paginador si es necesario
        this.paginator.pageIndex = 0;  // Opcional: reiniciar el índice de la página
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }
  
  deleteProduct(product: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Producto',
        message: `¿Está seguro de que desea eliminar el producto "${product.product_name}"?`
      }
    });
    
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        // Llamada al servicio para eliminar el producto
        this.productService.deleteProductById(product.product_id).subscribe({
          next: () => {
            alert(`Producto "${product.product_name}" eliminado exitosamente.`);
            this.loadProducts(); // Recarga los datos
          },
          error: (err) => {
            alert('Ocurrió un error al eliminar el producto.');
            console.error('Error al eliminar producto:', err);
          }
        });
      }
    });
  }
  
    
}
