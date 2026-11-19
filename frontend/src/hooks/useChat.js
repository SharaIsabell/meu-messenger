import { useCallback, useEffect, useRef, useState } from 'react';
import { contactApi } from '../services/contactApi';
import { messageApi } from '../services/messageApi';
import { socketService } from '../services/socketService';

export function useChat(session) {
  const { token, user } = session;
  const [contacts, setContacts] = useState([]);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [error, setError] = useState('');
  const contactsRef = useRef([]);

  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  const refreshContacts = useCallback(() => {
    contactApi.list(token).then(setContacts).catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    refreshContacts();
    socketService.connect(token);

    const stopListening = socketService.onMessage((message) => {
      const otherId = message.senderId === user.id ? message.receiverId : message.senderId;
      setMessagesByContact((prev) => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), message],
      }));
      // Mensagem de alguém que acabou de te adicionar: atualiza a lista
      if (!contactsRef.current.some((c) => c.id === otherId)) refreshContacts();
    });

    return () => {
      stopListening();
      socketService.disconnect();
    };
  }, [token, user.id, refreshContacts]);

  const loadHistory = useCallback(
    async (contactId) => {
      try {
        const history = await messageApi.history(token, contactId);
        setMessagesByContact((prev) => ({ ...prev, [contactId]: history }));
      } catch (e) {
        setError(e.message);
      }
    },
    [token]
  );

  async function addContact(username) {
    const contact = await contactApi.add(token, username);
    setContacts((prev) => [...prev, contact]);
  }

  async function sendMessage(to, content) {
    const result = await socketService.send(to, content);
    if (!result.ok) throw new Error(result.error);
  }

  return { contacts, messagesByContact, error, loadHistory, addContact, sendMessage };
}