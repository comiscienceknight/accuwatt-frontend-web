/* eslint no-console: 0 */
import 'ignore-styles';
import path from 'path';
import {Server} from 'http';
import Express from 'express';
import assets from 'express-hash-webpack';
import proxy from 'proxy-middleware';
import url from 'url';
import compression from 'compression';

const app = new Express();
const server = new Server(app);

app.locals.env = process.env;
app.use(compression());

let buildPath, assetTemplate;
if (process.env.NODE_ENV === 'production') {
	buildPath = path.join(__dirname + '/build/');
	assetTemplate = '[path][name][hash][ext]';
	app.use('/build', Express.static(buildPath));
} else {
	buildPath = 'http://127.0.0.1:9000/build/';
	assetTemplate = '[path][name][ext]';
	app.use('/build', proxy(url.parse(buildPath)));
}
const fontsPath = path.join(__dirname + '/fonts/');
app.use('/fonts', Express.static(fontsPath));

const port = 8888;

// use ejs templates
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './'));

app.use(assets({
	hashPath: buildPath,
	hashFileName: 'hash.txt',
	hashTemplate: '-[value]',
	assetTemplate: function () { // example of dynamic path
		return assetTemplate;
	},
	cache: true
}));

app.get('*', (req, res) => {
	let markup = '';
	let status = 200;
	return res.status(status).render('index', {markup});
});

server.listen(port, () => {
	console.log('listening on *: ' + port);
});

