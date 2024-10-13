
const CandidatoVaga = require('../Model/CandidatoVagaModel');
const Candidato = require('../Model/CandidatoModel');
const Vaga = require('../Model/VagaModel');


exports.getAllInscricoes = async (req, res) => {
    try {
        const inscricoes = await CandidatoVaga.getAll();
        res.json(inscricoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getInscricaoByIds = async (req, res) => {
    const { cpf, codigo } = req.params;
    try {
        const inscricao = await CandidatoVaga.getByIds(cpf, codigo);
        if (inscricao) {
            res.json(inscricao);
        } else {
            res.status(404).json({ message: 'Inscrição não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createInscricao = async (req, res) => {
    const { pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao } = req.body;

    try {
        
        const candidato = await Candidato.getByCpf(pk_cand_cpf);
        if (!candidato) {
            return res.status(400).json({ message: 'Candidato não encontrado' });
        }

        
        const vaga = await Vaga.getByCodigo(pk_vaga_codigo);
        if (!vaga) {
            return res.status(400).json({ message: 'Vaga não encontrada' });
        }

        
        if (vaga.vaga_quantidade <= 0) {
            return res.status(400).json({ message: 'Não há vagas disponíveis para esta posição' });
        }

        
        const existingInscricao = await CandidatoVaga.getByIds(pk_cand_cpf, pk_vaga_codigo);
        if (existingInscricao) {
            return res.status(400).json({ message: 'Candidato já está inscrito nesta vaga' });
        }

        
        await CandidatoVaga.create({ pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao });

        
        await Vaga.decrementQuantidade(pk_vaga_codigo);

        res.status(201).json({ message: 'Inscrição criada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteInscricao = async (req, res) => {
    const { cpf, codigo } = req.params;

    try {
        
        const inscricao = await CandidatoVaga.getByIds(cpf, codigo);
        if (!inscricao) {
            return res.status(404).json({ message: 'Inscrição não encontrada' });
        }

        
        await CandidatoVaga.delete(cpf, codigo);

        
        await Vaga.incrementQuantidade(codigo);

        res.json({ message: 'Inscrição excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getInscricoesByVaga = async (req, res) => {
    const { codigoVaga } = req.params;

    try {
        
        const vaga = await Vaga.getByCodigo(codigoVaga);
        if (!vaga) {
            return res.status(404).json({ message: 'Vaga não encontrada' });
        }

        
        const inscricoes = await CandidatoVaga.getByVaga(codigoVaga);

       
        res.json(inscricoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
