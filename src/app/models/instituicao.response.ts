import MovimentacaoResponse from "./movimentacao.response";

export default interface InstituicaoResponse {
    instituicao_id: string;
    nome: string;
    saldo: number;
    credito: boolean;
    limite_credito?: number;
    
    movimentacoes: MovimentacaoResponse[];
}