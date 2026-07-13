const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===== 数据目录 =====
const DATA_DIR = path.join(__dirname, 'data');
const CHATS_DIR = path.join(DATA_DIR, 'chats');
const SAVE_DIR = path.join(DATA_DIR, 'save');

if (!fs.existsSync(CHATS_DIR)) fs.mkdirSync(CHATS_DIR, { recursive: true });
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

// ===== 获取聊天记录 =====
app.get('/api/chat/:hostName', (req, res) => {
    const filePath = path.join(CHATS_DIR, req.params.hostName + '.json');
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ===== 保存聊天记录 =====
app.post('/api/chat/:hostName', (req, res) => {
    const filePath = path.join(CHATS_DIR, req.params.hostName + '.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ===== 获取存档 =====
app.get('/api/save/:key', (req, res) => {
    const filePath = path.join(SAVE_DIR, req.params.key + '.json');
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.json(JSON.parse(data));
        } else {
            res.json(null);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ===== 保存存档 =====
app.post('/api/save/:key', (req, res) => {
    const filePath = path.join(SAVE_DIR, req.params.key + '.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ 后端服务已启动: http://localhost:${PORT}`);
    console.log(`📁 数据目录: ${DATA_DIR}`);
});
