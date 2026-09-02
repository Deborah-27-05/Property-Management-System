import { useState, useMemo, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = { propertyId: '', unitId: '', issueTitle: '', description: '', priority: 'Medium', dateReported: '' };

export default function MaintenanceForm({ onDone, defaultPropertyId, request }) {
  const { properties, units, addMaintenanceRequest, updateMaintenanceRequest } = useAppData();
  const isEditing = !!request;

  const [form, setForm] = useState({ ...initialForm, propertyId: defaultPropertyId ? String(defaultPropertyId) : '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (request) {
      setForm({
        propertyId: request.propertyId != null ? String(request.propertyId) : '',
        unitId: request.unitId != null ? String(request.unitId) : '',
        issueTitle: request.issueTitle || '',
        description: request.description || '',
        priority: request.priority || 'Medium',
        dateReported: request.dateReported || '',
      });
    }
  }, [request]);

  const unitOptions = useMemo(
    () => units.filter((u) => String(u.propertyId) === form.propertyId),
    [units, form.propertyId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'propertyId' && !isEditing ? { unitId: '' } : {}) }));
  };

  const validate = () => {
    const next = {};
    if (!isEditing) {
      if (!form.propertyId) next.propertyId = 'Select a property.';
      if (!form.unitId) next.unitId = 'Select a unit.';
    }
    if (!form.issueTitle.trim()) next.issueTitle = 'Issue title is required.';
    if (!isEditing && !form.dateReported) next.dateReported = 'Date reported is required.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateMaintenanceRequest(request.id, form);
      } else {
        const unit = units.find((u) => String(u.id) === form.unitId);
        await addMaintenanceRequest({ ...form, tenantId: unit?.tenantId || null });
        setForm({ ...initialForm, propertyId: defaultPropertyId ? String(defaultPropertyId) : '' });
      }
      setSuccess(true);
      setTimeout(() => onDone?.(), 700);
    } catch (err) {
      setSubmitError(err.message || `Could not ${isEditing ? 'update' : 'create'} maintenance request. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Maintenance request {isEditing ? 'updated' : 'created'}.</div> : null}
      {submitError ? <div className="form-banner error">{submitError}</div> : null}
      {!isEditing ? (
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
      ) : null}
      <FormField label="Issue title" name="issueTitle" value={form.issueTitle} onChange={handleChange} error={errors.issueTitle} placeholder="e.g. Leaking kitchen tap" />
      <FormField label="Description" name="description" as="textarea" rows={3} value={form.description} onChange={handleChange} />
      <div className="field-row">
        <FormField label="Priority" name="priority" as="select" value={form.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </FormField>
        {!isEditing ? (
          <FormField label="Date reported" name="dateReported" type="date" value={form.dateReported} onChange={handleChange} error={errors.dateReported} />
        ) : null}
      </div>
      <Button type="submit" className="btn-block" disabled={submitting}>
        {submitting ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save Changes' : 'Create Request')}
      </Button>
    </form>
  );
}