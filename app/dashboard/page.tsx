"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Heart, Lock, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  nombre: string;
  apellido: string;
  fechaDeNacimiento: string;
  telefono: string;
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
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido actualizados correctamente.",
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron actualizar los datos. Por favor, intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar los datos.",
        variant: "destructive",
      })
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

          <TabsContent value="datos">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  {isEditing ? "Modifica tus datos personales" : "Tus datos personales"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        placeholder="Ej: 55-1234-5678"
                        pattern="[0-9]{2}[-][0-9]{4}[-][0-9]{4}"
                        title="Por favor ingresa un número de teléfono válido (Ej: 55-1234-5678)"
                        className="placeholder:text-gray-400"
                      />
                      <p className="text-sm text-gray-500">Formato: 55-1234-5678</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaDeNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fechaDeNacimiento"
                        name="fechaDeNacimiento"
                        type="date"
                        value={formData.fechaDeNacimiento}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {isEditing ? (
                      <>
                        <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                          Guardar Cambios
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                    )}
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => router.push('/update-password')}
                    >
                      <Lock className="h-4 w-4" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
