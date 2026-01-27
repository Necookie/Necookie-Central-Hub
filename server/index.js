const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Necookie API Running'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));