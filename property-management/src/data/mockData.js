export const properties = [
  {
    id: 'p1',
    name: 'Kilimani Court Apartments',
    location: 'Kilimani, Nairobi',
    description: 'A modern 4-storey apartment block with secure parking and a backup borehole, popular with young professionals.',
    units: 12,
    occupiedUnits: 10,
    vacantUnits: 2,
    monthlyRent: 35000,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Milimani Heights',
    location: 'Milimani, Kisumu',
    description: 'Quiet residential compound near the lakefront with three blocks of two-bedroom units.',
    units: 9,
    occupiedUnits: 7,
    vacantUnits: 2,
    monthlyRent: 22000,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Nyali Breeze Suites',
    location: 'Nyali, Mombasa',
    description: 'Furnished short- and long-stay suites five minutes from the beach, popular with contract workers.',
    units: 8,
    occupiedUnits: 5,
    vacantUnits: 3,
    monthlyRent: 48000,
    status: 'Active',
  },
  {
    id: 'p4',
    name: 'Ngong Road Villas',
    location: 'Ngong Road, Nairobi',
    description: 'Gated compound of 6 townhouses undergoing final finishing works before letting begins.',
    units: 6,
    occupiedUnits: 0,
    vacantUnits: 6,
    monthlyRent: 65000,
    status: 'Under Renovation',
  },
];

export const units = [
  { id: 'u1', propertyId: 'p1', unitNumber: 'A1', tenantId: 't1', monthlyRent: 35000, paymentStatus: 'Paid', occupancyStatus: 'Occupied' },
  { id: 'u2', propertyId: 'p1', unitNumber: 'A2', tenantId: 't2', monthlyRent: 35000, paymentStatus: 'Outstanding', occupancyStatus: 'Occupied' },
  { id: 'u3', propertyId: 'p1', unitNumber: 'A3', tenantId: null, monthlyRent: 35000, paymentStatus: '—', occupancyStatus: 'Vacant' },
  { id: 'u4', propertyId: 'p1', unitNumber: 'B1', tenantId: 't3', monthlyRent: 38000, paymentStatus: 'Paid', occupancyStatus: 'Occupied' },
  { id: 'u5', propertyId: 'p1', unitNumber: 'B2', tenantId: null, monthlyRent: 38000, paymentStatus: '—', occupancyStatus: 'Vacant' },
  { id: 'u6', propertyId: 'p2', unitNumber: '1B', tenantId: 't4', monthlyRent: 22000, paymentStatus: 'Overdue', occupancyStatus: 'Occupied' },
  { id: 'u7', propertyId: 'p2', unitNumber: '2A', tenantId: 't5', monthlyRent: 24000, paymentStatus: 'Paid', occupancyStatus: 'Occupied' },
  { id: 'u8', propertyId: 'p2', unitNumber: '2B', tenantId: null, monthlyRent: 24000, paymentStatus: '—', occupancyStatus: 'Vacant' },
  { id: 'u9', propertyId: 'p3', unitNumber: 'S1', tenantId: 't6', monthlyRent: 48000, paymentStatus: 'Partial', occupancyStatus: 'Occupied' },
  { id: 'u10', propertyId: 'p3', unitNumber: 'S2', tenantId: 't7', monthlyRent: 50000, paymentStatus: 'Paid', occupancyStatus: 'Occupied' },
];

export const tenants = [
  { id: 't1', fullName: 'Achieng Otieno', phone: '+254 712 345 678', email: 'achieng.otieno@example.co.ke', propertyId: 'p1', unitId: 'u1', monthlyRent: 35000, paymentStatus: 'Paid', leaseStart: '2024-02-01' },
  { id: 't2', fullName: 'Brian Kiprotich', phone: '+254 722 987 654', email: 'brian.kiprotich@example.co.ke', propertyId: 'p1', unitId: 'u2', monthlyRent: 35000, paymentStatus: 'Outstanding', leaseStart: '2023-11-15' },
  { id: 't3', fullName: 'Fatuma Hassan', phone: '+254 733 112 233', email: 'fatuma.hassan@example.co.ke', propertyId: 'p1', unitId: 'u4', monthlyRent: 38000, paymentStatus: 'Paid', leaseStart: '2024-06-01' },
  { id: 't4', fullName: 'Wafula Simiyu', phone: '+254 701 556 890', email: 'wafula.simiyu@example.co.ke', propertyId: 'p2', unitId: 'u6', monthlyRent: 22000, paymentStatus: 'Overdue', leaseStart: '2023-09-10' },
  { id: 't5', fullName: 'Naliaka Wanjiru', phone: '+254 719 447 210', email: 'naliaka.wanjiru@example.co.ke', propertyId: 'p2', unitId: 'u7', monthlyRent: 24000, paymentStatus: 'Paid', leaseStart: '2024-01-20' },
  { id: 't6', fullName: 'Kevin Mwangi', phone: '+254 745 668 121', email: 'kevin.mwangi@example.co.ke', propertyId: 'p3', unitId: 'u9', monthlyRent: 48000, paymentStatus: 'Partial', leaseStart: '2024-04-05' },
  { id: 't7', fullName: 'Grace Chebet', phone: '+254 708 991 034', email: 'grace.chebet@example.co.ke', propertyId: 'p3', unitId: 'u10', monthlyRent: 50000, paymentStatus: 'Paid', leaseStart: '2023-12-01' },
];

