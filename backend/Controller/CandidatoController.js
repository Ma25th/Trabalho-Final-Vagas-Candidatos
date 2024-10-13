
const Candidato = require('../Model/CandidatoModel');
exports.getAllCandidatos = async (req, res) => {
    try {
        const candidatos = await Candidato.getAll();
        res.json(candidatos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCandidatoByCpf = async (req, res) => {
    try {
        const candidato = await Candidato.getByCpf(req.params.cpf);
        if (candidato) {
            res.json(candidato);
        } else {
            res.status(404).json({ message: 'Candidato não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createCandidato = async (req, res) => {
    try {
        await Candidato.create(req.body);
        res.status(201).json({ message: 'Candidato criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCandidatoByName = async (req, res) => {
    try {
        const { search } = req.query; 
        if (!search) {
            return res.status(400).json({ message: 'Termo de busca não fornecido' });
        }
        
        const candidatos = await Candidato.findByName(search);
        res.json(candidatos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCandidato = async (req, res) => {
    try {
        await Candidato.update(req.params.cpf, req.body);
        res.json({ message: 'Candidato atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCandidato = async (req, res) => {
    try {
        await Candidato.delete(req.params.cpf);
        res.json({ message: 'Candidato excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
