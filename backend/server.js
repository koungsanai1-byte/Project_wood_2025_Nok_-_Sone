const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const { readdirSync } = require('fs');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
readdirSync('./Routes').forEach((r) => {
    console.log(r), app.use('/api', require(`./Routes/${r}`))
});

app.use('/uploads', express.static('public/uploads/'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
})  