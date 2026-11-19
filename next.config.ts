import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Publicação em servidor Node: saída autocontida para o runtime Node.
  output: "standalone",
  // Ativos locais do PDF (fontes) incluídos no rastreamento do servidor.
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/**/*"],
  },
  // Pacotes nativos ou de servidor que não devem ser empacotados.
  serverExternalPackages: ["pg", "sharp", "@pdf-lib/fontkit"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
