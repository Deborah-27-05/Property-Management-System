import { useState } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = {
  fullName: '', phone: '', email: '', propertyId: '', unitNumber: '', monthlyRent: '', leaseStart: '',
};

export default function TenantForm({ onDone, defaultPropertyId }) {
  const { properties, addTenant } = useAppData();
  const [form, setForm] = useState({ ...initialForm, propertyId: defaultPropertyId || '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    else if (!/^(\+254|0)[17]\d{8}$/.test(form.phone.replace(/\s+/g, ''))) {
      next.phone = 'Enter a valid Kenyan phone number, e.g. 0712 345 678.';
    }
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.propertyId) next.propertyId = 'Select a property.';
    if (!form.unitNumber.trim()) next.unitNumber = 'Unit number is required.';
    if (!form.monthlyRent || Number(form.monthlyRent) <= 0) next.monthlyRent = 'Enter a monthly rent greater than 0.';
    if (!form.leaseStart) next.leaseStart = 'Lease start date is required.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addTenant(form);
    setSuccess(true);
    setForm({ ...initialForm, propertyId: defaultPropertyId || '' });
    setTimeout(() => onDone?.(), 700);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Tenant added successfully.</div> : null}
      <FormField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
      <div className="field-row">
        <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="0712 345 678" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      </div>
      <div className="field-row">
        <FormField label="Property" name="propertyId" as="select" value={form.propertyId} onChange={handleChange} error={errors.propertyId}>
          <option value="">Select property…</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </FormField>
        <FormField label="Unit number" name="unitNumber" value={form.unitNumber} onChange={handleChange} error={errors.unitNumber} placeholder="e.g. C3" />
      </div>
      <div className="field-row">
        <FormField label="Monthly rent (KSh)" name="monthlyRent" type="number" min="1" value={form.monthlyRent} onChange={handleChange} error={errors.monthlyRent} />
        <FormField label="Lease start date" name="leaseStart" type="date" value={form.leaseStart} onChange={handleChange} error={errors.leaseStart} />
      </div>
      <Button type="submit" className="btn-block">Add Tenant</Button>
    </form>
  );
}