export const payments = [
  { id: 'pay1', tenantId: 't1', propertyId: 'p1', unitId: 'u1', amount: 35000, dueDate: '2026-08-01', paymentDate: '2026-08-01', method: 'M-Pesa', status: 'Paid', notes: 'Paid on time via till number.' },
  { id: 'pay2', tenantId: 't2', propertyId: 'p1', unitId: 'u2', amount: 35000, dueDate: '2026-08-01', paymentDate: null, method: null, status: 'Outstanding', notes: '' },
  { id: 'pay3', tenantId: 't3', propertyId: 'p1', unitId: 'u4', amount: 38000, dueDate: '2026-08-01', paymentDate: '2026-08-03', method: 'Bank Transfer', status: 'Paid', notes: '' },
  { id: 'pay4', tenantId: 't4', propertyId: 'p2', unitId: 'u6', amount: 22000, dueDate: '2026-07-01', paymentDate: null, method: null, status: 'Overdue', notes: 'Tenant requested a payment plan.' },
  { id: 'pay5', tenantId: 't5', propertyId: 'p2', unitId: 'u7', amount: 24000, dueDate: '2026-08-01', paymentDate: '2026-08-02', method: 'M-Pesa', status: 'Paid', notes: '' },
  { id: 'pay6', tenantId: 't6', propertyId: 'p3', unitId: 'u9', amount: 48000, dueDate: '2026-08-01', paymentDate: '2026-08-05', method: 'Cash', status: 'Partial', notes: 'Paid KSh 30,000 of 48,000.' },
  { id: 'pay7', tenantId: 't7', propertyId: 'p3', unitId: 'u10', amount: 50000, dueDate: '2026-08-01', paymentDate: '2026-08-01', method: 'M-Pesa', status: 'Paid', notes: '' },
];

export const maintenanceRequests = [
  { id: 'm1', propertyId: 'p1', unitId: 'u2', tenantId: 't2', issueTitle: 'Leaking kitchen tap', description: 'Constant drip from the kitchen tap, worsening over the week.', priority: 'Medium', dateReported: '2026-08-10', status: 'In Progress' },
  { id: 'm2', propertyId: 'p1', unitId: 'u1', tenantId: 't1', issueTitle: 'Broken window latch', description: 'Bedroom window latch is broken and cannot be locked.', priority: 'High', dateReported: '2026-08-14', status: 'Open' },
  { id: 'm3', propertyId: 'p2', unitId: 'u6', tenantId: 't4', issueTitle: 'Backup generator not starting', description: 'Compound generator fails to start during power outages.', priority: 'High', dateReported: '2026-08-12', status: 'Open' },
  { id: 'm4', propertyId: 'p3', unitId: 'u9', tenantId: 't6', issueTitle: 'AC unit noisy', description: 'Air conditioning unit makes a rattling noise on startup.', priority: 'Low', dateReported: '2026-08-05', status: 'Resolved' },
  { id: 'm5', propertyId: 'p2', unitId: 'u7', tenantId: 't5', issueTitle: 'Gate motor sticking', description: 'Main gate motor sticks halfway and needs manual push.', priority: 'Medium', dateReported: '2026-08-16', status: 'Open' },
];

// Helper lookups used across pages
export const getPropertyById = (id) => properties.find((p) => p.id === id);
export const getTenantById = (id) => tenants.find((t) => t.id === id);
export const getUnitsByPropertyId = (propertyId) => units.filter((u) => u.propertyId === propertyId);

export const currentUser = {
  fullName: 'Wanjiku Mureithi',
  email: 'wanjiku.mureithi@example.co.ke',
  phone: '+254 720 334 512',
  role: 'Property Manager',
  company: 'Mureithi Property Holdings',
};