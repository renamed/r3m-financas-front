import MovimentacaoResponse from "./movimentacao.response";

export default interface InstituicaoResponse {
    instituicaoId: string;
    nome: string;
    saldo: number;
    credito: boolean;
    
    movimentacoes: MovimentacaoResponse[];
}