const express = require('express');
const router = express.Router();
const { CadastrarEmpreendimento } = require('../controllers/RegistrarEmpreendimento');
const supabase = require('../Supabase/supabaseClient');


router.post('/cadastrar-empreendimento', async (req, res) => {
    const { schema, ...dados } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const result = await CadastrarEmpreendimento(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json({ message: 'Empreendimento cadastrado com sucesso!', data: result.data });
    } catch (error) {
        console.error('Erro ao cadastrar empreendimento:', error);
        res.status(500).json({ error: 'Erro ao cadastrar empreendimento.' });
    }
});

router.get('/listar-empreendimentos', async (req, res) => {
    const schema = req.query.schema
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('empreendimentos')
            .select('*')

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json({ message: 'Endereços listados com sucesso!', data });
    } catch (error) {
        console.error('Erro ao listar endereços:', error);
        res.status(500).json({ error: 'Erro ao listar endereços.' });
    }
})

router.delete('/delete-empreendimento', async (req, res) => {
    const { epd_id, schema } = req.query;
    if (!schema || !epd_id || isNaN(parseInt(epd_id))) {
        return res.status(400).json({ error: 'Schema ou ID de tipo de pessoa inválido.' });
    }
    try {
        const { error } = await supabase
            .schema(schema)
            .from('empreendimentos')
            .delete()
            .eq('epd_id', epd_id)

        if (error) {
            console.error('Erro ao deletar Empreendimento:', error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Empreendimento deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar Empreendimento:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
})

router.put('/atualizar-empreendimento', async (req, res) => {
    const {
        schema,
        epd_id,
        end_cep,
        epd_numero,
        epd_nome,
        epd_complemento,
        pes_id_arquiteto,
        epd_construtora,
        epd_responsavel,
        epd_engenheiro
    } = req.body;

    if (!schema || !epd_id) {
        return res.status(400).json({ error: 'Schema ou ID do empreendimento não especificado.' });
    }

    const dadosAtualizados = {
        ...(end_cep && { end_cep }),
        ...(epd_numero && { epd_numero }),
        ...(epd_nome && { epd_nome }),
        ...(epd_complemento && { epd_complemento }),
        ...(pes_id_arquiteto && { pes_id_arquiteto }),
        ...(epd_construtora && { epd_construtora }),
        ...(epd_responsavel && { epd_responsavel }),
        ...(epd_engenheiro && { epd_engenheiro })
    };

    console.log(dadosAtualizados)

    try {
        const { error } = await supabase
            .schema(schema)
            .from('empreendimentos')
            .update(dadosAtualizados)
            .eq('epd_id', epd_id);

        if (error) {
            console.error('Erro ao atualizar empreendimento:', error.message);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ message: 'Empreendimento atualizado com sucesso!', data: dadosAtualizados });
    } catch (error) {
        console.error('Erro ao atualizar empreendimento:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});


module.exports = router;
