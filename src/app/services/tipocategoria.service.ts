import { Injectable } from '@angular/core';
import TipoCategoriaResponse from '../models/tipo_categoria.response';

@Injectable({
  providedIn: 'root'
})
export class TipocategoriaService {

    private readonly BASE_URL = 'http://localhost:7050/api/tipocategoria';
    constructor() { }
  
    async ListarAsync(): Promise<TipoCategoriaResponse[]> {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) throw new Error('Erro ao listar tipos de categoria');
      return response.json();
    }
}
