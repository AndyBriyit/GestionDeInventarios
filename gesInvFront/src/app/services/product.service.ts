import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la URL base de la API
const BASE_URL = 'https://x5v6qv4qfe.execute-api.us-east-2.amazonaws.com/prod/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProducts(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}products`);
  }

  // Obtener un producto por ID
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}product?product_id=${productId}`);
  }

  // Eliminar producto por ID
  deleteProductById(productId: string): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}product?product_id=${productId}`);
  }

  // Crear un nuevo producto
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}product`, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Actualizar un producto
  updateProduct(productId: string, product: any): Observable<any> {
    return this.http.patch<any>(`${BASE_URL}product?product_id=${productId}`, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
