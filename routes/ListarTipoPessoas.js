const express = require('express');
const router = express.Router();
const supabase = require('../Supabase/supabaseClient');

router.get('/listar-tipos-pessoa', async (req, res) => {
    const schema = req.query.schema;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }

    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('tipo_pessoa')
            .select('tpp_descricao, tpp_classificacao, tpp_id');

        if (error) {
            console.error('Erro ao listar tipos de pessoa:', error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ data });
    } catch (error) {
        console.error('Erro ao listar os tipos de pessoa:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});



router.delete('/deletar-tipo-pessoa', async (req, res) => {
    const { tpp_id, schema } = req.query;
    if (!schema || !tpp_id || isNaN(parseInt(tpp_id))) {
        return res.status(400).json({ error: 'Schema ou ID de tipo de pessoa inválido.' });
    }

    try {
        const { error } = await supabase
            .schema(schema)
            .from('tipo_pessoa')
            .delete()
            .eq('tpp_id', tpp_id);

        if (error) {
            console.error('Erro ao deletar tipo de pessoa:', error.message);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: 'Tipo de pessoa deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar o tipo de pessoa:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

module.exports = router;
