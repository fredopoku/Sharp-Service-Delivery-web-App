const STORAGE_KEY = 'ssd_packages'

const defaultPackages = [
  {
    id: 'SSD-001',
    sender: 'Kwame Mensah',
    recipient: 'Ama Boateng',
    origin: 'Kumasi, Ghana',
    destination: 'London, UK',
    description: 'Electronics — Laptop',
    weight: '2.3 kg',
    status: 'In Transit',
    estimatedDelivery: '2026-05-20',
    createdAt: '2026-05-01',
    events: [
      { location: 'Kumasi, Ghana', status: 'Package Received', date: '2026-05-01 09:00', icon: '📦' },
      { location: 'Accra, Ghana', status: 'Arrived at Sorting Facility', date: '2026-05-03 14:30', icon: '🏭' },
      { location: 'Accra, Ghana', status: 'Departed — Kotoka International', date: '2026-05-05 22:00', icon: '✈️' },
      { location: 'Heathrow, UK', status: 'Arrived — Customs Clearance', date: '2026-05-07 06:45', icon: '🛃' },
    ],
  },
  {
    id: 'SSD-002',
    sender: 'Abena Owusu',
    recipient: 'David Osei',
    origin: 'Accra, Ghana',
    destination: 'Toronto, Canada',
    description: 'Clothing & Accessories',
    weight: '5.1 kg',
    status: 'Delivered',
    estimatedDelivery: '2026-04-30',
    createdAt: '2026-04-15',
    events: [
      { location: 'Accra, Ghana', status: 'Package Received', date: '2026-04-15 11:00', icon: '📦' },
      { location: 'Accra, Ghana', status: 'Departed — Kotoka International', date: '2026-04-18 01:00', icon: '✈️' },
      { location: 'Toronto, Canada', status: 'Arrived — Pearson International', date: '2026-04-20 08:30', icon: '🛬' },
      { location: 'Toronto, Canada', status: 'Out for Delivery', date: '2026-04-29 09:00', icon: '🚚' },
      { location: 'Toronto, Canada', status: 'Delivered', date: '2026-04-30 13:45', icon: '✅' },
    ],
  },
  {
    id: 'SSD-003',
    sender: 'Kofi Asante',
    recipient: 'Sandra Nkrumah',
    origin: 'Takoradi, Ghana',
    destination: 'New York, USA',
    description: 'Documents & Certificates',
    weight: '0.4 kg',
    status: 'Pending Pickup',
    estimatedDelivery: '2026-05-25',
    createdAt: '2026-05-10',
    events: [
      { location: 'Takoradi, Ghana', status: 'Package Booked — Awaiting Pickup', date: '2026-05-10 16:00', icon: '🕐' },
    ],
  },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultPackages
  } catch {
    return defaultPackages
  }
}

function save(packages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages))
}

export function getPackages() {
  return load()
}

export function getPackageById(id) {
  return load().find(p => p.id.toUpperCase() === id.toUpperCase()) || null
}

export function addPackage(pkg) {
  const packages = load()
  const next = { ...pkg, id: generateId(packages), createdAt: new Date().toISOString().slice(0, 10) }
  save([...packages, next])
  return next
}

export function updatePackage(id, updates) {
  const packages = load().map(p => p.id === id ? { ...p, ...updates } : p)
  save(packages)
}

export function deletePackage(id) {
  save(load().filter(p => p.id !== id))
}

function generateId(packages) {
  const nums = packages.map(p => parseInt(p.id.replace('SSD-', ''), 10)).filter(Boolean)
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `SSD-${String(next).padStart(3, '0')}`
}

export const STATUS_OPTIONS = [
  'Pending Pickup',
  'In Transit',
  'At Customs',
  'Out for Delivery',
  'Delivered',
  'Returned',
  'On Hold',
]
