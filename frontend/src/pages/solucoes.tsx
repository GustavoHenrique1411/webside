import React from 'react';
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap, Smartphone, BarChart3, Truck, FileText, RotateCcw, MapPin, Users, Award, MessageCircle } from "lucide-react";

const produtos = [
  {
    categoria: "Pista",
    itens: [
      { emoji: "⛽", nome: "WP PDV", desc: "PDV completo para pista de combustíveis com controle total de vendas e estoque", destaque: true },
      { emoji: "🏎️", nome: "WP PAY", desc: "Pagamento rápido e seguro com bandeiras e Pix", destaque: false },
      { emoji: "🤖", nome: "WP Autoatendimento", desc: "Totem self-service para abastecimento 24h", destaque: false },
      { emoji: "🔍", nome: "WP ID", desc: "Identificação biométrica e facial para clientes", destaque: false },
    ]
  },
  {
    categoria: "Conveniência",
    itens: [
      { emoji: "🛒", nome: "WP Conveniência", desc: "Gestão completa de loja de conveniência integrada ao PDV", destaque: false },
      { emoji: "📦", nome: "WP Contagem", desc: "Controle de estoque em tempo real com inventário móvel", destaque: false },
      { emoji: "📱", nome: "WP PDV Android", desc: "PDV móvel para Android com sincronização total", destaque: false },
      { emoji: "🧊", nome: "WP Freezer", desc: "Monitoramento inteligente de freezers e câmaras", destaque: false },
    ]
  },
  {
    categoria: "Gestão",
    itens: [
      { emoji: "📊", nome: "WP Gerencial", desc: "Relatórios gerenciais completos e dashboards customizáveis", destaque: false },
      { emoji: "📈", nome: "WP Dashboard & BI", desc: "Inteligência de negócios com análises avançadas", destaque: true },
      { emoji: "🚛", nome: "WP Frota", desc: "Controle de frotas e abastecimentos com geolocalização", destaque: false },
      { emoji: "📄", nome: "WP Faturamento", desc: "Emissão automática de NF-e e integração contábil", destaque: false },
      { emoji: "🔄", nome: "WP Conciliação", desc: "Conciliação bancária automática e relatórios fiscais", destaque: false },
    ]
  }
];

export default function SolucoesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#020234] via-blue-900 to-[#04176b] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#04A6F9]/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Soluções WebPosto - Líder de Mercado</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Todas as Soluções 
            <span className="block text-[#04A6F9] bg-gradient-to-r from-[#04A6F9] to-[#0284c7] bg-clip-text text-transparent">WebPosto</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">Descubra todos os módulos do sistema líder para postos de combustíveis. Do PDV à inteligência de negócios, tudo integrado e escalável.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link 
              to="/#contato" 
              className="group flex items-center gap-3 bg-[#04A6F9] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#0284c7] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto text-center"
            >
              Solicite Demonstração
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias de Produtos */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#020234] to-[#04176b] bg-clip-text text-transparent mb-6">Nossas Soluções Completas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Do abastecimento à gestão estratégica, todas as ferramentas que seu posto precisa em uma única plataforma integrada.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {produtos.map((cat, idx) => (
              <div key={idx} className="group bg-white/50 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:border-[#04A6F9]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {cat.itens.find(i => i.destaque)?.emoji || '⭐'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#020234]">{cat.categoria}</h3>
                    <p className="text-[#04A6F9] font-semibold">{cat.itens.length} Módulos</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {cat.itens.map((item, i) => (
                    <div key={i} className={`group/item flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      item.destaque 
                        ? 'bg-gradient-to-r from-[#04A6F9]/10 to-blue-50 border border-[#04A6F9]/30 shadow-lg hover:shadow-xl hover:scale-[1.02]' 
                        : 'hover:bg-gray-50 border border-gray-100'
                    }`}>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl flex-shrink-0 mt-0.5 shadow-md">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg text-[#020234] group-hover/item:text-[#04A6F9] transition-colors">{item.nome}</h4>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2" />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Link 
                    to="/#contato"
                    className="inline-flex items-center gap-2 text-[#04A6F9] font-semibold hover:text-[#0284c7] transition-colors group/link"
                  >
                    Saiba Mais Sobre {cat.categoria}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-[#04A6F9]/20 text-[#04A6F9] px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Por Que Escolher WebPosto?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#020234] to-gray-800 bg-clip-text text-transparent mt-6 mb-6">Tudo Integrado. Zero Complicação.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Uma única plataforma com todos os módulos interligados, atualizações automáticas e suporte especializado.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Clientes Satisfeitos", desc: "+500 postos usando diariamente", num: "+500" },
              { icon: Award, title: "Mercado Líder", desc: "20% dos postos brasileiros", num: "20%" },
              { icon: Smartphone, title: "100% Mobile", desc: "Apps nativos para todos os módulos", num: "3 Apps" },
              { icon: BarChart3, title: "BI Avançado", desc: "Dashboards em tempo real", num: "50+" },
              { icon: Truck, title: "Frotas Controladas", desc: "Geolocalização completa", num: "1000+" },
              { icon: Shield, title: "Suporte 24/7", desc: "Equipes dedicadas em 3 estados", num: "3 Filiais" }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-[#04A6F9]/30">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#04A6F9] to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="h-24">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#04A6F9] to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform">
                    {item.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#020234] mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-[#020234] to-[#04176b]">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-4 mb-8 border border-white/30">
            <MapPin className="w-6 h-6" />
            <span className="text-lg">Atendimento em MG, SP e GO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Transformar Seu Posto?</h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">Fale com nossos especialistas e descubra como o WebPosto pode revolucionar sua operação.</p>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-2xl mx-auto">
            <a 
              href="https://wa.me/5511988934345?text=Vi%20todas%20as%20soluções%20WebPosto%20e%20quero%20saber%20mais!" 
              target="_blank" 
              rel="noreferrer" 
              className="group flex-1 flex items-center justify-center gap-4 bg-[#25d366] text-white py-6 px-8 rounded-3xl font-bold text-lg hover:bg-[#20bd5a] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.02] border-2 border-transparent hover:border-white/20"
            >
              <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              Falar com Comercial (CUPOM WSSITE17031987)
            </a>
            <Link 
              to="/#suporte"
              className="group flex-1 flex items-center justify-center gap-4 bg-white/20 backdrop-blur-sm text-white py-6 px-8 rounded-3xl font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
            >
              Ver Suporte e Contatos
              <Users className="w-7 h-7" />
            </Link>
          </div>

          <p className="mt-12 text-white/70 text-sm">© 2026 Webside Sistemas - Transformando postos de combustíveis desde 2011</p>
        </div>
      </section>
    </div>
  );
}

