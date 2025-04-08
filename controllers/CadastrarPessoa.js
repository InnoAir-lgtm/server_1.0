const cadastrarPessoaC = async (dados, supabase, schema) => {
    if (!supabase) {
        throw new Error('Conexão Supabase não foi inicializada.');
    }
    if (!schema) {
        throw new Error('Schema não foi fornecido.');
    }
    try {
        const { tipoPessoa, cpf, cnpj, rg, inscricaoEstadual, dataNascimento, nome, fantasia, email } = dados;
        if (!tipoPessoa || !nome || (!cpf && tipoPessoa === 'cpf') || (!cnpj && tipoPessoa === 'cnpj')) {
            throw new Error('Dados obrigatórios ausentes. Verifique o tipo de pessoa e dados correspondentes.');
        }

        if (tipoPessoa === 'cpf' && !dataNascimento) {
            throw new Error('Data de nascimento é obrigatória para pessoa física.');
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
            pes_email: email,
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
        console.log('Pessoa cadastrada:', data);

        if (email && dados.tipoTecnicoSelecionado) {
            const anoNascimento = new Date(dataNascimento).getFullYear();
            const primeiroNome = nome.split(' ')[0];
            const senhaGerada = `${anoNascimento}${primeiroNome}@inno`;

            const usuarioPayload = {
                usr_email: email,
                usr_nome: nome,
                usr_senha: senhaGerada,
                usr_grupo: 'bela_arte',
                usr_perfil: 'Operador',
            };

            const { error: usuarioError } = await supabase
                .schema('public')
                .from('usuarios')
                .insert([usuarioPayload]);

            if (usuarioError) {
                console.error('Erro ao cadastrar usuário:', usuarioError.message);
                return { success: false, error: usuarioError };
            }

            console.log('Usuário cadastrado com sucesso.');
        }

        return { success: true, data };
    } catch (err) {
        console.error('Erro inesperado no cadastro:', err.message);
        return { success: false, error: err.message };
    }
};

module.exports = { cadastrarPessoaC };
