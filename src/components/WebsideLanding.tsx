import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Cloud, LineChart, Smartphone, ShieldCheck, Headset, Rocket, Cpu, ChevronRight, Lock, ChevronLeft, ChevronRight as ChevronRightIcon, Facebook, Instagram, Twitter, Linkedin, Loader2 } from "lucide-react";
import { apiService } from "@/lib/api";

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

const Stat = ({ value, label, desc }: { value: string; label: string; desc?: string }) => (
  <motion.div variants={container}>
    <div className="text-2xl md:text-3xl font-semibold text-white">{value}</div>
    <div className="text-xs md:text-sm opacity-80 text-white">{label}</div>
    {desc && <div className="text-xs opacity-60 text-white mt-1">{desc}</div>}
  </motion.div>
);

const Feature = ({ icon: Icon, title, desc }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; desc: string }) => (
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
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState('sp');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiService.createLead(formData);
      setIsDemoDialogOpen(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const images = [
    "/carrocel-1.png",
    "/carrocel-2.png",
    "/carrocel-3.png",
    "/carrocel-4.png",
    "/carrocel-5.png",
    "/carrocel-6.png",
    "/carrocel-7.png",
    "/carrocel-8.png",
    "/carrocel-9.png",
    "/carrocel-10.png",
    "/carrocel-11.png",
    "/carrocel-12.png",
    "/carrocel-13.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-play functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [nextImage]);

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
            <Button variant="cta" size="sm" onClick={() => setIsDemoDialogOpen(true)}>
              Solicitar Demonstração
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Solicitar Demonstração</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para solicitar uma demonstração do WebPosto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="col-span-3"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                className="col-span-3"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Empresa
              </Label>
              <Input
                id="company"
                placeholder="Nome da empresa"
                className="col-span-3"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Mensagem
              </Label>
              <Textarea
                id="message"
                placeholder="Conte-nos um pouco sobre sua necessidade..."
                className="col-span-3"
                rows={3}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Solicitação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Localização - {selectedLocation}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden">
            {selectedLocation === 'São Paulo' && (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.0551309038633!2d-46.61290902502347!3d-23.494523659139464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef7f45e97cb79%3A0x97025a8c0e55f6f0!2sWebside%20Consultoria%20e%20Sistemas!5e0!3m2!1spt-BR!2sbr!4v1721134917604!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
            {selectedLocation === 'Minas Gerais' && (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.81685371737!2d-46.93967112516066!3d-19.592345527882316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b036e13226ef7f%3A0x4b55d5e80d4fe2a0!2sR.%20Calim%C3%A9rio%20Guimar%C3%A3es%2C%20302%20-%20Centro%2C%20Arax%C3%A1%20-%20MG%2C%2038183-184!5e0!3m2!1spt-BR!2sbr!4v1721134802356!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
              <div className="mt-4">
                <p className="text-sm font-bold text-white opacity-90">Viva essa experiência!</p>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mt-2">
                  <span className="font-light">Descubra o</span> WebPosto
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed mt-2 font-light">
                  Surpreenda-se com nossa plataforma.
                </p>
              </div>
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
                <Stat value="70 Mil" label="Usuários ativos" desc="Somente de usuários ativos, múltiplos servidores, segurança, sistema em nuvem com backup em tempo real." />
                <Stat value="301 Millhões" label="Vendas processadas" desc="É o número de vendas processadas em todo país." />
                <Stat value="3.5 Milhões" label="Registros por hora" desc="De registros processados por hora, na plataforma do WebPosto e aplicativos." />
                <Stat value="1 Novo cliente" label="Novos clientes" desc="A cada 6 horas registramos a ativação de um novo cliente inovando conosco." />
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
                  <img
                    src="/macbook-dashboard-menor.png"
                    alt="Dashboard Preview"
                    className="w-full h-auto object-contain"
                  />
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

      {/* Video Demo Section */}
      <section className="py-14 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-6">
              Assista ao Vídeo de Demonstração
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              Veja como o WebPosto pode transformar a gestão do seu posto de combustíveis.
            </p>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/IGBq8AvytRI"
                title="Demonstração do WebPosto"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
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
            <div className="relative max-w-xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 bg-white/50 p-5">
                <img
                  src={images[currentImageIndex]}
                  alt={`Screenshot ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[32rem] object-contain rounded-2xl"
                />
              </div>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/70 hover:bg-white/90'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
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
            <Feature
              icon={Rocket}
              title="Implantação orientada"
              desc="Migração de dados, treinamento e acompanhamento para colocar o sistema em produção com segurança."
            />
            <Feature
              icon={Cpu}
              title="Integrações"
              desc="APIs e integrações com automação de bombas, ERPs e soluções fiscais."
            />
            <Feature
              icon={ShieldCheck}
              title="Segurança e conformidade"
              desc="Acesso seguro, perfis de usuário e trilhas de auditoria para conformidade fiscal e operacional."
            />
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
            className="mt-10"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-white text-center mb-6">Nossos Parceiros</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
              <motion.div
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                variants={container}
              >
                <img src="/logo-companytech.png" alt="CompanyTech" className="h-10 w-auto object-contain opacity-80 hover:opacity-100" />
              </motion.div>
              <motion.div
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                variants={container}
              >
                <img src="/logo-eztech.png" alt="EzTech" className="h-10 w-auto object-contain opacity-80 hover:opacity-100" />
              </motion.div>
              <motion.div
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                variants={container}
              >
                <img src="/logo-lider.png" alt="Lider" className="h-10 w-auto object-contain opacity-80 hover:opacity-100" />
              </motion.div>
              <motion.div
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                variants={container}
              >
                <img src="/logo-pump.png" alt="Pump" className="h-10 w-auto object-contain opacity-80 hover:opacity-100" />
              </motion.div>
              <motion.div
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                variants={container}
              >
                <img src="/logo-quality.png" alt="Quality" className="h-10 w-auto object-contain opacity-80 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              "São Paulo",
              "Minas Gerais",
            ].map((uf) => (
              <motion.div
                key={uf}
                className="flex items-center justify-center text-white/80 border border-white/10 rounded-2xl py-6 px-20 min-w-[160px] hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                variants={container}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedLocation(uf);
                  setShowMapDialog(true);
                }}
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
              <Button variant="cta" size="lg" onClick={() => setIsDemoDialogOpen(true)}>Agendar demonstração</Button>
              <Button variant="outline" size="lg">Falar no WhatsApp</Button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-white/10 bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 text-white/80">
          <div>
            <div className="text-white font-bold text-lg">Webside Sistemas</div>
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
            <div className="mt-4">
              <div className="text-white mb-2 font-medium">Redes Sociais</div>
              <div className="flex gap-3">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-6 text-xs text-white/60 border-t border-white/10">
          © 2026 Webside Sistemas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
