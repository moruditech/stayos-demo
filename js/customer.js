/* ============================================================
   StayOS Customer Portal — customer.js
   ============================================================ */

let D = null;
let customerType = 'guest'; // 'guest' | 'student'
let currentTab = 'stays';

const { fmt, fmtZAR, fmtDate, fmtDateShort, statusLabel, initials, makeBadge, loadData } = window.StayOS;

async function init() {
  D = await loadData();
  updateCustomerDisplay();
  renderTab('stays');
}

function getCustomer() {
  return customerType === 'student'
    ? D.customers.find(c => c.id === 'customer_004')
    : D.customers.find(c => c.id === 'customer_001');
}

function updateCustomerDisplay() {
  const c = getCustomer();
  const name = `${c.firstName} ${c.lastName}`;
  const init = c.firstName[0] + c.lastName[0];

  document.getElementById('navAvatar').textContent = init;
  document.getElementById('navName').textContent = c.firstName;
  document.getElementById('profileAvatarXL').textContent = init;
  document.getElementById('profileDisplayName').textContent = name;
  document.getElementById('profileEmail').textContent = c.email;

  // Student tab visibility
  const studentTab = document.getElementById('tabStudent');
  if (customerType === 'student') {
    studentTab.style.display = 'flex';
  } else {
    studentTab.style.display = 'none';
  }

  // Profile meta
  const meta = document.getElementById('profileMeta');
  if (customerType === 'guest') {
    const la = D.loyaltyAccount;
    meta.innerHTML = `
      <div class="profile-meta-item">
        <div class="profile-meta-val">${fmt(la.pointsBalance)}</div>
        <div class="profile-meta-label">Loyalty Points</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-val">${la.tier.charAt(0).toUpperCase() + la.tier.slice(1)}</div>
        <div class="profile-meta-label">Tier</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-val">${D.bookings.filter(b=>b.customerId==='customer_001').length}</div>
        <div class="profile-meta-label">Total Stays</div>
      </div>`;
  } else {
    const sd = D.studentData;
    meta.innerHTML = `
      <div class="profile-meta-item">
        <div class="profile-meta-val">${sd.studentNumber}</div>
        <div class="profile-meta-label">Student No.</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-val">${sd.allocatedRoom}</div>
        <div class="profile-meta-label">Room</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-val">${sd.fundingType.toUpperCase()}</div>
        <div class="profile-meta-label">Funding</div>
      </div>`;
  }
}

function switchCustomerType(type) {
  customerType = type;
  updateCustomerDisplay();
  // If on student tab and switching to guest, go back to stays
  if (type === 'guest' && currentTab === 'student') {
    switchTab('stays');
  } else {
    renderTab(currentTab);
  }
  custToast(`Viewing as ${type === 'student' ? 'Student — Amahle Dlamini' : 'Guest — Thabo Nkosi'}`, 'info');
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.customer-nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  renderTab(tab);
}

function renderTab(tab) {
  const el = document.getElementById('customerMain');
  el.innerHTML = '';
  switch(tab) {
    case 'stays':   renderStays(el);   break;
    case 'loyalty': renderLoyalty(el); break;
    case 'student': renderStudent(el); break;
    case 'profile': renderProfile(el); break;
  }
}

