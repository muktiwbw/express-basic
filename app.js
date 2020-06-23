const express = require('express')

const app = express();

app.get('/', (req, res) => {
    res.status(200)
        .json({
            app: 'Natours',
            version: '1.0.0',
            data: {
                code: 200,
                message: 'You just hit the root route!'
            }
        });
});

app.post('/', (req, res) => {
    res.status(200)
        .json({
            app: 'Natours',
            version: '1.0.0',
            data: {
                code: 200,
                message: 'This is a post route with the same url!'
            }
        })
})

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});