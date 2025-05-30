//fron chatgpt will change later
const http = require('http');
const https = require('https');
const url = require('url');
const chalk = require('chalk');

const PORT = 8080;

function getClient(protocol) {
  return protocol === 'https:' ? https : http;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let targetUrl = parsedUrl.path.slice(1);

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'http://' + targetUrl;
  }

  console.log(
    chalk.bgBlue.white('Proxy Request'),
    chalk.yellow(req.method),
    chalk.red(targetUrl)
  );

  const targetParsed = url.parse(targetUrl);

  const options = {
    protocol: targetParsed.protocol,
    hostname: targetParsed.hostname,
    port: targetParsed.port || (targetParsed.protocol === 'https:' ? 443 : 80),
    path: targetParsed.path,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = getClient(targetParsed.protocol).request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(chalk.bgRed.white('Proxy Error:'), err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(chalk.bgMagenta.white(`Proxy server running on http://localhost:${PORT}`));
  console.log(chalk.yellow('Paste URLs after the slash, e.g., http://localhost:8080/http://example.com'));
});
