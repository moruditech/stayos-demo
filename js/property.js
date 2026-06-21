/* ============================================================
   StayOS Property Dashboard — property.js
   ============================================================ */

let D = null; // seed data
let currentTab = 'overview';
let selectedBooking = null;

const { fmt, fmtZAR, fmtDate, fmtDateShort, statusLabel, roleLabel, initials, makeBadge, makeIcon, loadData, todayDisplay } = window.StayOS;

async function init() {
  D = await loadData();
  renderTab('overview');
  updateBadges();
}

function updateBadges() {
  const active = D.bookings.filter(b => ['checked_in','confirmed'].includes(b.status)).length;
  const hkPending = D.housekeepingTasks.filter(t => t.status !== 'completed').length;
  const mxOpen = D.maintenanceOrders.filter(o => !['closed','verified','completed'].includes(o.status)).length;
  document.getElementById('activeBookingsBadge').textContent = active;
  document.getElementById('hkPendingBadge').textContent = hkPending;
  document.getElementById('mxOpenBadge').textContent = mxOpen;
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.tab === tab);
  });
  const titles = {
    overview: 'Dashboard', bookings: 'Bookings', rooms: 'Room Status Board',
    housekeeping: 'Housekeeping', maintenance: 'Maintenance', reports: 'Reports', staff: 'Staff'
  };
  document.getElementById('topbarTitle').textContent = titles[tab] || tab;
  renderTab(tab);
}

function renderTab(tab) {
  const el = document.getElementById('pageContent');
  el.innerHTML = '';
  switch (tab) {
    case 'overview':     renderOverview(el);     break;
    case 'bookings':     renderBookings(el);     break;
    case 'rooms':        renderRooms(el);        break;
    case 'housekeeping': renderHousekeeping(el); break;
    case 'maintenance':  renderMaintenance(el);  break;
    case 'reports':      renderReports(el);      break;
    case 'staff':        renderStaff(el);        break;
  }
}

