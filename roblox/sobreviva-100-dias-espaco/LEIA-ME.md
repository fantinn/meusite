# Sobreviva 100 Dias no Espaço (Roblox)

Jogo de sobrevivência em uma base lunar. De dia você coleta recursos; de noite alienígenas atacam
quem estiver fora da zona protegida pelo reator. Sobreviva 100 dias para vencer.

## Como funciona

- **Reator**: cria a zona segura (círculo azul). Gasta combustível o tempo todo, mais rápido à noite.
  Quanto menos combustível, menor a zona. Se zerar, a zona some e os alienígenas entram.
- **Recursos** (segure **E**):
  - Cristal de Energia → abastece o reator
  - Sucata → melhora o reator (zona maior e tanque maior, até o nível 5)
  - Ração → comida
- **Status**: Vida, Fome (cai sempre) e Oxigênio (cai fora da base, enche dentro).
- **Alienígenas**: aparecem à noite, ficam mais fortes com os dias, não entram na zona segura.
  Ataque com **Q** (dão sucata e às vezes ração).
- **Morte**: perde a mochila. Morreu de dia → volta em 10 s. Morreu de noite → volta ao amanhecer.
  Se todos morrerem ao mesmo tempo, a partida reinicia no dia 1.
- **Recorde**: o placar mostra o maior dia sobrevivido e as vitórias (salvos com DataStore).

| Tecla | Ação |
|---|---|
| E | Coletar recurso / abastecer reator |
| R | Melhorar reator |
| Q | Atacar alienígena |
| F | Comer |

## Como montar no Roblox Studio

1. Abra o **Roblox Studio** → **New** → **Baseplate**.
2. Abra os painéis **View → Explorer** e **View → Properties**.
3. Crie os 5 scripts abaixo (passe o mouse no item do Explorer, clique no **+** e escolha o tipo).
   Renomeie com o nome exato e cole o conteúdo do arquivo correspondente:

| Onde (Explorer) | Tipo | Nome | Arquivo |
|---|---|---|---|
| ReplicatedStorage | ModuleScript | `Config` | `ReplicatedStorage/Config.luau` |
| ServerScriptService | Script | `Servidor` | `ServerScriptService/Servidor.server.luau` |
| ServerScriptService | ModuleScript | `Mundo` | `ServerScriptService/Mundo.luau` |
| ServerScriptService | ModuleScript | `Inimigos` | `ServerScriptService/Inimigos.luau` |
| StarterPlayer → StarterPlayerScripts | LocalScript | `HUD` | `StarterPlayerScripts/HUD.client.luau` |

4. Clique em **Play** (F5). O mapa, a luz e a interface são criados pelo código.
   O Baseplate e o SpawnLocation do template são removidos sozinhos durante o jogo.
5. Para testar com mais de um jogador: aba **Test** → **Clients and Servers** → 2 jogadores → **Start**.
6. (Opcional) Para salvar recordes no Studio: **Home → Game Settings → Security →
   Enable Studio Access to API Services**. Antes disso, aparece um aviso amarelo no Output — é normal.

Se algo der errado, abra **View → Output** e copie a mensagem em vermelho.

## Publicar

**File → Publish to Roblox**, dê um nome, descrição e ícone, e em **Game Settings → Permissions**
deixe o jogo público. Ative também **Game Settings → Avatar** se quiser travar R15/R6.

## Ajustar dificuldade

Tudo está no `Config`: duração do dia e da noite, consumo do reator, fome, oxigênio, quantidade de
recursos, vida/dano/velocidade dos alienígenas. Para testar rápido, use `DURACAO_DIA = 10` e
`DURACAO_NOITE = 10`.

## Ideias para a próxima versão

- Modelos melhores (Toolbox ou feitos no Blender) e sons: alarme à noite, coleta, ataque.
- Ferramenta de arma (Tool) com animação em vez do prompt de ataque.
- Chuva de meteoros, tempestade solar, chefão alienígena a cada 10 noites.
- Crafting: tanque de oxigênio extra, armadura, torreta automática na base.
- Resgatar astronautas perdidos no mapa (missões secundárias).
- Game passes: mochila maior, traje com mais oxigênio, cor do traje.
- Fazer as versões **mar** e **floresta** reaproveitando o mesmo código.

> O jogo é original e só usa mecânicas do gênero "sobreviva X dias". Não use nome, ícone ou
> modelos de outros jogos para evitar denúncias de cópia.
