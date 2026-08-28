import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';

const initialForm = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    else if (!/^(\+254|0)[17]\d{8}$/.test(form.phone.replace(/\s+/g, ''))) {
      next.phone = 'Enter a valid Kenyan phone number, e.g. 0712 345 678.';
    }
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Mock registration only — no account is actually created on a server.
    setSuccess(true);
    setForm(initialForm);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <div className="success-icon" aria-hidden="true">✓</div>
          <h1>Account created</h1>
          <p className="auth-sub">
            Your Nyumba account has been set up. You can now log in and explore the dashboard
            with sample property data.
          </p>
          <Button className="btn-block" onClick={() => navigate('/login')}>
            Continue to Login
          </Button>
        </div>
        <style>{`
          .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--gradient-hero-bg); }
          .auth-card { width: 100%; max-width: 420px; padding: 40px 32px; text-align: center; }
          .success-icon {
            width: 52px; height: 52px; border-radius: 50%; background: var(--color-success-bg); color: var(--color-success);
            display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px auto;
          }
          .auth-card h1 { font-size: 22px; }
          .auth-sub { font-size: 14px; margin-bottom: 24px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">N</span> Nyumba
        </Link>
        <h1>Create your account</h1>
        <p className="auth-sub">Set up Nyumba to start organizing your properties.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" />
          <FormField label="Email address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
          <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} hint="e.g. 0712 345 678" autoComplete="tel" />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
          <FormField label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />

          <Button type="submit" className="btn-block">Create Account</Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--gradient-hero-bg); }
        .auth-card { width: 100%; max-width: 440px; padding: 36px 32px; }
        .auth-brand { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 600; margin-bottom: 24px; }
        .auth-brand .brand-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px; background: var(--color-brand); color: var(--color-on-brand); font-size: 13px;
        }
        .auth-card h1 { font-size: 24px; margin-bottom: 4px; }
        .auth-sub { font-size: 14px; margin-bottom: 24px; }
        .auth-footer { text-align: center; font-size: 13.5px; margin: 20px 0 0 0; color: var(--color-text-muted); }
        .auth-footer a { color: var(--color-brand); font-weight: 600; }
      `}</style>
    </div>
  );
}