/* ── Overview ── */
function renderOverview(el) {
  const rooms = D.rooms.filter(r => r.tenantId === 'tenant_001');
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const available = rooms.filter(r => r.status === 'available').length;
  const todayArrivals = D.bookings.filter(b => b.checkIn === '2026-06-20' && b.tenantId === 'tenant_001');
  const todayDepartures = D.bookings.filter(b => b.checkOut === '2026-06-20' && b.tenantId === 'tenant_001');
  const occupancyPct = Math.round((occupied / rooms.length) * 100);
  const revToday = D.bookings.filter(b => b.status === 'checked_in').reduce((s,b) => s + b.ratePerNight, 0);
  const checkedIn = D.bookings.filter(b => b.status === 'checked_in').length;

  el.innerHTML = `
  <!-- Night Audit Banner -->
  <div class="audit-banner">
    <div>
      <div class="audit-banner-title">Night Audit Status</div>
      <div class="audit-banner-text">Last run: 20 Jun 2026 at 00:05 · All rooms reconciled · No breaches</div>
    </div>
    <div style="display:flex;align-items:center;gap:var(--sp-4);">
      <div class="audit-time">00:05</div>
      <span class="badge badge-available"><span class="badge-dot"></span>Complete</span>
    </div>
  </div>

  <!-- KPIs -->
  <div class="kpi-grid">
    <div class="kpi-card anim-in">
      <div class="kpi-label">Occupancy</div>
      <div class="kpi-value">${occupancyPct}%</div>
      <div class="kpi-sub"><span class="kpi-change-up">↑ 4.1%</span>&nbsp;vs last week</div>
    </div>
    <div class="kpi-card anim-in anim-delay-1">
      <div class="kpi-label">In-House Guests</div>
      <div class="kpi-value">${checkedIn * 2}</div>
      <div class="kpi-sub">${checkedIn} occupied rooms</div>
    </div>
    <div class="kpi-card anim-in anim-delay-2">
      <div class="kpi-label">Revenue Today</div>
      <div class="kpi-value" style="font-size:1.5rem;">${fmtZAR(revToday)}</div>
      <div class="kpi-sub">Confirmed room charges</div>
    </div>
    <div class="kpi-card anim-in anim-delay-3">
      <div class="kpi-label">Available Rooms</div>
      <div class="kpi-value">${available}</div>
      <div class="kpi-sub">of ${rooms.length} total rooms</div>
    </div>
  </div>

  <div class="two-col" style="margin-bottom:var(--sp-4);">
    <!-- Room Status Summary -->
    <div class="surface-raised section-block" style="padding:var(--sp-5);">
      <div class="section-block-header"><div class="section-block-title">Room Status Overview</div>
        <a onclick="switchTab('rooms')" style="cursor:pointer;font-size:0.8125rem;color:var(--accent);">View board →</a>
      </div>
      <div class="occ-bar-wrap" id="occBars"></div>
    </div>
    <!-- Activity Feed -->
    <div class="data-table-wrap section-block">
      <div class="data-table-header">
        <div class="data-table-title">Live Activity</div>
        <span class="badge badge-available"><span class="badge-dot"></span>Live</span>
      </div>
      <div id="activityFeed"></div>
    </div>
  </div>

  <div class="two-col">
    <!-- Today's Arrivals -->
    <div class="data-table-wrap section-block">
      <div class="data-table-header">
        <div class="data-table-title">Today's Arrivals</div>
        <span class="badge badge-confirmed"><span class="badge-dot"></span>${todayArrivals.length + 1} expected</span>
      </div>
      <table class="data-table"><thead><tr>
        <th>Guest</th><th>Room</th><th>Status</th><th>Action</th>
      </tr></thead><tbody id="arrivalsBody"></tbody></table>
    </div>
    <!-- Today's Departures -->
    <div class="data-table-wrap section-block">
      <div class="data-table-header">
        <div class="data-table-title">Today's Departures</div>
        <span class="badge badge-dirty"><span class="badge-dot"></span>${todayDepartures.length} checking out</span>
      </div>
      <table class="data-table"><thead><tr>
        <th>Guest</th><th>Room</th><th>Balance</th><th>Action</th>
      </tr></thead><tbody id="departuresBody"></tbody></table>
    </div>
  </div>`;

  // Populate occupancy bars
  const statuses = ['available','occupied','dirty','maintenance','inspection','blocked'];
  const colors = { available:'var(--s-available)', occupied:'var(--s-occupied)', dirty:'var(--s-dirty)', maintenance:'var(--s-maintenance)', inspection:'var(--s-inspection)', blocked:'var(--s-blocked)' };
  document.getElementById('occBars').innerHTML = statuses.map(s => {
    const count = rooms.filter(r => r.status === s).length;
    const pct = (count / rooms.length) * 100;
    if (count === 0) return '';
    return `<div class="occ-bar-row">
      <div class="occ-bar-label t-caption">${statusLabel(s)}</div>
      <div class="occ-bar-track"><div class="occ-bar-fill" style="width:${pct}%;background:${colors[s]};"></div></div>
      <div class="occ-bar-val t-mono">${count}</div>
    </div>`;
  }).join('');

  // Activity feed
  document.getElementById('activityFeed').innerHTML = D.recentActivity.map(a => `
    <div class="activity-item">
      <span class="activity-time">${a.time}</span>
      <span class="activity-dot activity-dot-${a.type}"></span>
      <div>
        <div class="activity-text">${a.message}</div>
        <div class="activity-actor">${a.actor}</div>
      </div>
    </div>`).join('');

  // Arrivals (checked_in today or arriving today)
  const arrivals = [
    { guestName: 'Priya Pillay', roomNumber: '303', status: 'confirmed' },
    ...D.bookings.filter(b => b.status === 'checked_in')
  ].slice(0, 4);

  document.getElementById('arrivalsBody').innerHTML = arrivals.map(b => `
    <tr onclick="openBookingModalById('${b.id || 'booking_003'}')">
      <td><div style="font-weight:600;">${b.guestName}</div><div class="table-secondary">${b.confirmationNumber || 'SOS-2026-00003'}</div></td>
      <td class="table-mono">Rm ${b.roomNumber}</td>
      <td>${makeBadge(b.status)}</td>
      <td><button class="btn btn-sm ${b.status === 'confirmed' ? 'btn-accent' : 'btn-outline'}" onclick="event.stopPropagation();showToast('${b.status === 'confirmed' ? 'Check-in processed' : 'Already checked in'}','${b.status === 'confirmed' ? 'success' : 'info'}')">${b.status === 'confirmed' ? 'Check In' : 'View'}</button></td>
    </tr>`).join('');

  // Departures
  const deps = D.bookings.filter(b => b.status === 'checked_in');
  document.getElementById('departuresBody').innerHTML = deps.map(b => `
    <tr onclick="openBookingModalById('${b.id}')">
      <td><div style="font-weight:600;">${b.guestName}</div><div class="table-secondary">${b.confirmationNumber}</div></td>
      <td class="table-mono">Rm ${b.roomNumber}</td>
      <td class="table-mono" style="color:${b.balanceDue > 0 ? 'var(--s-maintenance)' : 'var(--s-available)'}">${fmtZAR(b.balanceDue)}</td>
      <td><button class="btn btn-sm btn-outline" onclick="event.stopPropagation();showToast('Check-out processed for Rm ${b.roomNumber}','success')">Check Out</button></td>
    </tr>`).join('');
}

