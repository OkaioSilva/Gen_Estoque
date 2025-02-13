# Gen_Estoque
    Gerenciador de Estoque
O Gerenciador de Estoque é uma aplicação web desenvolvida para facilitar o controle e a gestão de produtos em um estoque. Com uma interface intuitiva e funcionalidades completas, o sistema permite adicionar, editar, excluir e monitorar o status dos produtos, além de fornecer uma visão geral do estoque.

Este projeto foi desenvolvido utilizando tecnologias modernas como JavaScript, Node.js, Express, MongoDB e HTML/CSS, garantindo uma experiência de usuário fluida e eficiente.

Funcionalidades Principais
1. Adicionar Produtos
Adicione novos produtos ao estoque informando o nome e a quantidade.

O status do produto é automaticamente definido com base na quantidade:

Em Estoque: Quantidade maior que 5.

Baixo Estoque: Quantidade entre 1 e 5.

Fora de Estoque: Quantidade igual a 0.

2. Editar Produtos
Edite o nome e a quantidade de um produto existente.

O status do produto é atualizado automaticamente após a edição.

3. Excluir Produtos
Remova produtos do estoque com confirmação de exclusão através de um modal.

4. Atualizar Status
Altere manualmente o status de um produto para:

Baixo Estoque

Fora de Estoque

5. Pesquisar Produtos
Pesquise produtos pelo nome para encontrar rapidamente itens específicos no estoque.

6. Visão Geral do Estoque
Visualize o resumo do estoque, incluindo:

Total de Itens: Número total de produtos no estoque.

Baixo Estoque: Quantidade de produtos com status "Baixo Estoque".

Fora de Estoque: Quantidade de produtos com status "Fora de Estoque".

7. Paginação
Navegue entre as páginas de produtos para visualizar grandes listas de forma organizada.

8. Interface Responsiva
Design moderno e responsivo, compatível com diferentes tamanhos de tela.

Tecnologias Utilizadas
Frontend
HTML5: Estrutura da interface.

CSS3: Estilização e design responsivo.

JavaScript: Lógica e interatividade da aplicação.

Font Awesome: Ícones para ações e status.

Backend
Node.js: Ambiente de execução do servidor.

Express: Framework para construção da API.

MongoDB: Banco de dados para armazenamento dos produtos.

Mongoose: Biblioteca para modelagem de dados no MongoDB.

Outras Ferramentas
Dotenv: Gerenciamento de variáveis de ambiente.

Helmet: Segurança para aplicações Express.

Morgan: Log de requisições HTTP.

Como Executar o Projeto
Pré-requisitos
Node.js instalado.

MongoDB instalado ou uma instância do MongoDB Atlas.

Passos para Execução

1.Clone o repositório:

    git clone https://github.com/seu-usuario/gerenciador-estoque.git

2.Instale as dependências:
      
      cd gerenciador-estoque
       npm install

3. Configure o arquivo  .env:
      
      * Crie um arquivo " .env " na raiz do projeto e adicione as variavéis de ambiente necessárias, como a URI do MongoDB

4. Inicie o servidor:

        npm start

5. Acesse a aplicação:

    * Abra o navegador e acesse http://localhost:3000.



Contribuição

Contribuições são bem-vindas! Se você deseja contribuir para o projeto


Autor

Kaio da Silva Souza:

https://github.com/OkaioSilva  
https://www.linkedin.com/in/kaiosilvaa/