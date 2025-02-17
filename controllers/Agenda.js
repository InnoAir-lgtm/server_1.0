async function agenda(dados, supabase, schema) {
    if (!supabase) {
        throw new Error("Supabase não foi fornecido");
    }

    if (!schema) {
        throw new Error("Schema não foi fornecido");
    }

    try {
        const { evt_titulo, evt_inicio, evt_fim, evt_descricao, evt_local, evt_lat, evt_log, evt_status, pes_evento, pes_destino, evt_evento } = dados;

        if (!evt_titulo || !evt_inicio || !evt_fim || !evt_evento || !pes_evento) {
            throw new Error("Campos obrigatórios estão faltando");
        }

        const { data, error } = await supabase
            .schema(schema)
            .from(`eventos`)
            .insert([
                {
                    evt_titulo,
                    evt_inicio,
                    evt_fim,
                    evt_descricao,
                    evt_local,
                    evt_lat,
                    evt_log,
                    evt_status,
                    pes_evento,
                    pes_destino,
                    evt_evento,
                    evt_upd: new Date()
                }
            ]);

        if (error) {
            throw new Error(`Erro ao inserir evento: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error("Erro ao agendar evento:", error);
        throw error;
    }
}

module.exports = { agenda };
