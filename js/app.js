const STORAGE_KEY = 'STITCHFLOW_CUSTOMER_ORDER_DATA';

const MASTER_TAILOR = {
    username: "admin",
    password: "mastertailor2026",
    name: "Master Tailor"
};

const DEFAULT_STATE = {
    customers: [
        { id: 1001, name: 'John Doe', phone: '+1 555-0142' },
        { id: 1002, name: 'Sarah Jenkins', phone: '+1 555-0188' }
    ],
    measurements: {
        1001: { chest: 40, waist: 32, length: 30, updatedAt: '2026-10-25' },
        1002: { chest: 36, waist: 28, length: 38, updatedAt: '2026-10-25' }
    },
    orders: [
        { id: 5001, customerId: 1001, item: '3-Piece Tuxedo', status: 'Pending', notes: 'Slim fit requested' },
        { id: 5002, customerId: 1002, item: 'Evening Gown Alteration', status: 'Completed', notes: 'Standard fit' }
    ]
};

const AREAS = {
    'Tambaram': [12.9249, 80.1000],
    'Chromepet': [12.9516, 80.1462],
    'Pallavaram': [12.9675, 80.1491],
    'Medavakkam': [12.9178, 80.1927],
    'Velachery': [12.9815, 80.2180],
    'Guindy': [13.0067, 80.2206],
    'Adyar': [13.0012, 80.2565],
    'T. Nagar': [13.0418, 80.2341],
    'Porur': [13.0382, 80.1565],
    'Anna Nagar': [13.0850, 80.2101],
    'Ambattur': [13.1143, 80.1548],
    'Perambur': [13.1186, 80.2330]
};

const TAILORS = [
    { id: 1, name: 'Royal Stitches', area: 'Tambaram', rating: 4.7, reviewCount: 214, price: 450, phone: '+91 90000 00001',
      services: ['Shirts', 'Trousers', 'Suits', 'Alterations'],
      reviews: ['Perfect fit on my suit, delivered a day early.', 'Neat finishing and fair pricing.'] },
    { id: 2, name: 'Meena Boutique', area: 'Chromepet', rating: 4.8, reviewCount: 340, price: 600, phone: '+91 90000 00002',
      services: ['Blouses', 'Bridal Wear', 'Kurtas', 'Alterations'],
      reviews: ['My bridal blouse came out exactly like the design.', 'Very patient with design changes.'] },
    { id: 3, name: 'Gentlemen\'s Cut', area: 'Velachery', rating: 4.5, reviewCount: 128, price: 700, phone: '+91 90000 00003',
      services: ['Suits', 'Shirts', 'Trousers', 'Sherwani'],
      reviews: ['Best formal wear tailor in the area.', 'A little pricey but worth it.'] },
    { id: 4, name: 'Anand Tailors', area: 'Pallavaram', rating: 4.2, reviewCount: 96, price: 350, phone: '+91 90000 00004',
      services: ['Shirts', 'Trousers', 'Alterations'],
      reviews: ['Quick alterations at a low price.', 'Good for everyday wear.'] },
    { id: 5, name: 'Lakshmi Designer Studio', area: 'Anna Nagar', rating: 4.9, reviewCount: 410, price: 850, phone: '+91 90000 00005',
      services: ['Blouses', 'Bridal Wear', 'Kurtas', 'Sherwani'],
      reviews: ['Excellent embroidery and detailing.', 'Booked them for my whole family wedding.'] },
    { id: 6, name: 'Perfect Fit Alterations', area: 'Guindy', rating: 4.3, reviewCount: 152, price: 250, phone: '+91 90000 00006',
      services: ['Alterations', 'Trousers', 'Shirts'],
      reviews: ['Fixed my trousers in one hour.', 'Honest and affordable.'] },
    { id: 7, name: 'Kumar Gents Tailoring', area: 'Medavakkam', rating: 4.4, reviewCount: 88, price: 400, phone: '+91 90000 00007',
      services: ['Shirts', 'Trousers', 'Suits'],
      reviews: ['Consistent quality on shirts.', 'Takes measurements carefully.'] },
    { id: 8, name: 'Stitch & Style', area: 'T. Nagar', rating: 4.6, reviewCount: 275, price: 650, phone: '+91 90000 00008',
      services: ['Blouses', 'Kurtas', 'Alterations', 'Bridal Wear'],
      reviews: ['Trendy designs and on-time delivery.', 'Great for festival outfits.'] },
    { id: 9, name: 'Sri Murugan Tailors', area: 'Ambattur', rating: 4.1, reviewCount: 74, price: 300, phone: '+91 90000 00009',
      services: ['Shirts', 'Trousers', 'Kurtas'],
      reviews: ['Simple, reliable and cheap.', 'School and office uniforms done well.'] },
    { id: 10, name: 'Heritage Sherwani House', area: 'Adyar', rating: 4.7, reviewCount: 190, price: 1500, phone: '+91 90000 00010',
      services: ['Sherwani', 'Suits', 'Bridal Wear'],
      reviews: ['Stunning sherwani for my wedding.', 'Premium fabric and perfect fit.'] },
    { id: 11, name: 'Porur Quick Stitch', area: 'Porur', rating: 4.0, reviewCount: 61, price: 280, phone: '+91 90000 00011',
      services: ['Alterations', 'Blouses', 'Kurtas'],
      reviews: ['Fast turnaround on blouse stitching.'] },
    { id: 12, name: 'Perambur Master Tailors', area: 'Perambur', rating: 4.4, reviewCount: 119, price: 480, phone: '+91 90000 00012',
      services: ['Shirts', 'Suits', 'Trousers', 'Kurtas'],
      reviews: ['Third generation tailors, very skilled.', 'Delivered before the festival.'] }
];

