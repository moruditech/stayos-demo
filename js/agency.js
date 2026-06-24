/* ============================================================
   StayOS Agency Dashboard — agency.js
   ============================================================ */

let D = null;


async function init() {
  D = await loadData();
  renderTab('portfolio');
}

function switchTab(tab) {
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.tab === tab);
  });
  const titles = {
    portfolio: 'Portfolio Overview', properties: 'Managed Properties',
    analytics: 'Portfolio Analytics', staff: 'Agency Staff', billing: 'Agency Billing'
  };
  document.getElementById('topbarTitle').textContent = titles[tab] || tab;
  renderTab(tab);
}

function renderTab(tab) {
  const el = document.getElementById('pageContent');
  el.innerHTML = '';
  switch (tab) {
    case 'portfolio':   renderPortfolio(el);   break;
    case 'properties':  renderProperties(el);  break;
    case 'analytics':   renderAnalytics(el);   break;
    case 'staff':       renderStaff(el);       break;
    case 'billing':     renderBilling(el);     break;
  }
}

/* ── Portfolio Overview ── */
function renderPortfolio(el) {
  const m = D.agencyMetrics;
  const hotelMetrics  = m.propertiesMetrics[0];
  const stuMetrics    = m.propertiesMetrics[1];

  el.innerHTML = `
  <!-- Portfolio Hero -->
  <div class="portfolio-hero">
    <div class="portfolio-hero-content">
      <div class="portfolio-greeting">Portfolio — June 2026</div>
      <div class="portfolio-name">Sunrise Property Group</div>
      <div class="portfolio-meta">
        <div class="portfolio-meta-item">
          <div class="portfolio-meta-val">${fmtZAR(m.totalRevenue)}</div>
          <div class="portfolio-meta-label">MTD Revenue</div>
        </div>
        <div class="portfolio-meta-item">
          <div class="portfolio-meta-val">${m.averageOccupancy}%</div>
          <div class="portfolio-meta-label">Avg Occupancy</div>
        </div>
        <div class="portfolio-meta-item">
          <div class="portfolio-meta-val">${m.totalBookings}</div>
          <div class="portfolio-meta-label">MTD Bookings</div>
        </div>
        <div class="portfolio-meta-item">
          <div class="portfolio-meta-val">${m.totalProperties}</div>
          <div class="portfolio-meta-label">Properties</div>
        </div>
        <div class="portfolio-meta-item">
          <div class="portfolio-meta-val">${m.totalStaff}</div>
          <div class="portfolio-meta-label">Staff Accounts</div>
        </div>
      </div>
    </div>
  </div>

  <!-- KPI Row -->
  <div class="kpi-grid" style="margin-bottom:var(--sp-6);">
    <div class="kpi-card anim-in">
      <div class="kpi-label">Total Revenue</div>
      <div class="kpi-value" style="font-size:1.5rem;">${fmtZAR(m.totalRevenue)}</div>
      <div class="kpi-sub"><span class="kpi-change-up">↑ ${m.revenueGrowth}%</span>&nbsp;vs May 2026</div>
    </div>
    <div class="kpi-card anim-in anim-delay-1">
      <div class="kpi-label">Portfolio Occupancy</div>
      <div class="kpi-value">${m.averageOccupancy}%</div>
      <div class="kpi-sub"><span class="kpi-change-up">↑ ${m.occupancyChange}%</span>&nbsp;vs last month</div>
    </div>
    <div class="kpi-card anim-in anim-delay-2">
      <div class="kpi-label">Total Bookings</div>
      <div class="kpi-value">${m.totalBookings}</div>
      <div class="kpi-sub"><span class="kpi-change-up">↑ ${m.bookingsGrowth}%</span>&nbsp;vs last month</div>
    </div>
    <div class="kpi-card anim-in anim-delay-3">
      <div class="kpi-label">Total Guests</div>
      <div class="kpi-value">${m.totalGuests}</div>
      <div class="kpi-sub">Across ${m.totalProperties} properties</div>
    </div>
  </div>

  <!-- Property cards -->
  <div class="section-block-header" style="margin-bottom:var(--sp-4);">
    <div class="section-block-title">Managed Properties</div>
    <a onclick="switchTab('properties')" style="cursor:pointer;font-size:0.8125rem;color:var(--accent);">View all →</a>
  </div>
  <div class="property-row">
    ${D.properties.map((p, i) => {
      const pm = m.propertiesMetrics[i];
      const typeClass = p.type === 'hotel' ? 'prop-type-hotel' : 'prop-type-student';
      const typeText  = p.type === 'hotel' ? 'Hotel' : 'Student Housing';
      return `
      <div class="prop-card" onclick="switchTab('properties')">
        <div class="prop-card-header">
          <div>
            <div class="prop-card-name">${p.name}</div>
            <div class="prop-card-addr">${p.address.suburb}, ${p.address.city}</div>
          </div>
          <div>
            <span class="prop-type-tag ${typeClass}">${typeText}</span>
          </div>
        </div>
        <div class="prop-card-metrics">
          <div class="prop-metric">
            <div class="prop-metric-val">${pm.occupancy}%</div>
            <div class="prop-metric-label">Occupancy</div>
          </div>
          <div class="prop-metric">
            <div class="prop-metric-val" style="font-size:0.9375rem;">${fmtZAR(pm.revenue)}</div>
            <div class="prop-metric-label">Revenue</div>
          </div>
          <div class="prop-metric">
            <div class="prop-metric-val">${pm.bookings}</div>
            <div class="prop-metric-label">Bookings</div>
          </div>
          <div class="prop-metric">
            <div class="prop-metric-val" style="font-size:0.9375rem;">${fmtZAR(pm.revPar)}</div>
            <div class="prop-metric-label">RevPAR</div>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- Lower row -->
  <div class="two-col">
    <!-- Revenue chart -->
    <div class="chart-container">
      <div class="chart-title">Monthly Revenue — 2026</div>
      <div class="chart-legend">
        <div class="legend-item-lg"><div class="legend-swatch" style="background:var(--accent);"></div>Sunrise Boutique Hotel</div>
        <div class="legend-item-lg"><div class="legend-swatch" style="background:var(--teal);"></div>Sunrise Student Village</div>
      </div>
      <div class="bar-chart" id="revenueChart"></div>
      <div class="chart-labels" id="revenueLabels"></div>
    </div>

    <!-- Alerts -->
    <div class="data-table-wrap">
      <div class="data-table-header">
        <div class="data-table-title">Portfolio Alerts</div>
        <span class="badge badge-dirty"><span class="badge-dot"></span>1 action needed</span>
      </div>
      <div class="alert-item">
        <div class="alert-icon alert-icon-warning">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L1.5 13h13L8 2z"/><path d="M8 7v3M8 11.5v.5"/></svg>
        </div>
        <div style="flex:1;">
          <div class="task-title">HVAC failure — Sunrise Boutique Hotel Rm 301</div>
          <div class="task-meta">Critical work order MX-001 · In progress · SLA 10:00</div>
        </div>
        <span class="badge badge-maintenance"><span class="badge-dot"></span>Critical</span>
      </div>
      <div class="alert-item">
        <div class="alert-icon alert-icon-info">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/></svg>
        </div>
        <div style="flex:1;">
          <div class="task-title">Student Village — S2 invoices not yet issued</div>
          <div class="task-meta">Semester 2 starts 1 Jul 2026 · 129 students pending</div>
        </div>
        <span class="badge badge-confirmed"><span class="badge-dot"></span>Upcoming</span>
      </div>
      <div class="alert-item">
        <div class="alert-icon alert-icon-ok">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 6-6"/></svg>
        </div>
        <div style="flex:1;">
          <div class="task-title">Night audit completed — both properties</div>
          <div class="task-meta">20 Jun 2026 · 00:05 · No exceptions reported</div>
        </div>
        <span class="badge badge-available"><span class="badge-dot"></span>Complete</span>
      </div>
      <div class="alert-item">
        <div class="alert-icon alert-icon-info">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/></svg>
        </div>
        <div style="flex:1;">
          <div class="task-title">Agency subscription renewal in 12 days</div>
          <div class="task-meta">Agency Pro plan · R 2,397/month · Auto-renews 2 Jul</div>
        </div>
        <span class="badge badge-pending"><span class="badge-dot"></span>Scheduled</span>
      </div>
    </div>
  </div>`;

  // Render bar chart
  setTimeout(() => {
    const months = D.agencyMetrics.revenueByMonth;
    const max = Math.max(...months.map(m => m.value));
    const hotelShare = 0.63; // Boutique Hotel is ~63% of revenue

    document.getElementById('revenueChart').innerHTML = months.map(m => {
      const total = m.value;
      const hotel = total * hotelShare;
      const student = total - hotel;
      const totalH = Math.round((total / max) * 100);
      const hotelH = Math.round((hotel / max) * 100);
      const stuH = Math.round((student / max) * 100);
      return `<div class="bar-group" title="${m.month}: ${fmtZAR(total)}">
        <div class="bar" style="height:${hotelH}%;background:var(--accent);"></div>
        <div class="bar" style="height:${stuH}%;background:var(--teal);"></div>
      </div>`;
    }).join('');

    document.getElementById('revenueLabels').innerHTML = months.map(m =>
      `<div class="chart-label">${m.month}</div>`
    ).join('');
  }, 50);
}

/* ── Properties List ── */
function renderProperties(el) {
  el.innerHTML = `
  <div class="data-table-wrap" style="margin-bottom:var(--sp-6);">
    <div class="data-table-header">
      <div class="data-table-title">Managed Properties (${D.properties.length})</div>
      <button class="btn btn-sm btn-accent" onclick="agencyToast('Add property workflow started','info')">+ Add Property</button>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Property</th><th>Type</th><th>Location</th>
        <th>Occupancy</th><th>Revenue MTD</th><th>RevPAR</th><th>Plan</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${D.properties.map((p, i) => {
          const pm = D.agencyMetrics.propertiesMetrics[i];
          const typeLabel = p.type === 'hotel' ? 'Hotel' : 'Student Housing';
          const planName = D.subscriptionPlans.find(pl => pl.id === p.planId)?.name || '—';
          const planTier = D.subscriptionPlans.find(pl => pl.id === p.planId)?.tier || 'growth';
          return `<tr onclick="agencyToast('Opening ${p.name} dashboard...','info')">
            <td>
              <div style="font-weight:600;">${p.name}</div>
              <div class="table-secondary">${p.address.street}</div>
            </td>
            <td><span class="t-caption" style="color:var(--light-text-2);">${typeLabel}</span></td>
            <td><div style="font-size:0.875rem;">${p.address.suburb}</div><div class="table-secondary">${p.address.city}, ${p.address.province}</div></td>
            <td class="table-mono">${pm.occupancy}%</td>
            <td class="table-mono">${fmtZAR(pm.revenue)}</td>
            <td class="table-mono">${fmtZAR(pm.revPar)}</td>
            <td>${makeBadge('confirmed', planName)}</td>
            <td>${makeBadge('available', 'Active')}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="two-col">
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Property Comparison</div></div>
      <table class="data-table">
        <thead><tr><th>Metric</th><th>Boutique Hotel</th><th>Student Village</th></tr></thead>
        <tbody>
          <tr><td class="table-secondary">Occupancy</td><td class="table-mono">75.2%</td><td class="table-mono">67.4%</td></tr>
          <tr><td class="table-secondary">Revenue MTD</td><td class="table-mono">${fmtZAR(289450)}</td><td class="table-mono">${fmtZAR(169470)}</td></tr>
          <tr><td class="table-secondary">RevPAR</td><td class="table-mono">${fmtZAR(1265)}</td><td class="table-mono">${fmtZAR(890)}</td></tr>
          <tr><td class="table-secondary">Bookings</td><td class="table-mono">218</td><td class="table-mono">129</td></tr>
          <tr><td class="table-secondary">Avg Stay</td><td class="table-mono">2.8 nights</td><td class="table-mono">180 days</td></tr>
          <tr><td class="table-secondary">Star Rating</td><td class="table-mono">4.3 / 5</td><td class="table-mono">N/A</td></tr>
        </tbody>
      </table>
    </div>
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Active Bookings — Today</div></div>
      <table class="data-table">
        <thead><tr><th>Property</th><th>In-House</th><th>Arrivals</th><th>Departures</th></tr></thead>
        <tbody>
          <tr>
            <td style="font-weight:500;">Boutique Hotel</td>
            <td class="table-mono">3</td>
            <td class="table-mono">1</td>
            <td class="table-mono">2</td>
          </tr>
          <tr>
            <td style="font-weight:500;">Student Village</td>
            <td class="table-mono">67</td>
            <td class="table-mono">0</td>
            <td class="table-mono">0</td>
          </tr>
          <tr style="background:var(--light-bg);">
            <td style="font-weight:700;">Total</td>
            <td class="table-mono" style="font-weight:700;">70</td>
            <td class="table-mono" style="font-weight:700;">1</td>
            <td class="table-mono" style="font-weight:700;">2</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── Analytics ── */
function renderAnalytics(el) {
  el.innerHTML = `
  <div class="kpi-grid" style="margin-bottom:var(--sp-6);">
    <div class="kpi-card"><div class="kpi-label">Commission Earned</div><div class="kpi-value" style="font-size:1.5rem;">${fmtZAR(36713)}</div><div class="kpi-sub">8% of portfolio revenue</div></div>
    <div class="kpi-card"><div class="kpi-label">Best Performer</div><div class="kpi-value" style="font-size:1.125rem;line-height:1.2;">Boutique<br>Hotel</div><div class="kpi-sub">75.2% occupancy</div></div>
    <div class="kpi-card"><div class="kpi-label">YTD Revenue</div><div class="kpi-value" style="font-size:1.5rem;">${fmtZAR(2312800)}</div><div class="kpi-sub kpi-change-up">↑ 14.2% vs 2025</div></div>
    <div class="kpi-card"><div class="kpi-label">YTD Bookings</div><div class="kpi-value">1,847</div><div class="kpi-sub kpi-change-up">↑ 9.8% vs 2025</div></div>
  </div>

  <div class="chart-container" style="margin-bottom:var(--sp-4);">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--sp-5);">
      <div class="chart-title">Portfolio Revenue — 6 Month Trend</div>
      <div style="font-family:var(--f-mono);font-size:0.8125rem;color:var(--light-text-2);">Jan → Jun 2026</div>
    </div>
    <div class="chart-legend">
      <div class="legend-item-lg"><div class="legend-swatch" style="background:var(--accent);"></div>Sunrise Boutique Hotel</div>
      <div class="legend-item-lg"><div class="legend-swatch" style="background:var(--teal);"></div>Sunrise Student Village</div>
    </div>
    <div class="bar-chart" id="analyticsChart" style="height:160px;"></div>
    <div class="chart-labels" id="analyticsLabels"></div>
  </div>

  <div class="two-col">
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Occupancy Breakdown — June</div></div>
      <table class="data-table">
        <thead><tr><th>Week</th><th>Hotel</th><th>Student Village</th><th>Portfolio</th></tr></thead>
        <tbody>
          <tr><td class="table-secondary">Week 1 (1–7 Jun)</td><td class="table-mono">71.4%</td><td class="table-mono">65.0%</td><td class="table-mono">68.2%</td></tr>
          <tr><td class="table-secondary">Week 2 (8–14 Jun)</td><td class="table-mono">78.6%</td><td class="table-mono">67.1%</td><td class="table-mono">72.9%</td></tr>
          <tr><td class="table-secondary">Week 3 (15–20 Jun)</td><td class="table-mono">75.7%</td><td class="table-mono">70.0%</td><td class="table-mono">72.9%</td></tr>
          <tr style="background:var(--light-bg);"><td style="font-weight:700;">MTD Average</td><td class="table-mono" style="font-weight:700;">75.2%</td><td class="table-mono" style="font-weight:700;">67.4%</td><td class="table-mono" style="font-weight:700;">71.3%</td></tr>
        </tbody>
      </table>
    </div>
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Booking Source Distribution</div></div>
      <table class="data-table">
        <thead><tr><th>Source</th><th>Bookings</th><th>Revenue</th></tr></thead>
        <tbody>
          <tr><td>Direct</td><td class="table-mono">198 (57%)</td><td class="table-mono">${fmtZAR(276400)}</td></tr>
          <tr><td>OTA — Booking.com</td><td class="table-mono">89 (26%)</td><td class="table-mono">${fmtZAR(114200)}</td></tr>
          <tr><td>Corporate</td><td class="table-mono">36 (10%)</td><td class="table-mono">${fmtZAR(46800)}</td></tr>
          <tr><td>Walk-in</td><td class="table-mono">24 (7%)</td><td class="table-mono">${fmtZAR(21520)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>`;

  setTimeout(() => {
    const months = D.agencyMetrics.revenueByMonth;
    const max = Math.max(...months.map(m => m.value));
    document.getElementById('analyticsChart').innerHTML = months.map(m => {
      const hotel   = Math.round((m.value * 0.63 / max) * 100);
      const student = Math.round((m.value * 0.37 / max) * 100);
      return `<div class="bar-group" title="${m.month}: ${fmtZAR(m.value)}">
        <div class="bar" style="height:${hotel}%;background:var(--accent);"></div>
        <div class="bar" style="height:${student}%;background:var(--teal);"></div>
      </div>`;
    }).join('');
    document.getElementById('analyticsLabels').innerHTML = months.map(m =>
      `<div class="chart-label">${m.month}</div>`).join('');
  }, 50);
}

/* ── Staff ── */
function renderStaff(el) {
  const agencyStaff = [
    { firstName:'Amanda', lastName:'Botha',    role:'agency_owner',   email:'amanda@sunrisegroup.co.za',       assignedProperties: 2, lastLogin:'Today 06:45' },
    { firstName:'Ruan',   lastName:'Grobler',  role:'agency_manager', email:'ruan@sunrisegroup.co.za',          assignedProperties: 1, lastLogin:'Today 07:00' },
    { firstName:'Thandi', lastName:'Sithole',  role:'agency_analyst', email:'thandi@sunrisegroup.co.za',        assignedProperties: 2, lastLogin:'Today 08:30' },
    { firstName:'Werner', lastName:'Pretorius',role:'agency_manager', email:'werner@sunrisegroup.co.za',        assignedProperties: 1, lastLogin:'Yesterday' },
  ];

  el.innerHTML = `
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Agency Staff (${agencyStaff.length} of 5 included seats)</div>
      <button class="btn btn-sm btn-outline" onclick="agencyToast('Staff invite sent','success')">+ Invite</button>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Staff Member</th><th>Role</th><th>Email</th>
        <th>Properties</th><th>Last Login</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${agencyStaff.map(s => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:var(--sp-3);">
              <div class="staff-avatar">${s.firstName[0]}${s.lastName[0]}</div>
              <div><div style="font-weight:600;">${s.firstName} ${s.lastName}</div></div>
            </div>
          </td>
          <td><span class="t-caption" style="color:var(--light-text-2);">${roleLabel(s.role)}</span></td>
          <td class="table-secondary">${s.email}</td>
          <td class="table-mono">${s.assignedProperties} / ${D.properties.length}</td>
          <td class="table-secondary">${s.lastLogin}</td>
          <td>${makeBadge('available', 'Active')}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div style="margin-top:var(--sp-4);padding:var(--sp-4) var(--sp-5);background:var(--light-surface);border:1px solid var(--light-border);border-radius:var(--r-md);display:flex;align-items:center;justify-content:space-between;">
    <div>
      <div style="font-weight:600;margin-bottom:2px;">Agency Seat Usage</div>
      <div class="table-secondary">4 of 5 included seats used. 1 additional staff seat available.</div>
    </div>
    <span class="badge badge-available"><span class="badge-dot"></span>1 seat available</span>
  </div>`;
}

/* ── Billing ── */
function renderBilling(el) {
  el.innerHTML = `
  <div class="two-col" style="margin-bottom:var(--sp-6);">
    <div class="surface-raised" style="padding:var(--sp-5);">
      <div class="kpi-label" style="margin-bottom:var(--sp-4);">Current Subscription</div>
      <div style="font-family:var(--f-display);font-size:2rem;font-weight:500;letter-spacing:-0.02em;margin-bottom:var(--sp-2);">Agency Pro</div>
      <div style="margin-bottom:var(--sp-4);">${makeBadge('available', 'Active')}</div>
      <div class="detail-row"><span class="detail-label">Base fee</span><span class="detail-value">R 1,999 / month</span></div>
      <div class="detail-row"><span class="detail-label">Per property (×2)</span><span class="detail-value">R 398 / month</span></div>
      <div class="detail-row"><span class="detail-label">Total</span><span class="detail-value" style="font-family:var(--f-mono);font-size:1.0625rem;font-weight:700;">R 2,397 / month</span></div>
      <div class="detail-row"><span class="detail-label">Next renewal</span><span class="detail-value">2 Jul 2026</span></div>
      <div style="margin-top:var(--sp-4);display:flex;gap:var(--sp-2);">
        <button class="btn btn-outline btn-sm" onclick="agencyToast('Upgrade options loaded','info')">Upgrade Plan</button>
        <button class="btn btn-ghost btn-sm" onclick="agencyToast('Cancellation requires 30 days notice','info')">Cancel</button>
      </div>
    </div>
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Recent Invoices</div></div>
      <table class="data-table">
        <thead><tr><th>Period</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Jun 2026</td><td class="table-mono">R 2,397</td><td>${makeBadge('available','Paid')}</td></tr>
          <tr><td>May 2026</td><td class="table-mono">R 2,397</td><td>${makeBadge('available','Paid')}</td></tr>
          <tr><td>Apr 2026</td><td class="table-mono">R 2,397</td><td>${makeBadge('available','Paid')}</td></tr>
          <tr><td>Mar 2026</td><td class="table-mono">R 2,397</td><td>${makeBadge('available','Paid')}</td></tr>
          <tr><td>Feb 2026</td><td class="table-mono">R 1,999</td><td>${makeBadge('available','Paid')}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header"><div class="data-table-title">Property Subscription Summary</div></div>
    <table class="data-table">
      <thead><tr><th>Property</th><th>Plan</th><th>Price</th><th>Billing Cycle</th><th>Next Renewal</th><th>Status</th></tr></thead>
      <tbody>
        ${D.properties.map(p => {
          const plan = D.subscriptionPlans.find(pl => pl.id === p.planId);
          return `<tr>
            <td style="font-weight:500;">${p.name}</td>
            <td>${makeBadge('confirmed', plan?.name || '—')}</td>
            <td class="table-mono">R ${plan?.monthlyPrice || '—'}/mo</td>
            <td class="table-secondary">Monthly</td>
            <td class="table-secondary">1 Jul 2026</td>
            <td>${makeBadge('available','Active')}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── Toast ── */
function agencyToast(msg, type = 'info') {
  const toast = document.getElementById('agToast');
  const inner = document.getElementById('agToastInner');
  const icons = { success: '✓', info: '·', error: '✕' };
  const colors = { success: 'var(--s-available)', info: 'var(--light-text-2)', error: 'var(--s-maintenance)' };
  inner.innerHTML = `<span style="font-size:1rem;font-weight:700;color:${colors[type]};">${icons[type]}</span> ${msg}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(window._agToastTimer);
  window._agToastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
  }, 3000);
}

init();
