import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import CategoryResponse from '../models/categoria.response';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private readonly BASE_URL = environment.categoriaApiUrl;
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
}




