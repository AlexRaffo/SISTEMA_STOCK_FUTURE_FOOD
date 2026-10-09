// ==========================================================================
// FUTURE FOOD SRL - SISTEMA DE STOCK, PRODUCCIÓN Y CONTABILIDAD EMPRESARIAL
// React 18 Application Logic
// ==========================================================================

const { useState, useEffect, useMemo, useRef } = React;

// -----------------------------
// FORMATTERS & UTILS
// -----------------------------
const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatNumber = (val, decimals = 2) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// -----------------------------
// SEED DATA INITIALIZATION
// -----------------------------
const INITIAL_SUPPLIERS = [
  {
    id: 'PROV-001',
    name: 'Molinos del Centro S.A.',
    cuit: '30-71458921-8',
    address: 'Av. Circunvalación 4520, Córdoba Capital',
    contactName: 'Carlos Mendizábal',
    phone: '+54 351 489-2233',
    email: 'ventas@molinosdelcentro.com.ar',
    notes: 'Proveedor principal de cereales y harinas agroecológicas. Entregas en 48hs.'
  },
  {
    id: 'PROV-002',
    name: 'NutriSupply Argentina S.R.L.',
    cuit: '30-71882341-3',
    address: 'Parque Industrial Pilar Lote 45, Buenos Aires',
    contactName: 'Lic. Mariana Varela',
    phone: '+54 11 5234-9988',
    email: 'pedidos@nutrisupply.com.ar',
    notes: 'Proteínas Whey Isolate, Cacao puro desgrasado y aminoácidos certificados.'
  },
  {
    id: 'PROV-003',
    name: 'AgroAlimentos de Cuyo S.A.',
    cuit: '30-68912304-5',
    address: 'Ruta Provincial 7 Km 1012, Mendoza',
    contactName: 'Roberto Guiñazú',
    phone: '+54 261 498-1122',
    email: 'rguinazu@agrocuyo.com.ar',
    notes: 'Pasta de maní 100% natural sin aditivos y semillas seleccionadas de Chía.'
  },
  {
    id: 'PROV-004',
    name: 'Apícola San Rafael',
    cuit: '20-25443912-4',
    address: 'Finca La Colmena s/n, San Rafael, Mendoza',
    contactName: 'Esteban Rossi',
    phone: '+54 260 442-8811',
    email: 'apicolasanrafael@gmail.com',
    notes: 'Miel pura de abeja cruda multifloral, libre de jarabes y pesticidas.'
  },
  {
    id: 'PROV-005',
    name: 'Envases Flexibles S.A.',
    cuit: '30-64210985-1',
    address: 'Av. Pavón 3450, Lanús Oeste, Buenos Aires',
    contactName: 'Andrea Fabbri',
    phone: '+54 11 4241-7700',
    email: 'afabbri@envasesflexibles.com.ar',
    notes: 'Doypack trilaminados barrera alta y bobinas Flowpack con impresión flexográfica.'
  },
  {
    id: 'PROV-006',
    name: 'Cartonería Industrial S.R.L.',
    cuit: '30-70891234-9',
    address: 'Parque Industrial San Martín, Buenos Aires',
    contactName: 'Jorge Pérez',
    phone: '+54 11 4755-3211',
    email: 'jperez@cartoneriaind.com',
    notes: 'Cajas corrugadas para embalaje secundario x 24 unidades.'
  }
];

const INITIAL_CLIENTS = [
  {
    id: 'CLI-001',
    name: 'Dietética Vida Sana & Natural',
    cuit: '30-71239845-2',
    address: 'Av. Cabildo 2140, CABA',
    contactName: 'Lucía Gómez',
    phone: '+54 11 4781-9920',
    email: 'compras@vidasana.com.ar',
    notes: 'Cadena de 4 sucursales. Cuenta corriente a 30 días.'
  },
  {
    id: 'CLI-002',
    name: 'Supermercados Austral S.R.L.',
    cuit: '30-65432109-7',
    address: 'Av. Colón 1890, Mar del Plata, Bs. As.',
    contactName: 'Martín Benítez',
    phone: '+54 223 492-3300',
    email: 'mbenitez@superaustral.com.ar',
    notes: 'Distribución mayorista en costa atlántica. Pedidos quincenales.'
  },
  {
    id: 'CLI-003',
    name: 'Gimnasio & Fitness Iron Fit',
    cuit: '27-33445566-4',
    address: 'Bv. San Juan 840, Córdoba Capital',
    contactName: 'Romina Valenzuela',
    phone: '+54 351 421-5544',
    email: 'shop@ironfit.com.ar',
    notes: 'Punto de venta directo en 3 gimnasios. Consumo alto de barritas proteicas.'
  },
  {
    id: 'CLI-004',
    name: 'Nutrición Activa Store',
    cuit: '30-71994821-6',
    address: 'San Martín 620, Rosario, Santa Fe',
    contactName: 'Diego Fontana',
    phone: '+54 341 448-9100',
    email: 'dfontana@nutricionactiva.com.ar',
    notes: 'Tienda de suplementación y alimentos funcionales.'
  }
];

const INITIAL_RAW_MATERIALS = [
  {
    id: 'MP-001',
    code: 'MP-AVE-01',
    name: 'Harina de Avena Integral',
    unit: 'Kg',
    costPrice: 1850.00,
    supplierId: 'PROV-001',
    currentStock: 480.00,
    minStock: 120.00,
    category: 'Cereales y Harinas',
    location: 'Depósito Central - Estante A1'
  },
  {
    id: 'MP-002',
    code: 'MP-WHE-02',
    name: 'Proteína Whey Isolate 90%',
    unit: 'Kg',
    costPrice: 14200.00,
    supplierId: 'PROV-002',
    currentStock: 85.50,
    minStock: 25.00,
    category: 'Proteínas y Suplementos',
    location: 'Depósito Climatizado - Estante B1'
  },
  {
    id: 'MP-003',
    code: 'MP-MAN-03',
    name: 'Pasta de Maní 100% Natural',
    unit: 'Kg',
    costPrice: 3400.00,
    supplierId: 'PROV-003',
    currentStock: 220.00,
    minStock: 60.00,
    category: 'Pastas y Frutos Secos',
    location: 'Depósito Central - Estante C2'
  },
  {
    id: 'MP-004',
    code: 'MP-MIE-04',
    name: 'Miel Pura de Abeja Cruda',
    unit: 'Kg',
    costPrice: 4100.00,
    supplierId: 'PROV-004',
    currentStock: 110.00,
    minStock: 35.00,
    category: 'Endulzantes Naturales',
    location: 'Depósito Central - Estante D1'
  },
  {
    id: 'MP-005',
    code: 'MP-CHI-05',
    name: 'Semillas de Chía Agroecológica',
    unit: 'Kg',
    costPrice: 2900.00,
    supplierId: 'PROV-003',
    currentStock: 95.00,
    minStock: 30.00,
    category: 'Semillas y Granos',
    location: 'Depósito Central - Estante A2'
  },
  {
    id: 'MP-006',
    code: 'MP-CAC-06',
    name: 'Cacao Amargo Puro en Polvo',
    unit: 'Kg',
    costPrice: 8500.00,
    supplierId: 'PROV-002',
    currentStock: 45.00,
    minStock: 20.00,
    category: 'Saborizantes y Cacao',
    location: 'Depósito Climatizado - Estante B2'
  },
  {
    id: 'MP-007',
    code: 'MP-DOY-07',
    name: 'Envase Doypack Impreso 250g con Cierre',
    unit: 'Unidad',
    costPrice: 125.00,
    supplierId: 'PROV-005',
    currentStock: 3200.00,
    minStock: 800.00,
    category: 'Packaging y Envases',
    location: 'Almacén de Empaque - Zona E'
  },
  {
    id: 'MP-008',
    code: 'MP-FLO-08',
    name: 'Envoltorio Flowpack Individual Barrera Alta',
    unit: 'Unidad',
    costPrice: 48.00,
    supplierId: 'PROV-005',
    currentStock: 7400.00,
    minStock: 2000.00,
    category: 'Packaging y Envases',
    location: 'Almacén de Empaque - Zona E'
  },
  {
    id: 'MP-009',
    code: 'MP-CAJ-09',
    name: 'Caja Corrugada Exhibidora x24u',
    unit: 'Unidad',
    costPrice: 390.00,
    supplierId: 'PROV-006',
    currentStock: 380.00,
    minStock: 100.00,
    category: 'Packaging y Envases',
    location: 'Almacén de Empaque - Zona F'
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'PT-001',
    code: 'PT-BAR-01',
    name: 'Barrita Proteica Choco-Maní 60g',
    category: 'Snacks Proteicos',
    salePrice: 1950.00,
    currentStock: 520,
    minStock: 150,
    description: 'Barra energética con 20g de proteína whey y baño de cacao puro.',
    // Check list BOM (Bill of Materials) - consumo exacto por unidad
    bom: [
      { rawMaterialId: 'MP-002', quantity: 0.022 }, // 22g de Proteína Whey
      { rawMaterialId: 'MP-003', quantity: 0.025 }, // 25g de Pasta de Maní
      { rawMaterialId: 'MP-004', quantity: 0.010 }, // 10g de Miel
      { rawMaterialId: 'MP-006', quantity: 0.005 }, // 5g de Cacao
      { rawMaterialId: 'MP-008', quantity: 1.000 }  // 1 Envoltorio Flowpack
    ]
  },
  {
    id: 'PT-002',
    code: 'PT-GRA-02',
    name: 'Granola Crunchy Superfood 250g',
    category: 'Desayunos Saludables',
    salePrice: 3850.00,
    currentStock: 230,
    minStock: 80,
    description: 'Avena horneada con miel de abeja, chía y chips de cacao puro.',
    bom: [
      { rawMaterialId: 'MP-001', quantity: 0.150 }, // 150g de Avena
      { rawMaterialId: 'MP-004', quantity: 0.045 }, // 45g de Miel
      { rawMaterialId: 'MP-005', quantity: 0.035 }, // 35g de Chía
      { rawMaterialId: 'MP-006', quantity: 0.020 }, // 20g de Cacao
      { rawMaterialId: 'MP-007', quantity: 1.000 }  // 1 Envase Doypack 250g
    ]
  },
  {
    id: 'PT-003',
    code: 'PT-BIT-03',
    name: 'Protein Bites Cacao & Chía 150g',
    category: 'Snacks Proteicos',
    salePrice: 3100.00,
    currentStock: 160,
    minStock: 60,
    description: 'Bocaditos proteicos sin cocción a base de pasta de maní y semillas.',
    bom: [
      { rawMaterialId: 'MP-002', quantity: 0.040 }, // 40g de Proteína Whey
      { rawMaterialId: 'MP-003', quantity: 0.060 }, // 60g de Pasta de Maní
      { rawMaterialId: 'MP-005', quantity: 0.030 }, // 30g de Chía
      { rawMaterialId: 'MP-006', quantity: 0.020 }, // 20g de Cacao
      { rawMaterialId: 'MP-007', quantity: 1.000 }  // 1 Envase Doypack 250g
    ]
  },
  {
    id: 'PT-004',
    code: 'PT-MAN-04',
    name: 'Crema de Maní Crunchy con Chía 400g',
    category: 'Untables Saludables',
    salePrice: 2800.00,
    currentStock: 95,
    minStock: 50,
    description: 'Untable de maní tostado con textura crocante y chía seleccionada.',
    bom: [
      { rawMaterialId: 'MP-003', quantity: 0.360 }, // 360g de Pasta de Maní
      { rawMaterialId: 'MP-005', quantity: 0.040 }, // 40g de Chía
      { rawMaterialId: 'MP-007', quantity: 1.000 }  // 1 Envase Doypack
    ]
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-001',
    code: 'CMP-2026-001',
    type: 'COMPRA',
    date: '2026-09-28T09:30:00.000Z',
    entityId: 'PROV-001',
    entityName: 'Molinos del Centro S.A.',
    referenceNumber: 'FC-A 0004-00012894',
    items: [
      { id: 'MP-001', name: 'Harina de Avena Integral', quantity: 300, unit: 'Kg', unitPrice: 1850.00, subtotal: 555000.00 }
    ],
    totalAmount: 555000.00,
    notes: 'Ingreso de lote MP-L2026-A12 con análisis microbiológico aprobado.'
  },
  {
    id: 'TRX-002',
    code: 'CMP-2026-002',
    type: 'COMPRA',
    date: '2026-09-29T11:15:00.000Z',
    entityId: 'PROV-002',
    entityName: 'NutriSupply Argentina S.R.L.',
    referenceNumber: 'FC-A 0001-00004521',
    items: [
      { id: 'MP-002', name: 'Proteína Whey Isolate 90%', quantity: 50, unit: 'Kg', unitPrice: 14200.00, subtotal: 710000.00 },
      { id: 'MP-006', name: 'Cacao Amargo Puro en Polvo', quantity: 30, unit: 'Kg', unitPrice: 8500.00, subtotal: 255000.00 }
    ],
    totalAmount: 965000.00,
    notes: 'Recepción insumos críticos para producción mensual.'
  },
  {
    id: 'TRX-003',
    code: 'PRD-2026-001',
    type: 'PRODUCCION',
    date: '2026-10-01T14:00:00.000Z',
    productId: 'PT-001',
    productName: 'Barrita Proteica Choco-Maní 60g',
    quantityProduced: 400,
    batchNumber: 'LOTE-BAR-2610-01',
    consumedMaterials: [
      { rawMaterialId: 'MP-002', name: 'Proteína Whey Isolate 90%', quantity: 8.80, unit: 'Kg', unitCost: 14200.00, subtotal: 124960.00 },
      { rawMaterialId: 'MP-003', name: 'Pasta de Maní 100% Natural', quantity: 10.00, unit: 'Kg', unitCost: 3400.00, subtotal: 34000.00 },
      { rawMaterialId: 'MP-004', name: 'Miel Pura de Abeja Cruda', quantity: 4.00, unit: 'Kg', unitCost: 4100.00, subtotal: 16400.00 },
      { rawMaterialId: 'MP-006', name: 'Cacao Amargo Puro en Polvo', quantity: 2.00, unit: 'Kg', unitCost: 8500.00, subtotal: 17000.00 },
      { rawMaterialId: 'MP-008', name: 'Envoltorio Flowpack Individual', quantity: 400, unit: 'Unidad', unitCost: 48.00, subtotal: 19200.00 }
    ],
    totalCost: 211560.00,
    unitCost: 528.90,
    notes: 'Orden de producción cumplida exitosamente en turno mañana. Rendimiento 100%.'
  },
  {
    id: 'TRX-004',
    code: 'VTA-2026-001',
    type: 'VENTA',
    date: '2026-10-03T16:45:00.000Z',
    entityId: 'CLI-003',
    entityName: 'Gimnasio & Fitness Iron Fit',
    referenceNumber: 'FC-B 0002-00000841',
    items: [
      { id: 'PT-001', name: 'Barrita Proteica Choco-Maní 60g', quantity: 200, unitPrice: 1950.00, subtotal: 390000.00 }
    ],
    totalAmount: 390000.00,
    notes: 'Entrega en sucursal Bv. San Juan con remito firmado.'
  },
  {
    id: 'TRX-005',
    code: 'VTA-2026-002',
    type: 'VENTA',
    date: '2026-10-04T10:20:00.000Z',
    entityId: 'CLI-001',
    entityName: 'Dietética Vida Sana & Natural',
    referenceNumber: 'FC-B 0002-00000842',
    items: [
      { id: 'PT-001', name: 'Barrita Proteica Choco-Maní 60g', quantity: 150, unitPrice: 1950.00, subtotal: 292500.00 },
      { id: 'PT-002', name: 'Granola Crunchy Superfood 250g', quantity: 60, unitPrice: 3850.00, subtotal: 231000.00 }
    ],
    totalAmount: 523500.00,
    notes: 'Pedido mensual consolidado. Despachado por transporte expreso.'
  }
];

