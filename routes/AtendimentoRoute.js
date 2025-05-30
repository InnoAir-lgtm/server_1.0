const express = require('express');
const router = express.Router();
const { cadastrarAtendimento } = require('../controllers/CadastrarAtendimento');
const supabase = require('../Supabase/supabaseClient');

router.post('/cadastrar-atendimento', async (req, res) => {
    const { schema, ...dados } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const result = await cadastrarAtendimento(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json({ message: 'Atendimento cadastrado com sucesso!', data: result.data });
    } catch (error) {
        console.error('Erro ao cadastrar atendimento:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: error.message || 'Erro ao cadastrar atendimento.' });
    }
})



router.get('/atendimentos', async (req, res) => {
    const { schema } = req.query;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }

    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('atendimento')
            .select('*');

        if (error) {
            console.error('Erro ao buscar atendimentos:', error.message);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar atendimentos:', error);
        res.status(500).json({ error: 'Erro ao buscar atendimentos.' });
    }
});

module.exports = router;