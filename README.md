# Micro-Livraria: Exemplo Prático de Microsserviços

Este repositório contém um exemplo simples de uma livraria virtual construída usando uma **arquitetura de microsserviços**. Esse repositório tem como base o exemplo do livro **Engenharia de Software Moderna** de Marco Tulio Valente, disponível em https://engsoftmoderna.info/.

O exemplo foi projetado para ser usado em uma **aula prática sobre microsserviços**, que pode, por exemplo, ser realizada após o estudo sobre Projeto de Arquitetura.

O objetivo do exemplo é permitir que o aluno tenha um primeiro contato com microsserviços e com tecnologias normalmente usadas nesse tipo de arquitetura, tais como **Node.js**, **REST** e **gRPC**.

Como nosso objetivo é didático, na livraria virtual estão à venda apenas três livros, conforme pode ser visto na próxima figura, que mostra a interface Web do sistema. Além disso, a operação de compra apenas simula a ação do usuário, não efetuando mudanças no estoque. Assim, os clientes da livraria podem realizar apenas duas operações: (1) listar os produtos à venda; (2) calcular o frete de envio.

<p align="center">
    <img width="70%" src="https://user-images.githubusercontent.com/7620947/108773349-f68f3500-753c-11eb-8c4f-434ca9a9deec.png" />
</p>

No restante deste documento vamos:

-   Descrever o sistema, com foco na sua arquitetura.
-   Apresentar instruções para sua execução local, usando o código disponibilizado no repositório.
-   Descrever a tarefa prática para ser realizada pelos alunos, que envolve a implementação de uma nova operação em um dos microsserviços.

## Arquitetura

A micro-livraria possui quatro microsserviços:

-   Front-end: microsserviço responsável pela interface com usuário, conforme mostrado na figura anterior.
-   Controller: microsserviço responsável por intermediar a comunicação entre o front-end e o backend do sistema.
-   Shipping: microserviço para cálculo de frete.
-   Inventory: microserviço para controle do estoque da livraria.

Os quatro microsserviços estão implementados em **JavaScript**, usando o Node.js para execução dos serviços no back-end.

No entanto, **você conseguirá completar as tarefas práticas mesmo se nunca programou em JavaScript**. O motivo é que o nosso roteiro já inclui os trechos de código que devem ser copiados para o sistema.

Para facilitar a execução e entendimento do sistema, também não usamos bancos de dados ou serviços externos.

## Protocolos de Comunicação

Como ilustrado no diagrama a seguir, a comunicação entre o front-end e o backend usa uma **API REST**, como é comum no caso de sistemas Web.

