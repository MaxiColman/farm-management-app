"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer } from 'lucide-react'

interface Zafra {
  id: number
  chacraId: number
  proveedorId: number
  transportistaId: number
  producto: string
  humedad: number
  pesoIngreso: number
  kilosDescuento: number
  pesoFinal: number
  remitoInicial: number
  remitoFinal: number
  volatil: number
  cuerpoExtrano: number
}

interface Chacra {
  id: number
  nombre: string
}

interface Proveedor {
  id: number
  nombre: string
}

interface Transportista {
  id: number
  nombre: string
}

export default function ZafraComponent() {
  const [zafras, setZafras] = useState<Zafra[]>([])
  const [filteredZafras, setFilteredZafras] = useState<Zafra[]>([])
  const [chacras, setChacras] = useState<Chacra[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [transportistas, setTransportistas] = useState<Transportista[]>([])
  const [selectedProveedorId, setSelectedProveedorId] = useState<string | null>(null)
  const [selectedTransportistaId, setSelectedTransportistaId] = useState<string | null>(null)
  const [selectedChacraId, setSelectedChacraId] = useState<string | null>(null)
  const [selectedProducto, setSelectedProducto] = useState<string>('all')
  const [zafraFormData, setZafraFormData] = useState<Omit<Zafra, 'id'>>({
    chacraId: 0,
    proveedorId: 0,
    transportistaId: 0,
    producto: '',
    humedad: 0,
    pesoIngreso: 0,
    kilosDescuento: 0,
    pesoFinal: 0,
    remitoInicial: 0,
    remitoFinal: 0,
    volatil: 0,
    cuerpoExtrano: 0
  })

  useEffect(() => {
    const loadedZafras = JSON.parse(localStorage.getItem('zafras') || '[]')
    const loadedChacras = JSON.parse(localStorage.getItem('chacras') || '[]')
    const loadedProveedores = JSON.parse(localStorage.getItem('proveedores') || '[]')
    const loadedTransportistas = JSON.parse(localStorage.getItem('transportistas') || '[]')

    setZafras(loadedZafras)
    setChacras(loadedChacras)
    setProveedores(loadedProveedores)
    setTransportistas(loadedTransportistas)
  }, [])

  useEffect(() => {
    localStorage.setItem('zafras', JSON.stringify(zafras))
  }, [zafras])

  useEffect(() => {
    const results = zafras.filter(zafra =>
      (selectedProveedorId === null || selectedProveedorId === 'all' || zafra.proveedorId === Number(selectedProveedorId)) &&
      (selectedTransportistaId === null || selectedTransportistaId === 'all' || zafra.transportistaId === Number(selectedTransportistaId)) &&
      (selectedChacraId === null || selectedChacraId === 'all' || zafra.chacraId === Number(selectedChacraId)) &&
      (selectedProducto === 'all' || zafra.producto === selectedProducto)
    )
    setFilteredZafras(results)
  }, [zafras, selectedProveedorId, selectedTransportistaId, selectedChacraId, selectedProducto])

  const handleZafraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setZafraFormData(prev => ({ ...prev, [name]: name === 'producto' ? value : parseFloat(value) }))
  }

  const addZafra = () => {
    if (zafraFormData.chacraId !== 0 && zafraFormData.proveedorId !== 0 && zafraFormData.transportistaId !== 0) {
      const newZafra = { ...zafraFormData, id: Date.now() }
      setZafras([...zafras, newZafra])
      resetZafraForm()
    }
  }

  const deleteZafra = (id: number) => {
    setZafras(zafras.filter(zafra => zafra.id !== id))
  }

  const resetZafraForm = () => {
    setZafraFormData({
      chacraId: 0,
      proveedorId: 0,
      transportistaId: 0,
      producto: '',
      humedad: 0,
      pesoIngreso: 0,
      kilosDescuento: 0,
      pesoFinal: 0,
      remitoInicial: 0,
      remitoFinal: 0,
      volatil: 0,
      cuerpoExtrano: 0
    })
  }

  const calcularTotalesZafra = () => {
    return {
      totalHumedad: zafras.reduce((sum, z) => sum + z.humedad, 0),
      totalPesoIngreso: zafras.reduce((sum, z) => sum + z.pesoIngreso, 0),
      totalKilosDescuento: zafras.reduce((sum, z) => sum + z.kilosDescuento, 0),
      totalPesoFinal: zafras.reduce((sum, z) => sum + z.pesoFinal, 0),
      totalRemitoInicial: zafras.reduce((sum, z) => sum + z.remitoInicial, 0),
      totalRemitoFinal: zafras.reduce((sum, z) => sum + z.remitoFinal, 0),
      totalVolatil: zafras.reduce((sum, z) => sum + z.volatil, 0),
      totalCuerpoExtrano: zafras.reduce((sum, z) => sum + z.cuerpoExtrano, 0),
    }
  }

  const printData = (data: any[], title: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + title + '</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('table { border-collapse: collapse; width: 100%; }');
      printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>' + title + '</h1>');
      printWindow.document.write('<table>');
      
      // Write table header
      printWindow.document.write('<tr>');
      for (let key in data[0]) {
        if (key !== 'id') {
          printWindow.document.write('<th>' + key + '</th>');
        }
      }
      printWindow.document.write('</tr>');
      
      // Write table body
      data.forEach((item) => {
        printWindow.document.write('<tr>');
        for (let key in item) {
          if (key !== 'id') {
            printWindow.document.write('<td>' + item[key] + '</td>');
          }
        }
        printWindow.document.write('</tr>');
      });
      
      printWindow.document.write('</table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); addZafra() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="chacra">Seleccionar Chacra</Label>
          <Select onValueChange={(value) => setZafraFormData(prev => ({ ...prev, chacraId: Number(value) }))}>
            <SelectTrigger id="chacra" aria-label="Seleccionar Chacra">
              <SelectValue placeholder="Seleccionar Chacra" />
            </SelectTrigger>
            <SelectContent>
              {chacras.map(chacra => (
                <SelectItem key={chacra.id} value={chacra.id.toString()}>{chacra.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor">Seleccionar Proveedor</Label>
          <Select onValueChange={(value) => setZafraFormData(prev => ({ ...prev, proveedorId: Number(value) }))}>
            <SelectTrigger id="proveedor" aria-label="Seleccionar Proveedor">
              <SelectValue placeholder="Seleccionar Proveedor" />
            </SelectTrigger>
            <SelectContent>
              {proveedores.map(proveedor => (
                <SelectItem key={proveedor.id} value={proveedor.id.toString()}>{proveedor.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="transportista">Seleccionar Transportista</Label>
          <Select onValueChange={(value) => setZafraFormData(prev => ({ ...prev, transportistaId: Number(value) }))}>
            <SelectTrigger id="transportista" aria-label="Seleccionar Transportista">
              <SelectValue placeholder="Seleccionar Transportista" />
            </SelectTrigger>
            <SelectContent>
              {transportistas.map(transportista => (
                <SelectItem key={transportista.id} value={transportista.id.toString()}>{transportista.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="producto">Producto</Label>
          <Input
            id="producto"
            name="producto"
            value={zafraFormData.producto}
            onChange={handleZafraInputChange}
            placeholder="Ej: Trigo"
            aria-label="Producto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="humedad">Humedad (%)</Label>
          <Input
            id="humedad"
            name="humedad"
            type="number"
            value={zafraFormData.humedad}
            onChange={handleZafraInputChange}
            placeholder="Ej: 14.5"
            aria-label="Porcentaje de humedad"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pesoIngreso">Peso de Ingreso (kg)</Label>
          <Input
            id="pesoIngreso"
            name="pesoIngreso"
            type="number"
            value={zafraFormData.pesoIngreso}
            onChange={handleZafraInputChange}
            placeholder="Ej: 5000"
            aria-label="Peso de ingreso en kilogramos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kilosDescuento">Kilos de Descuento</Label>
          <Input
            id="kilosDescuento"
            name="kilosDescuento"
            type="number"
            value={zafraFormData.kilosDescuento}
            onChange={handleZafraInputChange}
            placeholder="Ej: 100"
            aria-label="Kilos de descuento"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pesoFinal">Peso Final (kg)</Label>
          <Input
            id="pesoFinal"
            name="pesoFinal"
            type="number"
            value={zafraFormData.pesoFinal}
            onChange={handleZafraInputChange}
            placeholder="Ej: 4900"
            aria-label="Peso final en kilogramos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="remitoInicial">Número de Remito Inicial</Label>
          <Input
            id="remitoInicial"
            name="remitoInicial"
            type="number"
            value={zafraFormData.remitoInicial}
            onChange={handleZafraInputChange}
            placeholder="Ej: 1001"
            aria-label="Número de remito inicial"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="remitoFinal">Número de Remito Final</Label>
          <Input
            id="remitoFinal"
            name="remitoFinal"
            type="number"
            value={zafraFormData.remitoFinal}
            onChange={handleZafraInputChange}
            placeholder="Ej: 1005"
            aria-label="Número de remito final"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="volatil">Volátil (%)</Label>
          <Input
            id="volatil"
            name="volatil"
            type="number"
            value={zafraFormData.volatil}
            onChange={handleZafraInputChange}
            placeholder="Ej: 2.5"
            aria-label="Porcentaje de volátil"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuerpoExtrano">Cuerpo Extraño (%)</Label>
          <Input
            id="cuerpoExtrano"
            name="cuerpoExtrano"
            type="number"
            value={zafraFormData.cuerpoExtrano}
            onChange={handleZafraInputChange}
            placeholder="Ej: 1.2"
            aria-label="Porcentaje de cuerpo extraño"
          />
        </div>
        <Button type="submit" className="md:col-span-2 w-full">
          Agregar Zafra
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-col  md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Select onValueChange={(value) => setSelectedProveedorId(value)}>
            <SelectTrigger aria-label="Filtrar por Proveedor">
              <SelectValue placeholder="Filtrar por Proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Proveedores</SelectItem>
              {proveedores.map(proveedor => (
                <SelectItem key={proveedor.id} value={proveedor.id.toString()}>{proveedor.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedTransportistaId(value)}>
            <SelectTrigger aria-label="Filtrar por Transportista">
              <SelectValue placeholder="Filtrar por Transportista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Transportistas</SelectItem>
              {transportistas.map(transportista => (
                <SelectItem key={transportista.id} value={transportista.id.toString()}>{transportista.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedChacraId(value)}>
            <SelectTrigger aria-label="Filtrar por Chacra">
              <SelectValue placeholder="Filtrar por Chacra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Chacras</SelectItem>
              {chacras.map(chacra => (
                <SelectItem key={chacra.id} value={chacra.id.toString()}>{chacra.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedProducto(value)}>
            <SelectTrigger aria-label="Filtrar por Producto">
              <SelectValue placeholder="Filtrar por Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Productos</SelectItem>
              {Array.from(new Set(zafras.map(zafra => zafra.producto))).map(producto => (
                <SelectItem key={producto} value={producto}>{producto}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => printData(filteredZafras, 'Zafras')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chacra</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Transportista</TableHead>
              <TableHead>Humedad</TableHead>
              <TableHead>Volátil</TableHead>
              <TableHead>Cuerpo extraño</TableHead>
              <TableHead>Kilos descuento</TableHead>
              <TableHead>Remito Inicial</TableHead>
              <TableHead>Peso ingreso</TableHead>
              <TableHead>Remito final</TableHead>
              <TableHead>Peso final</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredZafras.map(zafra => (
              <TableRow key={zafra.id}>
                <TableCell>{chacras.find(c => c.id === zafra.chacraId)?.nombre}</TableCell>
                <TableCell>{zafra.producto}</TableCell>
                <TableCell>{proveedores.find(p => p.id === zafra.proveedorId)?.nombre}</TableCell>
                <TableCell>{transportistas.find(t => t.id === zafra.transportistaId)?.nombre}</TableCell>
                <TableCell>{zafra.humedad}</TableCell>
                <TableCell>{zafra.volatil}</TableCell>
                <TableCell>{zafra.cuerpoExtrano}</TableCell>
                <TableCell>{zafra.kilosDescuento}</TableCell>
                <TableCell>{zafra.remitoInicial}</TableCell>
                <TableCell>{zafra.pesoIngreso}</TableCell>
                <TableCell>{zafra.remitoFinal}</TableCell>
                <TableCell>{zafra.pesoFinal}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteZafra(zafra.id)} className="w-full md:w-auto">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h3 className="text-xl font-semibold mb-4">Totales de Zafra</h3>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Humedad</TableHead>
              <TableHead>Peso Ingreso</TableHead>
              <TableHead>Kilos Descuento</TableHead>
              <TableHead>Peso Final</TableHead>
              <TableHead>Remito Inicial</TableHead>
              <TableHead>Remito Final</TableHead>
              <TableHead>Volátil</TableHead>
              <TableHead>Cuerpo Extraño</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{calcularTotalesZafra().totalHumedad}</TableCell>
              <TableCell>{calcularTotalesZafra().totalPesoIngreso}</TableCell>
              <TableCell>{calcularTotalesZafra().totalKilosDescuento}</TableCell>
              <TableCell>{calcularTotalesZafra().totalPesoFinal}</TableCell>
              <TableCell>{calcularTotalesZafra().totalRemitoInicial}</TableCell>
              <TableCell>{calcularTotalesZafra().totalRemitoFinal}</TableCell>
              <TableCell>{calcularTotalesZafra().totalVolatil}</TableCell>
              <TableCell>{calcularTotalesZafra().totalCuerpoExtrano}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}