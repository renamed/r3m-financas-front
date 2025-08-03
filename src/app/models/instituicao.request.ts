export default interface InstituicaoRequest {
    nome: string;
    saldo_inicial: number;
    data_saldo_inicial: Date;
    instituicao_credito: boolean;
    limite_credito?: number | null;
}