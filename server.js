var express = require('express');

var app = express();

app.use('/templates', express.static('templates'))
app.use(express.static('www'))

app.get('*', function (req, res) {
    res.send('www/index.html')
})

var server = app.listen(process.env.PORT || 3000, function (){
    console.log('Server is listening on PORT: ', server.address().port);
})
