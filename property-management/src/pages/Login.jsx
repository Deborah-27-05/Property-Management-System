import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setSubmitError('');
    if (Object.keys(next).length > 0) return;

   
    login();
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">N</span> Nyumba
        </Link>
        <h1>Welcome back</h1>
        <p className="auth-sub">Login to manage your properties, tenants, and rent.</p>

        {submitError ? <div className="form-banner error">{submitError}</div> : null}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="auth-row">
            <label className="checkbox-row">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              Remember me
            </label>
            <span className="auth-hint">This demo does not send real credentials anywhere.</span>
          </div>

          <Button type="submit" className="btn-block" size="md">Login</Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--gradient-hero-bg); }
        .auth-card { width: 100%; max-width: 420px; padding: 36px 32px; }
        .auth-brand { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 600; margin-bottom: 24px; }
        .auth-brand .brand-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px; background: var(--color-brand); color: var(--color-on-brand); font-size: 13px;
        }
        .auth-card h1 { font-size: 24px; margin-bottom: 4px; }
        .auth-sub { font-size: 14px; margin-bottom: 24px; }
        .auth-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .auth-hint { font-size: 11.5px; color: var(--color-text-faint); max-width: 160px; }
        .auth-footer { text-align: center; font-size: 13.5px; margin: 20px 0 0 0; color: var(--color-text-muted); }
        .auth-footer a { color: var(--color-brand); font-weight: 600; }
      `}</style>
    </div>
  );
}
