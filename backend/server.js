const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const candidatoRoutes = require('./Routes/CandidatoRoutes');
const vagaRoutes = require('./Routes/VagaRoutes');
const inscricaoRoutes = require('./Routes/InscricaoRoutes'); 


app.use(express.json());
app.use(cors());

app.use(candidatoRoutes);
app.use(vagaRoutes);
app.use(inscricaoRoutes); 

app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
