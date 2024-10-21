import { createServer, request } from 'node:http';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

if (cluster.isPrimary) {
  spawn('npx', ['ts-node', 'src/index.ts'], {
    stdio: 'inherit',
    shell: true,
  });

  const numCPUs = availableParallelism() - 1;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ WORKER_PORT: 4001 + i });
  }

  let currentProxy = 0;
  createServer((req, res) => {
    const port = 4001 + (currentProxy % numCPUs);
    currentProxy++;

    const options = {
      hostname: 'localhost',
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = request(options, (proxyRes) => {
      let data = '';

      proxyRes.on('data', (chunk) => {
        data += chunk;
      });

      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode!, proxyRes.headers);
        res.end(data);
      });
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error communicating with forked server: ' + err.message);
    });

    req.on('data', (chunk) => {
      proxyReq.write(chunk);
    });

    req.on('end', () => {
      proxyReq.end();
    });
  }).listen(4000, () => {
    console.log('Primary server listening on port 4000 (load balancer)');
  });
} else {
  createServer((req, res) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = request(options, (proxyRes) => {
      let data = '';

      proxyRes.on('data', (chunk) => {
        data += chunk;
      });

      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode!, proxyRes.headers);
        res.end(data);
      });
    });

    proxyReq.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error communicating with DB');
    });

    req.on('data', (chunk) => {
      proxyReq.write(chunk);
    });

    req.on('end', () => {
      proxyReq.end();
    });
  }).listen(process.env.WORKER_PORT, () => {
    console.log(`Worker server listening on port ${process.env.WORKER_PORT}`);
  });
}
