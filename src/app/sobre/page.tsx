import { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Shield, Target, Users, Award, Heart, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre - PMMIRIM",
  description: "Conheça a história, missão e valores da Polícia Militar Mirim",
}

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <Shield className="mx-auto mb-6" size={64} />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre a PMMIRIM
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Formando cidadãos conscientes e preparados para o futuro
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Nossa História</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                A Polícia Militar Mirim nasceu com o objetivo de proporcionar educação cidadã 
                e formação de valores para crianças e adolescentes. Através de atividades 
                educativas, esportivas e culturais, buscamos desenvolver o senso de 
                responsabilidade, disciplina e respeito.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Desde sua fundação, a PMMIRIM tem impactado positivamente a vida de milhares 
                de jovens, oferecendo oportunidades de aprendizado e crescimento pessoal em 
                um ambiente seguro e acolhedor.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
              Missão, Visão e Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <Target className="text-blue-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Missão</h3>
                <p className="text-slate-700">
                  Formar cidadãos conscientes, disciplinados e comprometidos com valores 
                  éticos, preparando-os para serem agentes transformadores da sociedade.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <Award className="text-blue-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Visão</h3>
                <p className="text-slate-700">
                  Ser referência em educação cidadã e formação de jovens, reconhecida 
                  pela excelência e impacto positivo na comunidade.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <Heart className="text-blue-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Valores</h3>
                <ul className="text-slate-700 space-y-2">
                  <li>• Respeito</li>
                  <li>• Disciplina</li>
                  <li>• Responsabilidade</li>
                  <li>• Honestidade</li>
                  <li>• Solidariedade</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Nossas Atividades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <BookOpen className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Educação Cidadã</h3>
                <p className="text-slate-700">
                  Programas educacionais focados em valores, direitos e deveres, 
                  preparando jovens para exercer sua cidadania com consciência.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Atividades em Grupo</h3>
                <p className="text-slate-700">
                  Trabalho em equipe, desenvolvimento de liderança e habilidades 
                  sociais através de dinâmicas e projetos coletivos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Segurança e Prevenção</h3>
                <p className="text-slate-700">
                  Orientações sobre segurança pessoal, prevenção de acidentes e 
                  primeiros socorros.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Award className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Esporte e Cultura</h3>
                <p className="text-slate-700">
                  Práticas esportivas, culturais e recreativas que promovem saúde, 
                  disciplina e integração social.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Faça Parte!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Venha fazer parte da família PMMIRIM e transforme seu futuro através da 
              educação, disciplina e valores.
            </p>
            <a
              href="/contato"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Entre em Contato
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