/* ── Bookings ── */
function renderBookings(el) {
  const bookings = D.bookings.filter(b => b.tenantId === 'tenant_001');
  el.innerHTML = `
  <div class="section-block-header" style="margin-bottom:var(--sp-4);">
    <div></div>
    <button class="btn btn-accent btn-sm" onclick="openBookingModal()">+ New Booking</button>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">All Bookings</div>
      <div style="display:flex;gap:var(--sp-2);">
        <button class="filter-chip active" onclick="filterBookings(this,'all')">All (${bookings.length})</button>
        <button class="filter-chip" onclick="filterBookings(this,'checked_in')">In-House</button>
        <button class="filter-chip" onclick="filterBookings(this,'confirmed')">Upcoming</button>
        <button class="filter-chip" onclick="filterBookings(this,'checked_out')">Departed</button>
      </div>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Confirmation</th><th>Guest</th><th>Room</th>
        <th>Check-in</th><th>Check-out</th><th>Nights</th>
        <th>Total</th><th>Source</th><th>Status</th>
      </tr></thead>
      <tbody id="bookingsTableBody">
        ${renderBookingRows(bookings)}
      </tbody>
    </table>
  </div>`;
}

function renderBookingRows(bookings) {
  const srcLabel = { direct:'Direct', ota_booking:'Booking.com', ota_airbnb:'Airbnb', walk_in:'Walk-in', corporate:'Corporate', phone:'Phone', agency:'Agency' };
  return bookings.map(b => `
    <tr onclick="openBookingModalById('${b.id}')">
      <td class="table-mono" style="font-weight:600;">${b.confirmationNumber}</td>
      <td><div style="font-weight:500;">${b.guestName}</div></td>
      <td class="table-mono">Rm ${b.roomNumber}</td>
      <td>${fmtDateShort(b.checkIn)}</td>
      <td>${fmtDateShort(b.checkOut)}</td>
      <td class="table-mono">${b.nights}</td>
      <td class="table-mono">${fmtZAR(b.totalAmount)}</td>
      <td><span class="t-caption" style="color:var(--light-text-2);">${srcLabel[b.source] || b.source}</span></td>
      <td>${makeBadge(b.status)}</td>
    </tr>`).join('');
}

function filterBookings(btn, status) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const bookings = status === 'all'
    ? D.bookings.filter(b => b.tenantId === 'tenant_001')
    : D.bookings.filter(b => b.tenantId === 'tenant_001' && b.status === status);
  document.getElementById('bookingsTableBody').innerHTML = renderBookingRows(bookings);
}

