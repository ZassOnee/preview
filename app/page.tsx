import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Star, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 scroll-animate">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 animate-float parallax-element"
              data-speed="0.3"
            >
              Download Script <span className="gradient-text">Gratis</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto scroll-animate">
              Platform terpercaya untuk download berbagai script gratis tanpa login dan pembayaran. Semua script dapat
              diunduh secara bebas untuk keperluan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
              <Button asChild className="btn-primary">
                <Link href="/scripts">
                  <Download className="mr-2 h-5 w-5" />
                  Mulai Download
                </Link>
              </Button>
              <Button asChild className="btn-secondary">
                <Link href="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mengapa Pilih Script Gratis?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Kami menyediakan script berkualitas tinggi yang dapat diunduh secara gratis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="modern-card text-center group scroll-animate float-on-scroll">
              <div className="bg-gradient-to-br from-primary to-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Gratis</h3>
              <p className="text-gray-600">
                Semua script dapat diunduh tanpa biaya apapun. Tidak ada biaya tersembunyi.
              </p>
            </div>

            <div className="modern-card text-center group scroll-animate float-on-scroll">
              <div className="bg-gradient-to-br from-secondary to-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-600">
                Script yang kami sediakan telah diuji dan berkualitas tinggi untuk kebutuhan Anda.
              </p>
            </div>

            <div className="modern-card text-center group scroll-animate float-on-scroll">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tanpa Login</h3>
              <p className="text-gray-600">
                Tidak perlu mendaftar atau login. Langsung download script yang Anda butuhkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 scroll-animate">
        <div className="container mx-auto text-center">
          <div
            className="modern-card max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 parallax-element"
            data-speed="0.2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap untuk Mulai Download?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Jelajahi koleksi script gratis kami dan temukan yang sesuai dengan kebutuhan project Anda
            </p>
            <Button asChild className="btn-primary text-lg px-8 py-4">
              <Link href="/scripts">
                <Download className="mr-2 h-5 w-5" />
                Lihat Semua Script
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
