export default interface CategoryResponse {
    categoria_id: string;
    nome: string;
    parent_id?: string | null;
}