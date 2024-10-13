const db = require('./database');

class Candidato {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM candidato');
        return rows;
    }

    static async getByCpf(cpf) {
        const [rows] = await db.query('SELECT * FROM candidato WHERE pk_cand_cpf = ?', [cpf]);
        return rows[0];
    }

    static async findByName(nome) {
        const [rows] = await db.query('SELECT * FROM candidato WHERE cand_nome LIKE ?', [`%${nome}%`]);
        return rows;
    }

    static async create(data) {
        const { pk_cand_cpf, cand_nome, cand_endereco, cand_telefone } = data;
        const [result] = await db.query(
            'INSERT INTO candidato (pk_cand_cpf, cand_nome, cand_endereco, cand_telefone) VALUES (?, ?, ?, ?)',
            [pk_cand_cpf, cand_nome, cand_endereco, cand_telefone]
        );
        return result.insertId;
    }

    static async update(cpf, data) {
        const { cand_nome, cand_endereco, cand_telefone } = data;
        await db.query(
            'UPDATE candidato SET cand_nome = ?, cand_endereco = ?, cand_telefone = ? WHERE pk_cand_cpf = ?',
            [cand_nome, cand_endereco, cand_telefone, cpf]
        );
    }

    static async delete(cpf) {
        await db.query('DELETE FROM candidato WHERE pk_cand_cpf = ?', [cpf]);
    }
}

module.exports = Candidato;
