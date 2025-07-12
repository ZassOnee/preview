import { MessageCircle, Phone, Youtube, Instagram, Send, Mail, Users, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const socialMediaLinks = [
  {
    name: "WhatsApp",
    description: "Chat langsung untuk request script",
    icon: MessageCircle,
    url: "https://wa.me/6281234567890",
    color: "bg-green-500 hover:bg-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    isRecommended: true,
    subtitle: "Recommended untuk Request Script",
  },
  {
    name: "Saluran WhatsApp",
    description: "Update terbaru script gratis",
    icon: Phone,
    url: "https://whatsapp.com/channel/0029VaExample",
    color: "bg-green-600 hover:bg-green-700",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    isRecommended: false,
    subtitle: "Dapatkan notifikasi script baru",
  },
  {
    name: "YouTube",
    description: "Tutorial dan review script",
    icon: Youtube,
    url: "https://youtube.com/@scriptgratis",
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    isRecommended: false,
    subtitle: "Subscribe untuk tutorial",
  },
  {
    name: "Instagram",
    description: "Update dan behind the scenes",
    icon: Instagram,
    url: "https://instagram.com/scriptgratis",
    color: "bg-pink-500 hover:bg-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    isRecommended: false,
    subtitle: "Follow untuk update visual",
  },
  {
    name: "TikTok",
    description: "Video pendek tips coding",
    icon: MessageSquare,
    url: "https://tiktok.com/@scriptgratis",
    color: "bg-black hover:bg-gray-800",
    textColor: "text-gray-800",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    isRecommended: false,
    subtitle: "Tips coding dalam video pendek",
  },
  {
    name: "Grup Telegram",
    description: "Diskusi dan sharing script",
    icon: Send,
    url: "https://t.me/scriptgratisgroup",
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    isRecommended: false,
    subtitle: "Join komunitas developer",
  },
  {
    name: "Email",
    description: "Kontak resmi untuk kerjasama",
    icon: Mail,
    url: "mailto:info@scriptgratis.com",
    color: "bg-gray-500 hover:bg-gray-600",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    isRecommended: false,
    subtitle: "Untuk kerjasama bisnis",
  },
]

export default function KontakPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Terhubung dengan Script Gratis melalui berbagai platform sosial media
        </p>

        {/* Request Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-800">Request Script Khusus</h3>
          </div>
          <p className="text-green-700 mb-4">
            Butuh script khusus sesuai kebutuhan Anda? Request langsung melalui WhatsApp!
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <a
              href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20request%20script%20khusus"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Request Script via WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Social Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {socialMediaLinks.map((social, index) => (
          <Card
            key={index}
            className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${social.borderColor} ${social.bgColor} hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full ${social.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <social.icon className="w-8 h-8 text-white" />
                </div>

                {/* Platform Name */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-xl font-bold ${social.textColor}`}>{social.name}</h3>
                  {social.isRecommended && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Recommended</Badge>
                  )}
                </div>

                {/* Subtitle */}
                <p className="text-sm font-medium text-gray-600 mb-2">{social.subtitle}</p>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">{social.description}</p>

                {/* Button */}
                <Button asChild className={`w-full ${social.color} text-white border-0`}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-4 h-4 mr-2" />
                    Kunjungi {social.name}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Community Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900">Bergabung dengan Komunitas</h2>
            </div>

            <div className="space-y-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong>Grup Telegram:</strong> Diskusi teknis, sharing script, dan saling membantu
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong>YouTube:</strong> Tutorial lengkap penggunaan script dan tips coding
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong>Instagram & TikTok:</strong> Update terbaru dan konten edukatif
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Guidelines */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-green-900">Cara Request Script</h2>
            </div>

            <div className="space-y-4 text-green-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p>
                  Hubungi kami via <strong>WhatsApp</strong> dengan detail kebutuhan script
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p>
                  Jelaskan <strong>fungsi dan fitur</strong> yang diinginkan secara detail
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p>
                  Tim kami akan <strong>membalas dalam 24 jam</strong> dengan estimasi waktu
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <p>
                  Script akan <strong>dibagikan gratis</strong> setelah selesai dikembangkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-green-300">
              <p className="text-sm text-green-700">
                <strong>💡 Tips:</strong> Semakin detail penjelasan kebutuhan Anda, semakin cepat kami dapat membantu!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8 bg-gray-50 border-gray-200">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Apakah request script benar-benar gratis?</h3>
              <p className="text-gray-600 text-sm">
                Ya, semua script yang kami buat akan dibagikan secara gratis untuk semua pengguna.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Berapa lama waktu pembuatan script?</h3>
              <p className="text-gray-600 text-sm">
                Tergantung kompleksitas, biasanya 1-7 hari kerja. Kami akan memberikan estimasi yang jelas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Platform apa saja yang didukung?</h3>
              <p className="text-gray-600 text-sm">
                Kami mendukung berbagai platform: Web (HTML/CSS/JS), Mobile (Flutter), Desktop, dan lainnya.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bagaimana cara mendapat update script terbaru?</h3>
              <p className="text-gray-600 text-sm">
                Follow saluran WhatsApp kami atau subscribe YouTube untuk mendapat notifikasi script terbaru.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Siap Berkolaborasi?</h2>
        <p className="text-xl mb-6 opacity-90">
          Bergabunglah dengan ribuan developer yang sudah menggunakan script gratis kami
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <a
              href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20Script%20Gratis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat WhatsApp Sekarang
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
          >
            <a href="https://whatsapp.com/channel/0029VaExample" target="_blank" rel="noopener noreferrer">
              <Phone className="w-5 h-5 mr-2" />
              Join Saluran WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Hidden Admin Link - Tersembunyi di bagian bawah */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/admin"
          className="group opacity-20 hover:opacity-100 transition-all duration-500 hover:scale-110"
          title="Admin Panel"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-300" />
          </div>
        </Link>
      </div>

      {/* Footer dengan copyright dan admin link tersembunyi */}
      <footer className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 sm:mb-0">
            <p>&copy; 2024 Script Gratis. All rights reserved.</p>
          </div>

          {/* Alternative hidden admin link in footer */}
          <div className="flex items-center space-x-4">
            <span>Made with ❤️ for developers</span>
            <Link href="/admin" className="opacity-30 hover:opacity-100 transition-opacity duration-300" title="System">
              <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-blue-500 transition-colors"></div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
