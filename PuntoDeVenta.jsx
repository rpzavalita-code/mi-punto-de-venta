import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function PuntoDeVenta() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ codigo: "", nombre: "", precio: "", cantidad: "" });

  const agregarProducto = () => {
    if (!form.codigo || !form.nombre || !form.precio || !form.cantidad) return;
    const existe = productos.find(p => p.codigo === form.codigo);
    if (existe) {
      alert("Ya existe un producto con ese código.");
      return;
    }
    setProductos([...productos, { ...form, cantidad: parseInt(form.cantidad) }]);
    setForm({ codigo: "", nombre: "", precio: "", cantidad: "" });
  };

  const venderProducto = (codigo) => {
    setProductos(productos.map(p =>
      p.codigo === codigo && p.cantidad > 0 ? { ...p, cantidad: p.cantidad - 1 } : p
    ));
  };

  const surtirProducto = (codigo) => {
    const cantidadExtra = parseInt(prompt("¿Cuántas unidades deseas agregar?"));
    if (!cantidadExtra || cantidadExtra <= 0) return;
    setProductos(productos.map(p =>
      p.codigo === codigo ? { ...p, cantidad: p.cantidad + cantidadExtra } : p
    ));
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, "inventario.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Punto de Venta - Inventario</h1>
      <div>
        <input placeholder="Código" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
        <input placeholder="Cantidad" type="number" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} />
        <button onClick={agregarProducto}>Agregar</button>
      </div>
      <button onClick={exportarExcel}>Exportar a Excel</button>
      <ul>
        {productos.map((p, i) => (
          <li key={i}>
            {p.nombre} ({p.codigo}) - ${p.precio} - {p.cantidad} unidades
            <button onClick={() => venderProducto(p.codigo)}>Vender</button>
            <button onClick={() => surtirProducto(p.codigo)}>Surtir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}