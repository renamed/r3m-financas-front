export default interface RespostaAbstrata<T> {
    nome_tipo: string | null,
    resposta: T
}