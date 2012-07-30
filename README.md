ytJsComponents
==============

Conjunto de componentes JavaScript.


ytTreeView
----------
A motivação para criação deste componente (TreeView), foi o de substituir o componente TreeView da plataforma asp.net. Em um sistema que trabalhei, existia nós que poderiam carregar até 10.000 nós filhos ao serem expandindos. Neste momento o browser Internet Explorer 8 (Versão testada) travava entre 10 à 15 minutos, como neste momento nada mais poderia ser feito, dava a impressão que a única saída seria realmente finaliza-lo (Até que em determinado momento descobri que ao longo dos minutos e após clicar várias vezes em “Desejo continuar a execução do script” o troço funcionava!). Em outros browser’s testados, como no Firefox, a execução do script se tornava bem mais rápida, mas ainda sim, entre 2 à 3 minutos. Como se não bastasse, levando em consideração algumas centenas de nós raízes e mais um destes nós expandidos carregando os seus 10.000 filhos, ocorria uma transferência (oriunda de uma requisição ajax) de +/- 13mb de código-fonte relacionado a TreeView .net.

Nota: Mesmo utilizando o Ajax (UpdatePanel), a cada ação (expandir, colapsar) no componente, há uma requisição ao servidor que traz de volta todo o código-fonte (Com todo o HTML, que inclusive, possui muitos elementos e atributos para se representar cada nó!) correspondendo ao novo “print” do mesmo. Ou seja, se ao menos um destes nós, estivessem com os seus 10.000 nós filhos carregados,  a cada clique do mouse em outros nós (mesmo que estes não tivessem muitos sub-nós), seria feito novas transferências de 1(3|4|5|...) MB. Mais 10 à 15 minutos de espera por “clique” ?.

A partir de todos esses problemas decidi criar um novo componente TreeView que inicialmente atendesse a tais requisitos de desempenho. Logo, deixo bem claro que ainda muito precisa ser feito (Acrescentado, refatorado, etc.).

Principais características do ytTreeView:
* Carregamento de sub-nós sob demanda.
* A requisição retorna somente os nós necessários.
* A inserção do elementos HTML correspondente aos novos sub-nós requisitados é realizada via DOM (client-side), já que o retorno da requisição é feito via JSON, reduzindo muito com a transferência de dados). Como uma adição (Criação de elementos via DOM para cada sub-nó) de milhares de nós vindas de uma única requisição também tornaria o browser a travar por alguns segundos ou minutos. A solução foi fazê-lo parar (alguns milissegundos. Configurável) a cada intervalo de “X”(Configurável)  iterações (sub-nós criados). Assim, ao expandir um nó com grande volume de sub-nós a serem carregados, existirá um “load...” ao lado do nó que foi expandido que será exibido do momento da requisição ajax até o momento que será adicionado o último nó na “Tela”. Graças a estas curtas paradas (simulando um thread rodando em background), o resultado final é que o gif do load funciona normalmente, o browser não trava (cabeçalho “não respondendo...”), não é emitido o alerta “Deseja continuar a execução deste script?” e é possível visualizar os sub-nós sendo carregados com o scroll horizontal se movimentando em tempo real.


Breve continuarei atualizando o código, melhorando os exemplos e ajustando este  readme! ;)