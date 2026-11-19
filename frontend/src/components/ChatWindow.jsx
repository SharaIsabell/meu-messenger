import { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ contact, myId, messages, onSend, onBack }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const endRef = useRef(null);

  // Rola até a última mensagem sempre que chega uma nova
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await onSend(text);
      setText('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="chat">
      <header>
        <button className="back" onClick={onBack} aria-label="Voltar">←</button>
        <strong>@{contact.username}</strong>
      </header>

      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={m.senderId === myId ? 'bubble mine' : 'bubble'}>
            <p>{m.content}</p>
            <time>
              {new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </time>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && <p className="error hint">{error}</p>}

      <form className="composer" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem"
          maxLength={2000}
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}