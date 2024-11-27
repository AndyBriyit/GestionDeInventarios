import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Ajusta la ruta si es necesario
import { MatSelectChange } from '@angular/material/select';
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
  categoryFilter: string = '';
  minQuantityFilter: number | null = null;
  maxPriceFilter: number | null = null;
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
    // Ordenar por el código de producto (product_id) en orden ascendente por defecto
  this.dataSource.sort.active = 'product_id';
  this.dataSource.sort.direction = 'asc';
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data.products;
      this.dataSource.data = this.products;
    });
  }

  

// Filtro por categoría
applyCategoryFilter(event: MatSelectChange): void {
  this.categoryFilter = event.value;
  this.updateFilters();
}

// Filtro por cantidad mínima
applyQuantityFilter(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.minQuantityFilter = value ? parseInt(value, 10) : null;
  this.updateFilters();
}

// Filtro por precio máximo
applyPriceFilter(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.maxPriceFilter = value ? parseFloat(value) : null;
  this.updateFilters();
}

updateFilters(): void {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const matchesCategory = this.categoryFilter
      ? data.product_category.toLowerCase() === this.categoryFilter.toLowerCase()
      : true;

    const matchesQuantity = this.minQuantityFilter !== null
      ? data.product_quantity >= this.minQuantityFilter
      : true;

    const matchesPrice = this.maxPriceFilter !== null
      ? data.product_price <= this.maxPriceFilter
      : true;

    return matchesCategory && matchesQuantity && matchesPrice;
  };

  // La línea de abajo debería activar el filtro:
  this.dataSource.filter = `${this.categoryFilter} ${this.minQuantityFilter} ${this.maxPriceFilter}`;
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
