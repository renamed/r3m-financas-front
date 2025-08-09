import { Injectable } from '@angular/core';
import CategoryResponse from '../models/categoria.response';
import CategoriaRequest from '../models/categoria.request';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private readonly BASE_URL = 'http://localhost:7050/api/Categoria';
  constructor() { }

  async ListarAsync(): Promise<CategoryResponse[]> {
    const response = await fetch(this.BASE_URL);
    if (!response.ok) throw new Error('Erro ao listar categorias');
    return response.json();
  }

  async ListarPorPaiAsync(parent_id: string): Promise<CategoryResponse[]> {
    const response = await fetch(`${this.BASE_URL}/pai/${parent_id}`);
    if (!response.ok) throw new Error('Erro ao listar categorias por pai');
    return response.json();
  }

  async PesquisarAsync(nome: string): Promise<CategoryResponse[]> {
    const response = await fetch(`${this.BASE_URL}/?nome=${encodeURIComponent(nome)}`);
    if (!response.ok) throw new Error('Erro ao pesquisar categorias');
    return response.json();
  }

  async CriarAsync(categoria: CategoriaRequest) {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria)
    });
    
    if (!response.ok) throw new Error(await response.text());
  }

  async DeleteAsync(categoriaId: string) {
    const response = await fetch(`${this.BASE_URL}/${categoriaId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(await response.text());    
  }
}