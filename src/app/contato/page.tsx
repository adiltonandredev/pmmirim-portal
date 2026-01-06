import { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactForm } from "@/components/ContactForm"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contato - PMMIRIM",
  description: "Entre em contato com a Polícia Militar Mirim",
}

export default function ContatoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <Mail className="mx-auto mb-6" size={64} />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Estamos aqui para ajudar. Envie sua mensagem!
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Informações de Contato
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Endereço</h3>
                    <p className="text-slate-700">
                      Rua Exemplo, 123 - Centro<br />
                      Cidade - Estado, CEP 12345-678
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Telefone</h3>
                    <p className="text-slate-700">
                      (11) 1234-5678<br />
                      (11) 98765-4321
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-700">
                      contato@pmmirim.org.br<br />
                      atendimento@pmmirim.org.br
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Horário de Atendimento</h3>
                    <p className="text-slate-700">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 8h às 12h
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Dúvidas Frequentes</h3>
                <p className="text-blue-800 text-sm">
                  Antes de entrar em contato, confira nossa seção de perguntas frequentes. 
                  Sua dúvida pode já estar respondida!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Envie sua Mensagem
              </h2>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
