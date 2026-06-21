/* ============================================================
   StayOS Demo — data.js
   Loads seed data (inline fallback for file:// + GitHub Pages)
   ============================================================ */

const SEED_DATA = {"agency":{"id":"agency_001","name":"Sunrise Property Group","slug":"sunrise-property-group","status":"active","contactName":"Amanda Botha","contactEmail":"amanda@sunrisegroup.co.za","contactPhone":"+27 21 555 0100","registrationNumber":"2019/456789/07","staffCount":8,"managedProperties":2,"settings":{"commissionEnabled":true,"commissionPercent":8}},"properties":[{"id":"tenant_001","name":"Sunrise Boutique Hotel","slug":"sunrise-boutique-hotel","type":"hotel","status":"active","starRating":4,"address":{"street":"45 Kloof Street","suburb":"Gardens","city":"Cape Town","province":"WC","postalCode":"8001"},"contactEmail":"info@sunriseboutiquehotel.co.za","contactPhone":"+27 21 423 4567","currency":"ZAR","vatRate":15,"vatNumber":"4681234567","policies":{"checkInTime":"14:00","checkOutTime":"11:00","cancellationPolicy":"Free cancellation up to 48 hours before check-in."},"ratings":{"overall":4.3,"cleanliness":4.5,"service":4.2,"value":4.0,"location":4.8,"totalReviews":127},"planId":"plan_002"},{"id":"tenant_002","name":"Sunrise Student Village","slug":"sunrise-student-village","type":"student_housing","status":"active","address":{"street":"12 Rondebosch Main Road","suburb":"Rondebosch","city":"Cape Town","province":"WC","postalCode":"7700"},"contactEmail":"info@sunrisevillage.co.za","contactPhone":"+27 21 689 1234","currency":"ZAR","vatRate":15,"vatNumber":"4681234568","universityModuleEnabled":true,"planId":"plan_003"}],"rooms":[{"id":"room_001","tenantId":"tenant_001","roomNumber":"101","name":"Garden Single","type":"single","floor":"1","capacity":1,"baseRate":950,"status":"available","amenities":["wifi","ac","tv","safe"]},{"id":"room_002","tenantId":"tenant_001","roomNumber":"102","name":"Garden Double","type":"double","floor":"1","capacity":2,"baseRate":1450,"status":"occupied","amenities":["wifi","ac","tv","safe","minibar"]},{"id":"room_003","tenantId":"tenant_001","roomNumber":"103","name":"Garden Double","type":"double","floor":"1","capacity":2,"baseRate":1450,"status":"dirty","amenities":["wifi","ac","tv","safe"]},{"id":"room_004","tenantId":"tenant_001","roomNumber":"201","name":"City Twin","type":"twin","floor":"2","capacity":2,"baseRate":1350,"status":"available","amenities":["wifi","ac","tv","safe","bathtub"]},{"id":"room_005","tenantId":"tenant_001","roomNumber":"202","name":"Mountain Suite","type":"suite","floor":"2","capacity":2,"baseRate":2800,"status":"occupied","amenities":["wifi","ac","tv","safe","minibar","kitchenette","lounge"]},{"id":"room_006","tenantId":"tenant_001","roomNumber":"203","name":"City Double","type":"double","floor":"2","capacity":2,"baseRate":1450,"status":"inspection","amenities":["wifi","ac","tv","safe"]},{"id":"room_007","tenantId":"tenant_001","roomNumber":"301","name":"Penthouse Triple","type":"triple","floor":"3","capacity":3,"baseRate":1800,"status":"maintenance","amenities":["wifi","ac","tv","safe","minibar"]},{"id":"room_008","tenantId":"tenant_001","roomNumber":"302","name":"Table Mountain Double","type":"double","floor":"3","capacity":2,"baseRate":1600,"status":"available","amenities":["wifi","ac","tv","safe","minibar","balcony"]},{"id":"room_009","tenantId":"tenant_001","roomNumber":"303","name":"Penthouse Suite","type":"suite","floor":"3","capacity":2,"baseRate":3400,"status":"occupied","amenities":["wifi","ac","tv","safe","minibar","kitchenette","lounge","balcony"]},{"id":"room_010","tenantId":"tenant_001","roomNumber":"304","name":"Rooftop Single","type":"single","floor":"3","capacity":1,"baseRate":1100,"status":"blocked","amenities":["wifi","ac","tv","safe"]}],"bookings":[{"id":"booking_001","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00001","customerId":"customer_001","guestName":"Thabo Nkosi","roomId":"room_002","roomNumber":"102","checkIn":"2026-06-19","checkOut":"2026-06-22","nights":3,"adults":2,"children":0,"ratePerNight":1450,"subTotal":4350,"taxAmount":652.5,"totalAmount":5002.5,"status":"checked_in","source":"direct","depositPaid":true,"depositAmount":1450,"balanceDue":3552.5,"folioId":"folio_001","specialRequests":"Early check-in if possible. King bed preferred."},{"id":"booking_002","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00002","customerId":"customer_002","guestName":"Sarah van der Merwe","roomId":"room_005","roomNumber":"202","checkIn":"2026-06-18","checkOut":"2026-06-21","nights":3,"adults":2,"children":0,"ratePerNight":2800,"subTotal":8400,"taxAmount":1260,"totalAmount":9660,"status":"checked_in","source":"ota_booking","depositPaid":true,"depositAmount":2800,"balanceDue":6860,"folioId":"folio_002"},{"id":"booking_003","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00003","customerId":"customer_003","guestName":"Priya Pillay","roomId":"room_009","roomNumber":"303","checkIn":"2026-06-20","checkOut":"2026-06-25","nights":5,"adults":2,"children":0,"ratePerNight":3400,"subTotal":17000,"taxAmount":2550,"totalAmount":19550,"status":"confirmed","source":"direct","depositPaid":true,"depositAmount":3400,"balanceDue":16150},{"id":"booking_004","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00004","customerId":"customer_004","guestName":"James Morrison","roomId":"room_004","roomNumber":"201","checkIn":"2026-06-21","checkOut":"2026-06-23","nights":2,"adults":2,"children":0,"ratePerNight":1350,"subTotal":2700,"taxAmount":405,"totalAmount":3105,"status":"confirmed","source":"corporate","depositPaid":false,"balanceDue":3105},{"id":"booking_005","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00005","customerId":"customer_001","guestName":"Lindiwe Dube","roomId":"room_001","roomNumber":"101","checkIn":"2026-06-15","checkOut":"2026-06-19","nights":4,"adults":1,"children":0,"ratePerNight":950,"subTotal":3800,"taxAmount":570,"totalAmount":4370,"status":"checked_out","source":"direct","depositPaid":true,"balanceDue":0},{"id":"booking_006","tenantId":"tenant_001","confirmationNumber":"SOS-2026-00006","customerId":"customer_002","guestName":"Nomvula Sithole","roomId":"room_008","roomNumber":"302","checkIn":"2026-06-22","checkOut":"2026-06-24","nights":2,"adults":1,"children":0,"ratePerNight":1600,"subTotal":3200,"taxAmount":480,"totalAmount":3680,"status":"confirmed","source":"direct","depositPaid":false,"balanceDue":3680}],"housekeepingTasks":[{"id":"hk_001","roomNumber":"103","type":"checkout_clean","status":"in_progress","assignedTo":"Nomsa Khumalo","scheduledDate":"2026-06-20","priority":"high","checklist":[{"item":"Strip and change linen","completed":true},{"item":"Clean bathroom","completed":true},{"item":"Vacuum floors","completed":false},{"item":"Wipe surfaces","completed":false},{"item":"Restock amenities","completed":false}]},{"id":"hk_002","roomNumber":"203","type":"inspection","status":"pending","assignedTo":"Zanele Mokoena","scheduledDate":"2026-06-20","priority":"normal","checklist":[{"item":"Inspect linen quality","completed":false},{"item":"Check bathroom fixtures","completed":false},{"item":"Verify minibar stock","completed":false}]},{"id":"hk_003","roomNumber":"102","type":"stayover_clean","status":"pending","assignedTo":"Nomsa Khumalo","scheduledDate":"2026-06-20","priority":"normal","checklist":[{"item":"Make bed","completed":false},{"item":"Clean bathroom","completed":false},{"item":"Empty bins","completed":false},{"item":"Replenish towels","completed":false}]},{"id":"hk_004","roomNumber":"202","type":"stayover_clean","status":"completed","assignedTo":"Zanele Mokoena","scheduledDate":"2026-06-20","priority":"normal","completedAt":"2026-06-20T09:45:00"},{"id":"hk_005","roomNumber":"303","type":"turndown","status":"pending","assignedTo":"Nomsa Khumalo","scheduledDate":"2026-06-20","priority":"high","checklist":[{"item":"Turn down bed","completed":false},{"item":"Place chocolates","completed":false},{"item":"Draw curtains","completed":false}]}],"maintenanceOrders":[{"id":"mx_001","roomNumber":"301","title":"Air conditioning unit failure \u2014 no cooling","category":"hvac","priority":"critical","status":"in_progress","assignedTo":"Sipho Ndlovu","slaTarget":"2026-06-20T10:00:00","slaBreach":false,"partsCost":0,"labourHours":1.5,"createdAt":"2026-06-20T07:30:00"},{"id":"mx_002","roomNumber":"Common Area","title":"Pool pump bearing \u2014 unusual noise","category":"pool","priority":"high","status":"submitted","assignedTo":null,"slaTarget":"2026-06-20T14:00:00","slaBreach":false,"createdAt":"2026-06-20T08:15:00"},{"id":"mx_003","roomNumber":"102","title":"Bathroom tap dripping \u2014 hot water side","category":"plumbing","priority":"normal","status":"assigned","assignedTo":"Sipho Ndlovu","slaTarget":"2026-06-21T07:30:00","slaBreach":false,"createdAt":"2026-06-19T14:00:00"}],"staff":[{"id":"staff_001","tenantId":"tenant_001","firstName":"Amanda","lastName":"Botha","role":"property_owner","email":"amanda@sunriseboutique.co.za","isActive":true,"lastLoginAt":"2026-06-20T06:45:00"},{"id":"staff_002","tenantId":"tenant_001","firstName":"Ruan","lastName":"Grobler","role":"front_desk_manager","email":"ruan@sunriseboutique.co.za","isActive":true,"lastLoginAt":"2026-06-20T07:00:00"},{"id":"staff_003","tenantId":"tenant_001","firstName":"Nomsa","lastName":"Khumalo","role":"housekeeper_supervisor","email":"nomsa@sunriseboutique.co.za","isActive":true,"lastLoginAt":"2026-06-20T07:15:00"},{"id":"staff_004","tenantId":"tenant_001","firstName":"Sipho","lastName":"Ndlovu","role":"maintenance_technician","email":"sipho@sunriseboutique.co.za","isActive":true,"lastLoginAt":"2026-06-20T07:00:00"},{"id":"staff_005","tenantId":"tenant_001","firstName":"Zanele","lastName":"Mokoena","role":"housekeeper","email":"zanele@sunriseboutique.co.za","isActive":true,"lastLoginAt":"2026-06-20T07:20:00"}],"customers":[{"id":"customer_001","firstName":"Thabo","lastName":"Nkosi","email":"thabo.nkosi@email.co.za","phone":"+27 82 345 6789","nationality":"South African","isVerified":true,"marketingOptIn":true,"studentType":null,"isBlacklisted":false,"communicationPrefs":{"email":true,"sms":true,"whatsapp":true,"push":false}},{"id":"customer_002","firstName":"Sarah","lastName":"van der Merwe","email":"sarah.vdmerwe@email.com","phone":"+27 71 987 6543","nationality":"South African","isVerified":true,"marketingOptIn":false,"studentType":null,"isBlacklisted":false},{"id":"customer_003","firstName":"Priya","lastName":"Pillay","email":"priya.pillay@email.co.za","phone":"+27 83 654 3210","nationality":"South African","isVerified":true,"marketingOptIn":true,"studentType":null,"isBlacklisted":false},{"id":"customer_004","firstName":"Amahle","lastName":"Dlamini","email":"amahle.d@uct.ac.za","phone":"+27 63 456 7890","nationality":"South African","isVerified":true,"marketingOptIn":true,"studentType":"nsfas_funded","isBlacklisted":false}],"loyaltyAccount":{"customerId":"customer_001","pointsBalance":2340,"lifetimePoints":4890,"tier":"silver","tierUpdatedAt":"2026-03-15","lastActivityAt":"2026-06-19","expiresAt":"2027-06-19","tierThresholds":{"silver":1000,"gold":5000,"platinum":15000}},"loyaltyTransactions":[{"id":"lt_001","type":"earn","source":"booking","points":500,"balanceAfter":2340,"description":"Stay \u2014 SOS-2026-00001","createdAt":"2026-06-19T14:32:00"},{"id":"lt_002","type":"earn","source":"booking","points":450,"balanceAfter":1840,"description":"Stay \u2014 SOS-2026-00005","createdAt":"2026-06-15T11:00:00"},{"id":"lt_003","type":"burn","source":"redemption","points":-200,"balanceAfter":1390,"description":"Redeemed \u2014 room upgrade","createdAt":"2026-05-10T09:15:00"},{"id":"lt_004","type":"earn","source":"review","points":100,"balanceAfter":1590,"description":"Review submitted","createdAt":"2026-05-08T16:22:00"},{"id":"lt_005","type":"earn","source":"referral_bonus","points":300,"balanceAfter":1490,"description":"Referral bonus \u2014 friend registered","createdAt":"2026-04-20T10:00:00"},{"id":"lt_006","type":"earn","source":"booking","points":890,"balanceAfter":1190,"description":"Stay \u2014 SOS-2026-00003","createdAt":"2026-03-12T15:00:00"}],"subscriptionPlans":[{"id":"plan_001","name":"Starter","tier":"starter","monthlyPrice":299,"annualPrice":2990,"roomLimit":10,"propertyStaffLimit":3,"features":["bookings","housekeeping","basic_reports","email_notifications","customer_portal"],"description":"For small guesthouses and B&Bs getting started."},{"id":"plan_002","name":"Growth","tier":"growth","monthlyPrice":799,"annualPrice":7990,"roomLimit":30,"propertyStaffLimit":8,"features":["bookings","housekeeping","maintenance","reports","promotions","loyalty","reviews","sms_notifications","folio_management","rate_plans"],"description":"For growing hotels and guesthouses."},{"id":"plan_003","name":"Pro","tier":"pro","monthlyPrice":1499,"annualPrice":14990,"roomLimit":null,"propertyStaffLimit":null,"features":["bookings","housekeeping","maintenance","reports","promotions","loyalty","reviews","university_module","api_access","webhooks","whatsapp_notifications","corporate_accounts","group_bookings","revenue_management"],"description":"For large hotels, student housing, and multi-property portfolios."}],"agencyMetrics":{"currentMonth":"June 2026","totalRevenue":458920,"revenueGrowth":12.4,"averageOccupancy":71.3,"occupancyChange":3.2,"totalBookings":347,"bookingsGrowth":8.7,"totalProperties":2,"totalStaff":8,"totalGuests":289,"revenueByMonth":[{"month":"Jan","value":312400},{"month":"Feb","value":334200},{"month":"Mar","value":389100},{"month":"Apr","value":356800},{"month":"May","value":412300},{"month":"Jun","value":458920}],"propertiesMetrics":[{"propertyId":"tenant_001","name":"Sunrise Boutique Hotel","type":"hotel","occupancy":75.2,"revenue":289450,"bookings":218,"revPar":1265,"avgStay":2.8,"occupancyChange":4.1},{"propertyId":"tenant_002","name":"Sunrise Student Village","type":"student_housing","occupancy":67.4,"revenue":169470,"bookings":129,"revPar":890,"avgStay":180,"occupancyChange":2.3}]},"studentData":{"customerId":"customer_004","institutionName":"University of Cape Town","studentNumber":"DLAMAM001","faculty":"Commerce","course":"BCom Finance","yearOfStudy":2,"fundingType":"nsfas","nsfasReference":"NSFAS-2026-789012","allocationId":"alloc_001","tenantName":"Sunrise Student Village","allocatedRoom":"Room 4B","academicYear":"2026","lease":{"leaseNumber":"LSE-2026-00004","status":"active","startDate":"2026-02-01","endDate":"2026-11-30","monthlyRent":4500,"deposit":4500,"signedByStudent":true,"studentSignedAt":"2026-01-28"},"financialAccount":{"paymentType":"nsfas","totalCharged":27000,"totalPaidByBursary":27000,"outstandingBalance":0},"invoices":[{"invoiceNumber":"INV-2026-0001","semester":"2026-S1","totalAmount":27000,"paidAmount":27000,"outstanding":0,"status":"paid","dueDate":"2026-02-15","funderType":"nsfas","periodFrom":"2026-02-01","periodTo":"2026-06-30"},{"invoiceNumber":"INV-2026-0002","semester":"2026-S2","totalAmount":27000,"paidAmount":0,"outstanding":27000,"status":"issued","dueDate":"2026-07-31","funderType":"nsfas","periodFrom":"2026-07-01","periodTo":"2026-11-30"}]},"recentActivity":[{"time":"08:47","type":"checkin","message":"Thabo Nkosi checked in to Room 102","actor":"Ruan Grobler"},{"time":"08:32","type":"maintenance","message":"Work order MX-001 updated \u2014 HVAC Room 301 in progress","actor":"Sipho Ndlovu"},{"time":"08:15","type":"housekeeping","message":"Room 202 stayover clean completed","actor":"Zanele Mokoena"},{"time":"07:58","type":"booking","message":"New booking SOS-2026-00006 \u2014 Nomvula Sithole, 22\u201324 Jun","actor":"System"},{"time":"07:30","type":"maintenance","message":"Work order MX-001 raised \u2014 HVAC failure Room 301","actor":"Sipho Ndlovu"}]};

