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

module.exports = router;