/* ── My Stays ── */
function renderStays(el) {
  const myBookings = customerType === 'guest'
    ? D.bookings.filter(b => b.customerId === 'customer_001')
    : D.bookings.filter(b => false); // Students don't have hotel bookings

  const upcoming = myBookings.filter(b => ['confirmed','checked_in'].includes(b.status));
  const past     = myBookings.filter(b => ['checked_out','completed'].includes(b.status));

  if (customerType === 'student') {
    el.innerHTML = `
    <div class="student-banner" style="margin-bottom:var(--sp-6);">
      <div class="student-banner-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 9v4M10 7.5v.5"/></svg></div>
      <div>
        <div class="student-banner-title">Student Accommodation</div>
        <div class="student-banner-text">As a student resident at Sunrise Student Village, your stay is managed through your Room Allocation and Lease. View details in the Student tab.</div>
      </div>
    </div>
    <div style="text-align:center;padding:var(--sp-12);color:var(--light-text-2);">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3" style="margin:0 auto var(--sp-4);"><path d="M2 30V18a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v12"/><path d="M1 30h42v9H1z"/></svg>
      <div style="font-weight:600;margin-bottom:var(--sp-2);">No short stays on this account</div>
      <div style="font-size:0.875rem;">Switch to Guest view to see booking history, or use the Student tab for your accommodation details.</div>
    </div>`;
    return;
  }

  el.innerHTML = `
  ${upcoming.length > 0 ? `
  <div style="margin-bottom:var(--sp-6);">
    <div class="section-block-header" style="margin-bottom:var(--sp-4);">
      <div class="section-block-title">Current & Upcoming</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:var(--sp-4);" id="upcomingList">
    ${upcoming.map(b => renderBookingCard(b, true)).join('')}
    </div>
  </div>` : ''}

  <div>
    <div class="section-block-header" style="margin-bottom:var(--sp-4);">
      <div class="section-block-title">Stay History</div>
      <span class="t-caption c-muted">${myBookings.length} total stays</span>
    </div>
    ${past.length > 0 ? `
    <div style="display:flex;flex-direction:column;gap:var(--sp-4);" id="pastList">
      ${past.map(b => renderBookingCard(b, false)).join('')}
    </div>` : `<div style="text-align:center;padding:var(--sp-8);color:var(--light-text-2);font-size:0.875rem;">No past stays found.</div>`}
  </div>`;
}

function renderBookingCard(b, upcoming) {
  const property = D.properties.find(p => p.id === b.tenantId);
  const propName = property?.name || 'Sunrise Boutique Hotel';
  const checkInDate  = new Date(b.checkIn);
  const checkOutDate = new Date(b.checkOut);
  const checkinFmt   = checkInDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  const checkoutFmt  = checkOutDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  const yearFmt      = checkInDate.getFullYear();

  return `
  <div class="booking-card" onclick="custToast('Booking ${b.confirmationNumber} — details opened','info')">
    <div class="booking-card-header">
      <div>
        <div class="booking-card-ref">${b.confirmationNumber}</div>
        <div class="booking-card-name">${propName}</div>
      </div>
      ${makeBadge(b.status)}
    </div>
    <div class="booking-card-body">
      <div class="booking-card-dates">
        <div class="booking-date-col">
          <div class="booking-date-label">Check-in</div>
          <div class="booking-date-val">${checkinFmt}</div>
          <div class="booking-date-sub">${yearFmt}</div>
        </div>
        <div class="booking-date-arrow">→</div>
        <div class="booking-date-col">
          <div class="booking-date-label">Check-out</div>
          <div class="booking-date-val">${checkoutFmt}</div>
          <div class="booking-date-sub">${b.nights} night${b.nights > 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="booking-card-meta">
        <div class="booking-meta-item">
          <div class="booking-meta-label">Room</div>
          <div class="booking-meta-val booking-meta-mono">Rm ${b.roomNumber}</div>
        </div>
        <div class="booking-meta-item">
          <div class="booking-meta-label">Guests</div>
          <div class="booking-meta-val">${b.adults} adult${b.adults > 1 ? 's' : ''}</div>
        </div>
        <div class="booking-meta-item">
          <div class="booking-meta-label">Total</div>
          <div class="booking-meta-val booking-meta-mono">${fmtZAR(b.totalAmount, 2)}</div>
        </div>
        <div class="booking-meta-item">
          <div class="booking-meta-label">Balance</div>
          <div class="booking-meta-val booking-meta-mono" style="color:${b.balanceDue > 0 ? 'var(--s-maintenance)' : 'var(--s-available)'};">${fmtZAR(b.balanceDue)}</div>
        </div>
      </div>
    </div>
    <div class="booking-card-footer">
      <span class="t-caption c-muted">${b.source === 'direct' ? 'Direct booking' : b.source === 'ota_booking' ? 'Via Booking.com' : b.source}</span>
      <div style="display:flex;gap:var(--sp-2);">
        ${b.status === 'checked_out' ? `<button class="btn btn-sm btn-outline" onclick="event.stopPropagation();switchTab('loyalty');custToast('Review submitted — 100 loyalty points earned!','success')">Write Review</button>` : ''}
        ${b.balanceDue > 0 ? `<button class="btn btn-sm btn-accent" onclick="event.stopPropagation();custToast('Payment gateway loading...','info')">Pay ${fmtZAR(b.balanceDue)}</button>` : ''}
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation();custToast('Booking PDF downloading...','info')">Receipt</button>
      </div>
    </div>
  </div>`;
}

