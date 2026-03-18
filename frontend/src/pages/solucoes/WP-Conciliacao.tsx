import SolutionPage from '../../components/SolutionPage';

const WP_Conciliacao = () => (
  <SolutionPage
    title="WP Conciliação"
    emoji="🔄"
    description="Automação completa de conciliações bancárias e cartões via EDI/OFX."
    tag="Financeiro"
    features={[
      "Conciliação automática vendas x depósito bancário",
      "EDI com distribuidores de combustível",
      "Importação OFX de extratos bancários",
      "Conciliação de cartões de crédito/débito",
      "Relatórios de divergências automáticas",
      "Alertas de pendências financeiras"
    ]}
  />
);

export default WP_Conciliacao;

