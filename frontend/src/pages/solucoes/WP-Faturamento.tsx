import SolutionPage from '../../components/SolutionPage';

const WP_Faturamento = () => (
  <SolutionPage
    title="WP Faturamento"
    emoji="📄"
    description="Emissão rápida de boletos, NF-e e controle financeiro simplificado."
    tag="Fiscal"
    features={[
      "Emissão de boletos em lote",
      "NF-e/NFS-e automatizadas",
      "Controle de recebíveis e inadimplência",
      "Integração bancária para conciliação",
      "Relatórios fiscais para contador",
      "Alertas de vencimentos"
    ]}
  />
);

export default WP_Faturamento;

