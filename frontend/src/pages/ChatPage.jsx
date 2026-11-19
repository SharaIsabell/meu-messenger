import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import AddContactForm from '../components/AddContactForm';
import ContactList from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage() {
  const { session, logout } = useAuth();
  const chat = useChat(session);
  const [activeId, setActiveId] = useState(null);
  const active = chat.contacts.find((c) => c.id === activeId);
  const { loadHistory } = chat;

  useEffect(() => {
    if (activeId) loadHistory(activeId);
  }, [activeId, loadHistory]);

  return (
    <div className="layout">
      <aside className={activeId ? 'sidebar hidden-mobile' : 'sidebar'}>
        <header>
          <strong>@{session.user.username}</strong>
          <button className="link" onClick={logout}>Sair</button>
        </header>
        <AddContactForm onAdd={chat.addContact} />
        {chat.error && <p className="error hint">{chat.error}</p>}
        <ContactList contacts={chat.contacts} activeId={activeId} onSelect={setActiveId} />
      </aside>

      {active ? (
        <ChatWindow
          contact={active}
          myId={session.user.id}
          messages={chat.messagesByContact[active.id] || []}
          onSend={(text) => chat.sendMessage(active.id, text)}
          onBack={() => setActiveId(null)}
        />
      ) : (
        <main className="empty">Escolha um contato para conversar</main>
      )}
    </div>
  );
}