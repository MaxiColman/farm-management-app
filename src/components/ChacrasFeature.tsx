'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Printer } from 'lucide-react'

interface Chacra {
  id: number
  nombre: string
  arrendatario: string
  ubicacion: string
  sociedad: string
  empresa: string
  area: number
  polizas: string
}

export default function ChacraComponent() {
  const [chacras, setChacras] = useState<Chacra[]>([])
  const [filteredChacras, setFilteredChacras] = useState<Chacra[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [chacraFormData, setChacraFormData] = useState<Omit<Chacra, 'id'>>({
    nombre: '',
    arrendatario: '',
    ubicacion: '',
    sociedad: '',
    empresa: '',
    area: 0,
    polizas: ''
  })

  const isInitialMount = useRef(true)

  // Cargar chacras de localStorage cuando el componente se monta
  useEffect(() => {
    const storedChacras = JSON.parse(localStorage.getItem('chacras') || '[]')
    if (storedChacras.length > 0) {
      setChacras(storedChacras)
    }
  }, [])

  // Guardar chacras en localStorage cuando cambian, pero omitir el primer renderizado
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem('chacras', JSON.stringify(chacras))
    }
  }, [chacras])
  

  useEffect(() => {
    const results = chacras.filter(chacra =>
      chacra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chacra.arrendatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chacra.sociedad.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredChacras(results)
  }, [searchTerm, chacras])

  const handleChacraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setChacraFormData(prev => ({ ...prev, [name]: name === 'area' ? parseFloat(value) : value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtering is already done in useEffect
  }

  const addChacra = () => {
    if (chacraFormData.nombre.trim() !== '') {
      const newChacra = { ...chacraFormData, id: Date.now() }
      setChacras([...chacras, newChacra])
      resetChacraForm()
    }
  }

  const startEditingChacra = (chacra: Chacra) => {
    setEditingId(chacra.id)
    setChacraFormData(chacra)
  }

  const saveChacraEdit = () => {
    setChacras(chacras.map(chacra => 
      chacra.id === editingId ? { ...chacraFormData, id: chacra.id } : chacra
    ))
    resetChacraForm()
  }

  const deleteChacra = (id: number) => {
    setChacras(chacras.filter(chacra => chacra.id !== id))
  }

  const resetChacraForm = () => {
    setEditingId(null)
    setChacraFormData({
      nombre: '',
      arrendatario: '',
      ubicacion: '',
      sociedad: '',
      empresa: '',
      area: 0,
      polizas: ''
    })
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
      <form onSubmit={(e) => { e.preventDefault(); editingId ? saveChacraEdit() : addChacra() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Chacra</Label>
          <Input
            id="nombre"
            name="nombre"
            value={chacraFormData.nombre}
            onChange={handleChacraInputChange}
            placeholder="Ej: Chacra San José"
            aria-label="Nombre de la Chacra"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arrendatario">Nombre del arrendatario</Label>
          <Input
            id="arrendatario"
            name="arrendatario"
            value={chacraFormData.arrendatario}
            onChange={handleChacraInputChange}
            placeholder="Ej: Juan Pérez"
            aria-label="Nombre del arrendatario"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={chacraFormData.ubicacion}
            onChange={handleChacraInputChange}
            placeholder="Ej: Ruta 5, km 100"
            aria-label="Ubicación"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sociedad">Sociedad</Label>
          <Input
            id="sociedad"
            name="sociedad"
            value={chacraFormData.sociedad}
            onChange={handleChacraInputChange}
            placeholder="Ej: Sociedad Agrícola S.A."
            aria-label="Sociedad"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            name="empresa"
            value={chacraFormData.empresa}
            onChange={handleChacraInputChange}
            placeholder="Ej: Agroindustrias XYZ"
            aria-label="Empresa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área (hectáreas)</Label>
          <Input
            id="area"
            name="area"
            type="number"
            value={chacraFormData.area}
            onChange={handleChacraInputChange}
            placeholder="Ej: 100"
            aria-label="Área en hectáreas"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="polizas">Pólizas (números separados por comas)</Label>
          <Input
            id="polizas"
            name="polizas"
            value={chacraFormData.polizas}
            onChange={handleChacraInputChange}
            placeholder="Ej: 12345, 67890"
            aria-label="Pólizas"
          />
        </div>
        <Button type="submit" className="md:col-span-2 w-full">
          {editingId ? 'Guardar Cambios' : 'Agregar Chacra'}
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Buscar por nombre, arrendatario o sociedad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Buscar chacras"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        <Button onClick={() => printData(filteredChacras, 'Chacras')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de la Chacra</TableHead>
              <TableHead>Nombre del Arrendatario</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Sociedad</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Área (ha)</TableHead>
              <TableHead>Pólizas</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChacras.map(chacra => (
              <TableRow key={chacra.id}>
                <TableCell>{chacra.nombre}</TableCell>
                <TableCell>{chacra.arrendatario}</TableCell>
                <TableCell>{chacra.ubicacion}</TableCell>
                <TableCell>{chacra.sociedad}</TableCell>
                <TableCell>{chacra.empresa}</TableCell>
                <TableCell>{chacra.area}</TableCell>
                <TableCell>{chacra.polizas}</TableCell>
                <TableCell>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline" onClick={() => startEditingChacra(chacra)} className="bg-yellow-500 text-white hover:bg-yellow-600 w-full md:w-auto">
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => deleteChacra(chacra.id)} className="w-full md:w-auto">
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