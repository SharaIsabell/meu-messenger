import { useState } from 'react';

export default function AddContactForm({ onAdd }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await onAdd(username.trim().toLowerCase());
      setUsername('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="add-contact">
        <input
          placeholder="Adicionar pelo nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">+</button>
      </div>
      {error && <p className="error hint">{error}</p>}
    </form>
  );
}