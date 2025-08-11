# DogSweeper

DogSweeper é um projeto web inspirado no clássico Campo Minado, mas com um tema divertido de cachorros! O objetivo é encontrar todos os cachorros escondidos no tabuleiro sem clicar em um deles.

## Tecnologias Utilizadas
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Estrutura do Projeto
```
eslint.config.cjs
index.html
package.json
postcss.config.js
tailwind.config.js
  vite.config.ts
  src/
    constants.ts
    index.css
    main.tsx
    components/
      DogSweeper.tsx
    utils/
      board.ts
```

## Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/R1tter/gpt-projects.git
   cd gpt-projects
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) para visualizar o projeto.

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção.
- `npm run preview`: Visualiza a build de produção localmente.

## Personalização
Você pode alterar o tema, regras ou adicionar novos recursos editando os arquivos em `src/components` e `src/utils`.

## Licença
Este projeto é open-source e está sob a licença MIT.
