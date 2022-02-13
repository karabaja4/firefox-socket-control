#!/usr/bin/env node

const fs = require('fs');
const net = require('net');
const path = require('path');
const os = require('os');

const sock = path.join(os.tmpdir(), 'firefox.sock');

const send = (action, url) => {
  const msg = JSON.stringify({
    action: action || null,
    url: url || null
  });
  const header = Buffer.alloc(4);
  header.writeUInt32LE(msg.length, 0);
  process.stdout.write(header);
  process.stdout.write(msg);
}

const parse = (input) => {
  const args = input.split('|');
  const action = args[0];
  const urls = args.slice(1);
  if (urls.length === 0) {
    send(action, null);
  } else {
    for (let i = 0; i < urls.length; i++) {
      send(action, urls[i]);
    }
  }
}

const main = () => {
  fs.unlink(sock, () => {
    const server = net.createServer((socket) => {
      socket.on('data', (data) => {
        if (data) {
          parse(data.toString());
        }
      });
    });
    process.stdin.on('readable', () => {
      server.close(() => {
        process.exit(0);
      });
    });
    server.listen(sock);
  });
}

main();
