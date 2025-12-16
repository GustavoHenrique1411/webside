import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Cloud, LineChart, Smartphone, ShieldCheck, Headset, Rocket, Cpu, ChevronRight, Lock } from "lucide-react";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6
    } 
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <motion.div 
    className="text-center"
    variants={container}
  >
    <div className="text-2xl md:text-3xl font-semibold text-white">{value}</div>
    <div className="text-xs md:text-sm opacity-80 text-white">{label}</div>
  </motion.div>
);

const Feature = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <motion.div variants={container}>
    <Card className="border-0 shadow-card bg-white/90 backdrop-blur hover:shadow-brand transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent">
            <Icon className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle className="text-base md:text-lg text-primary">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border border-accent/30 text-accent bg-accent/10">
    <CheckCircle2 className="w-4 h-4" /> {children}
  </span>
);

const TestimonialCard = ({ quote, author }: { quote: string; author: string }) => (
  <motion.div variants={container}>
    <Card className="bg-white/10 border-white/10 text-white hover:bg-white/15 transition-all duration-300">
      <CardContent className="pt-6">
        <p className="text-sm md:text-base italic">"{quote}"</p>
        <div className="mt-4 text-xs md:text-sm opacity-80">{author}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function WebsideLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-hero">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.websidesistemas.com.br/imagens/logo_webside.png" 
              alt="Webside Sistemas" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80 text-sm">
            <a href="#produto" className="hover:text-white transition-colors">Produto</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a>
            <a href="#provas" className="hover:text-white transition-colors">Clientes</a>
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              <Lock className="w-4 h-4 mr-2" />
              Área Restrita
            </Button>
            <Button variant="cta" size="sm">
              Solicitar Demonstração
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 md:pt-24 md:pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div 
              variants={container} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
            >
              <Badge>Gestão em nuvem • Dashboard • Suporte 24/7</Badge>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight text-white">
                WebPosto: gestão completa e em tempo real para postos de combustíveis
              </h1>
              <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
                Centralize operações, acompanhe indicadores e tome decisões com segurança. Um sistema moderno, mobile e escalável para elevar a eficiência do seu posto.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="cta" size="lg">
                  Falar com um consultor
                </Button>
                <Button variant="hero" size="lg">
                  Ver recursos <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Stats */}
              <motion.div 
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={staggerChildren}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Stat value="> 70 mil" label="Usuários ativos" />
                <Stat value="> 301 mi" label="Vendas processadas" />
                <Stat value="3,5 mi/h" label="Registros por hora" />
                <Stat value="+1/6h" label="Novos clientes" />
              </motion.div>
            </motion.div>

            <motion.div 
              variants={container} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }} 
              className="relative"
            >
              <div className="relative rounded-3xl p-2 md:p-3 bg-white/10 border border-white/10 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-white overflow-hidden shadow-xl">
                  {/* Mock dashboard */}
                  <div className="p-4 md:p-6">
                    <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="h-24 rounded-xl bg-accent/20" />
                      <div className="h-24 rounded-xl bg-accent/20" />
                      <div className="h-24 rounded-xl bg-accent/20" />
                    </div>
                    <div className="mt-4 h-40 rounded-xl bg-muted/50" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <span className="px-3 py-2 rounded-xl text-xs text-white/90 bg-white/10 border border-white/10 backdrop-blur">
                  Painel personalizável • KPIs em tempo real
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 md:py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              "Alta disponibilidade",
              "Backup em tempo real",
              "Implantação assistida",
              "Migração de dados",
            ].map((t) => (
              <motion.div 
                key={t} 
                className="text-sm md:text-base text-muted-foreground flex items-center justify-center gap-2"
                variants={container}
              >
                <ShieldCheck className="w-5 h-5 text-accent" /> {t}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Produto */}
      <section id="produto" className="py-14 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            variants={container} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary">
              Tudo o que seu posto precisa em um único sistema
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              O <strong className="text-primary">WebPosto</strong> integra vendas, estoque, financeiro, fiscal e gestão de bombas em um ecossistema confiável. Acompanhe o negócio em tempo real via web e aplicativos móveis.
            </p>
            <ul className="mt-6 grid gap-3 text-foreground">
              {[
                "Gestão em nuvem com acesso seguro",
                "Dashboard e relatórios com DRE personalizado",
                "Aplicativos mobile para operação e gestão",
                "Integrações e APIs para automação",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> 
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button variant="cta">Solicitar apresentação</Button>
            </div>
          </motion.div>

          <motion.div 
            variants={container} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl h-48 md:h-64 bg-gradient-to-br from-accent/20 to-accent/5" />
              <div className="rounded-2xl h-48 md:h-64 bg-gradient-to-br from-accent/20 to-accent/5" />
              <div className="rounded-2xl h-32 md:h-40 bg-gradient-to-br from-accent/20 to-accent/5 col-span-2" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="py-14 md:py-24 bg-gradient-section">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            className="max-w-2xl"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary">
              Diferenciais que aceleram seus resultados
            </h2>
            <p className="mt-3 text-muted-foreground">
              Performance, segurança e suporte para operar sem fricção.
            </p>
          </motion.div>

          <motion.div 
            className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Feature 
              icon={Cloud} 
              title="Nuvem e disponibilidade" 
              desc="Arquitetura em nuvem com alta disponibilidade e backups contínuos." 
            />
            <Feature 
              icon={LineChart} 
              title="Painéis e DRE" 
              desc="KPIs, relatórios e DRE personalizável para decisões melhores." 
            />
            <Feature 
              icon={Smartphone} 
              title="Mobilidade" 
              desc="Apps para gestão e operação: acompanhe tudo onde estiver." 
            />
            <Feature 
              icon={Headset} 
              title="Suporte 24/7" 
              desc="Atendimento humano de ponta a ponta, quando você precisar." 
            />
          </motion.div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-14 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            className="grid lg:grid-cols-3 gap-6 items-stretch"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={container}>
              <Card className="border-0 shadow-card hover:shadow-brand transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-accent" />
                    <CardTitle className="text-primary">Implantação orientada</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Migração de dados, treinamento e acompanhamento para colocar o sistema em produção com segurança.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={container}>
              <Card className="border-0 shadow-card hover:shadow-brand transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-accent" />
                    <CardTitle className="text-primary">Integrações</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    APIs e integrações com automação de bombas, ERPs e soluções fiscais.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={container}>
              <Card className="border-0 shadow-card hover:shadow-brand transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <CardTitle className="text-primary">Segurança e conformidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Acesso seguro, perfis de usuário e trilhas de auditoria para conformidade fiscal e operacional.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Provas sociais */}
      <section id="provas" className="py-14 md:py-24 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 text-white">
          <motion.div 
            className="max-w-2xl"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold">Resultados que geram confiança</h2>
            <p className="mt-3 text-white/80">Depoimentos e números que mostram impacto real na operação.</p>
          </motion.div>

          <motion.div 
            className="mt-8 grid md:grid-cols-3 gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <TestimonialCard 
              quote="Desde que adotamos o WebPosto, reduzimos custos operacionais e ganhamos visibilidade do negócio em tempo real."
              author="Diretor de Operações • Rede de Postos"
            />
            <TestimonialCard 
              quote="O suporte 24/7 faz toda diferença. Nunca ficamos parados por questões do sistema."
              author="Gerente • Posto Central"
            />
            <TestimonialCard 
              quote="A migração foi tranquila e os relatórios nos ajudam a tomar decisões mais assertivas."
              author="Proprietário • Grupo Combustível"
            />
          </motion.div>

          <motion.div 
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              "São Paulo",
              "Goiás", 
              "Minas Gerais",
              "Rio de Janeiro",
            ].map((uf) => (
              <motion.div 
                key={uf} 
                className="flex items-center justify-center text-white/80 border border-white/10 rounded-2xl py-4 hover:bg-white/10 transition-colors"
                variants={container}
              >
                {uf}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section id="contato" className="py-14 md:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-primary">
              Pronto para modernizar a gestão do seu posto?
            </h3>
            <p className="mt-3 text-muted-foreground">
              Converse com nossa equipe e veja o WebPosto em ação. Apresentação guiada e sem compromisso.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="cta" size="lg">Agendar demonstração</Button>
              <Button variant="outline" size="lg">Falar no WhatsApp</Button>
            </div>

            {/* Mini formulário */}
            <form className="mt-8 grid md:grid-cols-3 gap-3 text-left">
              <input 
                className="rounded-xl border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="Seu nome" 
              />
              <input 
                className="rounded-xl border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="Seu e-mail" 
              />
              <input 
                className="rounded-xl border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="Seu telefone" 
              />
              <textarea 
                className="md:col-span-3 rounded-xl border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                rows={4} 
                placeholder="Conte um pouco sobre sua necessidade" 
              />
              <div className="md:col-span-3 text-right">
                <Button variant="cta">Enviar</Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 text-white/80">
          <div>
            <img 
              src="https://www.websidesistemas.com.br/imagens/logo_webside.png" 
              alt="Webside Sistemas" 
              className="h-7 w-auto" 
            />
            <p className="mt-3 text-sm max-w-sm">
              Soluções em software para postos de combustíveis. Inovação, segurança e suporte para operar com eficiência.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white mb-2 font-medium">Empresa</div>
              <ul className="space-y-1">
                <li><a href="#produto" className="hover:text-white transition-colors">Produto</a></li>
                <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
                <li><a href="#provas" className="hover:text-white transition-colors">Clientes</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white mb-2 font-medium">Recursos</div>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-white mb-2 font-medium">Fale com a gente</div>
            <p className="opacity-80">Atendimento comercial e suporte 24/7.</p>
            <div className="mt-3 flex flex-col gap-2">
              <a className="hover:text-white transition-colors" href="mailto:contato@websidesistemas.com.br">
                contato@websidesistemas.com.br
              </a>
              <a className="hover:text-white transition-colors" href="tel:+550000000000">
                (00) 0000-0000
              </a>
            </div>
          </div>
        </div>
        <div className="text-center py-6 text-xs text-white/60 border-t border-white/10">
          © {new Date().getFullYear()} Webside Sistemas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}