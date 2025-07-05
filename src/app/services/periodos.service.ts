import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import PeriodoResponse from '../models/periodo.response';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {

  private readonly BASE_URL = environment.periodoApiUrl;
  constructor() { }

  async ListarAsync(anoBase: Number): Promise<PeriodoResponse[]> {
    const response = await fetch(`${this.BASE_URL}/${anoBase}`);
    if (!response.ok) throw new Error('Erro ao listar períodos');
    return response.json();
  }
}