/* ── Rooms Board ── */
function renderRooms(el) {
  const rooms = D.rooms.filter(r => r.tenantId === 'tenant_001');
  const statuses = ['available','occupied','dirty','maintenance','inspection','blocked'];

  el.innerHTML = `
  <div class="section-block-header" style="margin-bottom:var(--sp-4);">
    <div class="board-controls">
      <button class="filter-chip active" onclick="filterRooms(this,'all')">All (${rooms.length})</button>
      ${statuses.map(s => {
        const n = rooms.filter(r => r.status === s).length;
        return n ? `<button class="filter-chip" data-status="${s}" onclick="filterRooms(this,'${s}')">${statusLabel(s)} (${n})</button>` : '';
      }).join('')}
    </div>
    <div class="status-legend">
      ${statuses.map(s => {
        const colors = { available:'var(--s-available)', occupied:'var(--s-occupied)', dirty:'var(--s-dirty)', maintenance:'var(--s-maintenance)', inspection:'var(--s-inspection)', blocked:'var(--s-blocked)' };
        return `<div class="legend-item"><div class="legend-dot" style="background:${colors[s]};"></div>${statusLabel(s)}</div>`;
      }).join('')}
    </div>
  </div>
  <div class="room-board" id="roomBoard">
    ${renderRoomTiles(rooms)}
  </div>`;
}

