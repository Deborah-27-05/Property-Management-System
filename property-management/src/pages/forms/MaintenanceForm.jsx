import { useState, useMemo } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = { propertyId: '', unitId: '', issueTitle: '', description: '', priority: 'Medium', dateReported: '' };

export default function MaintenanceForm({ onDone, defaultPropertyId }) {
  const { properties, units, addMaintenanceRequest } = useAppData();
  const [form, setForm] = useState({ ...initialForm, propertyId: defaultPropertyId || '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const unitOptions = useMemo(
    () => units.filter((u) => u.propertyId === form.propertyId),
    [units, form.propertyId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'propertyId' ? { unitId: '' } : {}) }));
  };

  const validate = () => {
    const next = {};
    if (!form.propertyId) next.propertyId = 'Select a property.';
    if (!form.unitId) next.unitId = 'Select a unit.';
    if (!form.issueTitle.trim()) next.issueTitle = 'Issue title is required.';
    if (!form.dateReported) next.dateReported = 'Date reported is required.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const unit = units.find((u) => u.id === form.unitId);
    addMaintenanceRequest({ ...form, tenantId: unit?.tenantId || null });
    setSuccess(true);
    setForm({ ...initialForm, propertyId: defaultPropertyId || '' });
    setTimeout(() => onDone?.(), 700);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Maintenance request created.</div> : null}
      <div className="field-row">
        <FormField label="Property" name="propertyId" as="select" value={form.propertyId} onChange={handleChange} error={errors.propertyId}>
          <option value="">Select property…</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </FormField>
        <FormField label="Unit" name="unitId" as="select" value={form.unitId} onChange={handleChange} error={errors.unitId} disabled={!form.propertyId}>
          <option value="">{form.propertyId ? 'Select unit…' : 'Choose a property first'}</option>
          {unitOptions.map((u) => (
            <option key={u.id} value={u.id}>{u.unitNumber}</option>
          ))}
        </FormField>
      </div>
      <FormField label="Issue title" name="issueTitle" value={form.issueTitle} onChange={handleChange} error={errors.issueTitle} placeholder="e.g. Leaking kitchen tap" />
      <FormField label="Description" name="description" as="textarea" rows={3} value={form.description} onChange={handleChange} />
      <div className="field-row">
        <FormField label="Priority" name="priority" as="select" value={form.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </FormField>
        <FormField label="Date reported" name="dateReported" type="date" value={form.dateReported} onChange={handleChange} error={errors.dateReported} />
      </div>
      <Button type="submit" className="btn-block">Create Request</Button>
    </form>
  );
}
