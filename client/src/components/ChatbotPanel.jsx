import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export default function ChatbotPanel({ apiBase = '', onError = () => { } }) {
    const base = (apiBase && apiBase.trim()) || '';
    const chatUrl = `${base}/api/chat`;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        id: 'sys', role: 'system', text: 'Hi! I am your Job Portal Assistant. How can I help you today?'
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastError, setLastError] = useState(null);
    const messagesRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    function pushMessage(msg) {
        setMessages(prev => [...prev, { id: (msg.id || Date.now().toString()), ...msg }]);
    }

    async function sendMessage(e) {
        e?.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        const userMsg = { id: Date.now().toString(), role: 'user', text: userText };
        pushMessage(userMsg);
        setInput('');
        setLoading(true);
        setLastError(null);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch(chatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText }),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!res.ok) {
                let serverMsg = `HTTP ${res.status}`;
                try {
                    const body = await res.json();
                    if (body && (body.error || body.message)) {
                        const msg = body.error || body.message;
                        serverMsg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
                    } else if (typeof body === 'string') {
                        serverMsg = body;
                    }
                } catch (parseErr) {
                    try {
                        const text = await res.text();
                        if (text) serverMsg = text;
                    } catch (_) { }
                }
                const errText = `Chat service returned ${serverMsg}.`;
                pushMessage({ role: 'assistant', id: 'err-' + Date.now(), text: `Sorry — the chat service responded with an error: ${serverMsg}.` });
                setLastError(errText);
                console.error('Chat API non-OK response', { url: chatUrl, status: res.status, serverMsg });
                onError(errText);
                return;
            }

            let data;
            try { data = await res.json(); } catch (err) { const text = await res.text(); data = { reply: text }; }

            const botText = (data && (data.reply || data.answer || data.message)) || 'Sorry — I have no reply right now.';
            pushMessage({ role: 'assistant', id: 'bot-' + Date.now(), text: botText });

        } catch (err) {
            const friendly = err.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Network or server error. Please try again.';
            pushMessage({ role: 'assistant', id: 'err-' + Date.now(), text: `Sorry — ${friendly}` });
            setLastError(friendly + (err.message ? ` (${err.message})` : ''));
            console.error('Chat API fetch error', err, { url: chatUrl });
            onError(err);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-purple-200 transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-10 fade-in dark:bg-slate-900 dark:border-purple-900">
                    <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                            <span className="font-semibold">Job Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-purple-500 p-1 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-purple-50/50 space-y-4 dark:bg-slate-900">
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-purple-100 rounded-bl-none dark:bg-slate-800 dark:text-white dark:border-purple-900'
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-purple-100 shadow-sm dark:bg-slate-800 dark:border-purple-900">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesRef} />
                    </div>

                    {lastError && (
                        <div className="bg-red-50 px-4 py-2 text-xs text-red-600 border-t border-red-100">
                            {lastError}
                        </div>
                    )}

                    <form onSubmit={sendMessage} className="p-3 bg-white border-t border-purple-100 dark:bg-slate-900 dark:border-purple-900">
                        <div className="relative flex items-center">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 rounded-xl text-sm transition-all dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800 placeholder-gray-400"
                            />
                            <button
                                disabled={loading || !input.trim()}
                                type="submit"
                                className="absolute right-2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
                {isOpen ? (
                    <X size={28} className="transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                    <MessageCircle size={28} className="transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>
        </div>
    );
}