let tailorQuery = { location: '', service: 'All', sort: 'distance' };
let compareIds = [];

let state = loadStateFromStorage();
if (!state.selectedTailor) state.selectedTailor = {};
let currentUser = { name: "Guest", role: "Guest", id: null };

function loadStateFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Error loading persistent state", e);
        }
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveStateToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetStorage() {
    if (confirm("Reset application data to initial state?")) {
        localStorage.removeItem(STORAGE_KEY);
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        state.selectedTailor = {};
        compareIds = [];
        updateDropdowns();
        renderAll();
        alert("Database reset successfully!");
    }
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(viewId).classList.add('active');
    document.getElementById(`btn-${viewId}`).classList.add('active');
    
    updateDropdowns();
    renderAll();
}

function switchAuthTab(tab) {
    if (tab === 'customer') {
        document.getElementById('formCustomer').style.display = 'block';
        document.getElementById('formTailor').style.display = 'none';
        document.getElementById('tabCustomer').classList.add('active');
        document.getElementById('tabTailor').classList.remove('active');
    } else {
        document.getElementById('formCustomer').style.display = 'none';
        document.getElementById('formTailor').style.display = 'block';
        document.getElementById('tabCustomer').classList.remove('active');
        document.getElementById('tabTailor').classList.add('active');
    }
}

// Authentication Handlers
function handleCustomerAuth(e) {
    e.preventDefault();
    const name = document.getElementById('custAuthName').value.trim();
    const contact = document.getElementById('custAuthContact').value.trim();

    let customerRecord = state.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (!customerRecord) {
        customerRecord = { id: Date.now(), name: name, phone: contact };
        state.customers.push(customerRecord);
        saveStateToStorage();
    }

    currentUser = { name: customerRecord.name, role: 'Customer', id: customerRecord.id };
    updateUserBanner();
    switchView('place-order');
}

function handleTailorAuth(e) {
    e.preventDefault();
    const user = document.getElementById('tailorUser').value.trim();
    const pass = document.getElementById('tailorPass').value.trim();

    if (user === MASTER_TAILOR.username && pass === MASTER_TAILOR.password) {
        currentUser = { name: MASTER_TAILOR.name, role: 'Tailor', id: 0 };
        updateUserBanner();
        switchView('dashboard');
    } else {
        alert("ACCESS DENIED: Invalid Master Tailor credentials.");
    }
}

function logout() {
    currentUser = { name: "Guest", role: "Guest", id: null };
    updateUserBanner();
    switchView('landing');
}

