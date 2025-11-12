
export interface User {
    id: string;
    nome: string;
    email: string;
    avatar: string | null;
    departamento: string;
    cargo: string;
    empresa: string;
    ativo: string;
    possui_ramal: string;
    line_id: string;
    permissoes: string[];
}
