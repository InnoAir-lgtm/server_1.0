const express = require('express');
const router = express.Router();
const { cadastrarObra } = require('../controllers/CadastrarObra');
const supabase = require('../Supabase/supabaseClient');

router.post('/cadastrar-obra', async (req, res) => {
    const { schema, ...dados } = req.body;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const result = await cadastrarObra(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json({ message: 'Obra cadastrada com sucesso!', data: result.data });
    } catch (error) {
        console.error('Erro ao cadastrar obra:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: error.message || 'Erro ao cadastrar obra.' });
    }
})


router.get('/obras', async (req, res) => {
    const { schema } = req.query;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('obras')
            .select('*');

        if (error) {
            console.error('Erro ao buscar obras:', error.message);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar obras:', error);
        res.status(500).json({ error: error.message || 'Erro ao buscar obras.' });
    }
});


module.exports = router;