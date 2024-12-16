// 翻译功能
document.getElementById('translateBtn').addEventListener('click', async () => {
    const sourceText = document.getElementById('sourceText').value;
    const sourceLanguage = document.getElementById('sourceLanguage').value;
    const targetLanguage = document.getElementById('targetLanguage').value;

    if (!sourceText.trim()) {
        alert('请输入要翻译的文本');
        return;
    }

    try {
        const response = await fetch(`${window.API_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sourceText,
                sourceLanguage,
                targetLanguage
            })
        });

        const data = await response.json();
        
        if (data.Response && data.Response.TargetText) {
            document.getElementById('translatedText').value = data.Response.TargetText;
        } else {
            throw new Error(data.error || '翻译失败');
        }
    } catch (error) {
        console.error('翻译错误:', error);
        alert(`翻译失败: ${error.message}`);
    }
});

// 语言切换功能
document.getElementById('switchLangBtn').addEventListener('click', () => {
    const sourceSelect = document.getElementById('sourceLanguage');
    const targetSelect = document.getElementById('targetLanguage');
    const sourceText = document.getElementById('sourceText');
    const translatedText = document.getElementById('translatedText');

    // 如果源语言是自动检测，则切换为目标语言的第一个选项
    const sourceValue = sourceSelect.value === 'auto' ? 
        sourceSelect.options[1].value : sourceSelect.value;

    // 交换语言选择
    const tempValue = sourceValue;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = tempValue;

    // 交换文本内容
    const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;

    // 如果有新的源文本，自动触发翻译
    if (sourceText.value) {
        document.getElementById('translateBtn').click();
    }
});

// 添加回车键翻译功能
document.getElementById('sourceText').addEventListener('keydown', (e) => {
    // 检查是否按下了 Ctrl+Enter 或 Command+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault(); // 阻止默认的换行行为
        document.getElementById('translateBtn').click();
    }
}); 