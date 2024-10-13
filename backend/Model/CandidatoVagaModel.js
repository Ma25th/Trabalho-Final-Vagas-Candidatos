const db = require('./database');

class CandidatoVaga {
    
    static async getAll() {
        const [rows] = await db.query(`
            SELECT cv.data_inscricao, cv.horario_inscricao, cv.pk_cand_cpf, cv.pk_vaga_codigo,
                   c.cand_nome, v.vaga_cargo
            FROM candidato_vaga cv
            JOIN candidato c ON cv.pk_cand_cpf = c.pk_cand_cpf
            JOIN vaga v ON cv.pk_vaga_codigo = v.pk_vaga_codigo
        `);
        return rows;
    }


    static async getByIds(cpf, codigo) {
        const [rows] = await db.query(
            'SELECT * FROM candidato_vaga WHERE pk_cand_cpf = ? AND pk_vaga_codigo = ?',
            [cpf, codigo]
        );
        return rows[0];
    }

    
    static async getByVaga(codigoVaga) {
        const [rows] = await db.query(`
            SELECT cv.data_inscricao, cv.horario_inscricao, cv.pk_cand_cpf, cv.pk_vaga_codigo,
                   c.cand_nome, v.vaga_cargo
            FROM candidato_vaga cv
            JOIN candidato c ON cv.pk_cand_cpf = c.pk_cand_cpf
            JOIN vaga v ON cv.pk_vaga_codigo = v.pk_vaga_codigo
            WHERE cv.pk_vaga_codigo = ?
        `, [codigoVaga]);
        return rows;
    }

   
    static async create(data) {
        const { pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao } = data;
        const [result] = await db.query(
            `INSERT INTO candidato_vaga (pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao)
             VALUES (?, ?, ?, ?)`,
            [pk_cand_cpf, pk_vaga_codigo, data_inscricao, horario_inscricao]
        );
        return result;
    }

    
    static async delete(cpf, codigo) {
        await db.query(
            'DELETE FROM candidato_vaga WHERE pk_cand_cpf = ? AND pk_vaga_codigo = ?',
            [cpf, codigo]
        );
    }
}

module.exports = CandidatoVaga;