function renderRoomTiles(rooms) {
  return rooms.map(r => {
    const booking = D.bookings.find(b => b.roomId === r.id && ['checked_in','confirmed'].includes(b.status));
    return `
    <div class="room-tile" data-status="${r.status}" onclick="openRoomModal('${r.id}')">
      <div class="room-number">${r.roomNumber}</div>
      <div class="room-type">${r.type} · Fl.${r.floor}</div>
      ${booking ? `<div style="font-size:0.75rem;color:var(--light-text-2);margin-bottom:var(--sp-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${booking.guestName}</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--sp-2);">
        ${makeBadge(r.status)}
        <div class="room-rate">${fmtZAR(r.baseRate)}</div>
      </div>
    </div>`;
  }).join('');
}

function filterRooms(btn, status) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const rooms = D.rooms.filter(r => r.tenantId === 'tenant_001' && (status === 'all' || r.status === status));
  document.getElementById('roomBoard').innerHTML = renderRoomTiles(rooms);
}

/* ── Housekeeping ── */
function renderHousekeeping(el) {
  const tasks = D.housekeepingTasks;
  const typeLabel = { checkout_clean: 'Checkout Clean', stayover_clean: 'Stayover Clean', deep_clean: 'Deep Clean', inspection: 'Inspection', turndown: 'Turndown' };

  el.innerHTML = `
  <div class="two-col" style="margin-bottom:var(--sp-4);">
    <div class="kpi-card"><div class="kpi-label">Pending</div><div class="kpi-value">${tasks.filter(t=>t.status==='pending').length}</div></div>
    <div class="kpi-card"><div class="kpi-label">In Progress</div><div class="kpi-value">${tasks.filter(t=>t.status==='in_progress').length}</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Housekeeping Tasks — 20 Jun 2026</div>
      <button class="btn btn-sm btn-outline" onclick="showToast('Task assigned to Nomsa','success')">+ Add Task</button>
    </div>
    <div id="hkTaskList">
      ${tasks.map(t => `
      <div class="task-item">
        <div class="task-icon task-icon-hk"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13V5l5-3 5 3v8"/><path d="M6 13v-3h4v3"/><path d="M2 13h12"/></svg></div>
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:2px;">
            <div class="task-title">Room ${t.roomNumber} — ${typeLabel[t.type] || t.type}</div>
            ${makeBadge(t.priority, t.priority.charAt(0).toUpperCase() + t.priority.slice(1))}
          </div>
          <div class="task-meta">Assigned to ${t.assignedTo} · ${t.status === 'completed' ? `Completed ${t.completedAt ? new Date(t.completedAt).toLocaleTimeString('en-ZA', {hour:'2-digit',minute:'2-digit'}) : ''}` : 'Scheduled for today'}</div>
          ${t.checklist ? `<div style="margin-top:var(--sp-2);display:flex;gap:var(--sp-1);flex-wrap:wrap;">${t.checklist.map(c=>`<span style="font-size:0.6875rem;padding:2px 6px;border-radius:2px;background:${c.completed?'var(--s-available-bg)':'var(--light-bg)'};color:${c.completed?'var(--s-available)':'var(--light-text-2)'};">${c.item}</span>`).join('')}</div>` : ''}
        </div>
        <div>
          ${makeBadge(t.status)}
          <div style="margin-top:var(--sp-2);">
            <button class="btn btn-xs ${t.status !== 'completed' ? 'btn-accent' : 'btn-outline'}" onclick="showToast('${t.status !== 'completed' ? 'Task marked complete' : 'Task already done'}','${t.status !== 'completed' ? 'success' : 'info'}')">${t.status !== 'completed' ? 'Complete' : 'Done'}</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

/* ── Maintenance ── */
function renderMaintenance(el) {
  const orders = D.maintenanceOrders;
  const priorityColors = { critical: 'var(--s-maintenance)', high: 'var(--s-dirty)', normal: 'var(--s-blocked)' };

  el.innerHTML = `
  <div class="three-col" style="margin-bottom:var(--sp-4);">
    <div class="kpi-card"><div class="kpi-label">Open Orders</div><div class="kpi-value">${orders.filter(o=>o.status!=='completed').length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Critical</div><div class="kpi-value" style="color:var(--s-maintenance);">${orders.filter(o=>o.priority==='critical').length}</div></div>
    <div class="kpi-card"><div class="kpi-label">SLA Breach Risk</div><div class="kpi-value">0</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Work Orders</div>
      <button class="btn btn-sm btn-outline" onclick="showToast('Work order created','success')">+ New Order</button>
    </div>
    ${orders.map(o => `
    <div class="task-item" style="border-left:3px solid ${priorityColors[o.priority]};">
      <div class="task-icon task-icon-mx"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2.5a3 3 0 0 1-3 4.5L2 11.5a1.5 1.5 0 0 0 2 2l4.5-4.5a3 3 0 0 1 4.5-3l-2 2 1 1 2-2a3 3 0 0 1-.5 4"/></svg></div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:2px;flex-wrap:wrap;">
          <div class="task-title">${o.title}</div>
          ${makeBadge(o.priority, o.priority.charAt(0).toUpperCase() + o.priority.slice(1))}
          ${makeBadge(o.status)}
        </div>
        <div class="task-meta">
          ${o.roomNumber} · ${o.category.toUpperCase()} · 
          ${o.assignedTo ? `Assigned to ${o.assignedTo}` : '<span style="color:var(--s-dirty)">Unassigned</span>'}
          · SLA: ${o.slaTarget ? new Date(o.slaTarget).toLocaleString('en-ZA', {hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}) : '—'}
        </div>
        <div style="font-size:0.75rem;color:var(--light-text-3);margin-top:4px;">Created: ${o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-ZA', {hour:'2-digit',minute:'2-digit'}) : ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--sp-2);align-items:flex-end;">
        ${!o.assignedTo ? `<button class="btn btn-xs btn-accent" onclick="showToast('Order assigned to Sipho Ndlovu','success')">Assign</button>` : ''}
        <button class="btn btn-xs btn-outline" onclick="showToast('Order updated','info')">Update</button>
      </div>
    </div>`).join('')}
  </div>`;
}

/* ── Reports ── */
function renderReports(el) {
  const totalRev = D.bookings.filter(b=>b.status !== 'cancelled').reduce((s,b)=>s+b.totalAmount,0);
  const checkedIn = D.bookings.filter(b=>b.status==='checked_in').length;
  const rooms = D.rooms.filter(r=>r.tenantId==='tenant_001');
  const occPct = Math.round((rooms.filter(r=>r.status==='occupied').length / rooms.length) * 100);

  el.innerHTML = `
  <div class="kpi-grid" style="margin-bottom:var(--sp-6);">
    <div class="kpi-card"><div class="kpi-label">MTD Revenue</div><div class="kpi-value" style="font-size:1.5rem;">${fmtZAR(289450)}</div><div class="kpi-sub kpi-change-up">↑ 12.4% vs Jun '25</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg Occupancy</div><div class="kpi-value">${occPct}%</div><div class="kpi-sub kpi-change-up">↑ 4.1% this month</div></div>
    <div class="kpi-card"><div class="kpi-label">RevPAR</div><div class="kpi-value" style="font-size:1.5rem;">R 1,265</div><div class="kpi-sub kpi-change-up">↑ 8.2%</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg Stay</div><div class="kpi-value">2.8</div><div class="kpi-sub">nights</div></div>
  </div>
  <div class="two-col">
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Revenue by Source</div></div>
      <table class="data-table"><thead><tr><th>Source</th><th>Bookings</th><th>Revenue</th><th>Share</th></tr></thead><tbody>
        <tr><td>Direct</td><td class="table-mono">148</td><td class="table-mono">${fmtZAR(181200)}</td><td class="table-mono">62.6%</td></tr>
        <tr><td>Booking.com</td><td class="table-mono">52</td><td class="table-mono">${fmtZAR(68900)}</td><td class="table-mono">23.8%</td></tr>
        <tr><td>Corporate</td><td class="table-mono">18</td><td class="table-mono">${fmtZAR(39350)}</td><td class="table-mono">13.6%</td></tr>
      </tbody></table>
    </div>
    <div class="data-table-wrap">
      <div class="data-table-header"><div class="data-table-title">Bookings by Room Type</div></div>
      <table class="data-table"><thead><tr><th>Type</th><th>Bookings</th><th>Avg Rate</th></tr></thead><tbody>
        <tr><td>Suite</td><td class="table-mono">62</td><td class="table-mono">R 3,100</td></tr>
        <tr><td>Double</td><td class="table-mono">89</td><td class="table-mono">R 1,450</td></tr>
        <tr><td>Twin</td><td class="table-mono">44</td><td class="table-mono">R 1,350</td></tr>
        <tr><td>Single</td><td class="table-mono">23</td><td class="table-mono">R 1,025</td></tr>
      </tbody></table>
    </div>
  </div>
  <div style="margin-top:var(--sp-4);padding:var(--sp-5);background:var(--light-surface);border:1px solid var(--light-border);border-radius:var(--r-md);">
    <div class="data-table-header" style="padding:0;margin-bottom:var(--sp-4);"><div class="data-table-title">Revenue Trend — June 2026</div></div>
    <div id="miniChart" style="display:flex;align-items:flex-end;gap:6px;height:80px;border-bottom:1px solid var(--light-border);padding-bottom:var(--sp-2);">
    </div>
    <div style="display:flex;gap:6px;margin-top:var(--sp-2);" id="miniChartLabels"></div>
  </div>`;

  // Mini chart
  const vals = [8200, 9400, 12100, 8900, 11200, 13400, 9800, 14200, 10800, 12600, 9200, 11800, 13200, 10400, 15800, 12300, 14600, 11200, 13800, 16200];
  const max = Math.max(...vals);
  document.getElementById('miniChart').innerHTML = vals.map((v,i) => {
    const h = Math.round((v / max) * 100);
    return `<div style="flex:1;height:${h}%;background:${i === vals.length-1 ? 'var(--accent)' : 'var(--light-border)'};border-radius:1px 1px 0 0;transition:background 0.2s;cursor:pointer;" title="R ${fmt(v)}" onmouseenter="this.style.background='var(--accent)'" onmouseleave="this.style.background='${i===vals.length-1?'var(--accent)':'var(--light-border)'}'"></div>`;
  }).join('');
  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  document.getElementById('miniChartLabels').innerHTML = days.map((d,i) => `<div style="flex:1;font-size:0.5625rem;color:var(--light-text-3);text-align:center;">${i % 4 === 0 ? d : ''}</div>`).join('');
}

/* ── Staff ── */
function renderStaff(el) {
  const staff = D.staff.filter(s => s.tenantId === 'tenant_001');
  const { initials } = window.StayOS;
  el.innerHTML = `
  <div class="data-table-wrap">
    <div class="data-table-header">
      <div class="data-table-title">Property Staff (${staff.length})</div>
      <button class="btn btn-sm btn-outline" onclick="showToast('Staff invite sent','success')">+ Invite Staff</button>
    </div>
    <table class="data-table"><thead><tr>
      <th>Staff Member</th><th>Role</th><th>Email</th><th>Last Login</th><th>Status</th>
    </tr></thead><tbody>
      ${staff.map(s => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:var(--sp-3);">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--light-bg);border:1px solid var(--light-border);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--light-text-2);">${initials(s.firstName,s.lastName)}</div>
            <div>
              <div style="font-weight:600;">${s.firstName} ${s.lastName}</div>
            </div>
          </div>
        </td>
        <td><span class="t-caption" style="color:var(--light-text-2);">${roleLabel(s.role)}</span></td>
        <td class="table-secondary">${s.email}</td>
        <td class="table-mono" style="color:var(--light-text-2);font-size:0.8125rem;">${s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'}) : '—'}</td>
        <td>${makeBadge('available','Active')}</td>
      </tr>`).join('')}
    </tbody></table>
  </div>`;
}

/* ── Modals ── */
function openBookingModalById(id) {
  const booking = D.bookings.find(b => b.id === id);
  if (!booking) return;
  selectedBooking = booking;
  showBookingModal(booking);
}

function openBookingModal() {
  showToast('Booking creation form — coming soon in full build', 'info');
}

function showBookingModal(b) {
  const modal = document.getElementById('bookingModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
  <div class="modal-header">
    <div>
      <div style="font-size:0.75rem;color:var(--light-text-2);margin-bottom:2px;" class="t-mono">${b.confirmationNumber}</div>
      <div style="font-size:1.125rem;font-weight:700;">${b.guestName}</div>
    </div>
    <div style="display:flex;gap:var(--sp-2);align-items:center;">
      ${makeBadge(b.status)}
      <div class="modal-close" onclick="closeModal()">&times;</div>
    </div>
  </div>
  <div class="modal-body">
    <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value detail-value-mono">Room ${b.roomNumber} (${b.roomId ? D.rooms.find(r=>r.id===b.roomId)?.name || '' : ''})</span></div>
    <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${fmtDate(b.checkIn)}</span></div>
    <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${fmtDate(b.checkOut)}</span></div>
    <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value detail-value-mono">${b.nights}</span></div>
    <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${b.adults} adult${b.adults>1?'s':''}${b.children?' + '+b.children+' child':''}</span></div>
    <div class="detail-row"><span class="detail-label">Rate / Night</span><span class="detail-value detail-value-mono">${fmtZAR(b.ratePerNight)}</span></div>
    <div class="detail-row"><span class="detail-label">Sub-total</span><span class="detail-value detail-value-mono">${fmtZAR(b.subTotal)}</span></div>
    <div class="detail-row"><span class="detail-label">VAT (15%)</span><span class="detail-value detail-value-mono">${fmtZAR(b.taxAmount)}</span></div>
    <div class="detail-row" style="font-weight:700;"><span class="detail-label">Total</span><span class="detail-value detail-value-mono" style="font-size:1.0625rem;">${fmtZAR(b.totalAmount)}</span></div>
    <div class="detail-row"><span class="detail-label">Deposit Paid</span><span class="detail-value">${b.depositPaid ? makeBadge('available', fmtZAR(b.depositAmount)) : makeBadge('maintenance','Not Paid')}</span></div>
    <div class="detail-row"><span class="detail-label">Balance Due</span><span class="detail-value detail-value-mono" style="color:${b.balanceDue>0?'var(--s-maintenance)':'var(--s-available)'};">${fmtZAR(b.balanceDue)}</span></div>
    ${b.specialRequests ? `<div class="detail-row"><span class="detail-label">Special Requests</span><span class="detail-value" style="font-style:italic;color:var(--light-text-2);max-width:60%;">${b.specialRequests}</span></div>` : ''}
    
    <div style="margin-top:var(--sp-4);">
      <div style="font-size:0.6875rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--light-text-2);margin-bottom:var(--sp-3);">Folio Items</div>
      <div class="folio-item"><div class="folio-item-desc">Room charge × ${b.nights} nights</div><div class="folio-item-amt">${fmtZAR(b.subTotal)}</div></div>
      <div class="folio-item"><div class="folio-item-desc">VAT @ 15%</div><div class="folio-item-amt">${fmtZAR(b.taxAmount)}</div></div>
      ${b.depositPaid ? `<div class="folio-item"><div class="folio-item-desc">Deposit received</div><div class="folio-item-amt" style="color:var(--s-available);">−${fmtZAR(b.depositAmount)}</div></div>` : ''}
    </div>

    <div class="action-row">
      ${b.status === 'confirmed' ? `<button class="btn btn-accent" onclick="closeModal();showToast('Check-in processed — Room ${b.roomNumber}','success')">Process Check-in</button>` : ''}
      ${b.status === 'checked_in' ? `<button class="btn btn-accent" onclick="closeModal();showToast('Check-out processed — Room ${b.roomNumber} queued for cleaning','success')">Process Check-out</button>` : ''}
      <button class="btn btn-outline" onclick="closeModal();showToast('PDF receipt generated','info')">Print Receipt</button>
      ${b.status !== 'cancelled' && b.status !== 'checked_out' ? `<button class="btn btn-outline" style="color:var(--s-maintenance);border-color:var(--s-maintenance);" onclick="closeModal();showToast('Cancellation recorded','info')">Cancel Booking</button>` : ''}
    </div>
  </div>`;
  modal.classList.add('open');
}

function openRoomModal(id) {
  const room = D.rooms.find(r => r.id === id);
  if (!room) return;
  const booking = D.bookings.find(b => b.roomId === id && ['checked_in','confirmed'].includes(b.status));
  const modal = document.getElementById('bookingModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
  <div class="modal-header">
    <div>
      <div style="font-size:0.75rem;color:var(--light-text-2);margin-bottom:2px;">Room Details</div>
      <div style="font-size:1.125rem;font-weight:700;">Room ${room.roomNumber} — ${room.name}</div>
    </div>
    <div style="display:flex;gap:var(--sp-2);align-items:center;">
      ${makeBadge(room.status)}
      <div class="modal-close" onclick="closeModal()">&times;</div>
    </div>
  </div>
  <div class="modal-body">
    <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${room.type.charAt(0).toUpperCase()+room.type.slice(1)}</span></div>
    <div class="detail-row"><span class="detail-label">Floor</span><span class="detail-value detail-value-mono">Floor ${room.floor}</span></div>
    <div class="detail-row"><span class="detail-label">Capacity</span><span class="detail-value">${room.capacity} guest${room.capacity>1?'s':''}</span></div>
    <div class="detail-row"><span class="detail-label">Base Rate</span><span class="detail-value detail-value-mono">${fmtZAR(room.baseRate)} / night</span></div>
    <div class="detail-row"><span class="detail-label">Amenities</span><span class="detail-value">${room.amenities?.map(a=>a.replace(/_/g,' ')).join(', ') || '—'}</span></div>
    ${booking ? `
    <div style="margin-top:var(--sp-4);padding:var(--sp-4);background:var(--s-occupied-bg);border-radius:var(--r-sm);border:1px solid var(--s-occupied)20;">
      <div style="font-size:0.75rem;font-weight:700;color:var(--s-occupied);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:var(--sp-3);">Current Booking</div>
      <div style="font-weight:600;">${booking.guestName}</div>
      <div style="font-size:0.875rem;color:var(--light-text-2);font-family:var(--f-mono);">${booking.confirmationNumber}</div>
      <div style="font-size:0.875rem;color:var(--light-text-2);margin-top:var(--sp-1);">${fmtDate(booking.checkIn)} → ${fmtDate(booking.checkOut)}</div>
    </div>` : ''}
    <div class="action-row">
      <button class="btn btn-outline btn-sm" onclick="closeModal();showToast('Room status updated','success')">Update Status</button>
      <button class="btn btn-outline btn-sm" onclick="closeModal();showToast('Block dates saved','info')">Block Dates</button>
    </div>
  </div>`;
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('bookingModal').classList.remove('open');
}

document.getElementById('bookingModal').addEventListener('click', e => {
  if (e.target === document.getElementById('bookingModal')) closeModal();
});

/* ── Toast ── */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const inner = document.getElementById('toastInner');
  const icons = { success: '✓', info: '·', error: '✕' };
  const colors = { success: 'var(--s-available)', info: 'var(--light-text-2)', error: 'var(--s-maintenance)' };
  inner.innerHTML = `<span style="font-size:1rem;font-weight:700;color:${colors[type]};">${icons[type]}</span> ${msg}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
  }, 3200);
}

// Keyboard close
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

init();
