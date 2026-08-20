import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  properties as initialProperties,
  units as initialUnits,
  tenants as initialTenants,
  payments as initialPayments,
  maintenanceRequests as initialMaintenance,
} from '../data/mockData';

const AppDataContext = createContext(null);

let idCounter = 1000;
const nextId = (prefix) => `${prefix}${idCounter++}`;

// Centralized in-memory "database" for the demo. In the future full-stack
// version, these arrays and the functions below would be replaced with
// calls to a Flask REST API backed by PostgreSQL.
export function AppDataProvider({ children }) {
  const [properties, setProperties] = useState(initialProperties);
  const [units, setUnits] = useState(initialUnits);
  const [tenants, setTenants] = useState(initialTenants);
  const [payments, setPayments] = useState(initialPayments);
  const [maintenanceRequests, setMaintenanceRequests] = useState(initialMaintenance);

  const addProperty = useCallback((data) => {
    const id = nextId('p');
    const newProperty = {
      id,
      name: data.name,
      location: data.location,
      description: data.description || '',
      units: Number(data.numberOfUnits),
      occupiedUnits: 0,
      vacantUnits: Number(data.numberOfUnits),
      monthlyRent: Number(data.monthlyRent),
      status: 'Active',
    };
    setProperties((prev) => [newProperty, ...prev]);
    return newProperty;
  }, []);

  const addTenant = useCallback((data) => {
    const tenantId = nextId('t');
    const unitId = nextId('u');
    const newTenant = {
      id: tenantId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      propertyId: data.propertyId,
      unitId,
      monthlyRent: Number(data.monthlyRent),
      paymentStatus: 'Outstanding',
      leaseStart: data.leaseStart,
    };
    const newUnit = {
      id: unitId,
      propertyId: data.propertyId,
      unitNumber: data.unitNumber,
      tenantId,
      monthlyRent: Number(data.monthlyRent),
      paymentStatus: 'Outstanding',
      occupancyStatus: 'Occupied',
    };
    setTenants((prev) => [newTenant, ...prev]);
    setUnits((prev) => [newUnit, ...prev]);
    setProperties((prev) =>
      prev.map((p) =>
        p.id === data.propertyId
          ? { ...p, occupiedUnits: p.occupiedUnits + 1, vacantUnits: Math.max(0, p.vacantUnits - 1) }
          : p
      )
    );
    return newTenant;
  }, []);

  const recordPayment = useCallback((data) => {
    const tenant = tenants.find((t) => t.id === data.tenantId);
    const newPayment = {
      id: nextId('pay'),
      tenantId: data.tenantId,
      propertyId: tenant?.propertyId,
      unitId: tenant?.unitId,
      amount: Number(data.amount),
      dueDate: data.paymentDate,
      paymentDate: data.paymentDate,
      method: data.method,
      status: 'Paid',
      notes: data.notes || '',
    };
    setPayments((prev) => [newPayment, ...prev]);
    setTenants((prev) =>
      prev.map((t) => (t.id === data.tenantId ? { ...t, paymentStatus: 'Paid' } : t))
    );
    setUnits((prev) =>
      prev.map((u) => (u.id === tenant?.unitId ? { ...u, paymentStatus: 'Paid' } : u))
    );
    return newPayment;
  }, [tenants]);

  const addMaintenanceRequest = useCallback((data) => {
    const newRequest = {
      id: nextId('m'),
      propertyId: data.propertyId,
      unitId: data.unitId,
      tenantId: data.tenantId || null,
      issueTitle: data.issueTitle,
      description: data.description || '',
      priority: data.priority,
      dateReported: data.dateReported,
      status: 'Open',
    };
    setMaintenanceRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  }, []);

  const updateMaintenanceStatus = useCallback((id, status) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }, []);

  const value = useMemo(
    () => ({
      properties,
      units,
      tenants,
      payments,
      maintenanceRequests,
      addProperty,
      addTenant,
      recordPayment,
      addMaintenanceRequest,
      updateMaintenanceStatus,
    }),
    [properties, units, tenants, payments, maintenanceRequests, addProperty, addTenant, recordPayment, addMaintenanceRequest, updateMaintenanceStatus]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}