"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Heart, Lock, Pencil, MapPin, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  nombre: string;
  apellido: string;
  fechaDeNacimiento: string;
  telefono: string;
}

interface Address {
  id: string;
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  predeterminada: boolean;
}

const orders = [
  {
    id: "ORD-001",
    date: "2024-03-20",
    status: "Delivered",
    total: 299.99,
    items: ["Elegance Tote Bag", "Mini Shoulder Bag"],
  },
  {
    id: "ORD-002",
    date: "2024-03-15",
    status: "In Transit",
    total: 159.99,
    items: ["Luxe Leather Clutch"],
  },
  {
    id: "ORD-003",
    date: "2024-03-10",
    status: "Processing",
    total: 449.99,
    items: ["Structured Handbag", "Quilted Chain Bag", "Bucket Bag"],
  },
];

const favorites = [
  {
    id: "1",
    name: "Elegance Tote Bag",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Chic Crossbody Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Luxe Leather Clutch",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const addresses: Address[] = [
  {
    id: "1",
    calle: "Av. Principal",
    numeroExterior: "123",
    colonia: "Centro",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    codigoPostal: "06000",
    predeterminada: true
  },
  {
    id: "2",
    calle: "Calle Secundaria",
    numeroExterior: "456",
    numeroInterior: "2B",
    colonia: "Roma Norte",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    codigoPostal: "06700",
    predeterminada: false
  }
];

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaDeNacimiento: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${session.user.email}`)
          const data = await response.json()

          if (response.ok) {
            console.log('Datos recibidos:', data)
            setUserData(data)
            // Actualizar el formulario con los datos existentes
            setFormData({
              nombre: data.nombre || '',
              apellido: data.apellido || '',
              email: session.user.email || '',
              telefono: data.telefono || '',
              fechaDeNacimiento: data.fechaDeNacimiento ? data.fechaDeNacimiento.split('T')[0] : '',
            })
          } else {
            console.error('Error en la respuesta:', data.error)
            toast({
              title: "Error",
              description: data.error || "No se pudieron cargar los datos del usuario",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error al obtener datos:', error)
          toast({
            title: "Error",
            description: "Ocurrió un error al cargar los datos del usuario",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchUserData()
    }
  }, [session, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Enviando datos:', formData)
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data
      try {
        data = await response.json()
        console.log('Respuesta del servidor:', data)
      } catch (jsonError) {
        console.error('Error al parsear la respuesta:', jsonError)
        throw new Error('Error al procesar la respuesta del servidor')
      }

      if (response.ok) {
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido actualizados correctamente.",
        })
        setIsEditing(false)
        setUserData(data)
      } else {
        console.error('Error en la respuesta:', data?.error || 'Error desconocido')
        toast({
          title: "Error",
          description: data?.error || data?.details || "No se pudieron actualizar los datos. Por favor, intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error al actualizar:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar los datos. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

        <Tabs defaultValue="datos" className="space-y-6">
          {/* Tabs para móviles */}
          <div className="md:hidden">
            <TabsList className="flex flex-col w-full gap-2 bg-transparent h-auto">
              <TabsTrigger 
                value="datos" 
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mis Datos
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="pedidos" 
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Mis Pedidos
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="favoritos" 
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mis Favoritos
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs para desktop */}
          <div className="hidden md:block">
            <TabsList>
              <TabsTrigger value="datos" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mis Datos
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Mis Pedidos
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Mis Favoritos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="datos">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Información Personal</CardTitle>
                  <CardDescription className="text-base">
                    {isEditing ? "Modifica tus datos personales" : "Tus datos personales"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-base font-medium">Nombre</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido" className="text-base font-medium">Apellido</Label>
                        <Input
                          id="apellido"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-base font-medium">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          placeholder="Ej: 5512345678"
                          pattern="[0-9]{10}"
                          title="Por favor ingresa un número de teléfono válido (10 dígitos)"
                          className="h-12 text-base placeholder:text-gray-400"
                        />
                        <p className="text-sm text-gray-500">Formato: 10 dígitos sin espacios ni guiones</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaDeNacimiento" className="text-base font-medium">Fecha de Nacimiento</Label>
                        <Input
                          id="fechaDeNacimiento"
                          name="fechaDeNacimiento"
                          type="date"
                          value={formData.fechaDeNacimiento}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      {isEditing ? (
                        <>
                          <Button type="submit" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 h-12 text-base">
                            Guardar Cambios
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="w-full sm:w-auto h-12 text-base"
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 h-12 text-base flex items-center gap-2"
                        >
                          <Pencil className="h-5 w-5" />
                          Editar
                        </Button>
                      )}
                      <Button 
                        type="button"
                        variant="outline" 
                        className="w-full sm:w-auto h-12 text-base flex items-center gap-2"
                        onClick={() => router.push('/update-password')}
                      >
                        <Lock className="h-5 w-5" />
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">Mis Direcciones</CardTitle>
                      <CardDescription className="text-base">Gestiona tus direcciones de envío</CardDescription>
                    </div>
                    <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 h-12 text-base flex items-center justify-center gap-2">
                      <Plus className="h-5 w-5" />
                      Agregar Dirección
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
                            <div className="space-y-2">
                              {address.predeterminada && (
                                <span className="inline-block text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium">
                                  Predeterminada
                                </span>
                              )}
                              <div className="space-y-1 text-base">
                                <p className="font-medium">
                                  {address.calle} {address.numeroExterior}
                                  {address.numeroInterior && `, Int. ${address.numeroInterior}`}
                                </p>
                                <p className="text-gray-600">{address.colonia}</p>
                                <p className="text-gray-600">{address.ciudad}, {address.estado}</p>
                                <p className="text-gray-600">CP: {address.codigoPostal}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2">
                            <Button variant="outline" size="sm" className="flex-1 sm:w-24">
                              Editar
                            </Button>
                            {!address.predeterminada && (
                              <Button variant="outline" size="sm" className="flex-1 sm:w-24">
                                Eliminar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pedidos">
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>Pedido {order.id}</span>
                      <span className="text-sm font-normal">{order.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Estado</p>
                          <p className="text-sm text-gray-500">{order.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Total</p>
                          <p className="text-sm text-gray-500">${order.total}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Productos</p>
                        <ul className="list-disc list-inside text-sm text-gray-500">
                          {order.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        style={{ position: 'relative' }}
                      />
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">${item.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
