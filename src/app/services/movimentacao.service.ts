import { Injectable } from '@angular/core';
import MovimentacaoResponse from '../models/movimentacao.response';
import { MovimentacaoRequest } from '../models/movimentacao.request';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  private readonly BASE_URL = 'http://localhost:7050/api/movimentacao';
  constructor() { }

  async ListarPorInstituicaoAsync(instituicaoId: string): Promise<MovimentacaoResponse[]> {
    const response = await fetch(`${this.BASE_URL}/${instituicaoId}`);
    if (!response.ok) throw new Error('Erro ao listar períodos');
    return response.json();
  }

  async AdicionarAsync(movimentacao: MovimentacaoRequest) {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movimentacao)
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar movimentação');
    }
  }
}
