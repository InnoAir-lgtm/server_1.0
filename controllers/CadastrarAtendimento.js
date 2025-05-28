async function cadastrarAtendimento(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('SP NOT CONFIGURED');
    }

    const atendimento = {
        atd_data: dados.data || null,
        atd_situacao: dados.situacao || null,
        atd_prioridade: dados.prioridade || null,
        atd_importancia: dados.importancia || null,
        atd_ambientes_importantes: dados.ambientes || null,
        atd_incidencia_luz: dados.luz || null,
        atd_data_situacao: dados.data_situacao || new Date().toISOString(),
        obr_id: dados.obra_id || null,
        ppc_id: dados.ppc_id || null,
        pes_colaborador: dados.colaborador || null
    };

    console.log('Cadastrando Atendimento:', atendimento);
    const { data, error } = await supabase
        .schema(schema)
        .from('atendimento')
        .insert([atendimento]);

    if (error) {
        console.error('Erro ao cadastrar Atendimento:', error.message);
        return { success: false, error };
    }

    return { success: true, data };
}

module.exports = { cadastrarAtendimento };
