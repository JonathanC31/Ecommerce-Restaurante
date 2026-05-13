import React, { useMemo, useState } from "react";

const views = [
  ["login", "Acceso", "Inicio de sesión", "Ingreso seguro por roles", "🔐"],
  ["dashboard", "Gerencia", "Dashboard gerencial", "Indicadores clave del restaurante", "📊"],
  ["pos", "Operación", "Ventas y punto de venta", "Registro de pedidos y ventas", "🧾"],
  ["billing", "Facturación", "Facturación electrónica DIAN", "Generación y validación fiscal", "📄"],
  ["accounting", "Contabilidad", "Contabilidad básica", "Ingresos, egresos y utilidad", "🧮"],
  ["inventory", "Inventarios", "Control de inventarios", "Stock, entradas, salidas y mínimos", "📦"],
  ["waste", "Inventarios", "Vencimientos y desperdicios", "Alertas de caducidad y pérdidas", "🌾"],
  ["analytics", "Analítica", "Analítica de datos y KPIs", "Indicadores operativos y financieros", "📈"],
  ["forecast", "Inteligencia", "Predicción de demanda", "Planeación de compras y producción", "🔮"],
  ["reports", "Reportes", "Reportes estratégicos", "Informes para gerencia y contabilidad", "📑"],
  ["users", "Administración", "Usuarios, roles y trazabilidad", "Control de acceso y auditoría", "👥"],
  ["settings", "Configuración", "Parámetros y respaldo", "DIAN, base de datos y mantenimiento", "⚙️"],
];

const kpis = [
  ["Ventas del mes", "$18.4M", "+12%"],
  ["Margen estimado", "31%", "+4%"],
  ["Facturas validadas", "428", "99.1%"],
  ["Desperdicio", "4.8%", "-2%"],
];

const sales = [
  ["Hamburguesa especial", "18", "$612.000"],
  ["Menú ejecutivo", "32", "$704.000"],
  ["Limonada natural", "41", "$246.000"],
  ["Postre de la casa", "12", "$144.000"],
];

const inventory = [
  ["Carne de res", "12 kg", "8 kg", "Alta", "OK"],
  ["Lechuga", "4 kg", "5 kg", "Media", "Bajo stock"],
  ["Queso tajado", "18 und", "10 und", "Alta", "OK"],
  ["Tomate", "3 kg", "4 kg", "Alta", "Bajo stock"],
];

const invoices = [
  ["FV-1024", "$86.500", "Validada"],
  ["FV-1025", "$142.000", "Pendiente"],
  ["FV-1026", "$59.000", "Validada"],
  ["FV-1027", "$230.000", "Rechazada"],
];

function Pill({ children, type = "neutral" }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    bad: "bg-rose-50 text-rose-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[type]}`}>{children}</span>;
}

function statusType(value) {
  if (["OK", "Validada", "Activo"].includes(value)) return "good";
  if (["Pendiente", "Bajo stock"].includes(value)) return "warn";
  if (["Rechazada", "Inactivo"].includes(value)) return "bad";
  return "neutral";
}

function Header({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400 text-2xl">🍽️</div>
          <div>
            <p className="text-lg font-black">RestaurIA</p>
            <p className="text-xs text-slate-300">Gestión contable, operativa y analítica</p>
          </div>
        </div>
        <div className="hidden rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200 md:block">✅ Datos seguros</div>
      </header>
      <div className="grid min-h-[650px] bg-slate-50 md:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white p-4 md:block">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Módulos</p>
          {["Gerencia", "Facturación", "Contabilidad", "Inventarios", "Analítica", "Admin"].map((item, index) => (
            <div key={item} className={`mb-2 rounded-2xl px-3 py-3 text-sm ${index === 0 ? "bg-slate-950 font-semibold text-white" : "text-slate-500"}`}>{item}</div>
          ))}
          <div className="mt-8 rounded-3xl bg-amber-50 p-4 text-xs leading-5 text-slate-600">
            <b className="text-slate-950">Contexto Colombia:</b> facturación electrónica DIAN, inventario trazable, reportes y control financiero.
          </div>
        </aside>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function Metric({ label, value, delta }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-3xl font-black text-slate-950">{value}</p>
        <Pill type={delta.startsWith("-") ? "warn" : "good"}>{delta}</Pill>
      </div>
    </div>
  );
}

function Bars({ amber = false }) {
  return (
    <div className="flex h-56 items-end gap-3 rounded-3xl bg-slate-50 p-5">
      {[48, 65, 52, 78, 92, 71, 88].map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className={`w-full rounded-t-2xl ${amber ? "bg-amber-400" : "bg-slate-950"}`} style={{ height: `${h}%` }} />
          <p className="text-xs font-semibold text-slate-400">D{i + 1}</p>
        </div>
      ))}
    </div>
  );
}

