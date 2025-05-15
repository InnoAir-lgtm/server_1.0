async function cadastrarProspeccao(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('BD not configured');
    }
    if (!schema) {
        throw new Error('Schema not specified');
    }

    const { data, error } = await supabase
        .schema(schema)
        .from('prospeccao')
        .insert([
            {
                ppc_data: dados.data,
                ppc_pessoa: dados.pessoa,
                pcd_id: dados.pcd_id,
                ppc_email: dados.email,
                ppc_telefone: dados.telefone,
                ppc_situacao: dados.situacao,
                tpp_id: dados.tpp_id,
                ppc_valor_estimado: dados.valor_estimado,
                ppc_data_trabalho: dados.data_trabalho,
                ppc_profissional: dados.profissional,
                ppc_engenheiro: dados.engenheiro,
                epd_id: dados.epd_id,
                ppc_data_situacao: dados.data_situacao,
                ppc_email_usuario: dados.email_usuario
            }
        ]);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}

module.exports = { cadastrarProspeccao };
