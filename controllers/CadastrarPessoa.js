const cadastrarPessoaC = async (dados, supabase, schema) => {
    if (!supabase) {
        throw new Error('Conexão Supabase não foi inicializada.');
    }

    if (!schema) {
        throw new Error('Schema não foi fornecido.');
    }

    try {
        const { tipoPessoa, cpf, cnpj, rg, inscricaoEstadual, dataNascimento, nome, fantasia } = dados;
        if (!tipoPessoa || (!cpf && !cnpj) || !nome) {
            throw new Error('Dados obrigatórios ausentes. Verifique o tipo de pessoa, CPF/CNPJ e nome.');
        }

        const identificador = tipoPessoa === 'cpf' ? cpf : cnpj;

        const { data: existePessoa, error: consultaError } = await supabase
            .schema(schema) 
            .from('pessoas')
            .select('pes_id')
            .eq('pes_cpf_cnpj', identificador);

        if (consultaError) {
            console.error('Erro ao consultar duplicidade:', consultaError.message);
            return { success: false, error: consultaError };
        }

        if (existePessoa.length > 0) {
            return { success: false, error: 'CPF ou CNPJ já cadastrado no sistema.' };
        }

        const payload = {
            pes_rg: rg,
            pes_ie: inscricaoEstadual,
            pes_dn: dataNascimento,
            pes_nome: nome,
            pes_fantasia: fantasia,
            pes_fis_jur: tipoPessoa,
            pes_cpf_cnpj: identificador,
        };

        
        const { data, error } = await supabase
            .schema(schema)
            .from('pessoas')
            .insert([payload])
            .select('pes_id');

        if (error) {
            console.error('Erro ao cadastrar pessoa:', error.message);
            return { success: false, error };
        }

        console.log('Dados recebidos:', payload);
        return { success: true, data };
    } catch (err) {
        console.error('Erro inesperado no cadastro:', err.message);
        return { success: false, error: err.message };
    }
};

module.exports = { cadastrarPessoaC };
