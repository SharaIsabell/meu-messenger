export default function ContactList({ contacts, activeId, onSelect }) {
  if (contacts.length === 0) {
    return <p className="hint">Adicione um amigo pelo nome de usuário dele.</p>;
  }

  return (
    <ul className="contacts">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <button
            className={contact.id === activeId ? 'active' : ''}
            onClick={() => onSelect(contact.id)}
          >
            @{contact.username}
          </button>
        </li>
      ))}
    </ul>
  );
}