function updateUserBanner() {
    const roleSpan = document.getElementById('currentUserRole');
    if (currentUser.role === 'Guest') {
        roleSpan.innerText = 'Not Signed In (Guest)';
    } else {
        roleSpan.innerText = `Signed In: ${currentUser.name} (${currentUser.role})`;
    }
    applyRolePermissions();
}

function applyRolePermissions() {
    const isTailor = currentUser.role === 'Tailor';
    const isCustomer = currentUser.role === 'Customer';
    const isGuest = currentUser.role === 'Guest';

    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = isGuest ? '' : 'none';
    });

    document.querySelectorAll('.tailor-only').forEach(el => {
        el.style.display = isTailor ? '' : 'none';
    });

    document.querySelectorAll('.customer-only').forEach(el => {
        el.style.display = isCustomer ? '' : 'none';
    });
}

// Centralized Measurement Synchronization Engine
function updateCustomerMeasurements(customerId, chest, waist, length) {
    if (!customerId) return;
    
    const formattedChest = parseFloat(chest) || 0;
    const formattedWaist = parseFloat(waist) || 0;
    const formattedLength = parseFloat(length) || 0;

    state.measurements[customerId] = {
        chest: formattedChest,
        waist: formattedWaist,
        length: formattedLength,
        updatedAt: new Date().toISOString().split('T')[0]
    };

    saveStateToStorage();
    renderAll();
}

// Customer Order Placement
function placeCustomerOrder(e) {
    e.preventDefault();
    if (currentUser.role !== 'Customer') return;

    const item = document.getElementById('custOrderItem').value;
    const chest = document.getElementById('custChest').value;
    const waist = document.getElementById('custWaist').value;
    const length = document.getElementById('custLength').value;
    const notes = document.getElementById('custNotes').value;

    updateCustomerMeasurements(currentUser.id, chest, waist, length);

    state.orders.push({
        id: Date.now(),
        customerId: currentUser.id,
        tailorId: state.selectedTailor[currentUser.id] || null,
        item: item,
        status: 'Pending',
        notes: notes
    });

    saveStateToStorage();
    e.target.reset();
    alert("Order and updated measurements recorded successfully!");
    switchView('orders');
}

// Customer Directory
function addCustomer(e) {
    e.preventDefault();
    if (currentUser.role !== 'Tailor') return;

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    
    const newId = Date.now();
    state.customers.push({ id: newId, name, phone });
    saveStateToStorage();

    e.target.reset();
    updateDropdowns();
    renderAll();
}

function deleteCustomer(id) {
    if (currentUser.role !== 'Tailor') return;
    state.customers = state.customers.filter(c => c.id !== id);
    delete state.measurements[id];
    state.orders = state.orders.filter(o => o.customerId !== id);
    saveStateToStorage();

    updateDropdowns();
    renderAll();
}

