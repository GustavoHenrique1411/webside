import SolutionPage from '../../components/SolutionPage';

const WP_Freezer = () => (
  <SolutionPage
    title="WP Freezer"
    emoji="🧊"
    description="Geladeira inteligente. Débito automático no cartão sem abrir a porta."
    tag="Inovação"
    features={[
      "Abertura apenas após autorização de pagamento",
      "Débito automático no cartão vinculado",
      "Controle de estoque em tempo real",
      "Relatórios de consumo por cliente/produto",
      "Integração com PDV principal",
      "Redução total de furtos em lojas de conveniência"
    ]}
  />
);

export default WP_Freezer;

