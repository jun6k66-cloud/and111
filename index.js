const { Proxy } = require('eaglerproxy');

const proxy = new Proxy({
    port: process.env.PORT || 10000,
    name: "My 26.2 Server Proxy",
    motd: "Welcome to my server!"
});

console.log("이글프록시가 시작되었습니다.");
