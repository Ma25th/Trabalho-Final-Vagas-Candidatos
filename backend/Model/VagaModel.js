const db = require('./database'); 

class Vaga {
    
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM vaga');
            return rows;
        } catch (error) {
            console.error('Erro em getAll:', error);
            throw error;
        }
    }

        static async findByCargo(cargo) {
        try {
            const [rows] = await db.query('SELECT * FROM vaga WHERE vaga_cargo LIKE ?', [`%${cargo}%`]);
            return rows;
        } catch (error) {
            console.error('Erro em findByCargo:', error);
            throw error;
        }
    }

    
    static async getByCodigo(codigo) {
        try {
            const [rows] = await db.query('SELECT * FROM vaga WHERE pk_vaga_codigo = ?', [codigo]);
            return rows[0];
        } catch (error) {
            console.error('Erro em getByCodigo:', error);
            throw error;
        }
    }

    
    static async create(data) {
        try {
            const { vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade } = data;
            const [result] = await db.query(
                'INSERT INTO vaga (vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade) VALUES (?, ?, ?, ?)',
                [vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro em create:', error);
            throw error;
        }
    }

    
    static async update(codigo, data) {
        try {
            const { vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade } = data;
            const [result] = await db.query(
                'UPDATE vaga SET vaga_cargo = ?, vaga_salario = ?, vaga_cidade = ?, vaga_quantidade = ? WHERE pk_vaga_codigo = ?',
                [vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade, codigo]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Erro em update:', error);
            throw error;
        }
    }

    
    static async delete(codigo) {
        try {
            const [result] = await db.query('DELETE FROM vaga WHERE pk_vaga_codigo = ?', [codigo]);
            return result.affectedRows;
        } catch (error) {
            console.error('Erro em delete:', error);
            throw error;
        }
    }

    
    static async decrementQuantidade(codigo) {
        try {
            const [result] = await db.query(
                'UPDATE vaga SET vaga_quantidade = vaga_quantidade - 1 WHERE pk_vaga_codigo = ? AND vaga_quantidade > 0',
                [codigo]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Erro em decrementQuantidade:', error);
            throw error;
        }
    }

    
    static async incrementQuantidade(codigo) {
        try {
            const [result] = await db.query(
                'UPDATE vaga SET vaga_quantidade = vaga_quantidade + 1 WHERE pk_vaga_codigo = ?',
                [codigo]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Erro em incrementQuantidade:', error);
            throw error;
        }
    }
}

module.exports = Vaga;
