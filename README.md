# FUTURE FOOD S.R.L. — Sistema de Gestión de Stock, Producción y Contabilidad

Sistema empresarial interno desarrollado en **React 18** y **HTML5** con diseño moderno corporativo para el control de inventario, flujo de compras a proveedores, órdenes de fabricación (BOM) y facturación a clientes.

---

## 🚀 Cómo Ejecutar el Sistema

El sistema es **100% autónomo y listo para usar**. No requiere instalaciones complejas de backend:

1. Ingrese a la carpeta [`SISTEMA_STOCK_FUTURE_FOOD`](file:///c:/Users/raffo/Desktop/Future%20Food/ANTIGRAVITY/SISTEMA_STOCK_FUTURE_FOOD).
2. Haga doble clic en el archivo [`index.html`](file:///c:/Users/raffo/Desktop/Future%20Food/ANTIGRAVITY/SISTEMA_STOCK_FUTURE_FOOD/index.html) para abrirlo en cualquier navegador web (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave).
3. **¡Listo!** El sistema cargará con la base de datos precargada de prueba de **FUTURE FOOD SRL** y sincronizará en tiempo real con el almacenamiento local (`localStorage`) de su navegador.

---

## 📋 Módulos Principales del Sistema

### 1. 🌾 Materias Primas (MP)
* **Atributos registrados**: Nombre del producto / insumo, Código interno, Unidad de medida (Kg, g, L, u), Precio de costo unitario ($), Proveedor habitual (con CUIT y Razón Social), Stock actual y Stock mínimo de seguridad.
* **Valuación Contable**: Calcula automáticamente el valor monetario inmovilizado en almacén (`Stock × Precio Costo`).
* **Alertas de Reposición**: Notificación visual inmediata cuando el stock cae por debajo del punto de pedido.

### 2. 📦 Mercaderías & Recetas de Fabricación (BOM)
* **Atributos registrados**: Nombre de la mercadería / producto terminado, Código, Categoría, Precio de venta sugerido ($), Stock disponible.
* **Check List BOM (Bill of Materials)**: Configuración exacta de las materias primas que consume por cada unidad elaborada (ej: 22g de Proteína Whey, 25g de Pasta de Maní, 1 Envoltorio Flowpack).
* **Cálculo Automático de Costos & Márgenes**:
  * **Costo Unitario BOM**: Suma de las materias primas consumidas a valor de costo actual.
  * **Margen Bruto de Ganancia (%)**: Comparación entre precio de venta y costo de insumos.
  * **Capacidad Máxima de Fabricación Inmediata**: Cálculo en tiempo real de cuántas unidades se pueden producir con el stock de materias primas disponible en depósito.

### 3. 👥 Directorio Comercial (Proveedores & Clientes)
* **Proveedores**: Razón Social, CUIT con validación, Domicilio fiscal, Contacto, Teléfono, Email y Condiciones comerciales.
* **Clientes**: Razón Social, CUIT, Domicilio de entrega, Contacto, Teléfono y Correo electrónico.

### 4. 🛒 Entradas por Compras (+ Materia Prima / Proveedor)
* Registro de facturas y remitos de compra.
* Asignación obligatoria de Proveedor (con CUIT y domicilio visibles).
* Detalle de múltiples materias primas recibidas con cantidades y precio unitario de compra.
* **Impacto automático**: Suma (+) el stock de cada materia prima en almacén y actualiza opcionalmente el costo de reposición.
* Emisión e impresión de comprobante de ingreso de mercadería.

### 5. 🏭 Órdenes de Fabricación (- Materia Prima / + Mercadería)
* Selección de la mercadería a fabricar y cantidad deseada.
* **Verificación de Stock en Tiempo Real**: Comprueba si hay suficientes existencias de cada ingrediente del BOM antes de producir.
* **Impacto automático**:
  * Resta (-) el stock exacto de todas las materias primas requeridas.
  * Suma (+) las unidades terminadas al stock de mercadería.
* Asignación de número de lote para trazabilidad alimentaria y emisión de Orden de Fabricación.

### 6. 💰 Salidas por Ventas (- Mercadería / Cliente)
* Facturación y remisión a clientes registrados.
* Despacho de productos terminados con validación de stock disponible.
* **Impacto automático**: Descuenta (-) las unidades vendidas del stock y registra el ingreso monetario contable.
* Generación e impresión de Factura / Remito con membrete oficial de **FUTURE FOOD S.R.L.**.

### 7. 📊 Dashboard Contable & Libro Diario (Kardex)
* Gráficos interactivos de valuación de inventario (Materias Primas vs. Mercaderías).
* KPIs: Valuación Total de Almacén, Ventas Facturadas, Compras de Insumos y Margen Bruto estimado.
* **Libro Diario (Kardex)**: Registro cronológico inmutable de todas las operaciones (Compras, Producción, Ventas, Ajustes).
* **Exportación a Excel**: Descarga en un clic de todas las tablas en formato `.XLSX`.
* **Copias de Seguridad**: Exportación e Importación de respaldos en formato `.JSON`.

---

## 🛠️ Tecnologías Utilizadas
* **React 18** (Functional Components, Hooks: `useState`, `useEffect`, `useMemo`, `useRef`)
* **HTML5 & CSS3** (Diseño responsive y optimizado para impresión con `@media print`)
* **Tailwind CSS** (Sistema de estilos utilitarios moderno)
* **Chart.js** (Visualización de datos y balances de inventario)
* **SheetJS (XLSX)** (Generación y descarga de archivos de Excel)
* **FontAwesome 6** (Iconografía corporativa)
* **LocalStorage API** (Persistencia local permanente sin requerir base de datos externa)

---
*FUTURE FOOD S.R.L. — Todos los derechos reservados.*
