const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port: PORT });

const MINECRAFT_SERVER = 'join.wrd.kr';
const MINECRAFT_PORT = 24986;

wss.on('connection', (ws) => {
    console.log('이글크래프트 유저가 프록시에 연결되었습니다.');

    // 마인크래프트 패브릭 서버로 TCP 소켓 연결
    const client = new net.Socket();
    client.connect(MINECRAFT_PORT, MINECRAFT_SERVER, () => {
        console.log('패브릭 서버와 통신이 연결되었습니다.');
    });

    // 이글크래프트(웹소켓) -> 마인크래프트 서버(TCP) 데이터 전달
    ws.on('message', (message) => {
        if (client.writable) {
            client.write(message);
        }
    });

    // 마인크래프트 서버(TCP) -> 이글크래프트(웹소켓) 데이터 전달
    client.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ws.on('close', () => {
        console.log('이글크래프트 유저 연결 종료');
        client.end();
    });

    client.on('close', () => {
        console.log('패브릭 서버 연결 종료');
        ws.close();
    });

    client.on('error', (err) => {
        console.error('TCP 소켓 에러:', err.message);
        ws.close();
    });

    ws.on('error', (err) => {
        console.error('웹소켓 에러:', err.message);
        client.end();
    });
});

console.log(`독립형 이글프록시 서버가 포트 ${PORT}에서 작동 중입니다.`);
