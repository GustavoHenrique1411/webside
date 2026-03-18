import SolutionPage from '../../components/SolutionPage';

const WP_PAY = () => (
  <SolutionPage
    title="WP PAY"
    emoji="🏎️"
    description="Mobilidade total na pista. Pagamento rápido, emissão de notas fiscais e cupons diretamente no abastecimento."
    tag="Pagamento"
    features={[
      "Pagamento na pista sem sair do carro",
      "Emissão instantânea de NF-e e cupom fiscal",
      "Suporte a todos os cartões, PIX e débito automático",
      "Redução de filas e aumento na velocidade de atendimento",
      "Integração com bombas e cofres",
      "Relatórios detalhados de vendas por pista"
    ]}
  />
);

export default WP_PAY;