/* ── Loyalty ── */
function renderLoyalty(el) {
  const la = D.loyaltyAccount;
  const pctToGold = Math.round((la.pointsBalance / la.tierThresholds.gold) * 100);
  const toGold = la.tierThresholds.gold - la.pointsBalance;

  el.innerHTML = `
  <!-- Loyalty Hero Card -->
  <div class="loyalty-hero" style="margin-bottom:var(--sp-6);">
    <div>
      <div class="loyalty-tier-label">Loyalty Programme</div>
      <div class="loyalty-tier-pill">● ${la.tier.toUpperCase()}</div>
      <div class="loyalty-tier-name"><span>${la.tier.charAt(0).toUpperCase() + la.tier.slice(1)}</span> Member</div>
      <div class="loyalty-progress-label">${fmt(toGold)} points to Gold tier</div>
      <div class="loyalty-progress-bar">
        <div class="loyalty-progress-fill" id="loyaltyBar" style="width:0%;"></div>
      </div>
      <div class="loyalty-progress-note">${fmt(la.pointsBalance)} / ${fmt(la.tierThresholds.gold)} points · Expires ${la.expiresAt}</div>
    </div>
    <div class="loyalty-balance-display">
      <div class="loyalty-points-number" id="loyaltyPts">0</div>
      <div class="loyalty-points-label">available points</div>
    </div>
  </div>

  <div class="two-col">
    <!-- Tier Benefits -->
    <div class="surface-raised" style="padding:var(--sp-5);margin-bottom:var(--sp-4);">
      <div style="font-size:0.9375rem;font-weight:700;margin-bottom:var(--sp-4);letter-spacing:-0.01em;">Your Silver Benefits</div>
      ${[
        ['5% discount on all direct bookings', true],
        ['Priority check-in', true],
        ['Free room upgrade (subject to availability)', true],
        ['2× points on weekday stays', true],
        ['Late checkout until 13:00', false],
        ['Complimentary breakfast (Gold)', false],
        ['Dedicated concierge (Platinum)', false],
      ].map(([text, active]) => `
      <div style="display:flex;align-items:center;gap:var(--sp-3);padding:var(--sp-2) 0;border-bottom:1px solid var(--light-border);">
        <div style="width:16px;height:16px;border-radius:50%;background:${active ? 'var(--s-available-bg)' : 'var(--light-border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${active ? '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="var(--s-available)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 6-6"/></svg>' : ''}
        </div>
        <div style="font-size:0.875rem;color:${active ? 'var(--light-text)' : 'var(--light-text-3)'};">${text}</div>
      </div>`).join('')}
      <button class="btn btn-accent btn-sm" style="margin-top:var(--sp-4);width:100%;justify-content:center;" onclick="custToast('${fmt(toGold)} points needed to reach Gold','info')">Reach Gold — ${fmt(toGold)} pts to go</button>
    </div>

    <!-- Redeem & Earn -->
    <div>
      <div class="data-table-wrap" style="margin-bottom:var(--sp-4);">
        <div class="data-table-header"><div class="data-table-title">Redeem Points</div></div>
        ${[
          { desc: '100 pts → R25 discount on next stay', pts: 100, label:'Use 100 pts' },
          { desc: '500 pts → Free room upgrade', pts: 500, label:'Use 500 pts' },
          { desc: '1,000 pts → 1 free night (standard room)', pts: 1000, label:'Use 1,000 pts' },
        ].map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--sp-3) var(--sp-5);border-bottom:1px solid var(--light-border);">
          <div>
            <div style="font-size:0.875rem;font-weight:500;">${r.desc}</div>
            <div style="font-size:0.75rem;color:var(--light-text-2);">Balance after: ${fmt(la.pointsBalance - r.pts)} pts</div>
          </div>
          <button class="btn btn-sm ${la.pointsBalance >= r.pts ? 'btn-outline' : 'btn-ghost'}" onclick="custToast('${la.pointsBalance >= r.pts ? `Redeemed ${r.pts} points — voucher sent to your email` : 'Insufficient points'}','${la.pointsBalance >= r.pts ? 'success' : 'error'}')">${r.label}</button>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Transaction History -->
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Points History</div>
      <div style="font-family:var(--f-mono);font-size:0.8125rem;color:var(--light-text-2);">Lifetime: ${fmt(la.lifetimePoints)} pts</div>
    </div>
    ${D.loyaltyTransactions.map(tx => `
    <div class="points-tx">
      <div class="points-tx-dot ${tx.type === 'earn' ? 'points-earn' : 'points-burn'}"></div>
      <div style="flex:1;">
        <div style="font-size:0.875rem;font-weight:500;color:var(--light-text);">${tx.description}</div>
        <div style="font-size:0.75rem;color:var(--light-text-2);">${new Date(tx.createdAt).toLocaleDateString('en-ZA', {day:'numeric',month:'short',year:'numeric'})}</div>
      </div>
      <div class="points-tx-amount ${tx.type === 'earn' ? 'points-earn-txt' : 'points-burn-txt'}">${tx.type === 'earn' ? '+' : ''}${fmt(tx.points)} pts</div>
      <div style="font-family:var(--f-mono);font-size:0.75rem;color:var(--light-text-3);min-width:70px;text-align:right;">${fmt(tx.balanceAfter)} bal</div>
    </div>`).join('')}
  </div>`;

  // Animate counter and bar
  setTimeout(() => {
    const barEl = document.getElementById('loyaltyBar');
    if (barEl) barEl.style.width = `${Math.min(pctToGold, 100)}%`;
    const ptsEl = document.getElementById('loyaltyPts');
    if (ptsEl) {
      let current = 0;
      const target = la.pointsBalance;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        ptsEl.textContent = fmt(Math.round(current));
        if (current >= target) clearInterval(timer);
      }, 25);
    }
  }, 100);
}

