import { useState } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = { name: '', location: '', numberOfUnits: '', monthlyRent: '', description: '' };

export default function PropertyForm({ onDone }) {
  const { addProperty } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Property name is required.';
    if (!form.location.trim()) next.location = 'Location is required.';
    if (!form.numberOfUnits || Number(form.numberOfUnits) <= 0) next.numberOfUnits = 'Enter a number of units greater than 0.';
    if (!form.monthlyRent || Number(form.monthlyRent) <= 0) next.monthlyRent = 'Enter a monthly rent greater than 0.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addProperty(form);
    setSuccess(true);
    setForm(initialForm);
    setTimeout(() => onDone?.(), 700);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Property added successfully.</div> : null}
      <FormField label="Property name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
      <FormField label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="e.g. Kilimani, Nairobi" />
      <div className="field-row">
        <FormField label="Number of units" name="numberOfUnits" type="number" min="1" value={form.numberOfUnits} onChange={handleChange} error={errors.numberOfUnits} />
        <FormField label="Monthly expected rent (KSh)" name="monthlyRent" type="number" min="1" value={form.monthlyRent} onChange={handleChange} error={errors.monthlyRent} />
      </div>
      <FormField label="Description" name="description" as="textarea" rows={3} value={form.description} onChange={handleChange} />
      <Button type="submit" className="btn-block">Add Property</Button>
    </form>
  );
}
