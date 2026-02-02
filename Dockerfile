# Imagem otimizada do Nixpacks
FROM ghcr.io/railwayapp/nixpacks:latest

WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# O Nixpacks precisa saber o que instalar. 
# Se você tem um flake.nix, ele vai tentar detectar, 
# mas vamos forçar a instalação do que você precisa.
RUN nixpacks build . --out ./build-output

# Variáveis de ambiente padrão do Fly
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Comando para rodar usando o motor do nixpacks
CMD ["nixpacks", "run", "."]
