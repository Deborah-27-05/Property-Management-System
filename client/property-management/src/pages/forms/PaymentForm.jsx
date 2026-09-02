import { useState, useEffect } from 'react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppDataContext';

const initialForm = { tenantId: '', amount: '', paymentDate: '', method: '', status: 'Paid', notes: '' };

export default function PaymentForm({ onDone, payment }) {
  const { tenants, recordPayment, updatePayment } = useAppData();
  const isEditing = !!payment;

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (payment) {
      setForm({
        tenantId: payment.tenantId != null ? String(payment.tenantId) : '',
        amount: payment.amount != null ? String(payment.amount) : '',
        paymentDate: payment.paymentDate || '',
        method: payment.method || '',
        status: payment.status || 'Paid',
        notes: payment.notes || '',
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!isEditing && !form.tenantId) next.tenantId = 'Select a tenant.';
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
      if (isEditing) {
        await updatePayment(payment.id, form);
      } else {
        await recordPayment(form);
        setForm(initialForm);
      }
      setSuccess(true);
      setTimeout(() => onDone?.(), 700);
    } catch (err) {
      setSubmitError(err.message || `Could not ${isEditing ? 'update' : 'record'} payment. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success ? <div className="form-banner success">Payment {isEditing ? 'updated' : 'recorded'} successfully.</div> : null}
      {submitError ? <div className="form-banner error">{submitError}</div> : null}
      {!isEditing ? (
        <FormField label="Tenant" name="tenantId" as="select" value={form.tenantId} onChange={handleChange} error={errors.tenantId}>
          <option value="">Select tenant…</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))}
        </FormField>
      ) : null}
      <div className="field-row">
        <FormField label="Amount (KSh)" name="amount" type="number" min="1" value={form.amount} onChange={handleChange} error={errors.amount} />
        <FormField label="Payment date" name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} error={errors.paymentDate} />
      </div>
      <div className="field-row">
        <FormField label="Payment method" name="method" as="select" value={form.method} onChange={handleChange} error={errors.method}>
          <option value="">Select method…</option>
          <option value="M-Pesa">M-Pesa</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="Cheque">Cheque</option>
        </FormField>
        {isEditing ? (
          <FormField label="Status" name="status" as="select" value={form.status} onChange={handleChange}>
            <option value="Paid">Paid</option>
            <option value="Outstanding">Outstanding</option>
          </FormField>
        ) : null}
      </div>
      <FormField label="Notes (optional)" name="notes" as="textarea" rows={2} value={form.notes} onChange={handleChange} />
      <Button type="submit" className="btn-block" disabled={submitting}>
        {submitting ? (isEditing ? 'Saving…' : 'Recording…') : (isEditing ? 'Save Changes' : 'Record Payment')}
      </Button>
    </form>
  );
}