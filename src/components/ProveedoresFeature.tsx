'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Printer } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Proveedor {
  id: number
  nombre: string
  ubicacion: string
  rut: string
  telefono: string
  cuentaBancaria: string
  tipo: string
}

export default function ProveedoresComponent() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [proveedorFormData, setProveedorFormData] = useState<Omit<Proveedor, 'id'>>({
    nombre: '',
    ubicacion: '',
    rut: '',
    telefono: '',
    cuentaBancaria: '',
    tipo: ''
  })

  const isInitialMount = useRef(true)

  useEffect(() => {
    const loadedProveedores = JSON.parse(localStorage.getItem('proveedores') || '[]')
    if (loadedProveedores.length > 0) {
      setProveedores(loadedProveedores)
    }
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem('proveedores', JSON.stringify(proveedores))
    }
  }, [proveedores])

  useEffect(() => {
    const results = proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.rut.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProveedores(results)
  }, [searchTerm, proveedores])

  const handleProveedorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProveedorFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProveedorSelectChange = (value: string) => {
    setProveedorFormData(prev => ({ ...prev, tipo: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtering is already done in useEffect
  }

  const addProveedor = () => {
    if (proveedorFormData.nombre.trim() !== '') {
      const newProveedor = { ...proveedorFormData, id: Date.now() }
      setProveedores([...proveedores, newProveedor])
      resetProveedorForm()
    }
  }

  const startEditingProveedor = (proveedor: Proveedor) => {
    setEditingId(proveedor.id)
    setProveedorFormData(proveedor)
  }

  const saveProveedorEdit = () => {
    setProveedores(proveedores.map(proveedor => 
      proveedor.id === editingId ? { ...proveedorFormData, id: proveedor.id } : proveedor
    ))
    resetProveedorForm()
  }

  const deleteProveedor = (id: number) => {
    setProveedores(proveedores.filter(proveedor => proveedor.id !== id))
  }

  const resetProveedorForm = () => {
    setEditingId(null)
    setProveedorFormData({
      nombre: '',
      ubicacion: '',
      rut: '',
      telefono: '',
      cuentaBancaria: '',
      tipo: ''
    })
  }

  const printData = (data: Proveedor[], title: string) => {
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
      for (const key in data[0]) {
        if (key !== 'id') {
          printWindow.document.write('<th>' + key + '</th>');
        }
      }
      printWindow.document.write('</tr>');
      
      // Write table body
      data.forEach((item) => {
        printWindow.document.write('<tr>');
        for (const key in item) {
          if (key !== 'id') {
            printWindow.document.write('<td>' + item[key as keyof Proveedor] + '</td>');
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
      <form onSubmit={(e) => { e.preventDefault(); editingId ? saveProveedorEdit() : addProveedor() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Proveedor</Label>
          <Input
            id="nombre"
            name="nombre"
            value={proveedorFormData.nombre}
            onChange={handleProveedorInputChange}
            placeholder="Ej: Insumos Agrícolas S.A."
            aria-label="Nombre del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación del Proveedor</Label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={proveedorFormData.ubicacion}
            onChange={handleProveedorInputChange}
            placeholder="Ej: Av. Principal 123, Ciudad"
            aria-label="Ubicación del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rut">RUT (Registro Único Tributario)</Label>
          <Input
            id="rut"
            name="rut"
            value={proveedorFormData.rut}
            onChange={handleProveedorInputChange}
            placeholder="Ej: 12.345.678-9"
            aria-label="RUT del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono de Contacto</Label>
          <Input
            id="telefono"
            name="telefono"
            value={proveedorFormData.telefono}
            onChange={handleProveedorInputChange}
            placeholder="Ej: +598 99 123 456"
            aria-label="Teléfono del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuentaBancaria">Cuenta Bancaria</Label>
          <Input
            id="cuentaBancaria"
            name="cuentaBancaria"
            value={proveedorFormData.cuentaBancaria}
            onChange={handleProveedorInputChange}
            placeholder="Ej: 1234-5678-90123456-00"
            aria-label="Cuenta Bancaria del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Proveedor</Label>
          <Select onValueChange={handleProveedorSelectChange} value={proveedorFormData.tipo}>
            <SelectTrigger id="tipo" aria-label="Tipo de Proveedor">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Insumos">Insumos</SelectItem>
              <SelectItem value="Servicios">Servicios</SelectItem>
              <SelectItem value="Transporte">Transporte</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="md:col-span-2 w-full">
          {editingId ? 'Guardar Cambios' : 'Agregar Proveedor'}
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Buscar por nombre, ubicación o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Buscar proveedores"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        <Button onClick={() => printData(filteredProveedores, 'Proveedores')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cuenta Bancaria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProveedores.map(proveedor => (
              <TableRow key={proveedor.id}>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.ubicacion}</TableCell>
                <TableCell>{proveedor.rut}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.cuentaBancaria}</TableCell>
                <TableCell>{proveedor.tipo}</TableCell>
                <TableCell>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline" onClick={() => startEditingProveedor(proveedor)} className="bg-yellow-500 text-white hover:bg-yellow-600 w-full md:w-auto">
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => deleteProveedor(proveedor.id)} className="w-full md:w-auto">
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}