/* ── Student ── */
function renderStudent(el) {
  const sd = D.studentData;
  const inv = sd.invoices;
  const lease = sd.lease;

  el.innerHTML = `
  <div class="student-banner" style="margin-bottom:var(--sp-6);">
    <div class="student-banner-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10L10 6l8 4-8 4-8-4z"/><path d="M5 11.5v4l5 2.5 5-2.5v-4"/><path d="M18 10v5"/></svg></div>
    <div>
      <div class="student-banner-title">${sd.institutionName} — ${sd.course}</div>
      <div class="student-banner-text">Year ${sd.yearOfStudy} · Student No. ${sd.studentNumber} · NSFAS Ref: ${sd.nsfasReference}</div>
    </div>
  </div>

  <div class="two-col" style="margin-bottom:var(--sp-6);">
    <!-- Accommodation Details -->
    <div class="surface-raised" style="padding:var(--sp-5);">
      <div style="font-size:0.9375rem;font-weight:700;margin-bottom:var(--sp-4);letter-spacing:-0.01em;">Accommodation</div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Property</span>
        <span class="detail-value" style="font-size:0.875rem;font-weight:500;">${sd.tenantName}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Room</span>
        <span class="detail-value" style="font-size:0.875rem;font-weight:500;font-family:var(--f-mono);">${sd.allocatedRoom}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Lease</span>
        <span class="detail-value" style="font-size:0.875rem;font-weight:500;font-family:var(--f-mono);">${lease.leaseNumber}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Period</span>
        <span class="detail-value" style="font-size:0.875rem;font-weight:500;">${fmtDate(lease.startDate)} – ${fmtDate(lease.endDate)}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Monthly Rent</span>
        <span class="detail-value" style="font-size:0.875rem;font-weight:500;font-family:var(--f-mono);">${fmtZAR(lease.monthlyRent)}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);display:flex;justify-content:space-between;">
        <span class="detail-label" style="font-size:0.8125rem;color:var(--light-text-2);">Status</span>
        <span>${makeBadge('available','Active')}</span>
      </div>
      <div style="margin-top:var(--sp-4);display:flex;gap:var(--sp-2);">
        <button class="btn btn-sm btn-outline" onclick="custToast('Lease document downloading...','info')">Download Lease</button>
        ${!lease.signedByStudent ? `<button class="btn btn-sm btn-accent" onclick="custToast('Digital signing initiated','info')">Sign Lease</button>` : `<span class="badge badge-available" style="align-self:center;"><span class="badge-dot"></span>Signed ${new Date(lease.studentSignedAt).toLocaleDateString('en-ZA',{day:'numeric',month:'short'})}</span>`}
      </div>
    </div>

    <!-- Financial Account -->
    <div class="surface-raised" style="padding:var(--sp-5);">
      <div style="font-size:0.9375rem;font-weight:700;margin-bottom:var(--sp-4);letter-spacing:-0.01em;">Financial Account</div>
      <div style="margin-bottom:var(--sp-4);">
        <div class="kpi-label" style="margin-bottom:var(--sp-2);">Outstanding Balance</div>
        <div style="font-family:var(--f-mono);font-size:2rem;font-weight:600;color:${sd.financialAccount.outstandingBalance > 0 ? 'var(--s-maintenance)' : 'var(--s-available)'};letter-spacing:-0.03em;">${fmtZAR(sd.financialAccount.outstandingBalance)}</div>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span style="font-size:0.8125rem;color:var(--light-text-2);">Total Charged</span>
        <span style="font-family:var(--f-mono);font-size:0.875rem;">${fmtZAR(sd.financialAccount.totalCharged)}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);border-bottom:1px solid var(--light-border);display:flex;justify-content:space-between;">
        <span style="font-size:0.8125rem;color:var(--light-text-2);">Paid by NSFAS</span>
        <span style="font-family:var(--f-mono);font-size:0.875rem;color:var(--s-available);">${fmtZAR(sd.financialAccount.totalPaidByBursary)}</span>
      </div>
      <div class="detail-row" style="padding-block:var(--sp-3);display:flex;justify-content:space-between;">
        <span style="font-size:0.8125rem;color:var(--light-text-2);">Funding Type</span>
        <span class="badge badge-inspection"><span class="badge-dot"></span>NSFAS</span>
      </div>
    </div>
  </div>

  <!-- Invoices -->
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Invoices</div>
    </div>
    ${inv.map(inv => `
    <div class="invoice-row" onclick="custToast('Invoice ${inv.invoiceNumber} downloading...','info')">
      <div class="invoice-icon">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="10" height="12" rx="1"/><path d="M6 5h4M6 8h4M6 11h2"/></svg>
      </div>
      <div style="flex:1;">
        <div style="font-size:0.875rem;font-weight:600;font-family:var(--f-mono);">${inv.invoiceNumber}</div>
        <div style="font-size:0.8125rem;color:var(--light-text-2);">${inv.semester} · Due ${fmtDate(inv.dueDate)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:var(--f-mono);font-size:0.9375rem;font-weight:600;">${fmtZAR(inv.totalAmount)}</div>
        <div style="font-size:0.75rem;color:${inv.outstanding > 0 ? 'var(--s-maintenance)' : 'var(--s-available)'};">${inv.outstanding > 0 ? `R ${fmt(inv.outstanding)} outstanding` : 'Paid in full'}</div>
      </div>
      <div style="margin-left:var(--sp-4);">
        ${makeBadge(inv.status)}
      </div>
    </div>`).join('')}
  </div>`;
}

/* ── Profile ── */
function renderProfile(el) {
  const c = getCustomer();
  const prefs = c.communicationPrefs || { email: true, sms: true, whatsapp: false, push: false };

  el.innerHTML = `
  <div class="two-col">
    <div>
      <!-- Personal Information -->
      <div class="surface" style="padding:var(--sp-5);margin-bottom:var(--sp-4);">
        <div class="form-section-title">Personal Information</div>
        <div class="form-grid">
          <div>
            <label class="form-label">First Name</label>
            <input class="form-input" value="${c.firstName}">
          </div>
          <div>
            <label class="form-label">Last Name</label>
            <input class="form-input" value="${c.lastName}">
          </div>
          <div class="form-full">
            <label class="form-label">Email Address</label>
            <input class="form-input" type="email" value="${c.email}">
          </div>
          <div>
            <label class="form-label">Phone Number</label>
            <input class="form-input" value="${c.phone}">
          </div>
          <div>
            <label class="form-label">Nationality</label>
            <input class="form-input" value="${c.nationality}">
          </div>
        </div>
        <div style="margin-top:var(--sp-5);display:flex;justify-content:flex-end;gap:var(--sp-2);">
          <button class="btn btn-outline btn-sm" onclick="custToast('Changes discarded','info')">Discard</button>
          <button class="btn btn-accent btn-sm" onclick="custToast('Profile updated successfully','success')">Save Changes</button>
        </div>
      </div>

      <!-- Security -->
      <div class="surface" style="padding:var(--sp-5);">
        <div class="form-section-title">Security</div>
        <div class="toggle-row">
          <div>
            <div class="toggle-info-title">Two-factor authentication</div>
            <div class="toggle-info-desc">Add an extra layer of security to your account</div>
          </div>
          <div class="toggle" onclick="this.classList.toggle('on');custToast('2FA settings updated','success')"></div>
        </div>
        <div class="toggle-row">
          <div>
            <div class="toggle-info-title">Login notifications</div>
            <div class="toggle-info-desc">Get notified of new logins via email</div>
          </div>
          <div class="toggle on" onclick="this.classList.toggle('on');custToast('Preference saved','success')"></div>
        </div>
        <button class="btn btn-outline btn-sm" style="margin-top:var(--sp-4);" onclick="custToast('Password reset email sent to ${c.email}','success')">Change Password</button>
      </div>
    </div>

    <div>
      <!-- Communication Preferences -->
      <div class="surface" style="padding:var(--sp-5);margin-bottom:var(--sp-4);">
        <div class="form-section-title">Communication Preferences</div>
        ${[
          { key: 'email',    label: 'Email Notifications',    desc: 'Booking confirmations, receipts, reminders', defaultOn: prefs.email },
          { key: 'sms',      label: 'SMS Notifications',      desc: 'Check-in reminders and urgent updates', defaultOn: prefs.sms },
          { key: 'whatsapp', label: 'WhatsApp Messages',      desc: 'Booking updates via WhatsApp Business', defaultOn: prefs.whatsapp },
          { key: 'push',     label: 'Push Notifications',     desc: 'Real-time alerts via the mobile app', defaultOn: prefs.push },
        ].map(p => `
        <div class="toggle-row">
          <div>
            <div class="toggle-info-title">${p.label}</div>
            <div class="toggle-info-desc">${p.desc}</div>
          </div>
          <div class="toggle ${p.defaultOn ? 'on' : ''}" onclick="this.classList.toggle('on');custToast('${p.label} ${p.defaultOn ? 'disabled' : 'enabled'}','success')"></div>
        </div>`).join('')}
        <div class="toggle-row">
          <div>
            <div class="toggle-info-title">Marketing & Offers</div>
            <div class="toggle-info-desc">Promotions, loyalty updates, and property news</div>
          </div>
          <div class="toggle ${c.marketingOptIn ? 'on' : ''}" onclick="this.classList.toggle('on');custToast('Marketing preference updated','success')"></div>
        </div>
      </div>

      <!-- POPIA Rights -->
      <div class="surface" style="padding:var(--sp-5);">
        <div class="form-section-title">Data & Privacy (POPIA)</div>
        <p style="font-size:0.875rem;color:var(--light-text-2);line-height:1.65;margin-bottom:var(--sp-4);">Under the Protection of Personal Information Act (POPIA), you have the right to access, correct, and request deletion of your personal data held by StayOS.</p>
        <div style="display:flex;flex-direction:column;gap:var(--sp-3);">
          <button class="btn btn-outline btn-sm" style="justify-content:flex-start;" onclick="custToast('Data export preparing — you will receive an email within 24 hours','success')">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v10M5 9l3 3 3-3"/><path d="M2 13h12"/></svg>
            Download my data (DSAR Export)
          </button>
          <button class="btn btn-outline btn-sm" style="justify-content:flex-start;" onclick="custToast('Correction request submitted — our team will review within 5 business days','success')">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg>
            Request data correction
          </button>
          <button class="btn btn-outline btn-sm" style="justify-content:flex-start;color:var(--s-maintenance);border-color:var(--s-maintenance);" onclick="custToast('Account deletion request submitted — 30-day cooling off period applies. Financial records are retained for 5 years as required by law.','info')">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h10M5 4V2h6v2"/><path d="M4 4l1 10h6l1-10"/></svg>
            Request account deletion
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Toast ── */
function custToast(msg, type = 'info') {
  const toast = document.getElementById('custToast');
  const inner = document.getElementById('custToastInner');
  const icons = { success: '✓', info: '·', error: '✕' };
  const colors = { success: 'var(--s-available)', info: 'var(--light-text-2)', error: 'var(--s-maintenance)' };
  inner.innerHTML = `<span style="font-size:1rem;font-weight:700;color:${colors[type]};">${icons[type]}</span> ${msg}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(window._custToastTimer);
  window._custToastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
  }, 3500);
}

// Make switchCustomerType accessible from HTML
window.switchCustomerType = switchCustomerType;

init();
