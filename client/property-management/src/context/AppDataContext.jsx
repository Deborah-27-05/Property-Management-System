import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { propertiesApi, unitsApi, tenantsApi, paymentsApi, maintenanceApi } from '../services/api';

const AppDataContext = createContext(null);

function mapProperty(apiProperty, apiUnits) {
  const propertyUnits = apiUnits.filter((u) => u.property_id === apiProperty.id);
  const occupiedUnits = propertyUnits.filter((u) => u.status === 'occupied').length;
  const rents = propertyUnits.map((u) => u.monthly_rent).filter((r) => r != null);
  const avgRent = rents.length ? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length) : 0;

  return {
    id: apiProperty.id,
    name: apiProperty.name,
    location: apiProperty.location,
    description: apiProperty.description || '',
    units: apiProperty.number_of_units,
    occupiedUnits,
    vacantUnits: Math.max(0, apiProperty.number_of_units - occupiedUnits),
    monthlyRent: avgRent,
    status: 'Active',
  };
}

function mapUnit(apiUnit, apiTenants) {
  const tenant = apiTenants.find((t) => t.unit_id === apiUnit.id);
  return {
    id: apiUnit.id,
    propertyId: apiUnit.property_id,
    unitNumber: apiUnit.unit_number,
    tenantId: tenant ? tenant.id : null,
    monthlyRent: apiUnit.monthly_rent,
    paymentStatus: '—',
    occupancyStatus: apiUnit.status === 'occupied' ? 'Occupied' : 'Vacant',
  };
}

function mapTenant(apiTenant, apiUnits) {
  const unit = apiUnits.find((u) => u.id === apiTenant.unit_id);
  return {
    id: apiTenant.id,
    fullName: apiTenant.full_name,
    phone: apiTenant.phone,
    email: apiTenant.email,
    propertyId: unit ? unit.property_id : null,
    unitId: apiTenant.unit_id,
    monthlyRent: unit ? unit.monthly_rent : 0,
    paymentStatus: '—',
    leaseStart: apiTenant.lease_start,
  };
}

function mapPayment(apiPayment, mappedTenants) {
  const tenant = mappedTenants.find((t) => t.id === apiPayment.tenant_id);
  return {
    id: apiPayment.id,
    tenantId: apiPayment.tenant_id,
    propertyId: tenant ? tenant.propertyId : null,
    unitId: tenant ? tenant.unitId : null,
    amount: apiPayment.amount,
    dueDate: apiPayment.payment_date,
    paymentDate: apiPayment.payment_date,
    method: apiPayment.payment_method,
    status: apiPayment.status === 'paid' ? 'Paid' : 'Outstanding',
    notes: '',
  };
}

const PRIORITY_TO_API = { Low: 'low', Medium: 'medium', High: 'high' };
const PRIORITY_FROM_API = { low: 'Low', medium: 'Medium', high: 'High' };

function mapMaintenance(apiRequest, mappedUnits) {
  const unit = mappedUnits.find((u) => u.id === apiRequest.unit_id);
  return {
    id: apiRequest.id,
    propertyId: unit ? unit.propertyId : null,
    unitId: apiRequest.unit_id,
    tenantId: apiRequest.tenant_id,
    issueTitle: apiRequest.title,
    description: apiRequest.description || '',
    priority: PRIORITY_FROM_API[apiRequest.priority] || 'Medium',
    dateReported: apiRequest.created_at ? apiRequest.created_at.slice(0, 10) : '',
    status: apiRequest.status,
  };
}

