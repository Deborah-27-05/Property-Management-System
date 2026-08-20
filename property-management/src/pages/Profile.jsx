import { useState } from 'react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    setSaved(true);
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p className="profile-sub">Manage the details attached to your Nyumba account.</p>

      <div className="card card-pad profile-card">
        <div className="profile-avatar-row">
          <div className="profile-avatar">{form.fullName.charAt(0)}</div>
          <div>
            <strong>{form.fullName}</strong>
            <span>{form.role}</span>
          </div>
        </div>

        <hr className="divider" />

        {saved ? <div className="form-banner success">Profile updated (demo only — not saved to a server).</div> : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <FormField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} />
            <FormField label="Role" name="role" value={form.role} onChange={handleChange} />
          </div>
          <div className="field-row">
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </div>
          <FormField label="Company" name="company" value={form.company} onChange={handleChange} />
          <Button type="submit">Save Changes</Button>
        </form>
      </div>

      <style>{`
        .profile-page h1 { font-size: 24px; margin-bottom: 4px; }
        .profile-sub { margin: 0 0 22px 0; font-size: 14px; }
        .profile-card { max-width: 620px; }
        .profile-avatar-row { display: flex; align-items: center; gap: 14px; }
        .profile-avatar {
          width: 52px; height: 52px; border-radius: 50%; background: var(--color-brand-tint); color: var(--color-brand);
          display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; flex: none;
        }
        .profile-avatar-row strong { display: block; font-size: 16px; }
        .profile-avatar-row span { display: block; font-size: 13px; color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}