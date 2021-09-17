export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
    const app = express();

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
        res.setHeader('Access-Control-Allow-Headers','x-test');
        res.setHeader('Content-Type', 'application/json');
        next();
        });

    app.use(bodyParser.urlencoded({extended : false}));
    app.use(express.json())
    app.use(bodyParser.text());
    app.get('/login/', (req, res) => {
        res.send('neveraskedfor');
    });

    app.get('/code/', (req, res) => {
        //res.send(import.meta.url.substring(8));
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        createReadStream('./app.js').pipe(res);
    })

    app.get('/sha1/:input', (req, res) => {
        var shasum = crypto.createHash('sha1');
        shasum.update(req.params.input);
        res.send(shasum.digest('hex'));
    })

    app.get('/req/', (req, res) => {

        http.get(req.query.addr, (get) => {
            let data = '';

            get.on('data', (chunk) => {
              data += chunk;
            });
          
            get.on('end', () => {
                res.send(data);
            });
          
          }).on("error", (err) => {
            res.send(data);
          });

    })

    app.post('/req/', (req, res) => {
        http.get(req.body.replace('addr=', ''), (get) => {
            let data = '';

            get.on('data', (chunk) => {
              data += chunk;
            });
          
            get.on('end', () => {
                res.send(data);
            });
          
          }).on("error", (err) => {
            res.send(data);
          });
    })

    app.all('*', (req, res) => {
        res.send('neveraskedfor');
    })

    return app;
}