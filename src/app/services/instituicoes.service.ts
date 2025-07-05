import { Injectable } from '@angular/core';
import InstituicaoResponse from '../models/instituicao.response';

@Injectable({
  providedIn: 'root'
})
export class InstituicoesService {
    private readonly BASE_URL = 'http://localhost:7050/api/instituicao';
    constructor() { }

    async ListarAsync(): Promise<InstituicaoResponse[]> {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) throw new Error('Erro ao listar instituições');
      return response.json();
    }
}
