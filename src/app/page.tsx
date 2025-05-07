import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRightCircle, LineChart, Shield, Gift, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-primary">
            <span className="kipo-gradient bg-clip-text text-transparent">Kipo</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Características
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Cómo funciona
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Testimonios
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Crear cuenta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 space-y-10">
        <div className="container flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Toma el control de tus finanzas con <span className="kipo-gradient bg-clip-text text-transparent">Kipo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px]">
            La forma más inteligente de gestionar tu dinero, establecer metas de ahorro y recibir recomendaciones personalizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Comenzar ahora <ArrowRightCircle size={16} />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                Cómo funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Características principales
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Todo lo que necesitas para gestionar tus finanzas personales en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <LineChart className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Seguimiento inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitorea automáticamente tus ingresos y gastos. Visualiza hacia dónde va tu dinero con gráficos claros y detallados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Metas personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crea objetivos financieros y sigue tu progreso. Recibe notificaciones cuando estés cerca de alcanzarlos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Gift className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Recomendaciones IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Obtén consejos personalizados basados en tus hábitos de gasto, utilizando inteligencia artificial avanzada.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Cómo funciona
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Comenzar con Kipo es sencillo y rápido
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</div>
              <h3 className="text-xl font-bold">Crea tu cuenta</h3>
              <p className="text-muted-foreground">
                Regístrate en menos de 2 minutos y completa un sencillo cuestionario para personalizar tu experiencia.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</div>
              <h3 className="text-xl font-bold">Configura tus objetivos</h3>
              <p className="text-muted-foreground">
                Define tus metas financieras, ya sea ahorrar para vacaciones, comprar una casa o crear un fondo de emergencia.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</div>
              <h3 className="text-xl font-bold">Recibe insights personalizados</h3>
              <p className="text-muted-foreground">
                Nuestra IA analiza tus patrones financieros y te proporciona consejos adaptados a tus necesidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Miles de personas ya están transformando sus finanzas con Kipo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-slate-200 w-12 h-12"></div>
                  <div>
                    <CardTitle>Ana Rodríguez</CardTitle>
                    <CardDescription>Profesional independiente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Antes de usar Kipo, nunca sabía exactamente en qué gastaba mi dinero. Ahora no solo tengo control total, sino que he logrado ahorrar para mi próximo viaje."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-slate-200 w-12 h-12"></div>
                  <div>
                    <CardTitle>Carlos Méndez</CardTitle>
                    <CardDescription>Emprendedor</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Las recomendaciones personalizadas de Kipo me han ayudado a reducir gastos innecesarios y enfocarme en lo que realmente importa. Mi estrés financiero ha disminuido considerablemente."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-slate-950 text-slate-50 px-6 py-12 sm:px-12 sm:py-16 md:p-20 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Comienza tu viaje financiero hoy mismo
              </h2>
              <p className="text-slate-300">
                Únete a miles de personas que están tomando el control de sus finanzas y construyendo un futuro más seguro.
              </p>
              <div className="pt-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
                    Crear cuenta gratuita
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kipo</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Equipo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Carreras
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Testimonios
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Guías
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Educación financiera
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Kipo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
