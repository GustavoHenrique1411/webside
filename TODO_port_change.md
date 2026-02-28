# Plan: Remover porta 3000 e usar 3001

## Arquivos a serem modificados:

1. **docker/docker-compose.yml**
   - Alterar porta de "3000:3000" para "3001:3001"
   - Alterar PORT=3000 para PORT=3001

2. **docker/docker-compose.dev.yml**
   - Já está com "3001:3000", alterar para "3001:3001"
   - Alterar PORT=3000 para PORT=3001

3. **docker/docker-compose.dev-hot.yml**
   - Alterar porta de "3000:3000" para "3001:3001"
   - Alterar PORT=3000 para PORT=3001

4. **docker/Dockerfile.backend**
   - Alterar EXPOSE 3000 para EXPOSE 3001
   - Alterar healthcheck de localhost:3000 para localhost:3001

5. **backend/src/index.js**
   - Alterar default PORT de 3000 para 3001
