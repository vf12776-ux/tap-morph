#!/bin/bash
echo "=== ПРОВЕРКА ПРОЕКТА ==="
echo

echo "1. Основные файлы:"
for f in index.html style.css app.js manifest.json service-worker.js; do
    if [ -f "$f" ] && [ -s "$f" ]; then
        lines=$(wc -l < "$f" 2>/dev/null || echo "?")
        echo "✅ $f ($lines строк)"
    else
        echo "❌ $f: ПРОБЛЕМА"
    fi
done
echo

echo "2. Иконки:"
if [ -f "icons/icon-192.png" ]; then
    size=$(wc -c < "icons/icon-192.png")
    if [ $size -gt 100 ]; then
        echo "✅ icon-192.png ($size байт)"
    else
        echo "⚠️  icon-192.png МАЛЕНЬКИЙ ($size байт)"
    fi
else
    echo "❌ icon-192.png НЕ НАЙДЕН"
fi

if [ -f "icons/icon-512.png" ]; then
    size=$(wc -c < "icons/icon-512.png")
    echo "✅ icon-512.png ($size байт)"
else
    echo "⚠️  icon-512.png НЕ НАЙДЕН"
fi
echo

echo "3. Service Worker:"
if grep -q "install" service-worker.js 2>/dev/null; then
    echo "✅ Событие install найдено"
else
    echo "❌ Service Worker пустой или неправильный"
fi
echo

echo "4. Запуск сервера:"
echo "Выполните: python3 -m http.server 8000"
echo "И откройте: http://localhost:8000"
