import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Printer } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Proveedor {
  id: number
  nombre: string
}

interface Transaccion {
  id: number
  proveedorId: number
  proveedorNombre: string
  fecha: string
  pagos: number
  creditos: number
  descripcion: string
  nombreComprador: string
  tieneIVA: boolean
  montoIVA: number
  total: number
}

export default function TransaccionesComponent() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [filteredTransacciones, setFilteredTransacciones] = useState<Transaccion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProveedorId, setSelectedProveedorId] = useState<string | null>(null)
  const [transaccionFormData, setTransaccionFormData] = useState<Omit<Transaccion, 'id' | 'proveedorId' | 'proveedorNombre' | 'montoIVA' | 'total'>>({
    fecha: '',
    pagos: 0,
    creditos: 0,
    descripcion: '',
    nombreComprador: '',
    tieneIVA: false
  })

  const isInitialMount = useRef(true)

  // Load providers and transactions from localStorage when the component mounts
  useEffect(() => {
    const loadedProveedores = JSON.parse(localStorage.getItem('proveedores') || '[]')
    const loadedTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
    setProveedores(loadedProveedores)
    setTransacciones(loadedTransacciones)
  }, [])

  // Save transactions to localStorage when they change, but skip the first render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem('transacciones', JSON.stringify(transacciones))
    }
  }, [transacciones])

  useEffect(() => {
    const results = transacciones.filter(transaccion =>
      transaccion.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaccion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaccion.nombreComprador.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTransacciones(results)
  }, [searchTerm, transacciones])

  const handleTransaccionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransaccionFormData(prev => ({ ...prev, [name]: name === 'pagos' || name === 'creditos' ? parseFloat(value) : value }))
  }

  const handleIVAChange = (checked: boolean) => {
    setTransaccionFormData(prev => ({ ...prev, tieneIVA: checked }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtering is already done in useEffect
  }

  const addTransaccion = () => {
    if (selectedProveedorId !== null) {
      const proveedor = proveedores.find(p => p.id === Number(selectedProveedorId))
      if (proveedor) {
        const montoBase = transaccionFormData.creditos - transaccionFormData.pagos
        const montoIVA = transaccionFormData.tieneIVA ? montoBase * 0.22 : 0
        const total = montoBase + montoIVA
        const newTransaccion = {
          ...transaccionFormData,
          id: Date.now(),
          proveedorId: Number(selectedProveedorId),
          proveedorNombre: proveedor.nombre,
          montoIVA,
          total
        }
        setTransacciones([...transacciones, newTransaccion])
        resetTransaccionForm()
      }
    }
  }

  const deleteTransaccion = (id: number) => {
    setTransacciones(transacciones.filter(transaccion => transaccion.id !== id))
  }

  const resetTransaccionForm = () => {
    setTransaccionFormData({
      fecha: '',
      pagos: 0,
      creditos: 0,
      descripcion: '',
      nombreComprador: '',
      tieneIVA: false
    })
    setSelectedProveedorId(null)
  }

  const calcularTotalTransacciones = () => {
    const totales = proveedores.map(proveedor => {
      const transaccionesProveedor = transacciones.filter(t => t.proveedorId === proveedor.id)
      const totalPagos = transaccionesProveedor.reduce((sum, t) => sum + t.pagos, 0)
      const totalCreditos = transaccionesProveedor.reduce((sum, t) => sum + t.creditos, 0)
      const totalIVA = transaccionesProveedor.reduce((sum, t) => sum + t.montoIVA, 0)
      const balance = totalCreditos - totalPagos + totalIVA
      return {
        proveedorId: proveedor.id,
        proveedorNombre: proveedor.nombre,
        totalPagos,
        totalCreditos,
        totalIVA,
        balance
      }
    })
    return totales.filter(t => t.totalPagos > 0 || t.totalCreditos > 0 || t.totalIVA > 0)
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
      <form onSubmit={(e) => { e.preventDefault(); addTransaccion() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="proveedor">Seleccionar Proveedor</Label>
          <Select onValueChange={(value) => setSelectedProveedorId(value)}>
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
          <Label htmlFor="fecha">Fecha de la Transacción</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={transaccionFormData.fecha}
            onChange={handleTransaccionInputChange}
            aria-label="Fecha de la transacción"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pagos">Pagos (monto en U$ o $)</Label>
          <Input
            id="pagos"
            name="pagos"
            type="number"
            value={transaccionFormData.pagos}
            onChange={handleTransaccionInputChange}
            placeholder="Ej: 10000"
            aria-label="Monto de pagos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="creditos">Créditos (monto en U$ o $)</Label>
          <Input
            id="creditos"
            name="creditos"
            type="number"
            value={transaccionFormData.creditos}
            onChange={handleTransaccionInputChange}
            placeholder="Ej: 5000"
            aria-label="Monto de créditos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción de la Transacción</Label>
          <Input
            id="descripcion"
            name="descripcion"
            value={transaccionFormData.descripcion}
            onChange={handleTransaccionInputChange}
            placeholder="Ej: Compra de semillas"
            aria-label="Descripción de la transacción"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombreComprador">Nombre del Comprador</Label>
          <Input
            id="nombreComprador"
            name="nombreComprador"
            value={transaccionFormData.nombreComprador}
            onChange={handleTransaccionInputChange}
            placeholder="Ej: María González"
            aria-label="Nombre del Comprador"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tieneIVA"
              checked={transaccionFormData.tieneIVA}
              onCheckedChange={handleIVAChange}
            />
            <Label htmlFor="tieneIVA">Tiene IVA (22%)</Label>
          </div>
        </div>
        <Button type="submit" className="md:col-span-2 w-full">
          Agregar Transacción
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Buscar por proveedor, descripción o comprador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Buscar transacciones"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        <Button onClick={() => printData(filteredTransacciones, 'Transacciones')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Pagos</TableHead>
              <TableHead>Créditos</TableHead>
              <TableHead>IVA</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Nombre del Comprador</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransacciones.map(transaccion => (
              <TableRow key={transaccion.id}>
                <TableCell>{transaccion.proveedorNombre}</TableCell>
                <TableCell>{transaccion.fecha}</TableCell>
                <TableCell>{transaccion.pagos}</TableCell>
                <TableCell>{transaccion.creditos}</TableCell>
                <TableCell>{transaccion.montoIVA.toFixed(2)}</TableCell>
                <TableCell>{transaccion.total.toFixed(2)}</TableCell>
                <TableCell>{transaccion.descripcion}</TableCell>
                <TableCell>{transaccion.nombreComprador}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteTransaccion(transaccion.id)} className="w-full md:w-auto">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h3 className="text-xl font-semibold mb-4">Total de Transacciones por Proveedor</h3>
      <div className="flex justify-end mb-4">
        <Button onClick={() => printData(calcularTotalTransacciones(), 'Total de Transacciones por Proveedor')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Totales
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              
              <TableHead>Total Pagos</TableHead>
              <TableHead>Total Créditos</TableHead>
              <TableHead>Total IVA</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calcularTotalTransacciones().map(total => (
              <TableRow key={total.proveedorId}>
                <TableCell>{total.proveedorNombre}</TableCell>
                <TableCell>{total.totalPagos.toFixed(2)}</TableCell>
                <TableCell>{total.totalCreditos.toFixed(2)}</TableCell>
                <TableCell>{total.totalIVA.toFixed(2)}</TableCell>
                <TableCell>{total.balance.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}