Já a comunicação entre o Controller e os microsserviços do back-end é baseada em [gRPC](https://grpc.io/).

<p align="center">
    <img width="70%" src="https://user-images.githubusercontent.com/7620947/108454750-bc2b4c80-724b-11eb-82e5-717b8b5c5a88.png" />
</p>

Optamos por usar gRPC no backend porque ele possui um desempenho melhor do que REST. Especificamente, gRPC é baseado no conceito de **Chamada Remota de Procedimentos (RPC)**. A ideia é simples: em aplicações distribuídas que usam gRPC, um cliente pode chamar funções implementadas em outros processos de forma transparente, isto é, como se tais funções fossem locais. Em outras palavras, chamadas gRPC tem a mesma sintaxe de chamadas normais de função.

Para viabilizar essa transparência, gRPC usa dois conceitos centrais:

-   uma linguagem para definição de interfaces
-   um protocolo para troca de mensagens entre aplicações clientes e servidoras.

Especificamente, no caso de gRPC, a implementação desses dois conceitos ganhou o nome de **Protocol Buffer**. Ou seja, podemos dizer que:

> Protocol Buffer = linguagem para definição de interfaces + protocolo para definição das mensagens trocadas entre aplicações clientes e servidoras

### Exemplo de Arquivo .proto

Quando trabalhamos com gRPC, cada microserviço possui um arquivo `.proto` que define a assinatura das operações que ele disponibiliza para os outros microsserviços.
Neste mesmo arquivo, declaramos também os tipos dos parâmetros de entrada e saída dessas operações.

O exemplo a seguir mostra o arquivo [.proto](https://github.com/aserg-ufmg/micro-livraria/blob/main/proto/shipping.proto) do nosso microsserviço de frete. Nele, definimos que esse microsserviço disponibiliza uma função `GetShippingRate`. Para chamar essa função devemos passar como parâmetro de entrada um objeto contendo o CEP (`ShippingPayLoad`). Após sua execução, a função retorna como resultado um outro objeto (`ShippingResponse`) com o valor do frete.

<p align="center">
    <img width="70%" src="https://user-images.githubusercontent.com/7620947/108770189-c776c480-7538-11eb-850a-f8a23f562fa5.png" />
</p>

Em gRPC, as mensagens (exemplo: `Shippingload`) são formadas por um conjunto de campos, tal como em um `struct` da linguagem C, por exemplo. Todo campo possui um nome (exemplo: `cep`) e um tipo (exemplo: `string`). Além disso, todo campo tem um número inteiro que funciona como um identificador único para o mesmo na mensagem (exemplo: ` = 1`). Esse número é usado pela implementação de gRPC para identificar o campo no formato binário de dados usado por gRPC para comunicação distribuída.

Arquivos .proto são usados para gerar **stubs**, que nada mais são do que proxies que encapsulam os detalhes de comunicação em rede, incluindo troca de mensagens, protocolos, etc. Mais detalhes sobre o padrão de projeto Proxy podem ser obtidos no [Capítulo 6](https://engsoftmoderna.info/cap6.html). 

Em linguagens estáticas, normalmente precisa-se chamar um compilador para gerar o código de tais stubs. No caso de JavaScript, no entanto, esse passo não é necessário, pois os stubs são gerados de forma transparente, em tempo de execução.

## Executando o Sistema

A seguir vamos descrever a sequência de passos para você executar o sistema localmente em sua máquina. Ou seja, todos os microsserviços estarão rodando na sua máquina.

**IMPORTANTE:** Você deve seguir esses passos antes de implementar as tarefas práticas descritas nas próximas seções.

1. Faça um fork do repositório. Para isso, basta clicar no botão **Fork** no canto superior direito desta página.

2. Vá para o terminal do seu sistema operacional e clone o projeto (lembre-se de incluir o seu usuário GitHub na URL antes de executar)

```
git clone https://github.com/<SEU USUÁRIO>/micro-livraria.git
```

3. É também necessário ter o Node.js instalado na sua máquina. Se você não tem, siga as instruções para instalação contidas nessa [página](https://nodejs.org/en/download/).

4. Em um terminal, vá para o diretório no qual o projeto foi clonado e instale as dependências necessárias para execução dos microsserviços:

```
cd micro-livraria
npm install
```

5. Inicie os microsserviços através do comando:

```
npm run start
```

6.  Para fins de teste, efetue uma requisição para o microsserviço reponsável pela API do backend.

-   Se tiver o `curl` instalado na sua máquina, basta usar:

```
curl -i -X GET http://localhost:3000/products
```

-   Caso contrário, você pode fazer uma requisição acessando, no seu navegador, a seguinte URL: `http://localhost:3000/products`.

7. Teste agora o sistema como um todo, abrindo o front-end em um navegador: http://localhost:5000. Faça então um teste das principais funcionalidades da livraria.

## Tarefa Prática #1: Implementando uma Nova Operação

Nesta primeira tarefa, você irá implementar uma nova operação no serviço `Inventory`. Essa operação, chamada `SearchProductByID` vai pesquisar por um produto, dado o seu ID.

Como descrito anteriormente, as assinaturas das operações de cada microsserviço são definidas em um arquivo `.proto`, no caso [proto/inventory.proto](https://github.com/aserg-ufmg/micro-livraria/blob/main/proto/inventory.proto).

#### Passo 1

Primeiro, você deve declarar a assinatura da nova operação. Para isso, inclua a definição dessa assinatura no referido arquivo `.proto` (na linha logo após a assinatura da função `SearchAllProducts`):

```proto
service InventoryService {
    rpc SearchAllProducts(Empty) returns (ProductsResponse) {}
    rpc SearchProductByID(Payload) returns (ProductResponse) {}
}
```

Em outras palavras, você está definindo que o microsserviço `Inventory` vai responder a uma nova requisição, chamada `SearchProductByID`, que tem como parâmetro de entrada um objeto do tipo `Payload` e como parâmetro de saída um objeto do tipo `ProductResponse`.

#### Passo 2

Inclua também no mesmo arquivo a declaração do tipo do objeto `Payload`, o qual apenas contém o ID do produto a ser pesquisado.

```proto
message Payload {
    int32 id = 1;
}
```

Veja que `ProductResponse` -- isto é, o tipo de retorno da operação -- já está declarado mais abaixo no arquivo `proto`:

```proto
message ProductsResponse {
    repeated ProductResponse products = 1;
}
```

Ou seja, a resposta da nossa requisição conterá um único campo, do tipo `ProductResponse`, que também já está implementando no mesmo arquivo:

```proto
message ProductResponse {
    int32 id = 1;
    string name = 2;
    int32 quantity = 3;
    float price = 4;
    string photo = 5;
    string author = 6;
}
```

#### Passo 3

Agora você deve implementar a função `SearchProductByID` no arquivo [services/inventory/index.js](https://github.com/aserg-ufmg/micro-livraria/blob/main/services/inventory/index.js).

Reforçando, no passo anterior, apenas declaramos a assinatura dessa função. Então, agora, vamos prover uma implementação para ela.

Para isso, você precisa implementar a função requerida pelo segundo parâmetro da função `server.addService`, localizada na linha 17 do arquivo [services/inventory/index.js](https://github.com/aserg-ufmg/micro-livraria/blob/main/services/inventory/index.js).

De forma semelhante à função `SearchAllProducts`, que já está implementada, você deve adicionar o corpo da função `SearchProductByID` com a lógica de pesquisa de produtos por ID. Este código deve ser adicionado logo após o `SearchAllProducts` na linha 23.

```js
    SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },
```

A função acima usa o método `find` para pesquisar em `products` pelo ID de produto fornecido. Veja que:

-   `payload` é o parâmetro de entrada do nosso serviço, conforme definido antes no arquivo .proto (passo 2). Ele armazena o ID do produto que queremos pesquisar. Para acessar esse ID basta escrever `payload.request.id`.

-   `product` é uma unidade de produto a ser pesquisado pela função `find` (nativa de JavaScript). Essa pesquisa é feita em todos os items da lista de produtos até que um primeiro `product` atenda a condição de busca, isto é `product.id == payload.request.id`.

-   [products](https://github.com/aserg-ufmg/micro-livraria/blob/main/services/inventory/products.json) é um arquivo JSON que contém a descrição dos livros à venda na livraria.

-   `callback` é uma função que deve ser invocada com dois parâmetros:
    -   O primeiro parâmetro é um objeto de erro, caso ocorra. No nosso exemplo nenhum erro será retornado, portanto `null`.
    -   O segundo parâmetro é o resultado da função, no nosso caso um `ProductResponse`, assim como definido no arquivo [proto/inventory.proto](https://github.com/aserg-ufmg/micro-livraria/blob/main/proto/inventory.proto).

#### Passo 4

Para finalizar, temos que incluir a função `SearchProductByID` em nosso `Controller`. Para isso, você deve incluir uma nova rota `/product/{id}` que receberá o ID do produto como parâmetro. Na definição da rota, você deve também incluir a chamada para o método definido no Passo 3.

Sendo mais específico, o seguinte trecho de código deve ser adicionado na linha 44 do arquivo [services/controller/index.js](https://github.com/aserg-ufmg/micro-livraria/blob/main/services/controller/index.js), logo após a rota `/shipping/:cep`.

```js
app.get('/product/:id', (req, res, next) => {
    // Chama método do microsserviço.
    inventory.SearchProductByID({ id: req.params.id }, (err, product) => {
        // Se ocorrer algum erro de comunicação
        // com o microsserviço, retorna para o navegador.
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            // Caso contrário, retorna resultado do
            // microsserviço (um arquivo JSON) com os dados
            // do produto pesquisado
            res.json(product);
        }
    });
});
```

Finalize, efetuando uma chamada no novo endpoint da API: http://localhost:3000/product/1

Para ficar claro: até aqui, apenas implementamos a nova operação no backend. A sua incorporação no frontend ficará pendente, pois requer mudar a interface Web, para, por exemplo, incluir um botão "Pesquisar Livro".

**IMPORTANTE**: Se tudo funcionou corretamente, dê um **COMMIT & PUSH** (e certifique-se de que seu repositório no GitHub foi atualizado; isso é fundamental para seu trabalho ser devidamente corrigido).

```bash
git add --all
git commit -m "Tarefa prática #1 - Microservices"
git push origin main
```


## Créditos

Este exercício prático, incluindo o seu código, foi elaborado por **Rodrigo Brito**, aluno de mestrado do DCC/UFMG, como parte das suas atividades na disciplina Estágio em Docência, cursada em 2020/2, sob orientação do **Prof. Marco Tulio Valente**.

O código deste repositório possui uma [licença MIT](https://opensource.org/license/mit). O roteiro descrito acima possui uma licença [CC-BY](https://creativecommons.org/licenses/by/4.0/).





















# 📚 Arquitetura Visual - Micro-Livraria (Modelo C4)
---

## 🔹 1. Diagrama de Contexto

```mermaid
graph TD
    Cliente[Cliente] --> Sistema[Micro-Livraria]
    Admin[Administrador] --> Sistema

    Sistema --> Pagamento[Gateway de Pagamento]
    Sistema --> Entrega[Serviço de Entrega]
```

---

## 🔹 2. Diagrama de Containers

```mermaid
graph TD
    Cliente --> Frontend[Frontend Web]
    Admin --> Frontend

    Frontend --> API[Backend API]

    API --> Catalogo[Microserviço de Catálogo]
    API --> Pedidos[Microserviço de Pedidos]
    API --> Pagamento[Microserviço de Pagamento]

    Catalogo --> DB[(Banco de Dados)]
    Pedidos --> DB
    Pagamento --> DB

    Pagamento --> Gateway[Gateway Externo]
    Pedidos --> Entrega[Serviço de Entrega]
```

---

## 🔹 3. Diagrama de Componentes (Backend API)

```mermaid
graph TD
    Controller --> Auth[Auth Component]
    Controller --> Catalogo[Catalog Component]
    Controller --> Pedido[Order Component]
    Controller --> Pagamento[Payment Component]

    Auth --> RepoAuth[(Auth Repository)]
    Catalogo --> RepoCat[(Catalog Repository)]
    Pedido --> RepoPedido[(Order Repository)]
    Pagamento --> RepoPag[(Payment Repository)]
```

---

## 🔹 4. Diagrama de Código (Order)

```mermaid
classDiagram
    class OrderController
    class OrderService
    class OrderRepository
    class Order

    OrderController --> OrderService
    OrderService --> OrderRepository
    OrderRepository --> Order
```