let _data = null;

async function loadData() {
  if (_data) return _data;
  try {
    // Try fetch first (works on live servers)
    const res = await fetch('./data/seed.json');
    if (res.ok) {
      _data = await res.json();
      return _data;
    }
  } catch(e) {
    // fall through to inline data (file:// protocol)
  }
  _data = SEED_DATA;
  return _data;
}


function fmt(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-ZA').format(n);
}

function fmtZAR(n, decimals = 0) {
  if (n == null) return '—';
  return 'R\u202F' + new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateShort(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function fmtTime(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function todayStr() {
  return '2026-06-20'; // Demo fixed date
}

function todayDisplay() {
  return 'Saturday, 20 June 2026';
}

function statusLabel(s) {
  const map = {
    available: 'Available', occupied: 'Occupied', dirty: 'Dirty',
    maintenance: 'Maintenance', inspection: 'Inspection', blocked: 'Blocked',
    cleaning: 'Cleaning', checked_in: 'Checked In', checked_out: 'Checked Out',
    confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled',
    completed: 'Completed', in_progress: 'In Progress', submitted: 'Submitted',
    assigned: 'Assigned', critical: 'Critical', high: 'High', normal: 'Normal'
  };
  return map[s] || s?.replace(/_/g, ' ');
}

function roleLabel(r) {
  const map = {
    property_owner: 'Property Owner', front_desk_manager: 'Front Desk Manager',
    receptionist: 'Receptionist', revenue_manager: 'Revenue Manager',
    housekeeper_supervisor: 'HK Supervisor', housekeeper: 'Housekeeper',
    maintenance_supervisor: 'Maintenance Supervisor', maintenance_technician: 'Technician',
    property_accountant: 'Accountant', property_admin: 'Admin',
    agency_owner: 'Agency Owner', agency_manager: 'Agency Manager',
    agency_analyst: 'Analyst', super_admin: 'Super Admin'
  };
  return map[r] || r?.replace(/_/g, ' ');
}

function initials(firstName, lastName) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
}

function makeBadge(status, text) {
  const label = text || statusLabel(status);
  return `<span class="badge badge-${status}"><span class="badge-dot"></span>${label}</span>`;
}

function makeIcon(name) {
  const icons = {
    dashboard: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/><rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/></svg>`,
    bed: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4"/><path d="M1 10h14v3H1z"/><path d="M4 9V7h3v2"/><path d="M9 9V7h3v2"/></svg>`,
    calendar: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 2v2M11 2v2M2 7h12"/></svg>`,
    housekeeping: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13V5l5-3 5 3v8"/><path d="M6 13v-3h4v3"/><path d="M2 13h12"/></svg>`,
    wrench: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2.5a3 3 0 0 1-3 4.5L2 11.5a1.5 1.5 0 0 0 2 2l4.5-4.5a3 3 0 0 1 4.5-3l-2 2 1 1 2-2a3 3 0 0 1-.5 4"/></svg>`,
    chart: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13h12"/><path d="M5 13V7"/><path d="M9 13V4"/><path d="M13 13V9"/></svg>`,
    users: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2.5"/><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5"/><circle cx="12" cy="5" r="1.5"/><path d="M11 14h4c0-2.2-1.3-4-3-4.5"/></svg>`,
    bell: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2a4 4 0 0 1 4 4v3l1.5 2.5h-11L4 9V6a4 4 0 0 1 4-4z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>`,
    star: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l1.8 3.6L14 6.4l-3 2.9.7 4.1L8 11.5l-3.7 1.9.7-4.1-3-2.9 4.2-.8L8 2z"/></svg>`,
    tag: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2H14v5L8 13 3 8l6-6z"/><circle cx="12" cy="4.5" r="0.75" fill="currentColor" stroke="none"/></svg>`,
    building: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M6 6h1M9 6h1M6 9h1M9 9h1M6 12h4"/></svg>`,
    invoice: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="10" height="12" rx="1"/><path d="M6 5h4M6 8h4M6 11h2"/></svg>`,
    key: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="3"/><path d="M8.5 9.5L14 14M11 12l1.5 1.5"/></svg>`,
    person: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>`,
    settings: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/></svg>`,
    plus: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`,
    search: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>`,
    logout: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/><path d="M11 5l3 3-3 3M7 8h7"/></svg>`,
    chevron: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`,
    up: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12V4M4 8l4-4 4 4"/></svg>`,
    down: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4v8M12 8l-4 4-4-4"/></svg>`,
    alert: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L1.5 13h13L8 2z"/><path d="M8 7v3M8 11.5v.5"/></svg>`,
    check: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 6-6"/></svg>`,
    portfolio: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    loyalty: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z"/></svg>`,
    home: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7L8 2l6 5"/><path d="M4 7v7h8V7"/><path d="M6 14v-4h4v4"/></svg>`
  };
  return icons[name] || '';
}

window.StayOS = { loadData, fmt, fmtZAR, fmtDate, fmtDateShort, fmtTime, todayStr, todayDisplay, statusLabel, roleLabel, initials, makeBadge, makeIcon };