function Login() {
  return (
    <Shell>
      <div className="grid min-h-[590px] place-items-center">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-3xl text-white">🍽️</div>
          <h2 className="mt-6 text-center text-3xl font-black text-slate-950">Ingresar a RestaurIA</h2>
          <p className="mt-2 text-center text-sm text-slate-500">Acceso por roles para proteger información financiera y operativa.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">admin@restaurante.com</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">••••••••••</div>
            <div className="grid grid-cols-3 gap-2">
              {["Admin", "Contador", "Operador"].map((role, index) => <button key={role} className={`rounded-2xl px-3 py-2 text-xs font-bold ${index === 0 ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-500"}`}>{role}</button>)}
            </div>
            <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">Iniciar sesión</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Dashboard() {
  return (
    <Shell>
      <Header title="Dashboard gerencial" subtitle="Vista central para tomar decisiones con datos actualizados." />
      <div className="grid gap-4 md:grid-cols-4">{kpis.map(([label, value, delta]) => <Metric key={label} label={label} value={value} delta={delta} />)}</div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Ventas últimos 7 días</h3><Bars /></section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-black">Alertas críticas</h3>
          <div className="mt-4 space-y-3">{["Lechuga bajo stock", "12 facturas pendientes", "Tomate vence en 2 días", "Egreso alto en carnes"].map((a, i) => <div key={a} className="rounded-2xl bg-slate-50 p-4 text-sm"><b className="mr-2 text-amber-700">{i + 1}</b>{a}</div>)}</div>
        </section>
      </div>
    </Shell>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{headers.map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => <tr key={row.join("-")}>{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`px-4 py-4 ${i === 0 ? "font-black text-slate-950" : "text-slate-600"}`}>{i === row.length - 1 && ["OK", "Bajo stock", "Validada", "Pendiente", "Rechazada", "Activo", "Inactivo"].includes(cell) ? <Pill type={statusType(cell)}>{cell}</Pill> : cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Pos() {
  return <Shell><Header title="Ventas y punto de venta" subtitle="Registro operativo de pedidos, ventas y pagos." action={<button className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black">Nueva venta</button>} /><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Productos vendidos hoy</h3><Table headers={["Producto", "Cant.", "Total"]} rows={sales} /></section><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">Resumen de caja</h3>{["Efectivo: $820.000", "Tarjeta: $1.240.000", "Transferencia: $690.000"].map(x => <div key={x} className="mt-3 rounded-2xl bg-slate-50 p-4 font-semibold">{x}</div>)}<button className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">Cerrar caja</button></section></div></Shell>;
}

function Billing() {
  return <Shell><Header title="Facturación electrónica DIAN" subtitle="Generación, validación y almacenamiento fiscal." action={<button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Crear factura</button>} /><div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">Nueva factura</h3>{["Cliente: Consumidor final", "NIT/CC: 222222222222", "Forma de pago: Tarjeta", "Total: $86.500"].map(x => <div key={x} className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">{x}</div>)}<button className="mt-5 w-full rounded-2xl bg-amber-400 px-4 py-3 font-black">Enviar a validación DIAN</button></section><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Estado de facturas</h3><Table headers={["Factura", "Total", "Estado"]} rows={invoices} /></section></div></Shell>;
}

function Accounting() {
  const rows = [["Ingreso", "Venta diaria", "$2.750.000"], ["Egreso", "Compra de insumos", "$980.000"], ["Egreso", "Pago proveedor", "$1.350.000"], ["Ingreso", "Evento privado", "$3.200.000"]];
  return <Shell><Header title="Contabilidad básica" subtitle="Control financiero de ingresos, egresos y rentabilidad." /><div className="grid gap-4 md:grid-cols-3"><Metric label="Ingresos" value="$18.4M" delta="Mes" /><Metric label="Egresos" value="$9.7M" delta="Mes" /><Metric label="Utilidad bruta" value="$8.7M" delta="47%" /></div><section className="mt-6 rounded-3xl bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Movimientos recientes</h3>{rows.map(([t, d, v]) => <div key={`${t}-${d}`} className="mb-3 grid rounded-2xl bg-slate-50 p-4 md:grid-cols-[120px_1fr_150px]"><Pill type={t === "Ingreso" ? "good" : "bad"}>{t}</Pill><span>{d}</span><b>{v}</b></div>)}</section></Shell>;
}

function Inventory() {
  return <Shell><Header title="Control de inventarios" subtitle="Entradas, salidas, stock mínimo y trazabilidad de productos." action={<button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Registrar entrada</button>} /><section className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">Buscar insumo o producto</div><Table headers={["Producto", "Stock", "Mínimo", "Rotación", "Estado"]} rows={inventory} /></section></Shell>;
}

function Waste() {
  return <Shell><Header title="Vencimientos y desperdicios" subtitle="Control para reducir pérdidas económicas y desperdicio alimentario." /><div className="grid gap-5 lg:grid-cols-2"><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">Próximos vencimientos</h3>{[["Tomate", "2 días", "3 kg"], ["Pollo", "3 días", "7 kg"], ["Crema de leche", "5 días", "12 und"]].map(([p, d, q]) => <div key={p} className="mt-3 flex justify-between rounded-2xl bg-amber-50 p-4"><div><b>{p}</b><p className="text-sm text-slate-500">Cantidad: {q}</p></div><Pill type="warn">{d}</Pill></div>)}</section><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">Desperdicio del mes</h3><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-slate-50 p-5"><p className="text-3xl font-black">$420K</p><p className="text-sm text-slate-500">Costo estimado</p></div><div className="rounded-3xl bg-slate-50 p-5"><p className="text-3xl font-black">-18%</p><p className="text-sm text-slate-500">Frente al mes anterior</p></div></div><div className="mt-4 rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-800">Recomendación: priorizar recetas con tomate y pollo antes del cierre de semana.</div></section></div></Shell>;
}

function Analytics() {
  return <Shell><Header title="Analítica de datos y KPIs" subtitle="Indicadores para evaluar productividad, costos y comportamiento de ventas." /><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Ventas por categoría</h3><Bars /></section><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">KPIs operativos</h3>{["Ticket promedio: $42.300", "Tiempo promedio de facturación: 1m 22s", "Rotación de inventario: 6.4", "Rentabilidad por plato: 34%"].map(x => <div key={x} className="mt-3 rounded-2xl bg-slate-50 p-4 font-semibold">{x}</div>)}</section></div></Shell>;
}

function Forecast() {
  return <Shell><Header title="Predicción básica de demanda" subtitle="Pronóstico basado en ventas históricas para planear compras y producción." /><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="mb-4 font-black">Pronóstico semanal</h3><Bars amber /></section><section className="rounded-3xl bg-white p-5 shadow-sm"><h3 className="font-black">Recomendación de compras</h3>{[["Carne de res", "+18 kg"], ["Pan artesanal", "+120 und"], ["Lechuga", "+6 kg"], ["Papas", "+30 kg"]].map(([i, q]) => <div key={i} className="mt-3 flex justify-between rounded-2xl bg-slate-50 p-4"><span>{i}</span><b>{q}</b></div>)}</section></div></Shell>;
}

function Reports() {
  const cards = ["Reporte de ventas", "Reporte contable", "Reporte de inventario", "Reporte de desperdicio", "Reporte fiscal DIAN", "Reporte gerencial"];
  return <Shell><Header title="Reportes estratégicos" subtitle="Informes exportables para operación, gerencia y contabilidad." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map(c => <div key={c} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-3xl">📑</p><h3 className="mt-4 font-black">{c}</h3><p className="mt-2 text-sm text-slate-500">Consulta y exportación de información para toma de decisiones.</p><button className="mt-5 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">Ver detalle</button></div>)}</div></Shell>;
}

function Users() {
  const rows = [["Laura Gómez", "Administradora", "Activo", "Total"], ["Andrés Rivas", "Contador", "Activo", "Finanzas"], ["María Ruiz", "Operadora", "Activo", "POS"], ["Carlos Peña", "Bodega", "Inactivo", "Inventario"]];
  return <Shell><Header title="Usuarios, roles y trazabilidad" subtitle="Seguridad, auditoría, permisos y control de cambios." action={<button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Crear usuario</button>} /><section className="rounded-3xl bg-white p-5 shadow-sm"><Table headers={["Usuario", "Rol", "Estado", "Permiso"]} rows={rows} /><div className="mt-5 rounded-3xl bg-slate-50 p-5"><b>Últimos eventos de auditoría</b><p className="mt-2 text-sm text-slate-600">Factura FV-1027 rechazada · Inventario actualizado · Usuario Contador exportó reporte financiero.</p></div></section></Shell>;
}

function Settings() {
  return <Shell><Header title="Parámetros, respaldo y mantenimiento" subtitle="Configuración operativa, fiscal, técnica y de continuidad." /><div className="grid gap-5 lg:grid-cols-3">{[["Parámetros DIAN", "Resolución, prefijo, certificado y ambiente de validación."], ["Base de datos", "Respaldos automáticos, restauración y consistencia de información."], ["Mantenimiento", "Correctivo, preventivo y evolutivo para cambios normativos."]].map(([t, d]) => <div key={t} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-3xl">⚙️</p><h3 className="mt-4 font-black">{t}</h3><p className="mt-2 text-sm text-slate-500">{d}</p><button className="mt-5 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold">Configurar</button></div>)}</div></Shell>;
}

const viewMap = {
  login: <Login />,
  dashboard: <Dashboard />,
  pos: <Pos />,
  billing: <Billing />,
  accounting: <Accounting />,
  inventory: <Inventory />,
  waste: <Waste />,
  analytics: <Analytics />,
  forecast: <Forecast />,
  reports: <Reports />,
  users: <Users />,
  settings: <Settings />,
};

export default function RestaurantMockupRecuperado() {
  const [selected, setSelected] = useState("dashboard");
  const active = useMemo(() => views.find(([id]) => id === selected), [selected]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 md:px-8">
      <div className="mx-auto mb-8 max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-600">Mockup de plataforma</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Gestión inteligente para restaurantes</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Mockup navegable para facturación electrónica, contabilidad, inventarios, analítica, predicción de demanda, reportes y administración.</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Seleccionar vista</p>
          <div className="space-y-2">
            {views.map(([id, group, title, subtitle, icon]) => {
              const isActive = selected === id;
              return (
                <button key={id} onClick={() => setSelected(id)} className={`w-full rounded-2xl p-3 text-left transition ${isActive ? "bg-slate-950 text-white shadow-lg" : "hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-2xl text-lg ${isActive ? "bg-white/10" : "bg-slate-100"}`}>{icon}</div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{group}</p>
                      <p className="text-sm font-black">{title}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section>
          <div className="mb-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-amber-700">{active?.[1]}</p>
            <h2 className="mt-1 text-2xl font-black">{active?.[2]}</h2>
            <p className="mt-1 text-sm text-slate-500">{active?.[3]}</p>
          </div>
          {viewMap[selected] || <Dashboard />}
        </section>
      </div>
    </div>
  );
}
