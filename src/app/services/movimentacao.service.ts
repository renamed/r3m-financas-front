import { Injectable } from '@angular/core';
import MovimentacaoResponse from '../models/movimentacao.response';
import { MovimentacaoRequest } from '../models/movimentacao.request';
import MovimentacaoCategoriaSomaResponse from '../models/movimentacao.categoria.soma';
import RespostaAbstrata from '../models/resposta.abstrata';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  private readonly BASE_URL = 'http://localhost:7050/api/movimentacao';
  constructor() { }

  async ListarPorInstituicaoAsync(instituicao_id: string, periodo_id: string): Promise<MovimentacaoResponse[]> {
    const response = await fetch(`${this.BASE_URL}/${instituicao_id}/${periodo_id}`);
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

  async DeletarAsync(movimentacaoId: string) {
    const response = await fetch(`${this.BASE_URL}/${movimentacaoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar movimentação');
    }
  }

  async ListarPorCategoria(periodoId: string, categoriaPaiId: string | null, instituicaoId: string | null, incluirCategoriaZerada : boolean) 
    : Promise<RespostaAbstrata<MovimentacaoCategoriaSomaResponse[] | MovimentacaoResponse[]>> {
    let url = `${this.BASE_URL}/periodo/${periodoId}?`
    if (categoriaPaiId) {
      url += `categoriaPaiId=${categoriaPaiId}&`;
    }

    if (instituicaoId) {
      url += `instituicaoId=${instituicaoId}&`;
    }

    if (incluirCategoriaZerada){
      url += `incluirCategoriaZerada=${incluirCategoriaZerada}`;
    }

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }
}
