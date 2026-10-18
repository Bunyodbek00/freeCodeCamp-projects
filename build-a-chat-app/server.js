import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
    let filePath = './public/index.html';
    let contentType = 'text/html';

    if (req.url === '/script.js') {
        filePath = './public/script.js';
        contentType = 'application/javascript';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const wss = new WebSocketServer({ server });

// Feature 4: Store recent message history (max 50 messages)
let messageHistory = [];

// Helper to broadcast current online users list (Feature 2)
function broadcastUserList() {
    const users = [];
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.username) {
            users.push(client.username);
        }
    });
    const userListMsg = JSON.stringify({ type: 'users', users });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(userListMsg);
        }
    });
}

wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username") || "Anonymous";
    socket.username = username;

    // Feature 4: Send existing message history to the newly connected client
    socket.send(JSON.stringify({ type: 'history', history: messageHistory }));

    // Feature 2: Update online user list for everyone
    broadcastUserList();

    // Feature 1: Add timestamp to join message
    const joinMessage = {
        type: "system",
        text: `${username} joined`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    messageHistory.push(joinMessage);
    if (messageHistory.length > 50) messageHistory.shift();

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(joinMessage));
        }
    });

    socket.on("message", (data) => {
        try {
            const parsed = JSON.parse(data);

            // Feature 3: Handle typing indicator events
            if (parsed.type === 'typing') {
                const typingMsg = JSON.stringify({ 
                    type: 'typing', 
                    username: socket.username, 
                    isTyping: parsed.isTyping 
                });
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client !== socket) {
                        client.send(typingMsg);
                    }
                });
                return;
            }

            // Regular chat message (Feature 1: Timestamp added)
            const chatMessage = {
                type: "chat",
                username: socket.username,
                text: parsed.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            messageHistory.push(chatMessage);
            if (messageHistory.length > 50) messageHistory.shift();

            const chatMsgString = JSON.stringify(chatMessage);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(chatMsgString);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });

    socket.on("close", () => {
        const leaveMessage = {
            type: 'system',
            text: `${username} left`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        messageHistory.push(leaveMessage);
        if (messageHistory.length > 50) messageHistory.shift();

        const leaveMsgString = JSON.stringify(leaveMessage);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(leaveMsgString);
            }
        });

        broadcastUserList();
    });
});

server.listen(PORT, () => {
    console.log("Chat server running at http://localhost:3001");
});