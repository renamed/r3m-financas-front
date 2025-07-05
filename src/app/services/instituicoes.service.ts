import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import InstituicaoResponse from '../models/instituicao.response';

@Injectable({
  providedIn: 'root'
})
export class InstituicoesService {
    private readonly BASE_URL = environment.instituicaoApiUrl;
    constructor() { }

    async ListarAsync(): Promise<InstituicaoResponse[]> {
      const response = await fetch(this.BASE_URL);
      if (!response.ok) throw new Error('Erro ao listar instituições');
      return response.json();
    }
}