function renderCustomers() {
    const tbody = document.getElementById('customerTable');
    let customerList = state.customers;

    if (currentUser.role === 'Customer') {
        customerList = state.customers.filter(c => c.id === currentUser.id);
    }

    tbody.innerHTML = customerList.map(c => {
        const m = state.measurements[c.id];
        const chestVal = m ? `${m.chest}"` : '<span style="color:#94a3b8;">N/A</span>';
        const waistVal = m ? `${m.waist}"` : '<span style="color:#94a3b8;">N/A</span>';
        const lengthVal = m ? `${m.length}"` : '<span style="color:#94a3b8;">N/A</span>';

        return `
            <tr>
                <td>#${c.id.toString().slice(-4)}</td>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${chestVal}</td>
                <td>${waistVal}</td>
                <td>${lengthVal}</td>
                <td class="tailor-only">
                    <button class="btn btn-danger" onclick="deleteCustomer(${c.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Measurements Subsystem
function saveMyMeasurements(e) {
    e.preventDefault();
    if (currentUser.role !== 'Customer') return;

    const chest = document.getElementById('myChest').value;
    const waist = document.getElementById('myWaist').value;
    const length = document.getElementById('myLength').value;

    updateCustomerMeasurements(currentUser.id, chest, waist, length);
    alert("Your body measurements have been updated.");
}

function registerGuestWithMeasurements(e) {
    e.preventDefault();
    if (currentUser.role !== 'Guest') return;

    const name = document.getElementById('guestName').value.trim();
    const contact = document.getElementById('guestContact').value.trim();

    let customerRecord = state.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!customerRecord) {
        customerRecord = { id: Date.now(), name: name, phone: contact };
        state.customers.push(customerRecord);
    }

    const chest = document.getElementById('guestChest').value;
    const waist = document.getElementById('guestWaist').value;
    const length = document.getElementById('guestLength').value;

    updateCustomerMeasurements(customerRecord.id, chest, waist, length);

    currentUser = { name: customerRecord.name, role: 'Customer', id: customerRecord.id };
    e.target.reset();
    updateUserBanner();
    switchView('measurements');
    alert("Registration successful. Customer profile and measurements saved.");
}

function fillMeasurementForms() {
    const m = currentUser.role === 'Customer' ? state.measurements[currentUser.id] : null;
    const fields = {
        myChest: 'chest', myWaist: 'waist', myLength: 'length',
        custChest: 'chest', custWaist: 'waist', custLength: 'length'
    };
    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = m ? m[fields[id]] : '';
    });
}

function populateTailorMeasurementFields(custId) {
    if (!custId) return;
    const m = state.measurements[custId];
    document.getElementById('measChest').value = m ? m.chest : '';
    document.getElementById('measWaist').value = m ? m.waist : '';
    document.getElementById('measLength').value = m ? m.length : '';
}

function addMeasurement(e) {
    e.preventDefault();
    if (currentUser.role !== 'Tailor') return;

    const custId = document.getElementById('measCustSelect').value;
    const chest = document.getElementById('measChest').value;
    const waist = document.getElementById('measWaist').value;
    const length = document.getElementById('measLength').value;

    updateCustomerMeasurements(custId, chest, waist, length);
    alert("Customer measurement record updated.");
}

function renderMeasurements() {
    const tbody = document.getElementById('measurementTable');
    let customerIds = Object.keys(state.measurements);

    if (currentUser.role === 'Customer') {
        customerIds = customerIds.filter(id => id == currentUser.id);
    } else if (currentUser.role === 'Guest') {
        customerIds = [];
    }

    tbody.innerHTML = customerIds.map(custId => {
        const cust = state.customers.find(c => c.id == custId);
        const m = state.measurements[custId];
        const updatedOn = m.updatedAt || 'N/A';
        return `
            <tr>
                <td>${cust ? cust.name : 'Unknown Customer'}</td>
                <td>${m.chest}"</td>
                <td>${m.waist}"</td>
                <td>${m.length}"</td>
                <td><small style="color:#6b21a8;">${updatedOn}</small></td>
            </tr>
        `;
    }).join('');
}

// Orders Subsystem
function toggleOrderStatus(orderId) {
    if (currentUser.role !== 'Tailor') return;
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.status = order.status === 'Pending' ? 'Completed' : 'Pending';
        saveStateToStorage();
    }
    renderAll();
}

function renderOrders() {
    const tbody = document.getElementById('orderTable');
    let displayOrders = state.orders;

    if (currentUser.role === 'Customer') {
        displayOrders = state.orders.filter(o => o.customerId === currentUser.id);
    }

    tbody.innerHTML = displayOrders.map(o => {
        const cust = state.customers.find(c => c.id === o.customerId);
        const m = state.measurements[o.customerId];
        const measStr = m ? `Chest: ${m.chest}", Waist: ${m.waist}", Length: ${m.length}"` : 'No measurements attached';

        return `
            <tr>
                <td>#${o.id.toString().slice(-4)}</td>
                <td>${cust ? cust.name : 'Unknown'}</td>
                <td>${o.item} ${o.notes ? `<br><small style="color:#6b21a8;">Note: ${o.notes}</small>` : ''}${o.tailorId ? `<br><small style="color:#6b21a8;">Tailor: ${(TAILORS.find(t => t.id === o.tailorId) || {}).name || 'Unknown'}</small>` : ''}</td>
                <td><small>${measStr}</small></td>
                <td><span class="badge ${o.status === 'Pending' ? 'badge-pending' : 'badge-completed'}">${o.status}</span></td>
                <td class="tailor-only"><button class="btn" onclick="toggleOrderStatus(${o.id})">Toggle Status</button></td>
            </tr>
        `;
    }).join('');
}

