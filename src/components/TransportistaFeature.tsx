import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Printer } from 'lucide-react'

interface Transportista {
  id: number
  nombre: string
  matricula: string
  telefono: string
  empresa: string
}

export default function TransportistaComponent() {
  const [transportistas, setTransportistas] = useState<Transportista[]>([])
  const [filteredTransportistas, setFilteredTransportistas] = useState<Transportista[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [transportistaFormData, setTransportistaFormData] = useState<Omit<Transportista, 'id'>>({
    nombre: '',
    matricula: '',
    telefono: '',
    empresa: ''
  })

  const isInitialMount = useRef(true)

  // Cargar transportistas de localStorage cuando el componente se monta
  useEffect(() => {
    const loadedTransportistas = JSON.parse(localStorage.getItem('transportistas') || '[]')
    setTransportistas(loadedTransportistas)
  }, [])

  // Guardar transportistas en localStorage cuando cambian, pero omitir el primer renderizado
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem('transportistas', JSON.stringify(transportistas))
    }
  }, [transportistas])

  useEffect(() => {
    const results = transportistas.filter(transportista =>
      transportista.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transportista.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transportista.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTransportistas(results)
  }, [searchTerm, transportistas])

  const handleTransportistaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransportistaFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filtering is already done in useEffect
  }

  const addTransportista = () => {
    if (transportistaFormData.nombre.trim() !== '') {
      const newTransportista = { ...transportistaFormData, id: Date.now() }
      setTransportistas([...transportistas, newTransportista])
      resetTransportistaForm()
    }
  }

  const startEditingTransportista = (transportista: Transportista) => {
    setEditingId(transportista.id)
    setTransportistaFormData(transportista)
  }

  const saveTransportistaEdit = () => {
    setTransportistas(transportistas.map(transportista => 
      transportista.id === editingId ? { ...transportistaFormData, id: transportista.id } : transportista
    ))
    resetTransportistaForm()
  }

  const deleteTransportista = (id: number) => {
    setTransportistas(transportistas.filter(transportista => transportista.id !== id))
  }

  const resetTransportistaForm = () => {
    setEditingId(null)
    setTransportistaFormData({
      nombre: '',
      matricula: '',
      telefono: '',
      empresa: ''
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
      <form onSubmit={(e) => { e.preventDefault(); editingId ? saveTransportistaEdit() : addTransportista() }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Transportista</Label>
          <Input
            id="nombre"
            name="nombre"
            value={transportistaFormData.nombre}
            onChange={handleTransportistaInputChange}
            placeholder="Ej: Juan Rodríguez"
            aria-label="Nombre del transportista"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="matricula">Matrícula del Vehículo</Label>
          <Input
            id="matricula"
            name="matricula"
            value={transportistaFormData.matricula}
            onChange={handleTransportistaInputChange}
            placeholder="Ej: ABC 1234"
            aria-label="Matrícula del transportista"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono de Contacto</Label>
          <Input
            id="telefono"
            name="telefono"
            value={transportistaFormData.telefono}
            onChange={handleTransportistaInputChange}
            placeholder="Ej: +598 99 987 654"
            aria-label="Teléfono del transportista"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa de Transporte</Label>
          <Input
            id="empresa"
            name="empresa"
            value={transportistaFormData.empresa}
            onChange={handleTransportistaInputChange}
            placeholder="Ej: Transportes Rápidos S.A."
            aria-label="Empresa del transportista"
          />
        </div>
        <Button type="submit" className="md:col-span-2 w-full">
          {editingId ? 'Guardar Cambios' : 'Agregar Transportista'}
        </Button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Buscar por nombre, matrícula o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Buscar transportistas"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
        <Button onClick={() => printData(filteredTransportistas, 'Transportistas')} className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransportistas.map(transportista => (
              <TableRow key={transportista.id}>
                <TableCell>{transportista.matricula}</TableCell>
                <TableCell>{transportista.nombre}</TableCell>
                <TableCell>{transportista.telefono}</TableCell>
                <TableCell>{transportista.empresa}</TableCell>
                <TableCell>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline" onClick={() => startEditingTransportista(transportista)} className="bg-yellow-500 text-white hover:bg-yellow-600 w-full md:w-auto">
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => deleteTransportista(transportista.id)} className="w-full md:w-auto">
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