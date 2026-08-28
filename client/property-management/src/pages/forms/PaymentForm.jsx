import { useState } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = { tenantId: '', amount: '', paymentDate: '', method: '', notes: '' };

export default function PaymentForm({ onDone }) {
  const { tenants, recordPayment } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.tenantId) next.tenantId = 'Select a tenant.';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter an amount greater than 0.';
    if (!form.paymentDate) next.paymentDate = 'Payment date is required.';
    if (!form.method) next.method = 'Select a payment method.';
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
      await recordPayment(form);
      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => onDone?.(), 700);
    } catch (err) {
      setSubmitError(err.message || 'Could not record payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Payment recorded successfully.</div> : null}
      {submitError ? <div className="form-banner error">{submitError}</div> : null}
      <FormField label="Tenant" name="tenantId" as="select" value={form.tenantId} onChange={handleChange} error={errors.tenantId}>
        <option value="">Select tenant…</option>
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>{t.fullName}</option>
        ))}
      </FormField>
      <div className="field-row">
        <FormField label="Amount (KSh)" name="amount" type="number" min="1" value={form.amount} onChange={handleChange} error={errors.amount} />
        <FormField label="Payment date" name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} error={errors.paymentDate} />
      </div>
      <FormField label="Payment method" name="method" as="select" value={form.method} onChange={handleChange} error={errors.method}>
        <option value="">Select method…</option>
        <option value="M-Pesa">M-Pesa</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Cash">Cash</option>
        <option value="Cheque">Cheque</option>
      </FormField>
      <FormField label="Notes (optional)" name="notes" as="textarea" rows={2} value={form.notes} onChange={handleChange} />
      <Button type="submit" className="btn-block" disabled={submitting}>
        {submitting ? 'Recording…' : 'Record Payment'}
      </Button>
    </form>
  );
}
