const Vaga = require('../Model/VagaModel');


exports.getAllVagas = async (req, res) => {
    try {
        const { search } = req.query; 
        let vagas;

        if (search) {
            console.log(`Buscando vagas com termo: "${search}"`); 
            vagas = await Vaga.findByCargo(search); 
        } else {
            vagas = await Vaga.getAll(); 
        }

        console.log(`Quantidade de vagas encontradas: ${vagas.length}`); 
        res.json(vagas);
    } catch (error) {
        console.error('Erro em getAllVagas:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getVagaByCodigo = async (req, res) => {
    try {
        const vaga = await Vaga.getByCodigo(req.params.codigo);
        if (vaga) {
            res.json(vaga);
        } else {
            res.status(404).json({ message: 'Vaga não encontrada' });
        }
    } catch (error) {
        console.error('Erro em getVagaByCodigo:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.createVaga = async (req, res) => {
    try {
        const id = await Vaga.create(req.body);
        res.status(201).json({ message: 'Vaga criada com sucesso', id });
    } catch (error) {
        console.error('Erro em createVaga:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.updateVaga = async (req, res) => {
    try {
        const affectedRows = await Vaga.update(req.params.codigo, req.body);
        if (affectedRows > 0) {
            res.json({ message: 'Vaga atualizada com sucesso' });
        } else {
            res.status(404).json({ message: 'Vaga não encontrada para atualização' });
        }
    } catch (error) {
        console.error('Erro em updateVaga:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteVaga = async (req, res) => {
    try {
        const affectedRows = await Vaga.delete(req.params.codigo);
        if (affectedRows > 0) {
            res.json({ message: 'Vaga excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Vaga não encontrada para exclusão' });
        }
    } catch (error) {
        console.error('Erro em deleteVaga:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.decrementVagaQuantidade = async (req, res) => {
    const { codigo } = req.params;
    try {
        const vaga = await Vaga.getByCodigo(codigo);
        if (!vaga) {
            return res.status(404).json({ message: 'Vaga não encontrada' });
        }

        if (vaga.vaga_quantidade <= 0) {
            return res.status(400).json({ message: 'Não há vagas disponíveis para decrementar' });
        }

        const affectedRows = await Vaga.decrementQuantidade(codigo);
        if (affectedRows > 0) {
            res.json({ message: 'Quantidade de vagas decrementada com sucesso' });
        } else {
            res.status(400).json({ message: 'Erro ao decrementar a quantidade de vagas' });
        }
    } catch (error) {
        console.error('Erro em decrementVagaQuantidade:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.incrementVagaQuantidade = async (req, res) => {
    const { codigo } = req.params;
    try {
        const vaga = await Vaga.getByCodigo(codigo);
        if (!vaga) {
            return res.status(404).json({ message: 'Vaga não encontrada' });
        }

        const affectedRows = await Vaga.incrementQuantidade(codigo);
        if (affectedRows > 0) {
            res.json({ message: 'Quantidade de vagas incrementada com sucesso' });
        } else {
            res.status(400).json({ message: 'Erro ao incrementar a quantidade de vagas' });
        }
    } catch (error) {
        console.error('Erro em incrementVagaQuantidade:', error);
        res.status(500).json({ error: error.message });
    }
};
