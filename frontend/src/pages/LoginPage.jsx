import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LABELS = { login: 'Entrar', register: 'Criar conta', recover: 'Redefinir senha' };

export default function LoginPage() {
  const { login, register, recover, startSession } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    password: '',
    recoveryCode: '',
    inviteCode: '',
  });
  const [pending, setPending] = useState(null); // aguardando a pessoa guardar o código
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.username, form.password);
      if (mode === 'register') {
        setPending(await register(form.username, form.password, form.inviteCode));
      }
      if (mode === 'recover') {
        setPending(await recover(form.username, form.recoveryCode, form.password));
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (pending) {
    return (
      <div className="card">
        <h2>Guarde seu código de recuperação</h2>
        <p>
          Como o app não usa e-mail nem telefone, este código é a única forma de recuperar
          sua conta se você esquecer a senha. Anote num lugar seguro.
        </p>
        <code className="recovery">{pending.recoveryCode}</code>
        <button onClick={() => startSession(pending)}>Já guardei, continuar</button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>SH Messenger</h1>
      <input
        placeholder="Nome de usuário"
        value={form.username}
        onChange={update('username')}
        autoComplete="username"
        autoCapitalize="none"
      />
      {mode === 'recover' && (
        <input
          placeholder="Código de recuperação"
          value={form.recoveryCode}
          onChange={update('recoveryCode')}
        />
      )}
      <input
        type="password"
        placeholder={mode === 'recover' ? 'Nova senha' : 'Senha'}
        value={form.password}
        onChange={update('password')}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
      />
      {mode === 'register' && (
        <input
          placeholder="Código de convite"
          value={form.inviteCode}
          onChange={update('inviteCode')}
        />
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit">{LABELS[mode]}</button>

      <nav className="modes">
        {Object.keys(LABELS)
          .filter((m) => m !== mode)
          .map((m) => (
            <button key={m} type="button" className="link" onClick={() => setMode(m)}>
              {m === 'recover' ? 'Esqueci a senha' : LABELS[m]}
            </button>
          ))}
      </nav>
    </form>
  );
}