import { Injectable } from '@angular/core';
import InstituicaoResponse from '../models/instituicao.response';
import InstituicaoRequest from '../models/instituicao.request';

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

    async AdicionarAsync(instituicao: InstituicaoRequest) {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(instituicao)
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao adicionar instituição');
      }
    }
}
