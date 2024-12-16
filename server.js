const express = require('express');
const cors = require('cors');
const axios = require('axios');
const md5 = require('md5');

const app = express();

// 启用CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 提供静态文件访问
app.use(express.static('public'));

// 百度翻译 API 配置
const appid = 'API';
const key = 'Key';

app.post('/translate', express.json(), async (req, res) => {
    const { sourceText, sourceLanguage, targetLanguage } = req.body;
    
    if (!sourceText || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: '缺少必要参数' });
    }

    try {
        const salt = Date.now();
        const sign = md5(appid + sourceText + salt + key);
        
        const response = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
            params: {
                q: sourceText,
                from: sourceLanguage,
                to: targetLanguage,
                appid: appid,
                salt: salt,
                sign: sign
            }
        });

        if (response.data && response.data.trans_result) {
            res.json({
                Response: {
                    TargetText: response.data.trans_result[0].dst
                }
            });
        } else {
            throw new Error('翻译失败');
        }
    } catch (error) {
        console.error('翻译错误:', error);
        res.status(500).json({
            error: '翻译失败',
            details: error.message
        });
    }
});

// 添加错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || '服务器内部错误'
    });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 