export function AppDataProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshAll = useCallback(async () => {
    const [propertiesRes, unitsRes, tenantsRes, paymentsRes, maintenanceRes] = await Promise.all([
      propertiesApi.list(),
      unitsApi.list(),
      tenantsApi.list(),
      paymentsApi.list(),
      maintenanceApi.list(),
    ]);
    const apiUnits = unitsRes.units;
    const apiTenants = tenantsRes.tenants;
    const apiPayments = paymentsRes.payments;
    const apiMaintenance = maintenanceRes.maintenance_requests;

    const mappedTenants = apiTenants.map((t) => mapTenant(t, apiUnits));
    const mappedUnits = apiUnits.map((u) => mapUnit(u, apiTenants));

    setUnits(mappedUnits);
    setProperties(propertiesRes.properties.map((p) => mapProperty(p, apiUnits)));
    setTenants(mappedTenants);
    setPayments(apiPayments.map((p) => mapPayment(p, mappedTenants)));
    setMaintenanceRequests(apiMaintenance.map((m) => mapMaintenance(m, mappedUnits)));
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    refreshAll()
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [refreshAll]);

  // ---------- Properties ----------
  const addProperty = useCallback(
    async (data) => {
      await propertiesApi.create({
        name: data.name,
        location: data.location,
        description: data.description || '',
        number_of_units: Number(data.numberOfUnits),
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const updateProperty = useCallback(
    async (id, data) => {
      await propertiesApi.update(id, {
        name: data.name,
        location: data.location,
        description: data.description || '',
        number_of_units: Number(data.numberOfUnits),
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const deleteProperty = useCallback(
    async (id) => {
      await propertiesApi.remove(id);
      await refreshAll();
    },
    [refreshAll]
  );

  // ---------- Units ----------
  const updateUnit = useCallback(
    async (id, data) => {
      await unitsApi.update(id, {
        unit_number: data.unitNumber,
        monthly_rent: Number(data.monthlyRent),
        status: data.occupancyStatus === 'Occupied' ? 'occupied' : 'vacant',
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const deleteUnit = useCallback(
    async (id) => {
      await unitsApi.remove(id);
      await refreshAll();
    },
    [refreshAll]
  );

  // ---------- Tenants ----------
  const addTenant = useCallback(
    async (data) => {
      const newUnit = await unitsApi.create({
        property_id: Number(data.propertyId),
        unit_number: data.unitNumber,
        monthly_rent: Number(data.monthlyRent),
        status: 'occupied',
      });
      await tenantsApi.create({
        unit_id: newUnit.id,
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        lease_start: data.leaseStart,
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const updateTenant = useCallback(
    async (id, data) => {
      await tenantsApi.update(id, {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        lease_start: data.leaseStart,
        lease_end: data.leaseEnd,
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const deleteTenant = useCallback(
    async (id) => {
      await tenantsApi.remove(id);
      await refreshAll();
    },
    [refreshAll]
  );

  // ---------- Payments ----------
  const recordPayment = useCallback(
    async (data) => {
      await paymentsApi.create({
        tenant_id: Number(data.tenantId),
        amount: Number(data.amount),
        payment_date: data.paymentDate,
        payment_method: data.method,
        status: 'paid',
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const updatePayment = useCallback(
    async (id, data) => {
      await paymentsApi.update(id, {
        amount: Number(data.amount),
        payment_date: data.paymentDate,
        payment_method: data.method,
        status: data.status ? data.status.toLowerCase() : 'paid',
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const deletePayment = useCallback(
    async (id) => {
      await paymentsApi.remove(id);
      await refreshAll();
    },
    [refreshAll]
  );

  // ---------- Maintenance ----------
  const addMaintenanceRequest = useCallback(
    async (data) => {
      await maintenanceApi.create({
        unit_id: Number(data.unitId),
        tenant_id: data.tenantId ? Number(data.tenantId) : null,
        title: data.issueTitle,
        description: data.description || '',
        priority: PRIORITY_TO_API[data.priority] || 'medium',
        status: 'Open',
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const updateMaintenanceRequest = useCallback(
    async (id, data) => {
      await maintenanceApi.update(id, {
        title: data.issueTitle,
        description: data.description || '',
        priority: PRIORITY_TO_API[data.priority] || 'medium',
      });
      await refreshAll();
    },
    [refreshAll]
  );

  const updateMaintenanceStatus = useCallback(
    async (id, status) => {
      await maintenanceApi.update(id, { status });
      await refreshAll();
    },
    [refreshAll]
  );

  const deleteMaintenanceRequest = useCallback(
    async (id) => {
      await maintenanceApi.remove(id);
      await refreshAll();
    },
    [refreshAll]
  );

  const value = useMemo(
    () => ({
      properties,
      units,
      tenants,
      payments,
      maintenanceRequests,
      loading,
      loadError,
      addProperty,
      updateProperty,
      deleteProperty,
      updateUnit,
      deleteUnit,
      addTenant,
      updateTenant,
      deleteTenant,
      recordPayment,
      updatePayment,
      deletePayment,
      addMaintenanceRequest,
      updateMaintenanceRequest,
      updateMaintenanceStatus,
      deleteMaintenanceRequest,
    }),
    [
      properties,
      units,
      tenants,
      payments,
      maintenanceRequests,
      loading,
      loadError,
      addProperty,
      updateProperty,
      deleteProperty,
      updateUnit,
      deleteUnit,
      addTenant,
      updateTenant,
      deleteTenant,
      recordPayment,
      updatePayment,
      deletePayment,
      addMaintenanceRequest,
      updateMaintenanceRequest,
      updateMaintenanceStatus,
      deleteMaintenanceRequest,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
