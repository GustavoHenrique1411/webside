import SolutionPage from '../../components/SolutionPage';

const WP_Contagem = () => (
  <SolutionPage
    title="WP Contagem"
    emoji="📦"
    description="Inventário ultra-rápido. Use a câmera do celular para contar estoque e imprimir etiquetas."
    tag="Estoque"
    features={[
      "Leitura de código de barras via câmera celular",
      "Inventário em tempo real com upload instantâneo",
      "Impressão de etiquetas diretamente do app",
      "Comparação automática estoque real x sistema",
      "Relatórios de discrepâncias e perdas",
      "Multi-usuário simultâneo em filiais"
    ]}
  />
);

export default WP_Contagem;

