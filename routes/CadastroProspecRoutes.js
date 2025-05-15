const express = require('express');
const router = express.Router();
const { cadastrarProspeccao } = require('../controllers/CadastrrarProspec');
const supabase = require('../Supabase/supabaseClient');

router.post('/cadastrar-prospeccao', async (req, res) => {
    const { schema, ...dados } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const result = await cadastrarProspeccao(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json({ message: 'Prospeccao cadastrado com sucesso!', data: result.data });
    } catch (error) {
        console.error('Erro ao cadastrar prospecção:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: error.message || 'Erro ao cadastrar prospecção.' });
    }
});

router.get('/listar-prospeccao', async (req, res) => {
    const schema = req.query.schema
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('prospeccao')
            .select('*')
        if (error) {
            return res.status(400).json({ error: error.message })
        } res.status(200).json({ message: 'prospeccao listados com sucesso!', data });
    } catch (error) {
        console.error('Erro ao listar prospeccao:', error);
        res.status(500).json({ error: 'Erro ao listar prospeccao.' });
    }
})

router.put('/atualizar-situacao/:id', async (req, res) => {
    const { id } = req.params;
    const { schema, ppc_situacao } = req.body;

    if (!schema || !id) {
        return res.status(400).json({ error: 'Schema ou ID da prospecção não especificado.' });
    }


    const dadosAtualizados = {
        ...(ppc_situacao && { ppc_situacao }),
        ppc_data_situacao: new Date()
    };

    console.log('Atualizando prospeccao:', dadosAtualizados);

    try {
        const { error } = await supabase
            .schema(schema)
            .from('prospeccao')
            .update(dadosAtualizados)
            .eq('ppc_id', id);

        if (error) {
            console.error('Erro ao atualizar situação:', error.message);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({
            message: 'Situação atualizada com sucesso!',
            data: dadosAtualizados
        });
    } catch (error) {
        console.error('Erro ao atualizar situação:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

router.put('/editar-prospeccao/:id', async (req, res) => {
    const { id } = req.params;
    const { schema, ...dadosRecebidos } = req.body;

    if (!schema || !id) {
        return res.status(400).json({ error: 'Schema ou ID não especificado.' });
    }

    const dadosAtualizados = Object.fromEntries(
        Object.entries(dadosRecebidos).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(dadosAtualizados).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado enviado para atualização.' });
    }

    console.log('Dados para atualizar:', dadosAtualizados);

    try {
        const { error } = await supabase
            .schema(schema)
            .from('prospeccao')
            .update(dadosAtualizados)
            .eq('ppc_id', id);

        if (error) {
            console.error('Erro ao editar prospecção:', error.message);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({
            message: 'Prospecção atualizada com sucesso!',
            data: dadosAtualizados
        });
    } catch (error) {
        console.error('Erro no servidor:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});


module.exports = router;
