#VTEX - Super Menu
>*Extensões da plataforma VTEX são plugins criados por desenvolvedores de interface ou pelo VTEX Lab (Laboratório de Inovações da VTEX) que podem ser inseridas em sua loja. Existem extensões gratuitas com código aberto -  Open Source - e extensões pagas.  Indicamos que a instalação seja realizada pelos profissionais e empresas certificados pela VTEX. Vale ressaltar que qualquer profissional de CSS, JavaScript e HTML pode também executar esta tarefa.*

----------

## Configuração

###Configurando do CSV\* para primeiro nivel do menu
O arquivo CVS possui a configuração do primeiro nivel do menu.

Como base usaremos o arquivo menu-configuracao.csv.

```xml
Menu1;/link-do-menu1;/caminho-do-menu1.xml;/caminho-da-coleção-para-o-menu1;
Menu2;/link-do-menu2;/caminho-do-menu2.xml;/caminho-da-coleção-para-o-menu2;
```
* Menu1; - Texto do botão
* link-do-menu1; - URL do botão
* caminho-do-menu1.xml; - URL do xml de configuração do submenu (explicado no próximo passo)
* caminho-da-coleção-para-o-menu1; - Existe a possíbilidade de se usar uma coleção no menu (explicado mais a frente)

*\*O arquivo CSV (comma separated) é um arquivo de texto, a extensão XML é utilizada pelas opções que a plataforma oferece.*

###Configurando do XML para o segundo nivel do menu (submenus)
O Super Menu gera os links através de um arquivo XML (uma tabela de links). 

Como base usaremos o arquivo menu-sample.xlsx.

Esse arquivo possui 7 colunas

* 1. menu - Texto que será exibido no site. Digitar sempre em maiusculas/minúsculas;
* 2. url - Endereço do link;
* 3. seção - Caracteriza o titulo de seção do menu, isso criará um link com marcação diferenciada. O padrão é não (vazio). Digite apenas sim (com letras minusculas), se for diferente do padrão;
* 4. coluna nova - O padrão é não (vazio). Digite apenas sim (com letras minusculas), se for iniciar uma nova coluna;
* 5. icone - URL do icone de cada link. Deixar em branco se não houver.
* 6. "class" Caso seja necessário uma marcação especial de css. Deixar em branco se não houver.
* 7. target - Atributo target do link





##Instalação
Faça o upload para o "Gerenciador do portal" no "Vtex Admin" dos seguintes arquivos:
* vtex_super_menu.js
* vtex_xml_menu.js


Faça a chamada do arquivo javascript na página:

```html
<script type="text/javascript" src="/arquivos/vtex_super_menu.js"></script>
```

Execute o plugin:

```javascript
$(".tpl-menu").vtex_super_menu();
```