// Helper to calculate BOM unit cost for a product
const calculateBomUnitCost = (bom = [], rawMaterials = []) => {
  if (!bom || !Array.isArray(bom)) return 0;
  return bom.reduce((acc, item) => {
    const raw = rawMaterials.find(r => r.id === item.rawMaterialId);
    const unitPrice = raw ? Number(raw.costPrice) || 0 : 0;
    return acc + (unitPrice * (Number(item.quantity) || 0));
  }, 0);
};

// Helper to calculate maximum immediate production units based on current stock
const calculateMaxProduction = (bom = [], rawMaterials = []) => {
  if (!bom || bom.length === 0) return 0;
  let maxPossible = Infinity;
  for (const item of bom) {
    const raw = rawMaterials.find(r => r.id === item.rawMaterialId);
    if (!raw || !item.quantity || Number(item.quantity) <= 0) {
      return 0;
    }
    const possibleForThisRaw = Math.floor(raw.currentStock / item.quantity);
    if (possibleForThisRaw < maxPossible) {
      maxPossible = possibleForThisRaw;
    }
  }
  return maxPossible === Infinity ? 0 : Math.max(0, maxPossible);
};

// -----------------------------
// MAIN APP COMPONENT
// -----------------------------
function FutureFoodStockApp() {
  // Load State from LocalStorage or Initial Seed Data
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, rawMaterials, products, purchases, production, sales, entities, audit
  const [notification, setNotification] = useState(null);

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('ff_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('ff_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [rawMaterials, setRawMaterials] = useState(() => {
    const saved = localStorage.getItem('ff_raw_materials');
    return saved ? JSON.parse(saved) : INITIAL_RAW_MATERIALS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ff_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ff_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Modals state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'newRawMaterial', 'editRawMaterial', 'newProduct', 'editProduct', 'newSupplier', 'editSupplier', 'newClient', 'editClient', 'newPurchase', 'newProduction', 'newSale', 'viewTransaction', 'quickStockAdjust', 'backupRestore'
    data: null
  });

  // Print voucher modal state
  const [printDoc, setPrintDoc] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ff_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('ff_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ff_raw_materials', JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem('ff_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // -----------------------------
  // ACCOUNTING & VALUATION METRICS
  // -----------------------------
  const metrics = useMemo(() => {
    // 1. Total Raw Materials Valuation ($)
    const rawValuation = rawMaterials.reduce((acc, rm) => acc + (rm.currentStock * rm.costPrice), 0);
    
    // 2. Total Finished Goods Valuation ($ at BOM Cost and at Sale Price)
    const productsCostValuation = products.reduce((acc, p) => {
      const bomCost = calculateBomUnitCost(p.bom, rawMaterials);
      return acc + (p.currentStock * bomCost);
    }, 0);

    const productsSaleValuation = products.reduce((acc, p) => acc + (p.currentStock * p.salePrice), 0);

    // 3. Transactions Aggregations
    const totalPurchases = transactions
      .filter(t => t.type === 'COMPRA')
      .reduce((acc, t) => acc + (t.totalAmount || 0), 0);

    const totalSales = transactions
      .filter(t => t.type === 'VENTA')
      .reduce((acc, t) => acc + (t.totalAmount || 0), 0);

    const totalProductionCost = transactions
      .filter(t => t.type === 'PRODUCCION')
      .reduce((acc, t) => acc + (t.totalCost || 0), 0);

    // 4. Low stock alerts
    const lowStockRawMaterials = rawMaterials.filter(rm => rm.currentStock <= rm.minStock);
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

    return {
      rawValuation,
      productsCostValuation,
      productsSaleValuation,
      totalInventoryValuation: rawValuation + productsCostValuation,
      totalPurchases,
      totalSales,
      totalProductionCost,
      estimatedGrossMargin: totalSales > 0 ? ((totalSales - totalProductionCost) / totalSales * 100) : 0,
      lowStockRawMaterials,
      lowStockProducts,
      totalRawItems: rawMaterials.length,
      totalProductItems: products.length
    };
  }, [rawMaterials, products, transactions]);

  // -----------------------------
  // BUSINESS OPERATIONS HANDLERS
  // -----------------------------

  // 1. REGISTRO DE COMPRA (+ Materia Prima / Proveedor)
  const handleRegisterPurchase = (purchaseData) => {
    const { supplierId, referenceNumber, items, notes, updateCosts } = purchaseData;
    const supplier = suppliers.find(s => s.id === supplierId);
    
    if (!supplier) {
      showToast('Debe seleccionar un proveedor válido', 'error');
      return;
    }
    if (!items || items.length === 0) {
      showToast('Debe agregar al menos una materia prima a la compra', 'error');
      return;
    }

    const newCode = `CMP-${new Date().getFullYear()}-${String(transactions.filter(t => t.type === 'COMPRA').length + 1).padStart(3, '0')}`;
    const totalAmount = items.reduce((acc, it) => acc + (Number(it.quantity) * Number(it.unitPrice)), 0);

    // Update Raw Materials Stock & Cost Prices if specified
    setRawMaterials(prev => {
      return prev.map(rm => {
        const purchased = items.find(it => it.rawMaterialId === rm.id);
        if (purchased) {
          const newStock = Number(rm.currentStock) + Number(purchased.quantity);
          const newCost = updateCosts ? Number(purchased.unitPrice) : rm.costPrice;
          return {
            ...rm,
            currentStock: newStock,
            costPrice: newCost,
            supplierId: supplierId || rm.supplierId
          };
        }
        return rm;
      });
    });

    // Create Transaction Record
    const newTransaction = {
      id: `TRX-${Date.now()}`,
      code: newCode,
      type: 'COMPRA',
      date: new Date().toISOString(),
      entityId: supplier.id,
      entityName: supplier.name,
      referenceNumber: referenceNumber || 'S/N',
      items: items.map(it => {
        const rm = rawMaterials.find(r => r.id === it.rawMaterialId);
        return {
          id: it.rawMaterialId,
          name: rm ? rm.name : 'Materia Prima',
          quantity: Number(it.quantity),
          unit: rm ? rm.unit : 'Unidad',
          unitPrice: Number(it.unitPrice),
          subtotal: Number(it.quantity) * Number(it.unitPrice)
        };
      }),
      totalAmount,
      notes: notes || 'Entrada de almacén por compra de materias primas'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    showToast(`¡Compra ${newCode} registrada! Se ingresaron ${items.length} materias primas al stock.`);
    setModalState({ isOpen: false, type: null, data: null });
  };

  // 2. REGISTRO DE PRODUCCIÓN (- Materias Primas / + Mercadería)
  const handleRegisterProduction = (prodData) => {
    const { productId, quantity, batchNumber, notes } = prodData;
    const qtyToProduce = Number(quantity);
    const product = products.find(p => p.id === productId);

    if (!product) {
      showToast('Seleccione un producto terminado a fabricar', 'error');
      return;
    }
    if (qtyToProduce <= 0) {
      showToast('La cantidad a producir debe ser mayor a cero', 'error');
      return;
    }

    if (!product.bom || product.bom.length === 0) {
      showToast('El producto seleccionado no posee materias primas configuradas en su checklist / receta BOM', 'error');
      return;
    }

    // Strict validation: check raw material availability
    const missingMaterials = [];
    for (const bomItem of product.bom) {
      const rm = rawMaterials.find(r => r.id === bomItem.rawMaterialId);
      const requiredQty = bomItem.quantity * qtyToProduce;
      if (!rm || rm.currentStock < requiredQty) {
        missingMaterials.push({
          name: rm ? rm.name : `MP Desconocida (${bomItem.rawMaterialId})`,
          required: requiredQty,
          available: rm ? rm.currentStock : 0,
          unit: rm ? rm.unit : 'u'
        });
      }
    }

    if (missingMaterials.length > 0) {
      const msg = `Stock insuficiente de materias primas:\n` + 
        missingMaterials.map(m => `• ${m.name}: Requiere ${formatNumber(m.required)} ${m.unit}, Disponible: ${formatNumber(m.available)} ${m.unit}`).join('\n');
      alert(msg);
      return;
    }

    // Deduct Raw Materials from Stock
    const consumedMaterials = [];
    let totalCost = 0;

    setRawMaterials(prev => {
      return prev.map(rm => {
        const bomItem = product.bom.find(b => b.rawMaterialId === rm.id);
        if (bomItem) {
          const requiredQty = bomItem.quantity * qtyToProduce;
          const subtotalCost = requiredQty * rm.costPrice;
          totalCost += subtotalCost;
          consumedMaterials.push({
            rawMaterialId: rm.id,
            name: rm.name,
            quantity: requiredQty,
            unit: rm.unit,
            unitCost: rm.costPrice,
            subtotal: subtotalCost
          });
          return {
            ...rm,
            currentStock: Math.max(0, rm.currentStock - requiredQty)
          };
        }
        return rm;
      });
    });

    // Add Produced Goods to Product Stock
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            currentStock: Number(p.currentStock) + qtyToProduce
          };
        }
        return p;
      });
    });

    const newCode = `PRD-${new Date().getFullYear()}-${String(transactions.filter(t => t.type === 'PRODUCCION').length + 1).padStart(3, '0')}`;
    const unitCost = qtyToProduce > 0 ? (totalCost / qtyToProduce) : 0;

    const newTransaction = {
      id: `TRX-${Date.now()}`,
      code: newCode,
      type: 'PRODUCCION',
      date: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      quantityProduced: qtyToProduce,
      batchNumber: batchNumber || `LOTE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(transactions.length + 1).padStart(2, '0')}`,
      consumedMaterials,
      totalCost,
      unitCost,
      notes: notes || 'Fabricación ejecutada de acuerdo a fórmula estándar'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    showToast(`¡Producción exitosa! Se fabricaron ${formatNumber(qtyToProduce)} u. de "${product.name}" y se descontaron los insumos del almacén.`);
    setModalState({ isOpen: false, type: null, data: null });
  };

  // 3. REGISTRO DE VENTA (- Mercadería / Cliente)
  const handleRegisterSale = (saleData) => {
    const { clientId, referenceNumber, items, notes } = saleData;
    const client = clients.find(c => c.id === clientId);

    if (!client) {
      showToast('Seleccione un cliente válido para la venta', 'error');
      return;
    }
    if (!items || items.length === 0) {
      showToast('Agregue al menos una mercadería a la venta', 'error');
      return;
    }

    // Validate stock for all sold products
    const insufficientStock = [];
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      const qtyToSell = Number(item.quantity);
      if (!prod || prod.currentStock < qtyToSell) {
        insufficientStock.push({
          name: prod ? prod.name : 'Mercadería',
          requested: qtyToSell,
          available: prod ? prod.currentStock : 0
        });
      }
    }

    if (insufficientStock.length > 0) {
      const msg = `Stock insuficiente de mercadería para la venta:\n` +
        insufficientStock.map(m => `• ${m.name}: Solicitado: ${m.requested} u, Disponible: ${m.available} u`).join('\n');
      alert(msg);
      return;
    }

    // Deduct Finished Goods from Stock
    setProducts(prev => {
      return prev.map(p => {
        const soldItem = items.find(it => it.productId === p.id);
        if (soldItem) {
          return {
            ...p,
            currentStock: p.currentStock - Number(soldItem.quantity)
          };
        }
        return p;
      });
    });

    const newCode = `VTA-${new Date().getFullYear()}-${String(transactions.filter(t => t.type === 'VENTA').length + 1).padStart(3, '0')}`;
    const totalAmount = items.reduce((acc, it) => acc + (Number(it.quantity) * Number(it.unitPrice)), 0);

    const newTransaction = {
      id: `TRX-${Date.now()}`,
      code: newCode,
      type: 'VENTA',
      date: new Date().toISOString(),
      entityId: client.id,
      entityName: client.name,
      referenceNumber: referenceNumber || 'REMITO-S/N',
      items: items.map(it => {
        const prod = products.find(p => p.id === item.productId);
        return {
          id: it.productId,
          name: prod ? prod.name : 'Mercadería',
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          subtotal: Number(it.quantity) * Number(it.unitPrice)
        };
      }),
      totalAmount,
      notes: notes || 'Salida de mercadería por venta despachada'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    showToast(`¡Venta ${newCode} registrada a ${client.name}! Mercadería descontada de stock.`);
    setModalState({ isOpen: false, type: null, data: null });
  };

  // CRUD RAW MATERIALS
  const handleSaveRawMaterial = (formData) => {
    if (modalState.type === 'editRawMaterial') {
      setRawMaterials(prev => prev.map(rm => rm.id === formData.id ? { ...rm, ...formData } : rm));
      showToast(`Materia prima "${formData.name}" actualizada con éxito.`);
    } else {
      const newId = `MP-${String(rawMaterials.length + 1).padStart(3, '0')}`;
      const newCode = formData.code || `MP-${formData.name.substring(0, 3).toUpperCase()}-${String(rawMaterials.length + 1).padStart(2, '0')}`;
      const newRM = {
        ...formData,
        id: newId,
        code: newCode,
        currentStock: Number(formData.currentStock) || 0,
        costPrice: Number(formData.costPrice) || 0,
        minStock: Number(formData.minStock) || 0
      };
      setRawMaterials(prev => [...prev, newRM]);
      showToast(`Materia prima "${formData.name}" dada de alta en el sistema.`);
    }
    setModalState({ isOpen: false, type: null, data: null });
  };

  const handleDeleteRawMaterial = (id) => {
    const isUsedInBom = products.some(p => p.bom && p.bom.some(b => b.rawMaterialId === id));
    if (isUsedInBom) {
      alert('No se puede eliminar esta materia prima porque está asignada en el checklist/receta de uno o más productos terminados.');
      return;
    }
    if (confirm('¿Está seguro de eliminar esta materia prima del catálogo?')) {
      setRawMaterials(prev => prev.filter(rm => rm.id !== id));
      showToast('Materia prima eliminada del catálogo.', 'info');
    }
  };

  // CRUD PRODUCTS
  const handleSaveProduct = (formData) => {
    if (modalState.type === 'editProduct') {
      setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData } : p));
      showToast(`Mercadería "${formData.name}" actualizada con éxito.`);
    } else {
      const newId = `PT-${String(products.length + 1).padStart(3, '0')}`;
      const newCode = formData.code || `PT-${formData.name.substring(0, 3).toUpperCase()}-${String(products.length + 1).padStart(2, '0')}`;
      const newProd = {
        ...formData,
        id: newId,
        code: newCode,
        salePrice: Number(formData.salePrice) || 0,
        currentStock: Number(formData.currentStock) || 0,
        minStock: Number(formData.minStock) || 0,
        bom: formData.bom || []
      };
      setProducts(prev => [...prev, newProd]);
      showToast(`Mercadería "${formData.name}" registrada con su checklist BOM.`);
    }
    setModalState({ isOpen: false, type: null, data: null });
  };

  const handleDeleteProduct = (id) => {
    if (confirm('¿Está seguro de eliminar esta mercadería del catálogo?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Mercadería eliminada del catálogo.', 'info');
    }
  };

  // CRUD SUPPLIERS & CLIENTS
  const handleSaveSupplier = (formData) => {
    if (modalState.type === 'editSupplier') {
      setSuppliers(prev => prev.map(s => s.id === formData.id ? { ...s, ...formData } : s));
      showToast(`Proveedor "${formData.name}" actualizado.`);
    } else {
      const newId = `PROV-${String(suppliers.length + 1).padStart(3, '0')}`;
      setSuppliers(prev => [...prev, { ...formData, id: newId }]);
      showToast(`Proveedor "${formData.name}" registrado.`);
    }
    setModalState({ isOpen: false, type: null, data: null });
  };

  const handleSaveClient = (formData) => {
    if (modalState.type === 'editClient') {
      setClients(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
      showToast(`Cliente "${formData.name}" actualizado.`);
    } else {
      const newId = `CLI-${String(clients.length + 1).padStart(3, '0')}`;
      setClients(prev => [...prev, { ...formData, id: newId }]);
      showToast(`Cliente "${formData.name}" registrado.`);
    }
    setModalState({ isOpen: false, type: null, data: null });
  };

  // QUICK STOCK ADJUSTMENT
  const handleQuickAdjust = ({ type, id, newStock, reason }) => {
    const qty = Number(newStock);
    if (type === 'MP') {
      const rm = rawMaterials.find(r => r.id === id);
      if (!rm) return;
      const diff = qty - rm.currentStock;
      setRawMaterials(prev => prev.map(r => r.id === id ? { ...r, currentStock: qty } : r));
      
      const newTransaction = {
        id: `TRX-${Date.now()}`,
        code: `AJU-${Date.now().toString().slice(-4)}`,
        type: 'AJUSTE',
        date: new Date().toISOString(),
        entityName: 'Auditoría Interna',
        items: [{ id: rm.id, name: rm.name, quantity: diff, unit: rm.unit, unitPrice: rm.costPrice, subtotal: diff * rm.costPrice }],
        totalAmount: Math.abs(diff * rm.costPrice),
        notes: `Ajuste inventario físico MP: ${reason || 'Recuento manual de almacén'}`
      };
      setTransactions(prev => [newTransaction, ...prev]);
      showToast(`Stock de "${rm.name}" ajustado a ${qty} ${rm.unit}`);
    } else {
      const prod = products.find(p => p.id === id);
      if (!prod) return;
      const diff = qty - prod.currentStock;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, currentStock: qty } : p));
      
      const newTransaction = {
        id: `TRX-${Date.now()}`,
        code: `AJU-${Date.now().toString().slice(-4)}`,
        type: 'AJUSTE',
        date: new Date().toISOString(),
        entityName: 'Auditoría Interna',
        items: [{ id: prod.id, name: prod.name, quantity: diff, unitPrice: prod.salePrice, subtotal: diff * prod.salePrice }],
        totalAmount: Math.abs(diff * prod.salePrice),
        notes: `Ajuste inventario físico Mercadería: ${reason || 'Recuento manual de depósito'}`
      };
      setTransactions(prev => [newTransaction, ...prev]);
      showToast(`Stock de "${prod.name}" ajustado a ${qty} u.`);
    }
    setModalState({ isOpen: false, type: null, data: null });
  };

  // EXPORT TO EXCEL
  const handleExportExcel = () => {
    if (typeof XLSX === 'undefined') {
      showToast('Librería de exportación no cargada', 'error');
      return;
    }
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Raw Materials
      const rmData = rawMaterials.map(rm => {
        const supp = suppliers.find(s => s.id === rm.supplierId);
        return {
          'Código': rm.code,
          'Materia Prima': rm.name,
          'Categoría': rm.category || '-',
          'Unidad': rm.unit,
          'Costo Unitario ($)': rm.costPrice,
          'Stock Actual': rm.currentStock,
          'Stock Mínimo': rm.minStock,
          'Valor Total Stock ($)': rm.currentStock * rm.costPrice,
          'Proveedor Habitual': supp ? supp.name : '-',
          'CUIT Proveedor': supp ? supp.cuit : '-'
        };
      });
      const wsRM = XLSX.utils.json_to_sheet(rmData);
      XLSX.utils.book_append_sheet(wb, wsRM, 'Materias Primas');

      // Sheet 2: Products & BOM
      const prodData = products.map(p => {
        const bomCost = calculateBomUnitCost(p.bom, rawMaterials);
        const margin = p.salePrice > 0 ? ((p.salePrice - bomCost) / p.salePrice * 100).toFixed(1) : '0';
        const maxProd = calculateMaxProduction(p.bom, rawMaterials);
        return {
          'Código': p.code,
          'Mercadería': p.name,
          'Categoría': p.category || '-',
          'Precio Venta ($)': p.salePrice,
          'Costo Prod. BOM ($)': bomCost,
          'Margen Bruto (%)': `${margin}%`,
          'Stock Actual': p.currentStock,
          'Capacidad Fab. Inmediata': maxProd,
          'Valorizado Stock Venta ($)': p.currentStock * p.salePrice
        };
      });
      const wsProd = XLSX.utils.json_to_sheet(prodData);
      XLSX.utils.book_append_sheet(wb, wsProd, 'Mercaderías');

      // Sheet 3: Transactions / Movimientos
      const trxData = transactions.map(t => ({
        'Código Mov.': t.code,
        'Tipo': t.type,
        'Fecha': formatDate(t.date),
        'Contraparte / Detalle': t.entityName || t.productName || '-',
        'Ref / Comprobante': t.referenceNumber || t.batchNumber || '-',
        'Total ($)': t.totalAmount || t.totalCost || 0,
        'Observaciones': t.notes || ''
      }));
      const wsTrx = XLSX.utils.json_to_sheet(trxData);
      XLSX.utils.book_append_sheet(wb, wsTrx, 'Libro Diario');

      XLSX.writeFile(wb, `FUTURE_FOOD_SRL_Inventario_${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast('Planilla Excel generada y descargada exitosamente.');
    } catch (err) {
      console.error(err);
      showToast('Error al generar archivo Excel', 'error');
    }
  };

  // BACKUP & RESTORE
  const handleExportJSON = () => {
    const data = {
      backupDate: new Date().toISOString(),
      company: 'FUTURE FOOD SRL',
      suppliers,
      clients,
      rawMaterials,
      products,
      transactions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_futurefood_srl_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Copia de respaldo JSON exportada.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.suppliers && data.rawMaterials && data.products) {
          if (confirm('¿Desea restaurar este respaldo? Se sobrescribirán los datos actuales en el navegador.')) {
            setSuppliers(data.suppliers || []);
            setClients(data.clients || []);
            setRawMaterials(data.rawMaterials || []);
            setProducts(data.products || []);
            setTransactions(data.transactions || []);
            showToast('¡Datos restaurados con éxito desde el archivo de respaldo!');
            setModalState({ isOpen: false, type: null, data: null });
          }
        } else {
          alert('El archivo no posee el formato de respaldo de Future Food SRL.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    if (confirm('¿Restablecer todo a los datos iniciales de fábrica de FUTURE FOOD SRL?')) {
      setSuppliers(INITIAL_SUPPLIERS);
      setClients(INITIAL_CLIENTS);
      setRawMaterials(INITIAL_RAW_MATERIALS);
      setProducts(INITIAL_PRODUCTS);
      setTransactions(INITIAL_TRANSACTIONS);
      showToast('Datos de demostración restablecidos.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium ${
            notification.type === 'error' ? 'bg-rose-600' :
            notification.type === 'info' ? 'bg-sky-600' : 'bg-emerald-600'
          }`}>
            <i className={`fas ${notification.type === 'error' ? 'fa-exclamation-triangle' : notification.type === 'info' ? 'fa-info-circle' : 'fa-check-circle'} text-lg`}></i>
            <span className="text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-30 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* BRAND LOGO */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-black text-xl shadow-md">
                <i className="fas fa-seedling"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight text-white">FUTURE FOOD</span>
                  <span className="text-xs bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">S.R.L.</span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium">Control de Stock, Producción & Contabilidad</p>
              </div>
            </div>

            {/* QUICK ACTIONS BUTTONS */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setModalState({ isOpen: true, type: 'newPurchase', data: null })}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                title="Registrar Compra de Materia Prima a Proveedor"
              >
                <i className="fas fa-cart-plus text-emerald-300"></i>
                <span>+ Compra MP</span>
              </button>

              <button 
                onClick={() => setModalState({ isOpen: true, type: 'newProduction', data: null })}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                title="Registrar Orden de Producción (Consume MP, Suma Mercadería)"
              >
                <i className="fas fa-industry text-amber-200"></i>
                <span>🏭 Fabricar</span>
              </button>

              <button 
                onClick={() => setModalState({ isOpen: true, type: 'newSale', data: null })}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                title="Registrar Venta de Mercadería a Cliente"
              >
                <i className="fas fa-receipt text-sky-200"></i>
                <span>- Venta</span>
              </button>

              <div className="h-6 w-px bg-emerald-800 mx-1"></div>

              <button
                onClick={handleExportExcel}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                title="Exportar Todo a Excel (.XLSX)"
              >
                <i className="fas fa-file-excel text-lg text-emerald-400"></i>
              </button>

              <button
                onClick={() => setModalState({ isOpen: true, type: 'backupRestore', data: null })}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                title="Copias de Seguridad (Backup / Restore)"
              >
                <i className="fas fa-database text-lg"></i>
              </button>
            </div>

          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-emerald-950/90 border-t border-emerald-800/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Dashboard Contable</span>
            </button>

            <button
              onClick={() => setActiveTab('rawMaterials')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'rawMaterials' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-wheat-awn"></i>
              <span>Materias Primas (MP)</span>
              {metrics.lowStockRawMaterials.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {metrics.lowStockRawMaterials.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'products' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-box-open"></i>
              <span>Mercaderías & Recetas (BOM)</span>
              {metrics.lowStockProducts.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {metrics.lowStockProducts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'purchases' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-truck-ramp-box"></i>
              <span>Entradas (Compras MP)</span>
            </button>

            <button
              onClick={() => setActiveTab('production')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'production' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-industry"></i>
              <span>Producción (-MP / +PT)</span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'sales' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-cash-register"></i>
              <span>Salidas (Ventas)</span>
            </button>

            <button
              onClick={() => setActiveTab('entities')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'entities' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-address-book"></i>
              <span>Proveedores & Clientes</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'audit' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <i className="fas fa-book-journal-whills"></i>
              <span>Libro Diario (Kardex)</span>
            </button>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW ROUTER */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            metrics={metrics}
            rawMaterials={rawMaterials}
            products={products}
            transactions={transactions}
            suppliers={suppliers}
            clients={clients}
            onOpenModal={(type, data) => setModalState({ isOpen: true, type, data })}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'rawMaterials' && (
          <RawMaterialsView 
            rawMaterials={rawMaterials}
            suppliers={suppliers}
            onOpenModal={(type, data) => setModalState({ isOpen: true, type, data })}
            onDelete={handleDeleteRawMaterial}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView 
            products={products}
            rawMaterials={rawMaterials}
            onOpenModal={(type, data) => setModalState({ isOpen: true, type, data })}
            onDelete={handleDeleteProduct}
          />
        )}

        {activeTab === 'purchases' && (
          <PurchasesView 
            transactions={transactions.filter(t => t.type === 'COMPRA')}
            suppliers={suppliers}
            rawMaterials={rawMaterials}
            onOpenNewPurchase={() => setModalState({ isOpen: true, type: 'newPurchase', data: null })}
            onViewVoucher={(tx) => setPrintDoc(tx)}
          />
        )}

        {activeTab === 'production' && (
          <ProductionView 
            transactions={transactions.filter(t => t.type === 'PRODUCCION')}
            products={products}
            rawMaterials={rawMaterials}
            onOpenNewProduction={() => setModalState({ isOpen: true, type: 'newProduction', data: null })}
            onViewVoucher={(tx) => setPrintDoc(tx)}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView 
            transactions={transactions.filter(t => t.type === 'VENTA')}
            clients={clients}
            products={products}
            onOpenNewSale={() => setModalState({ isOpen: true, type: 'newSale', data: null })}
            onViewVoucher={(tx) => setPrintDoc(tx)}
          />
        )}

        {activeTab === 'entities' && (
          <EntitiesView 
            suppliers={suppliers}
            clients={clients}
            onOpenModal={(type, data) => setModalState({ isOpen: true, type, data })}
            onDeleteSupplier={(id) => {
              if (confirm('¿Eliminar proveedor?')) {
                setSuppliers(prev => prev.filter(s => s.id !== id));
                showToast('Proveedor eliminado.');
              }
            }}
            onDeleteClient={(id) => {
              if (confirm('¿Eliminar cliente?')) {
                setClients(prev => prev.filter(c => c.id !== id));
                showToast('Cliente eliminado.');
              }
            }}
          />
        )}

        {activeTab === 'audit' && (
          <AuditView 
            transactions={transactions}
            onViewVoucher={(tx) => setPrintDoc(tx)}
            onExportExcel={handleExportExcel}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">FUTURE FOOD S.R.L.</span>
            <span>•</span>
            <span>Sistema Interno de Gestión de Stock & Contabilidad</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Versión 2.4.0 ERP</span>
            <button onClick={handleResetDemoData} className="hover:text-emerald-400 underline transition">
              Cargar datos demo
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-slate-200">
            
            {/* MODAL: RAW MATERIAL FORM */}
            {(modalState.type === 'newRawMaterial' || modalState.type === 'editRawMaterial') && (
              <RawMaterialFormModal 
                isEdit={modalState.type === 'editRawMaterial'}
                initialData={modalState.data}
                suppliers={suppliers}
                onSave={handleSaveRawMaterial}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: PRODUCT & BOM FORM */}
            {(modalState.type === 'newProduct' || modalState.type === 'editProduct') && (
              <ProductFormModal 
                isEdit={modalState.type === 'editProduct'}
                initialData={modalState.data}
                rawMaterials={rawMaterials}
                onSave={handleSaveProduct}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: SUPPLIER FORM */}
            {(modalState.type === 'newSupplier' || modalState.type === 'editSupplier') && (
              <SupplierFormModal 
                isEdit={modalState.type === 'editSupplier'}
                initialData={modalState.data}
                onSave={handleSaveSupplier}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: CLIENT FORM */}
            {(modalState.type === 'newClient' || modalState.type === 'editClient') && (
              <ClientFormModal 
                isEdit={modalState.type === 'editClient'}
                initialData={modalState.data}
                onSave={handleSaveClient}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: NEW PURCHASE (ENTRADA MP) */}
            {modalState.type === 'newPurchase' && (
              <PurchaseFormModal 
                suppliers={suppliers}
                rawMaterials={rawMaterials}
                onSave={handleRegisterPurchase}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: NEW PRODUCTION (-MP / +PT) */}
            {modalState.type === 'newProduction' && (
              <ProductionFormModal 
                products={products}
                rawMaterials={rawMaterials}
                onSave={handleRegisterProduction}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: NEW SALE (SALIDA MERCADERIA) */}
            {modalState.type === 'newSale' && (
              <SaleFormModal 
                clients={clients}
                products={products}
                onSave={handleRegisterSale}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: QUICK STOCK ADJUST */}
            {modalState.type === 'quickStockAdjust' && (
              <QuickStockAdjustModal 
                data={modalState.data}
                onSave={handleQuickAdjust}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

            {/* MODAL: BACKUP & RESTORE */}
            {modalState.type === 'backupRestore' && (
              <BackupRestoreModal 
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
                onClose={() => setModalState({ isOpen: false, type: null, data: null })}
              />
            )}

          </div>
        </div>
      )}

      {/* PRINT / VOUCHER VIEWER MODAL */}
      {printDoc && (
        <VoucherPrintModal 
          doc={printDoc}
          onClose={() => setPrintDoc(null)}
        />
      )}

    </div>
  );
}

// =========================================================================
// VIEW COMPONENTS
// =========================================================================

// -----------------------------
// 1. DASHBOARD VIEW
// -----------------------------
function DashboardView({ metrics, rawMaterials, products, transactions, suppliers, clients, onOpenModal, onNavigateTab }) {
  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Initialize or update Chart.js
  useEffect(() => {
    if (!chartCanvasRef.current || typeof Chart === 'undefined') return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Materias Primas ($)', 'Mercaderías en Depósito ($)'],
        datasets: [{
          data: [metrics.rawValuation, metrics.productsCostValuation],
          backgroundColor: ['#059669', '#d97706'],
          hoverOffset: 4,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${formatCurrency(context.raw)}`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [metrics]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HERO WELCOME & SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Planta & Almacén Operativo
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Panel de Control General</h1>
            <p className="text-emerald-200 text-sm mt-1 max-w-2xl">
              Monitoreo contable del flujo de materias primas (+Compras / -Producción) y mercaderías terminadas (+Producción / -Ventas).
            </p>
          </div>
          
          <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-4 text-right backdrop-blur-sm">
            <span className="text-xs text-emerald-300 font-medium uppercase tracking-wider block">Valuación Total de Almacén</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-code">{formatCurrency(metrics.totalInventoryValuation)}</span>
            <div className="text-[11px] text-emerald-300 mt-0.5">Valuado al costo de reposición</div>
          </div>
        </div>
      </div>

      {/* 4 CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Materias Primas */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Materias Primas</span>
              <h3 className="text-xl font-bold text-emerald-800 mt-1 font-mono-code">{formatCurrency(metrics.rawValuation)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
              <i className="fas fa-wheat-awn"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>{metrics.totalRawItems} Ítems registrados</span>
            <button onClick={() => onNavigateTab('rawMaterials')} className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1">
              Ver catálogo <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Card 2: Mercaderías */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mercaderías (Costo)</span>
              <h3 className="text-xl font-bold text-amber-800 mt-1 font-mono-code">{formatCurrency(metrics.productsCostValuation)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
              <i className="fas fa-boxes-stacked"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>Valor Venta: {formatCurrency(metrics.productsSaleValuation)}</span>
            <button onClick={() => onNavigateTab('products')} className="text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
              Ver recetas <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Card 3: Ventas Totales */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventas Facturadas</span>
              <h3 className="text-xl font-bold text-sky-700 mt-1 font-mono-code">{formatCurrency(metrics.totalSales)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
              <i className="fas fa-receipt"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>{transactions.filter(t => t.type === 'VENTA').length} Facturas emitidas</span>
            <button onClick={() => onNavigateTab('sales')} className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1">
              Ver ventas <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Card 4: Compras de Insumos */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compras Insumos</span>
              <h3 className="text-xl font-bold text-indigo-700 mt-1 font-mono-code">{formatCurrency(metrics.totalPurchases)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg">
              <i className="fas fa-truck-ramp-box"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>{transactions.filter(t => t.type === 'COMPRA').length} Órdenes de compra</span>
            <button onClick={() => onNavigateTab('purchases')} className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
              Ver compras <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

      </div>

      {/* CRITICAL STOCK ALERTS (IF ANY) */}
      {(metrics.lowStockRawMaterials.length > 0 || metrics.lowStockProducts.length > 0) && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-rose-800 font-bold mb-3">
            <i className="fas fa-triangle-exclamation text-lg"></i>
            <span>Alertas de Punto de Reposición (Stock Crítico)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {metrics.lowStockRawMaterials.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-rose-700 uppercase block mb-2">Materias Primas a Reponer con Proveedor:</span>
                <ul className="space-y-2 text-xs">
                  {metrics.lowStockRawMaterials.map(rm => (
                    <li key={rm.id} className="flex justify-between items-center bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                      <div>
                        <span className="font-semibold text-slate-800">{rm.name}</span>
                        <span className="text-slate-500 block text-[11px]">Mínimo req: {rm.minStock} {rm.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-rose-700 font-mono-code">{formatNumber(rm.currentStock)} {rm.unit}</span>
                        <button 
                          onClick={() => onOpenModal('newPurchase', { preselectedRmId: rm.id })}
                          className="block text-[10px] text-emerald-700 hover:underline font-semibold mt-0.5"
                        >
                          + Comprar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {metrics.lowStockProducts.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-amber-700 uppercase block mb-2">Mercaderías Terminadas con Stock Bajo:</span>
                <ul className="space-y-2 text-xs">
                  {metrics.lowStockProducts.map(p => (
                    <li key={p.id} className="flex justify-between items-center bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                      <div>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                        <span className="text-slate-500 block text-[11px]">Mínimo req: {p.minStock} u</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-700 font-mono-code">{p.currentStock} u</span>
                        <button 
                          onClick={() => onOpenModal('newProduction', { preselectedProductId: p.id })}
                          className="block text-[10px] text-amber-800 hover:underline font-semibold mt-0.5"
                        >
                          🏭 Fabricar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TWO COLUMNS: CHART & QUICK TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART CARD */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <i className="fas fa-pie-chart text-emerald-600"></i>
                Composición del Inventario
              </h3>
            </div>
            <div className="relative h-48 w-full flex items-center justify-center">
              <canvas ref={chartCanvasRef}></canvas>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 block">Materias Primas</span>
              <span className="font-bold text-emerald-700 font-mono-code">{((metrics.rawValuation / (metrics.totalInventoryValuation || 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 block">Mercaderías</span>
              <span className="font-bold text-amber-700 font-mono-code">{((metrics.productsCostValuation / (metrics.totalInventoryValuation || 1)) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* LATEST TRANSACTIONS / MOVIMIENTOS RECIENTES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i className="fas fa-clock-rotate-left text-slate-500"></i>
              Últimos Movimientos del Libro Diario
            </h3>
            <button onClick={() => onNavigateTab('audit')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              Ver todos ({transactions.length}) <i className="fas fa-arrow-right ml-1 text-[10px]"></i>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Comprobante</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Contraparte / Detalle</th>
                  <th className="py-2.5 px-3 text-right">Monto ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="table-row-hover">
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.type === 'COMPRA' ? 'bg-emerald-100 text-emerald-800' :
                        t.type === 'PRODUCCION' ? 'bg-amber-100 text-amber-800' :
                        t.type === 'VENTA' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{t.code}</td>
                    <td className="py-2.5 px-3 text-slate-500">{formatDateShort(t.date)}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{t.entityName || t.productName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                      {formatCurrency(t.totalAmount || t.totalCost || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

// -----------------------------
// 2. RAW MATERIALS VIEW (MATERIAS PRIMAS)
// -----------------------------
function RawMaterialsView({ rawMaterials, suppliers, onOpenModal, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set(rawMaterials.map(r => r.category).filter(Boolean));
    return Array.from(set);
  }, [rawMaterials]);

  const filtered = useMemo(() => {
    return rawMaterials.filter(rm => {
      const matchSearch = rm.name.toLowerCase().includes(search.toLowerCase()) || 
                          rm.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'ALL' || rm.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [rawMaterials, search, filterCategory]);

  const totalRawValuation = useMemo(() => {
    return filtered.reduce((acc, rm) => acc + (rm.currentStock * rm.costPrice), 0);
  }, [filtered]);

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-wheat-awn text-emerald-600"></i>
            Catálogo de Materias Primas e Insumos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro detallado de materias primas: Producto, Precio de Costo, Proveedor Habitual y Stock Almacén.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total en Almacén</span>
            <span className="text-sm font-black text-emerald-900 font-mono-code">{formatCurrency(totalRawValuation)}</span>
          </div>
          
          <button
            onClick={() => onOpenModal('newRawMaterial', null)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            <i className="fas fa-plus"></i>
            <span>Nueva Materia Prima</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
          <input
            type="text"
            placeholder="Buscar por nombre o código de insumo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Categoría:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Todas las categorías ({rawMaterials.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Materia Prima</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4">Precio Costo ($)</th>
                <th className="py-3 px-4">Proveedor Habitual</th>
                <th className="py-3 px-4 text-center">Stock Actual</th>
                <th className="py-3 px-4 text-right">Valorizado ($)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400">
                    No se encontraron materias primas registradas.
                  </td>
                </tr>
              ) : (
                filtered.map(rm => {
                  const supplier = suppliers.find(s => s.id === rm.supplierId);
                  const isCritical = rm.currentStock <= rm.minStock;
                  const valorized = rm.currentStock * rm.costPrice;

                  return (
                    <tr key={rm.id} className="table-row-hover">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-600">{rm.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{rm.name}</div>
                        <div className="text-[11px] text-slate-400">{rm.category || 'General'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                          {rm.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {formatCurrency(rm.costPrice)}
                      </td>
                      <td className="py-3 px-4">
                        {supplier ? (
                          <div>
                            <span className="font-semibold text-slate-700">{supplier.name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">CUIT: {supplier.cuit}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sin proveedor asignado</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-sm">
                        <span className={isCritical ? 'text-rose-600' : 'text-slate-800'}>
                          {formatNumber(rm.currentStock)} {rm.unit}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-normal">Mín: {rm.minStock} {rm.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                        {formatCurrency(valorized)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isCritical ? 'badge-stock-danger' : 'badge-stock-ok'
                        }`}>
                          {isCritical ? 'Reponer' : 'Óptimo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onOpenModal('quickStockAdjust', { type: 'MP', id: rm.id, currentStock: rm.currentStock, name: rm.name, unit: rm.unit })}
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded transition"
                            title="Ajuste Rápido de Inventario"
                          >
                            <i className="fas fa-sliders"></i>
                          </button>
                          <button
                            onClick={() => onOpenModal('editRawMaterial', rm)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 rounded transition"
                            title="Editar Datos"
                          >
                            <i className="fas fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() => onDelete(rm.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded transition"
                            title="Eliminar"
                          >
                            <i className="fas fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// -----------------------------
// 3. PRODUCTS VIEW & BOM (MERCADERÍAS & RECETAS)
// -----------------------------
function ProductsView({ products, rawMaterials, onOpenModal, onDelete }) {
  const [search, setSearch] = useState('');
  const [expandedBomId, setExpandedBomId] = useState(null);

  const filtered = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-box-open text-amber-600"></i>
            Mercaderías & Recetas de Fabricación (BOM)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de productos terminados: Precio de venta, Stock y Check List de materias primas que consume por unidad.
          </p>
        </div>

        <button
          onClick={() => onOpenModal('newProduct', null)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <i className="fas fa-plus"></i>
          <span>Nueva Mercadería</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
          <input
            type="text"
            placeholder="Buscar mercadería..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="text-slate-500 text-xs hidden sm:block">
          Mostrando {filtered.length} productos terminados
        </div>
      </div>

      {/* PRODUCTS CARDS & RECIPES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(product => {
          const bomCost = calculateBomUnitCost(product.bom, rawMaterials);
          const grossProfit = product.salePrice - bomCost;
          const grossMargin = product.salePrice > 0 ? (grossProfit / product.salePrice * 100).toFixed(1) : '0';
          const maxImmediateProduction = calculateMaxProduction(product.bom, rawMaterials);
          const isExpanded = expandedBomId === product.id;

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition">
              
              {/* CARD TOP INFO */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {product.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{product.name}</h3>
                    <p className="text-xs text-slate-500">{product.category || 'General'}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Precio de Venta</span>
                    <span className="text-lg font-black text-slate-900 font-mono-code">{formatCurrency(product.salePrice)}</span>
                  </div>
                </div>

                {/* FINANCIAL & PRODUCTION METRICS */}
                <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Costo BOM Insumos</span>
                    <span className="font-bold text-slate-800 font-mono-code">{formatCurrency(bomCost)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Margen Bruto</span>
                    <span className="font-bold text-emerald-700 font-mono-code">{grossMargin}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Stock Actual</span>
                    <span className="font-bold text-amber-800 font-mono-code">{product.currentStock} u</span>
                  </div>
                </div>

                {/* IMMEDIATE CAPACITY BADGE */}
                <div className="mt-3 flex items-center justify-between text-xs bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <i className="fas fa-gauge-high text-emerald-600"></i>
                    <span className="font-semibold">Capacidad de Fabricación Inmediata:</span>
                  </div>
                  <span className="font-bold text-emerald-900 font-mono-code">{maxImmediateProduction} Unidades</span>
                </div>

                {/* BOM CHECKLIST ACCORDION */}
                <div className="mt-4">
                  <button
                    onClick={() => setExpandedBomId(isExpanded ? null : product.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-list-check text-amber-600"></i>
                      <span>Checklist de Materias Primas que consume ({(product.bom || []).length} insumos)</span>
                    </span>
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in text-xs">
                      {(!product.bom || product.bom.length === 0) ? (
                        <p className="text-slate-400 italic p-2 text-center">No tiene materias primas asignadas en su receta.</p>
                      ) : (
                        product.bom.map((item, idx) => {
                          const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
                          const unitCost = rm ? rm.costPrice : 0;
                          const totalLineCost = unitCost * item.quantity;
                          const hasEnough = rm && rm.currentStock >= item.quantity;

                          return (
                            <div key={idx} className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-200">
                              <div>
                                <span className="font-semibold text-slate-800">{rm ? rm.name : 'MP no encontrada'}</span>
                                <span className="text-[11px] text-slate-400 block font-mono">
                                  Consume: {formatNumber(item.quantity, 3)} {rm ? rm.unit : 'u'} por unidad
                                </span>
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-slate-700 font-medium">{formatCurrency(totalLineCost)}</span>
                                <span className={`block text-[10px] font-bold ${hasEnough ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {rm ? `Stock: ${formatNumber(rm.currentStock)} ${rm.unit}` : 'Sin stock'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* CARD FOOTER ACTIONS */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenModal('newProduction', { preselectedProductId: product.id })}
                  className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-900"
                >
                  <i className="fas fa-industry"></i>
                  <span>Crear Orden de Fabricación</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onOpenModal('quickStockAdjust', { type: 'PT', id: product.id, currentStock: product.currentStock, name: product.name, unit: 'u' })}
                    className="p-1.5 text-slate-500 hover:text-amber-600 rounded transition"
                    title="Ajuste de Stock Físico"
                  >
                    <i className="fas fa-sliders"></i>
                  </button>
                  <button
                    onClick={() => onOpenModal('editProduct', product)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 rounded transition"
                    title="Editar Receta / Mercadería"
                  >
                    <i className="fas fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded transition"
                    title="Eliminar Mercadería"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

// -----------------------------
// 4. PURCHASES VIEW (ENTRADAS DE MATERIA PRIMA)
// -----------------------------
function PurchasesView({ transactions, suppliers, rawMaterials, onOpenNewPurchase, onViewVoucher }) {
  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-truck-ramp-box text-emerald-600"></i>
            Entradas por Compras de Materias Primas (+ Stock MP)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro de facturas y remitos de proveedores. Incrementa automáticamente el stock de materias primas.
          </p>
        </div>

        <button
          onClick={onOpenNewPurchase}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <i className="fas fa-cart-plus"></i>
          <span>+ Registrar Compra a Proveedor</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Comprobante</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">CUIT</th>
                <th className="py-3 px-4">Materias Primas Ingresadas</th>
                <th className="py-3 px-4 text-right">Total Factura ($)</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No hay compras registradas en el historial.
                  </td>
                </tr>
              ) : (
                transactions.map(t => {
                  const supp = suppliers.find(s => s.id === t.entityId);
                  return (
                    <tr key={t.id} className="table-row-hover">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {t.code}
                        <span className="block text-[10px] text-slate-400 font-normal">{t.referenceNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(t.date)}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{t.entityName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{supp ? supp.cuit : '-'}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {t.items.map((it, i) => (
                            <span key={i} className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] mr-1">
                              +{formatNumber(it.quantity)} {it.unit} de {it.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 text-sm">
                        {formatCurrency(t.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewVoucher(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                        >
                          <i className="fas fa-print"></i>
                          <span>Comprobante</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// -----------------------------
// 5. PRODUCTION VIEW (- MATERIAS PRIMAS / + MERCADERÍA)
// -----------------------------
function ProductionView({ transactions, products, rawMaterials, onOpenNewProduction, onViewVoucher }) {
  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-industry text-amber-600"></i>
            Órdenes de Fabricación (- Materia Prima / + Mercadería)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transformación contable de insumos: Descuenta automáticamente las materias primas del BOM e ingresa stock de mercadería terminada.
          </p>
        </div>

        <button
          onClick={onOpenNewProduction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <i className="fas fa-gears"></i>
          <span>+ Nueva Orden de Fabricación</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Orden Nº</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Mercadería Fabricada</th>
                <th className="py-3 px-4 text-center">Cantidad (+)</th>
                <th className="py-3 px-4">Lote Nº</th>
                <th className="py-3 px-4">Insumos Consumidos (-)</th>
                <th className="py-3 px-4 text-right">Costo Total ($)</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No se registran órdenes de producción finalizadas.
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="table-row-hover">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{t.code}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(t.date)}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{t.productName}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-full font-mono">
                        +{t.quantityProduced} u
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{t.batchNumber}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {(t.consumedMaterials || []).map((m, i) => (
                          <span key={i} className="inline-block bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] mr-1">
                            -{formatNumber(m.quantity, 2)} {m.unit} {m.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 text-sm">
                      {formatCurrency(t.totalCost)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewVoucher(t)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <i className="fas fa-print"></i>
                        <span>Orden</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// -----------------------------
// 6. SALES VIEW (SALIDAS DE MERCADERÍA / CLIENTES)
// -----------------------------
function SalesView({ transactions, clients, products, onOpenNewSale, onViewVoucher }) {
  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-cash-register text-sky-600"></i>
            Salidas por Ventas a Clientes (- Stock Mercadería)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro de remitos y facturas de venta. Descuenta unidades de mercadería del stock y registra el ingreso contable.
          </p>
        </div>

        <button
          onClick={onOpenNewSale}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <i className="fas fa-receipt"></i>
          <span>+ Registrar Venta a Cliente</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Comprobante</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">CUIT</th>
                <th className="py-3 px-4">Mercaderías Despachadas</th>
                <th className="py-3 px-4 text-right">Total Venta ($)</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No se registran ventas en el historial.
                  </td>
                </tr>
              ) : (
                transactions.map(t => {
                  const client = clients.find(c => c.id === t.entityId);
                  return (
                    <tr key={t.id} className="table-row-hover">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {t.code}
                        <span className="block text-[10px] text-slate-400 font-normal">{t.referenceNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(t.date)}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{t.entityName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{client ? client.cuit : '-'}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {t.items.map((it, i) => (
                            <span key={i} className="inline-block bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[11px] mr-1">
                              -{it.quantity} u de {it.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-800 text-sm">
                        {formatCurrency(t.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewVoucher(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                        >
                          <i className="fas fa-print"></i>
                          <span>Factura</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// -----------------------------
// 7. ENTITIES VIEW (PROVEEDORES Y CLIENTES)
// -----------------------------
function EntitiesView({ suppliers, clients, onOpenModal, onDeleteSupplier, onDeleteClient }) {
  const [subTab, setSubTab] = useState('suppliers'); // 'suppliers' or 'clients'
  const [search, setSearch] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.cuit.includes(search)
    );
  }, [suppliers, search]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cuit.includes(search)
    );
  }, [clients, search]);

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* HEADER WITH TOGGLE BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-address-book text-emerald-700"></i>
            Directorio de Proveedores & Clientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro fiscal obligatorio: Razón Social, CUIT, Domicilio Comercial y Datos de Contacto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'suppliers' ? (
            <button
              onClick={() => onOpenModal('newSupplier', null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <i className="fas fa-user-plus"></i>
              <span>Nuevo Proveedor</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenModal('newClient', null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <i className="fas fa-user-plus"></i>
              <span>Nuevo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTABS */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setSubTab('suppliers')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition border-b-2 ${
            subTab === 'suppliers'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fas fa-truck-field"></i>
          <span>Proveedores ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('clients')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition border-b-2 ${
            subTab === 'clients'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fas fa-building-user"></i>
          <span>Clientes ({clients.length})</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
          <input
            type="text"
            placeholder={`Buscar por nombre o CUIT de ${subTab === 'suppliers' ? 'proveedor' : 'cliente'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* SUPPLIERS TABLE */}
      {subTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Razón Social / Proveedor</th>
                  <th className="py-3 px-4">CUIT</th>
                  <th className="py-3 px-4">Domicilio Fiscal</th>
                  <th className="py-3 px-4">Contacto & Teléfono</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map(s => (
                  <tr key={s.id} className="table-row-hover">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{s.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">{s.cuit}</td>
                    <td className="py-3 px-4 text-slate-600">{s.address}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{s.contactName}</div>
                      <div className="text-slate-400 text-[11px]">{s.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.email}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenModal('editSupplier', s)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded transition"
                          title="Editar Proveedor"
                        >
                          <i className="fas fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => onDeleteSupplier(s.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded transition"
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLIENTS TABLE */}
      {subTab === 'clients' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Razón Social / Cliente</th>
                  <th className="py-3 px-4">CUIT</th>
                  <th className="py-3 px-4">Domicilio de Entrega</th>
                  <th className="py-3 px-4">Contacto & Teléfono</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map(c => (
                  <tr key={c.id} className="table-row-hover">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{c.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-sky-800 font-semibold">{c.cuit}</td>
                    <td className="py-3 px-4 text-slate-600">{c.address}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{c.contactName}</div>
                      <div className="text-slate-400 text-[11px]">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.email}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenModal('editClient', c)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 rounded transition"
                          title="Editar Cliente"
                        >
                          <i className="fas fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => onDeleteClient(c.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded transition"
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// -----------------------------
// 8. AUDIT & KARDEX VIEW (LIBRO DIARIO)
// -----------------------------
function AuditView({ transactions, onViewVoucher, onExportExcel }) {
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'ALL' || t.type === filterType;
      const matchSearch = t.code.toLowerCase().includes(search.toLowerCase()) ||
                          (t.entityName && t.entityName.toLowerCase().includes(search.toLowerCase())) ||
                          (t.productName && t.productName.toLowerCase().includes(search.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [transactions, filterType, search]);

  return (
    <div className="space-y-5 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-book-journal-whills text-slate-700"></i>
            Libro Diario de Movimientos & Kardex
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auditoría cronológica inmutable de todas las transacciones de entradas, salidas, producción y ajustes.
          </p>
        </div>

        <button
          onClick={onExportExcel}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <i className="fas fa-file-excel text-emerald-300"></i>
          <span>Descargar Planilla Excel</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
          <input
            type="text"
            placeholder="Buscar por código, cliente, proveedor o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Tipo de Operación:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="ALL">Todas las operaciones ({transactions.length})</option>
            <option value="COMPRA">Compras (+ Materia Prima)</option>
            <option value="PRODUCCION">Producción (-MP / +PT)</option>
            <option value="VENTA">Ventas (- Mercadería)</option>
            <option value="AJUSTE">Ajustes de Inventario</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Operación</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Detalle / Contraparte</th>
                <th className="py-3 px-4">Comprobante Ref.</th>
                <th className="py-3 px-4 text-right">Impacto Económico ($)</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className="table-row-hover">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{t.code}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      t.type === 'COMPRA' ? 'bg-emerald-100 text-emerald-800' :
                      t.type === 'PRODUCCION' ? 'bg-amber-100 text-amber-800' :
                      t.type === 'VENTA' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{formatDate(t.date)}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {t.entityName || t.productName}
                    {t.notes && <span className="block text-[11px] font-normal text-slate-400 truncate max-w-xs">{t.notes}</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{t.referenceNumber || t.batchNumber || '-'}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 text-sm">
                    {formatCurrency(t.totalAmount || t.totalCost || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewVoucher(t)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded transition"
                      title="Ver Comprobante Imprimible"
                    >
                      <i className="fas fa-file-invoice"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// =========================================================================
// MODAL FORMS (CREAR / EDITAR)
// =========================================================================

// 1. RAW MATERIAL FORM MODAL
function RawMaterialFormModal({ isEdit, initialData, suppliers, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    code: initialData?.code || '',
    name: initialData?.name || '',
    unit: initialData?.unit || 'Kg',
    costPrice: initialData?.costPrice || '',
    supplierId: initialData?.supplierId || (suppliers[0]?.id || ''),
    currentStock: initialData?.currentStock || '',
    minStock: initialData?.minStock || '20',
    category: initialData?.category || 'Insumos Generales'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingrese el nombre de la materia prima');
      return;
    }
    if (Number(formData.costPrice) < 0) {
      alert('El precio de costo no puede ser negativo');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-wheat-awn text-emerald-600"></i>
          <span>{isEdit ? 'Editar Materia Prima' : 'Nueva Materia Prima / Insumo'}</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nombre del Insumo / Materia Prima *</label>
            <input
              type="text"
              required
              placeholder="Ej: Harina de Avena Integral"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Categoría</label>
            <input
              type="text"
              placeholder="Ej: Cereales, Proteínas, Packaging"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Unidad de Medida *</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="Kg">Kilogramos (Kg)</option>
              <option value="Gramos">Gramos (g)</option>
              <option value="Litros">Litros (L)</option>
              <option value="Unidad">Unidad (u)</option>
              <option value="Bolsa">Bolsa</option>
              <option value="Caja">Caja</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Precio Costo Unitario ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Proveedor Habitual *</label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} (CUIT: {s.cuit})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Stock Actual Inicial *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Stock Mínimo (Alerta de Reposición) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="20"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
          >
            {isEdit ? 'Actualizar Materia Prima' : 'Guardar Materia Prima'}
          </button>
        </div>

      </form>
    </div>
  );
}

// 2. PRODUCT & BOM FORM MODAL (MERCADERÍAS & RECETA)
function ProductFormModal({ isEdit, initialData, rawMaterials, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    code: initialData?.code || '',
    name: initialData?.name || '',
    category: initialData?.category || 'Snacks Proteicos',
    salePrice: initialData?.salePrice || '',
    currentStock: initialData?.currentStock || '0',
    minStock: initialData?.minStock || '50',
    description: initialData?.description || '',
    bom: initialData?.bom ? JSON.parse(JSON.stringify(initialData.bom)) : []
  });

  // Calculate live BOM cost
  const calculatedCost = useMemo(() => {
    return calculateBomUnitCost(formData.bom, rawMaterials);
  }, [formData.bom, rawMaterials]);

  const grossMargin = useMemo(() => {
    const price = Number(formData.salePrice) || 0;
    if (price <= 0) return 0;
    return ((price - calculatedCost) / price * 100).toFixed(1);
  }, [formData.salePrice, calculatedCost]);

  // BOM items management
  const handleAddBomItem = () => {
    if (rawMaterials.length === 0) return;
    setFormData(prev => ({
      ...prev,
      bom: [...prev.bom, { rawMaterialId: rawMaterials[0].id, quantity: 0.05 }]
    }));
  };

  const handleUpdateBomItem = (index, field, value) => {
    setFormData(prev => {
      const newBom = [...prev.bom];
      newBom[index] = { ...newBom[index], [field]: value };
      return { ...prev, bom: newBom };
    });
  };

  const handleRemoveBomItem = (index) => {
    setFormData(prev => ({
      ...prev,
      bom: prev.bom.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingrese el nombre de la mercadería');
      return;
    }
    if (Number(formData.salePrice) <= 0) {
      alert('El precio de venta debe ser mayor a cero');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-box-open text-amber-600"></i>
          <span>{isEdit ? 'Editar Mercadería & Receta BOM' : 'Nueva Mercadería / Producto Terminado'}</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nombre de la Mercadería *</label>
            <input
              type="text"
              required
              placeholder="Ej: Barrita Proteica Choco-Maní 60g"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Categoría</label>
            <input
              type="text"
              placeholder="Ej: Snacks, Granola, Untables"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Precio de Venta Sugerido ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Stock Actual Inicial (Unidades) *</label>
            <input
              type="number"
              required
              placeholder="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Stock Mínimo (Alerta) *</label>
            <input
              type="number"
              required
              placeholder="50"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* BOM CHECKLIST SECTION */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <i className="fas fa-list-check text-amber-600"></i>
                Check List de Materias Primas que Consume por Unidad
              </span>
              <span className="text-[11px] text-slate-500 block">Indique las cantidades exactas requeridas para fabricar 1 sola unidad.</span>
            </div>

            <button
              type="button"
              onClick={handleAddBomItem}
              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition text-xs flex items-center gap-1"
            >
              <i className="fas fa-plus"></i>
              <span>+ Agregar Insumo</span>
            </button>
          </div>

          {/* BOM ITEMS LIST */}
          <div className="space-y-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {formData.bom.length === 0 ? (
              <p className="text-slate-400 text-center py-4 italic">
                Haga clic en "+ Agregar Insumo" para armar la receta / checklist de materias primas.
              </p>
            ) : (
              formData.bom.map((item, idx) => {
                const selectedRm = rawMaterials.find(r => r.id === item.rawMaterialId);
                const unitCost = selectedRm ? selectedRm.costPrice : 0;
                const lineCost = unitCost * (Number(item.quantity) || 0);

                return (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <select
                        value={item.rawMaterialId}
                        onChange={(e) => handleUpdateBomItem(idx, 'rawMaterialId', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                      >
                        {rawMaterials.map(rm => (
                          <option key={rm.id} value={rm.id}>
                            {rm.name} ({rm.unit}) - Costo: {formatCurrency(rm.costPrice)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Cantidad"
                          value={item.quantity}
                          onChange={(e) => handleUpdateBomItem(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs pr-6"
                        />
                        <span className="absolute right-2 top-1.5 text-slate-400 text-[10px]">
                          {selectedRm?.unit || 'u'}
                        </span>
                      </div>
                    </div>

                    <div className="w-24 text-right font-mono font-bold text-slate-700 text-xs">
                      {formatCurrency(lineCost)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBomItem(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <i className="fas fa-trash-can"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* LIVE COST & MARGIN BOX */}
          <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="text-amber-800 font-bold block">Costo de Producción BOM Estimado:</span>
              <span className="text-xs text-amber-700 font-mono-code">{formatCurrency(calculatedCost)} por unidad</span>
            </div>
            <div className="text-right">
              <span className="text-amber-800 font-bold block">Margen Bruto de Ganancia:</span>
              <span className="text-sm font-black text-emerald-800 font-mono-code">{grossMargin}%</span>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm"
          >
            {isEdit ? 'Actualizar Mercadería' : 'Guardar Mercadería & Receta'}
          </button>
        </div>

      </form>
    </div>
  );
}

// 3. SUPPLIER FORM MODAL
function SupplierFormModal({ isEdit, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    cuit: initialData?.cuit || '',
    address: initialData?.address || '',
    contactName: initialData?.contactName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingrese la razón social o nombre del proveedor');
      return;
    }
    if (!formData.cuit.trim()) {
      alert('Ingrese el CUIT del proveedor');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-truck-field text-emerald-600"></i>
          <span>{isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor de Materia Prima'}</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Razón Social / Nombre *</label>
            <input
              type="text"
              required
              placeholder="Ej: Molinos del Centro S.A."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">CUIT *</label>
            <input
              type="text"
              required
              placeholder="30-XXXXXXXX-X"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Domicilio Fiscal / Planta *</label>
          <input
            type="text"
            required
            placeholder="Ej: Av. Circunvalación 4520, Córdoba"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Persona de Contacto</label>
            <input
              type="text"
              placeholder="Ej: Carlos Mendizábal"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              placeholder="+54 11 ...."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Comercial</label>
            <input
              type="email"
              placeholder="ventas@proveedor.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Observaciones / Insumos Principales</label>
          <textarea
            rows="2"
            placeholder="Condiciones de pago, tiempos de entrega, insumos certificados..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
          >
            {isEdit ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 4. CLIENT FORM MODAL
function ClientFormModal({ isEdit, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    cuit: initialData?.cuit || '',
    address: initialData?.address || '',
    contactName: initialData?.contactName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingrese la razón social o nombre del cliente');
      return;
    }
    if (!formData.cuit.trim()) {
      alert('Ingrese el CUIT del cliente');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-building-user text-sky-600"></i>
          <span>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente / Destinatario'}</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Razón Social / Nombre *</label>
            <input
              type="text"
              required
              placeholder="Ej: Dietética Vida Sana & Natural"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">CUIT *</label>
            <input
              type="text"
              required
              placeholder="30-XXXXXXXX-X"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Domicilio de Entrega / Local *</label>
          <input
            type="text"
            required
            placeholder="Ej: Av. Cabildo 2140, CABA"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Persona de Contacto</label>
            <input
              type="text"
              placeholder="Ej: Lucía Gómez"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              placeholder="+54 11 ...."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="compras@cliente.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Notas Comerciales</label>
          <textarea
            rows="2"
            placeholder="Días de recepción, horarios de entrega, cuenta corriente..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-sm"
          >
            {isEdit ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 5. PURCHASE FORM MODAL (+ MATERIA PRIMA / PROVEEDOR)
function PurchaseFormModal({ suppliers, rawMaterials, onSave, onClose }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [updateCosts, setUpdateCosts] = useState(true);

  const [items, setItems] = useState([
    { rawMaterialId: rawMaterials[0]?.id || '', quantity: 50, unitPrice: rawMaterials[0]?.costPrice || 0 }
  ]);

  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === supplierId);
  }, [supplierId, suppliers]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, it) => acc + ((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)), 0);
  }, [items]);

  const handleAddItem = () => {
    if (rawMaterials.length === 0) return;
    setItems(prev => [
      ...prev,
      { rawMaterialId: rawMaterials[0].id, quantity: 10, unitPrice: rawMaterials[0].costPrice }
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems(prev => {
      const newItems = [...prev];
      if (field === 'rawMaterialId') {
        const rm = rawMaterials.find(r => r.id === value);
        newItems[index] = {
          ...newItems[index],
          rawMaterialId: value,
          unitPrice: rm ? rm.costPrice : newItems[index].unitPrice
        };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return newItems;
    });
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierId) {
      alert('Seleccione un proveedor');
      return;
    }
    if (items.length === 0) {
      alert('Agregue al menos una materia prima');
      return;
    }
    for (const item of items) {
      if (Number(item.quantity) <= 0) {
        alert('Las cantidades deben ser mayores a cero');
        return;
      }
    }
    onSave({
      supplierId,
      referenceNumber,
      items,
      notes,
      updateCosts
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-cart-plus text-emerald-600"></i>
          <span>Registrar Compra de Materias Primas (+ Entrada Almacén)</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        
        {/* SUPPLIER SELECTOR & DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Proveedor *</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {selectedSupplier && (
              <div className="mt-1 text-[11px] text-slate-500">
                CUIT: <span className="font-mono font-semibold">{selectedSupplier.cuit}</span> | {selectedSupplier.address}
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nº Comprobante / Factura / Remito *</label>
            <input
              type="text"
              required
              placeholder="Ej: FC-A 0004-00018942"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ITEMS SECTION */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-800 text-sm">Detalle de Materias Primas a Ingresar:</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg transition text-xs flex items-center gap-1"
            >
              <i className="fas fa-plus"></i>
              <span>+ Agregar Ítem</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {items.map((item, idx) => {
              const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
              const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

              return (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <select
                      value={item.rawMaterialId}
                      onChange={(e) => handleUpdateItem(idx, 'rawMaterialId', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      {rawMaterials.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} (Stock Actual: {formatNumber(r.currentStock)} {r.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1.5 text-slate-400 text-[10px]">
                        {rm?.unit || 'u'}
                      </span>
                    </div>
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Precio Compra $"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs"
                    />
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-emerald-800 text-xs">
                    {formatCurrency(subtotal)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={updateCosts}
                onChange={(e) => setUpdateCosts(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Actualizar el precio de costo estándar de la materia prima con estos valores</span>
            </label>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total de la Compra:</span>
              <span className="text-xl font-black text-emerald-900 font-mono-code">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
          <input
            type="text"
            placeholder="Lote de proveedor, fecha de vencimiento, estado del transporte..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-check"></i>
            <span>Confirmar Ingreso al Stock</span>
          </button>
        </div>

      </form>
    </div>
  );
}

// 6. PRODUCTION FORM MODAL (- MATERIA PRIMA / + MERCADERÍA)
function ProductionFormModal({ products, rawMaterials, onSave, onClose }) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(100);
  const [batchNumber, setBatchNumber] = useState(`LOTE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`);
  const [notes, setNotes] = useState('');

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [productId, products]);

  const maxPossible = useMemo(() => {
    if (!selectedProduct) return 0;
    return calculateMaxProduction(selectedProduct.bom, rawMaterials);
  }, [selectedProduct, rawMaterials]);

  // Real-time BOM consumption breakdown
  const bomBreakdown = useMemo(() => {
    if (!selectedProduct || !selectedProduct.bom) return [];
    const qty = Number(quantity) || 0;
    return selectedProduct.bom.map(item => {
      const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
      const totalNeeded = item.quantity * qty;
      const isSufficient = rm ? (rm.currentStock >= totalNeeded) : false;
      const lineCost = (rm?.costPrice || 0) * totalNeeded;

      return {
        rm,
        item,
        totalNeeded,
        isSufficient,
        lineCost
      };
    });
  }, [selectedProduct, quantity, rawMaterials]);

  const totalProductionCost = useMemo(() => {
    return bomBreakdown.reduce((acc, b) => acc + b.lineCost, 0);
  }, [bomBreakdown]);

  const hasShortage = useMemo(() => {
    return bomBreakdown.some(b => !b.isSufficient);
  }, [bomBreakdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId) {
      alert('Seleccione un producto a fabricar');
      return;
    }
    if (Number(quantity) <= 0) {
      alert('La cantidad a fabricar debe ser mayor a cero');
      return;
    }
    if (hasShortage) {
      alert('No hay stock suficiente de materias primas para fabricar esta cantidad.');
      return;
    }
    onSave({
      productId,
      quantity: Number(quantity),
      batchNumber,
      notes
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-industry text-amber-600"></i>
          <span>Registrar Orden de Producción (- Materia Prima / + Mercadería)</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Mercadería a Fabricar *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock Actual: {p.currentStock} u)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cantidad a Fabricar (u) *</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Número de Lote / Batch *</label>
            <input
              type="text"
              required
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
            <div>
              <span className="text-[10px] text-amber-800 uppercase font-bold block">Capacidad Máxima Inmediata:</span>
              <span className="text-base font-black text-amber-950 font-mono-code">{maxPossible} Unidades</span>
            </div>
            <button
              type="button"
              onClick={() => setQuantity(maxPossible)}
              className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-bold text-[10px]"
            >
              Usar Máx
            </button>
          </div>
        </div>

        {/* INVENTORY IMPACT PREVIEW */}
        <div className="pt-2 border-t border-slate-200">
          <span className="font-bold text-slate-800 text-sm block mb-1">
            Impacto Automático en Materias Primas (-):
          </span>

          <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
            {bomBreakdown.map((b, idx) => (
              <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border ${
                b.isSufficient ? 'bg-white border-slate-200' : 'bg-rose-50 border-rose-300'
              }`}>
                <div>
                  <span className="font-bold text-slate-800">{b.rm ? b.rm.name : 'Insumo'}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">
                    Descuenta: <strong className="text-rose-700">-{formatNumber(b.totalNeeded, 3)} {b.rm?.unit}</strong> ({formatNumber(b.item.quantity, 3)}/u)
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-700">{formatCurrency(b.lineCost)}</span>
                  <span className={`block text-[10px] font-bold ${b.isSufficient ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {b.isSufficient ? `Disponible: ${formatNumber(b.rm.currentStock)} ${b.rm.unit}` : `¡FALTANTE! Hay ${formatNumber(b.rm?.currentStock || 0)} ${b.rm?.unit}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between items-center bg-slate-100 p-3 rounded-xl">
            <div>
              <span className="text-slate-600 text-xs block">Costo Total de Materias Primas:</span>
              <span className="text-base font-black text-slate-900 font-mono-code">{formatCurrency(totalProductionCost)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-600 text-xs block">Costo Unitario Resultante:</span>
              <span className="text-base font-black text-slate-900 font-mono-code">
                {formatCurrency(quantity > 0 ? (totalProductionCost / quantity) : 0)} / u
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Observaciones de Planta</label>
          <input
            type="text"
            placeholder="Turno, operario a cargo, controles de calidad..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={hasShortage}
            className={`px-5 py-2 rounded-xl font-bold shadow-sm flex items-center gap-2 text-white ${
              hasShortage ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <i className="fas fa-gears"></i>
            <span>Ejecutar Orden de Fabricación</span>
          </button>
        </div>

      </form>
    </div>
  );
}

// 7. SALE FORM MODAL (- MERCADERÍA / CLIENTE)
function SaleFormModal({ clients, products, onSave, onClose }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState([
    { productId: products[0]?.id || '', quantity: 20, unitPrice: products[0]?.salePrice || 0 }
  ]);

  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === clientId);
  }, [clientId, clients]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, it) => acc + ((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)), 0);
  }, [items]);

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems(prev => [
      ...prev,
      { productId: products[0].id, quantity: 10, unitPrice: products[0].salePrice }
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems(prev => {
      const newItems = [...prev];
      if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        newItems[index] = {
          ...newItems[index],
          productId: value,
          unitPrice: prod ? prod.salePrice : newItems[index].unitPrice
        };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return newItems;
    });
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      alert('Seleccione un cliente');
      return;
    }
    if (items.length === 0) {
      alert('Agregue al menos una mercadería a vender');
      return;
    }
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (Number(item.quantity) <= 0) {
        alert('Las cantidades deben ser mayores a cero');
        return;
      }
      if (!prod || prod.currentStock < Number(item.quantity)) {
        alert(`Stock insuficiente de "${prod?.name}". Disponible: ${prod?.currentStock} u.`);
        return;
      }
    }
    onSave({
      clientId,
      referenceNumber,
      items,
      notes
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-cash-register text-sky-600"></i>
          <span>Registrar Venta de Mercadería (- Salida de Stock)</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        
        {/* CLIENT SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cliente *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-medium"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-1 text-[11px] text-slate-500">
                CUIT: <span className="font-mono font-semibold">{selectedClient.cuit}</span> | {selectedClient.address}
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nº Comprobante / Factura / Remito *</label>
            <input
              type="text"
              required
              placeholder="Ej: FC-B 0002-00001050"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ITEMS SECTION */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-800 text-sm">Mercaderías a Despachar:</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-lg transition text-xs flex items-center gap-1"
            >
              <i className="fas fa-plus"></i>
              <span>+ Agregar Mercadería</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {items.map((item, idx) => {
              const prod = products.find(p => p.id === item.productId);
              const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
              const isAvailable = prod && prod.currentStock >= Number(item.quantity);

              return (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleUpdateItem(idx, 'productId', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.currentStock} u) - ${formatNumber(p.salePrice)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      placeholder="Cantidad"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs text-center"
                    />
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Precio Venta $"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-xs"
                    />
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-sky-800 text-xs">
                    {formatCurrency(subtotal)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-right">
            <span className="text-xs text-slate-500 block">Total Facturado a Cliente:</span>
            <span className="text-xl font-black text-sky-900 font-mono-code">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Observaciones / Transporte</label>
          <input
            type="text"
            placeholder="Transporte expreso, número de guía, condiciones de entrega..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-check"></i>
            <span>Confirmar Despacho & Venta</span>
          </button>
        </div>

      </form>
    </div>
  );
}

// 8. QUICK STOCK ADJUST MODAL
function QuickStockAdjustModal({ data, onSave, onClose }) {
  const [newStock, setNewStock] = useState(data?.currentStock || 0);
  const [reason, setReason] = useState('Recuento físico de inventario / Auditoría');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type: data.type,
      id: data.id,
      newStock: Number(newStock),
      reason
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-sliders text-amber-600"></i>
          <span>Ajuste Rápido de Inventario Físico</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">Ítem a ajustar:</span>
          <span className="text-base font-bold text-slate-900">{data?.name}</span>
          <span className="text-xs text-slate-500 block mt-1">
            Stock actual registrado: <strong className="font-mono text-slate-800">{data?.currentStock} {data?.unit}</strong>
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nuevo Stock Real ({data?.unit}) *</label>
          <input
            type="number"
            step="0.01"
            required
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Motivo del Ajuste *</label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm"
          >
            Guardar Ajuste
          </button>
        </div>
      </form>
    </div>
  );
}

// 9. BACKUP & RESTORE MODAL
function BackupRestoreModal({ onExportJSON, onImportJSON, onClose }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-database text-emerald-700"></i>
          <span>Copias de Seguridad (Backup & Restore)</span>
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      <div className="mt-5 space-y-6 text-xs">
        
        {/* EXPORT */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">Descargar Copia de Respaldo Completa</h4>
            <p className="text-emerald-800 text-xs mt-0.5">
              Guarda un archivo .JSON con todas las materias primas, productos, proveedores, clientes y movimientos.
            </p>
          </div>
          <button
            onClick={onExportJSON}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2 whitespace-nowrap"
          >
            <i className="fas fa-download"></i>
            <span>Exportar JSON</span>
          </button>
        </div>

        {/* IMPORT */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm">Restaurar Copia desde Archivo</h4>
          <p className="text-slate-600 text-xs mt-0.5 mb-3">
            Cargue un archivo .JSON previamente exportado para recuperar todos los datos.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={onImportJSON}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
          />
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// 10. PRINTABLE VOUCHER / REMITO / FACTURA MODAL
function VoucherPrintModal({ doc, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fade-in border border-slate-200 print-container">
        
        {/* NO-PRINT HEADER BAR */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <i className="fas fa-file-invoice text-emerald-700"></i>
            <span>Visualización de Comprobante Oficial</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <i className="fas fa-print"></i>
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* OFFICIAL MEMBRETE */}
        <div className="mt-4 pb-4 border-b-2 border-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-emerald-900">FUTURE FOOD S.R.L.</h2>
            <p className="text-xs text-slate-600">Alimentos Funcionales & Saludables</p>
            <p className="text-[11px] text-slate-500 mt-1">
              CUIT: 30-71899012-3 | IVA Responsable Inscripto<br/>
              Planta Industrial: Parque Industrial Este Lote 12, Córdoba, Argentina<br/>
              Tel: +54 351 555-4321 | contacto@futurefood.com.ar
            </p>
          </div>

          <div className="text-right">
            <div className="inline-block border border-slate-800 px-3 py-1 text-center mb-1">
              <span className="text-xs font-black block">COMPROBANTE INTERNO</span>
              <span className="text-sm font-mono font-bold text-slate-900">{doc.code}</span>
            </div>
            <p className="text-xs text-slate-600">Fecha: {formatDate(doc.date)}</p>
            <p className="text-xs text-slate-600 font-mono">Ref: {doc.referenceNumber || doc.batchNumber || '-'}</p>
          </div>
        </div>

        {/* ENTITY DETAILS */}
        <div className="py-3 bg-slate-50 my-3 px-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">
              {doc.type === 'COMPRA' ? 'Proveedor' : doc.type === 'VENTA' ? 'Cliente' : 'Sector'}
            </span>
            <span className="font-bold text-slate-900 text-sm">{doc.entityName || doc.productName || 'Planta Elaboradora'}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Tipo de Operación</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">{doc.type}</span>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="my-4">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Descripción</th>
                <th className="py-2 px-3 text-center">Cantidad</th>
                <th className="py-2 px-3 text-right">Precio Unit. ($)</th>
                <th className="py-2 px-3 text-right">Subtotal ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {doc.items ? (
                doc.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-medium text-slate-800">{it.name}</td>
                    <td className="py-2 px-3 text-center font-mono">{formatNumber(it.quantity)} {it.unit || 'u'}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{formatCurrency(it.subtotal)}</td>
                  </tr>
                ))
              ) : (doc.consumedMaterials ? (
                doc.consumedMaterials.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-medium text-slate-800">{it.name} (Insumo)</td>
                    <td className="py-2 px-3 text-center font-mono">{formatNumber(it.quantity, 3)} {it.unit}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(it.unitCost)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{formatCurrency(it.subtotal)}</td>
                  </tr>
                ))
              ) : null)}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan="3" className="py-2 px-3 text-right text-sm">TOTAL:</td>
                <td className="py-2 px-3 text-right text-sm font-mono text-emerald-900">
                  {formatCurrency(doc.totalAmount || doc.totalCost || 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER SIGNATURES */}
        <div className="mt-8 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
          <div>
            <div className="border-b border-slate-400 w-40 mx-auto mb-1"></div>
            <span>Firma y Aclaración Responsable</span>
          </div>
          <div>
            <div className="border-b border-slate-400 w-40 mx-auto mb-1"></div>
            <span>Recepción Conforme / Auditoría</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// -----------------------------
// RENDER ROOT
// -----------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<FutureFoodStockApp />);
}
