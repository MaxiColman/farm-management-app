"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Printer } from 'lucide-react'

interface Flete {
  id: number
  producto: string
  kmRecorridos: number
  tarifaPorKm: number
  tarifaPorTonelada: number
  fecha: string
  transportistaId: number
  transportistaNombre: string
}

interface Transportista {
  id: number
  nombre: string
}

export default function FletesComponent() {
  const [fletes, setFletes] = useState<Flete[]>([])
  const [transportistas, setTransportistas] = useState<Transportista[]>([])
  const [filteredFletes, setFilteredFletes] = useState<Flete[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [fleteFormData, setFleteFormData] = useState<Omit<Flete, 'id' | 'tarifaPorTonelada' | 'transportistaNombre'>>({
    producto: '',
    kmRecorridos: 0,
    tarifaPorKm: 0,
    fecha: '',
    transportistaId: 0
  })

  const isInitialMountFletes = useRef(true)

  useEffect(() => {
    const loadedFletes = JSON.parse(localStorage.getItem('fletes') || '[]')
    const loadedTransportistas = JSON.parse(localStorage.getItem('transportistas') || '[]')

    setFletes(loadedFletes)
    setTransportistas(loadedTransportistas)
  }, [])

  useEffect(() => {
    if (isInitialMountFletes.current) {
      isInitialMountFletes.current = false
    } else {
      localStorage.setItem('fletes', JSON.stringify(fletes))
    }
  }, [fletes])

  useEffect(() => {
    const results = fletes.filter(flete =>
      flete.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flete.transportistaNombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredFletes(results)
  }, [searchTerm, fletes])

  const handleFleteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFleteFormData(prev => ({ ...prev, [name]: name === 'kmRecorridos' || name === 'tarifaPorKm' ? parseFloat(value) : value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtering is already done in useEffect
  }

  const addFlete = () => {
    if (fleteFormData.producto.trim() !== '' && fleteFormData.transportistaId !== 0) {
      const transportista = transportistas.find(t => t.id === fleteFormData.transportistaId)
      if (transportista) {
        const tarifaPorTonelada = fleteFormData.kmRecorridos * fleteFormData.tarifaPorKm
        const newFlete = {
          ...fleteFormData,
          id: Date.now(),
          tarifaPorTonelada,
          transportistaNombre: transportista.nombre
        }
        setFletes([...fletes, newFlete])
        resetFleteForm()
      }
    }
  }

  const deleteFlete = (id: number) => {
    setFletes(fletes.filter(flete => flete.id !== id))
  }

  const resetFleteForm = () => {
    setFleteFormData({
      producto: '',
      kmRecorridos: 0,
      tarifaPorKm: 0,
      fecha: '',
      transportistaId: 0
    })
  }

  const calcularTotalFletes = () => {
    const totales = transportistas.map(transportista => {
      const fletesTransportista = fletes.filter(f => f.transportistaId === transportista.id)
      const totalKmRecorridos = fletesTransportista.reduce((sum, f) => sum + f.kmRecorridos, 0)
      const totalTarifaPorKm = fletesTransportista.reduce((sum, f) => sum + f.tarifaPorKm, 0)
      const totalTarifaPorTonelada = fletesTransportista.reduce((sum, f) => sum + f.tarifaPorTonelada, 0)
      return {
        transportistaId: transportista.id,
        transportistaNombre: transportista.nombre,
        totalKmRecorridos,
        totalTarifaPorKm,
        totalTarifaPorTonelada
      }
    })
    return totales.filter(t => t.totalKmRecorridos > 0)
  }

  const printData = (data: Flete[] | ReturnType<typeof calcularTotalFletes>, title: string) => {
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
            printWindow.document.write('<td>' + item[key as keyof typeof item] + '</td>');
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
      <form onSubmit={(e) => { e.preventDefault(); addFlete() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="producto">Producto Transportado</Label>
          <Input
            id="producto"
            name="producto"
            value={fleteFormData.producto}
            onChange={handleFleteInputChange}
            placeholder="Ej: Trigo"
            aria-label="Producto transportado"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kmRecorridos">Kilómetros Recorridos</Label>
          <Input
            id="kmRecorridos"
            name="kmRecorridos"
            type="number"
            value={fleteFormData.kmRecorridos}
            onChange={handleFleteInputChange}
            placeholder="Ej: 100"
            aria-label="Kilómetros recorridos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tarifaPorKm">Tarifa por Kilómetro (en pesos uruguayos)</Label>
          <Input
            id="tarifaPorKm"
            name="tarifaPorKm"
            type="number"
            value={fleteFormData.tarifaPorKm}
            onChange={handleFleteInputChange}
            placeholder="Ej: 50"
            aria-label="Tarifa por kilómetro"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha del Flete</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={fleteFormData.fecha}
            onChange={handleFleteInputChange}
            aria-label="Fecha del flete"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transportista">Seleccionar Transportista</Label>
          <Select onValueChange={(value) => setFleteFormData(prev => ({ ...prev, transportistaId: Number(value) }))}>
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
        <Button type="submit" className="md:col-span-2 w-full">
          Agregar Flete
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Buscar por producto o transportista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Buscar fletes"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        <Button onClick={() => printData(filteredFletes, 'Fletes')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Kilómetros recorridos</TableHead>
              <TableHead>Tarifa por kilómetro</TableHead>
              <TableHead>Tarifa por tonelada</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Transportista</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFletes.map(flete => (
              <TableRow key={flete.id}>
                <TableCell>{flete.producto}</TableCell>
                <TableCell>{flete.kmRecorridos}</TableCell>
                <TableCell>{flete.tarifaPorKm}</TableCell>
                <TableCell>{flete.tarifaPorTonelada}</TableCell>
                <TableCell>{flete.fecha}</TableCell>
                <TableCell>{flete.transportistaNombre}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteFlete(flete.id)} className="w-full md:w-auto">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Total de Fletes por Transportista</h3>
      <div className="flex justify-end mb-4">
        <Button onClick={() => printData(calcularTotalFletes(), 'Total de Fletes por Transportista')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Totales
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transportista</TableHead>
              <TableHead>Total Km Recorridos</TableHead>
              <TableHead>Total Tarifa por Km</TableHead>
              <TableHead>Total Tarifa por Tonelada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calcularTotalFletes().map(total => (
              <TableRow key={total.transportistaId}>
                <TableCell>{total.transportistaNombre}</TableCell>
                <TableCell>{total.totalKmRecorridos}</TableCell>
                <TableCell>{total.totalTarifaPorKm}</TableCell>
                <TableCell>{total.totalTarifaPorTonelada}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}