// Tailor Search and Geospatial Functions
function distanceKm(a, b) {
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function findArea(text) {
    const q = text.trim().toLowerCase().replace(/\./g, '');
    if (!q) return null;
    return Object.keys(AREAS).find(a => a.toLowerCase().replace(/\./g, '') === q) ||
           Object.keys(AREAS).find(a => a.toLowerCase().replace(/\./g, '').includes(q));
}

function initTailorSearch() {
    document.getElementById('areaList').innerHTML = Object.keys(AREAS).map(a => `<option value="${a}">`).join('');
    const services = ['All', ...new Set(TAILORS.flatMap(t => t.services))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
    document.getElementById('tailorService').innerHTML = services.map(s => `<option value="${s}">${s === 'All' ? 'All services' : s}</option>`).join('');
}

function findTailors() {
    tailorQuery.location = document.getElementById('tailorLocation').value;
    tailorQuery.service = document.getElementById('tailorService').value;
    tailorQuery.sort = document.getElementById('tailorSort').value;
    renderTailors();
}

function toggleCompare(id) {
    if (compareIds.includes(id)) {
        compareIds = compareIds.filter(x => x !== id);
    } else if (compareIds.length >= 3) {
        alert("Maximum of 3 tailors allowed for direct comparison.");
    } else {
        compareIds.push(id);
    }
    document.getElementById('comparePanel').innerHTML = '';
    renderTailors();
}

function clearComparison() {
    compareIds = [];
    document.getElementById('comparePanel').innerHTML = '';
    renderTailors();
}

function showComparison() {
    if (compareIds.length < 2) {
        alert("Please select at least 2 tailors to compare.");
        return;
    }
    const origin = AREAS[findArea(tailorQuery.location)];
    const list = compareIds.map(id => TAILORS.find(t => t.id === id));
    const dist = t => origin ? distanceKm(origin, AREAS[t.area]).toFixed(1) + ' km' : 'Enter location';
    const row = (label, fn) => `<tr><th>${label}</th>${list.map(t => `<td>${fn(t)}</td>`).join('')}</tr>`;

    document.getElementById('comparePanel').innerHTML = `
        <div class="card" style="overflow-x: auto;">
            <h3>Tailor Comparison</h3>
            <table>
                <thead><tr><th></th>${list.map(t => `<th>${t.name}</th>`).join('')}</tr></thead>
                <tbody>
                    ${row('Area', t => t.area)}
                    ${row('Distance', dist)}
                    ${row('Rating', t => `<span class="stars">★ ${t.rating}</span> (${t.reviewCount} reviews)`)}
                    ${row('Starting Price', t => '₹' + t.price)}
                    ${row('Services', t => t.services.join(', '))}
                    ${row('Reviews', t => t.reviews.map(r => `"${r}"`).join('<br>'))}
                    ${row('Contact', t => `<a href="tel:${t.phone.replace(/\s/g, '')}">${t.phone}</a>`)}
                    ${row('', t => `<button class="btn" onclick="selectTailor(${t.id})">Select</button>`)}
                </tbody>
            </table>
        </div>`;
    document.getElementById('comparePanel').scrollIntoView({ behavior: 'smooth' });
}

function selectTailor(id) {
    if (currentUser.role !== 'Customer') {
        alert("Please sign in as a customer to select a primary tailor.");
        switchView('auth');
        return;
    }
    state.selectedTailor[currentUser.id] = id;
    saveStateToStorage();
    renderTailors();
}

function clearSelectedTailor() {
    if (currentUser.role !== 'Customer') return;
    delete state.selectedTailor[currentUser.id];
    saveStateToStorage();
    renderTailors();
}

function renderTailors() {
    const results = document.getElementById('tailorResults');
    if (!results) return;

    const areaName = findArea(tailorQuery.location);
    const origin = areaName ? AREAS[areaName] : null;
    const msg = document.getElementById('tailorMessage');

    if (tailorQuery.location.trim() && !origin) {
        msg.innerHTML = `<div class="card" style="background:#fef9c3; border-color:#fde047;">Location "${tailorQuery.location}" not recognized. Available areas: ${Object.keys(AREAS).join(', ')}. Displaying all tailors.</div>`;
    } else if (origin) {
        msg.innerHTML = `<div class="card" style="background:#faf5ff;">Displaying tailors within proximity of <b>${areaName}</b>.</div>`;
    } else {
        msg.innerHTML = '';
    }

    let list = TAILORS.map(t => ({ ...t, km: origin ? distanceKm(origin, AREAS[t.area]) : null }));
    if (tailorQuery.service !== 'All') list = list.filter(t => t.services.includes(tailorQuery.service));

    if (tailorQuery.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (tailorQuery.sort === 'price') list.sort((a, b) => a.price - b.price);
    else if (origin) list.sort((a, b) => a.km - b.km);

    const chosenId = currentUser.role === 'Customer' ? state.selectedTailor[currentUser.id] : null;
    const chosen = TAILORS.find(t => t.id === chosenId);
    document.getElementById('selectedTailorBox').innerHTML = chosen ? `
        <div class="user-banner">
            <div>Selected Tailor: ${chosen.name} (${chosen.area})</div>
            <div>
                <button class="btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; margin-right: 0.5rem;" onclick="switchView('place-order')">Place Order</button>
                <button class="btn btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="clearSelectedTailor()">Change Tailor</button>
            </div>
        </div>` : '';

    const bar = document.getElementById('compareBar');
    bar.style.display = compareIds.length ? 'flex' : 'none';
    document.getElementById('compareCount').innerText = compareIds.length;

    if (!list.length) {
        results.innerHTML = '<div class="card empty-note" style="grid-column: 1 / -1;">No tailors offer the requested service filter.</div>';
        return;
    }

    results.innerHTML = list.map(t => `
        <div class="card tailor-card ${t.id === chosenId ? 'chosen' : ''}">
            <h4>${t.name}</h4>
            <div class="tailor-meta">
                <span class="stars">★ ${t.rating} <span style="color:#6b21a8; font-weight:normal;">(${t.reviewCount})</span></span>
                <span>${t.area}${t.km !== null ? ' · ' + t.km.toFixed(1) + ' km away' : ''}</span>
                <span>From <b>₹${t.price}</b></span>
            </div>
            <div>${t.services.map(s => `<span class="tag">${s}</span>`).join('')}</div>
            ${t.reviews.slice(0, 2).map(r => `<p class="review">"${r}"</p>`).join('')}
            <div class="tailor-actions">
                <a class="btn" href="tel:${t.phone.replace(/\s/g, '')}">Call</a>
                <a class="btn btn-whatsapp" href="https://wa.me/${t.phone.replace(/\D/g, '')}" target="_blank" rel="noopener">WhatsApp</a>
                <button class="btn btn-secondary" onclick="selectTailor(${t.id})">${t.id === chosenId ? 'Selected' : 'Select'}</button>
                <label class="compare-check"><input type="checkbox" ${compareIds.includes(t.id) ? 'checked' : ''} onchange="toggleCompare(${t.id})"> Compare</label>
            </div>
        </div>
    `).join('');
}

// Dashboard Metrics Pipeline
function renderDashboard() {
    let displayOrders = state.orders;
    if (currentUser.role === 'Customer') {
        displayOrders = state.orders.filter(o => o.customerId === currentUser.id);
    }

    document.getElementById('statCustomers').innerText = currentUser.role === 'Customer' ? 1 : state.customers.length;
    document.getElementById('statOrders').innerText = displayOrders.length;
    document.getElementById('statPending').innerText = displayOrders.filter(o => o.status === 'Pending').length;
}

function updateDropdowns() {
    const select = document.getElementById('measCustSelect');
    const options = state.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    select.innerHTML = options || '<option value="">No registered customers</option>';
    if (select.value) {
        populateTailorMeasurementFields(select.value);
    }
}

function renderAll() {
    renderCustomers();
    renderMeasurements();
    renderOrders();
    renderDashboard();
    renderTailors();
    fillMeasurementForms();
    applyRolePermissions();
}

// System Initialization
initTailorSearch();
updateUserBanner();
updateDropdowns();
renderAll();
switchView('landing');
