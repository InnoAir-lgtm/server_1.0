async function cadastrarObra(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('SUPABASE NOT CONFIGURED');
    }

    const obra = {
        obr_complemento: dados.complemento || null,
        pes_id_cliente: dados.cliente_id,
        obr_situacao: dados.situacao || null,
        obr_eng_nome: dados.eng_nome || null,            
        obr_eng_telefone: dados.eng_telefone || null,    
        obr_eng_email: dados.eng_email || null,        
        pes_id_profissional: dados.profissional_id,
        epd_id: dados.epd_id
    };

    console.log('Cadastrando Obra:', obra); // Log the obra

    const { data, error } = await supabase
        .schema(schema)
        .from('obras')
        .insert([obra]);

    if (error) {
        console.error('Erro ao cadastrar Obra:', error.message);
        return { success: false, error };
    }

    return { success: true, data };
}

module.exports = { cadastrarObra };
