'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Leaf, Users, DollarSign, Truck, Ship, Sun } from 'lucide-react'
import ChacrasFeature from '@/components/ChacrasFeature'
import ProveedoresFeature from '@/components/ProveedoresFeature'
import TransaccionesFeature from '@/components/TransaccionesFeature'
import TransportistaFeature from '@/components/TransportistaFeature'
import FletesFeature from '@/components/FletesFeature'
import ZafraFeature from '@/components/ZafraFeature'

interface NavItem {
  name: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { name: 'Home', icon: <Home className="w-4 h-4" /> },
  { name: 'Chacras', icon: <Leaf className="w-4 h-4" /> },
  { name: 'Proveedores', icon: <Users className="w-4 h-4" /> },
  { name: 'Transacciones', icon: <DollarSign className="w-4 h-4" /> },
  { name: 'Transportista', icon: <Truck className="w-4 h-4" /> },
  { name: 'Fletes', icon: <Ship className="w-4 h-4" /> },
  { name: 'Zafra', icon: <Sun className="w-4 h-4" /> },
]

export default function FarmManagementApp() {
  const [selectedPage, setSelectedPage] = useState('Home')

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Navigation sidebar */}
      <nav className="w-full md:w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Farm Management App</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Button
                  variant={selectedPage === item.name ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(item.name)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              {navItems.find(item => item.name === selectedPage)?.icon}
              <span className="ml-2">{selectedPage}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPage === 'Home' && <p>Welcome to the Farm Management App</p>}
            {selectedPage === 'Chacras' && <ChacrasFeature />}
            {selectedPage === 'Proveedores' && <ProveedoresFeature />}
            {selectedPage === 'Transacciones' && <TransaccionesFeature />}
            {selectedPage === 'Transportista' && <TransportistaFeature />}
            {selectedPage === 'Fletes' && <FletesFeature />}
            {selectedPage === 'Zafra' && <ZafraFeature />}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}