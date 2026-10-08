-- Servidor principal do "Sobreviva 100 Dias no Espaço".
-- Script chamado "Servidor" dentro de ServerScriptService.
-- Controla a partida: dia/noite, reator, fome, oxigênio, morte, vitória/derrota e recordes.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local DataStoreService = game:GetService("DataStoreService")

local Config = require(ReplicatedStorage:WaitForChild("Config"))
local Mundo = require(script.Parent:WaitForChild("Mundo"))
local Inimigos = require(script.Parent:WaitForChild("Inimigos"))

-- Nós decidimos quando cada jogador nasce (quem morre à noite espera o amanhecer)
Players.CharacterAutoLoads = false

-- Comunicação com o HUD
local pastaRemotes = Instance.new("Folder")
pastaRemotes.Name = "Remotes"
local remoteAcao = Instance.new("RemoteEvent")
remoteAcao.Name = "Acao"
remoteAcao.Parent = pastaRemotes
local remoteAviso = Instance.new("RemoteEvent")
remoteAviso.Name = "Aviso"
remoteAviso.Parent = pastaRemotes
pastaRemotes.Parent = ReplicatedStorage

---------------------------------------------------------------------
-- Estado da partida
---------------------------------------------------------------------
local dia = 1
local noite = false
local partida = "Jogando" -- "Jogando", "Vitoria" ou "Derrota"
local combustivel = Config.COMBUSTIVEL_INICIAL
local nivel = 1
local mundo -- preenchido por Mundo.Construir

local function combustivelMaximo()
	return Config.COMBUSTIVEL_INICIAL + Config.COMBUSTIVEL_POR_NIVEL * (nivel - 1)
end

local function custoMelhoria()
	return Config.CUSTO_MELHORIA * nivel
end

-- O raio diminui conforme o combustível acaba; com o tanque vazio a zona some
local function raioZona()
	if combustivel <= 0 then
		return 0
	end
	local maximo = Config.RAIO_BASE + Config.RAIO_POR_NIVEL * (nivel - 1)
	local minimo = maximo * 0.4
	return minimo + (maximo - minimo) * (combustivel / combustivelMaximo())
end

local function naZona(posicao)
	local dx, dz = posicao.X - mundo.centro.X, posicao.Z - mundo.centro.Z
	return math.sqrt(dx * dx + dz * dz) <= raioZona()
end

local function avisar(jogador, texto)
	if jogador then
		remoteAviso:FireClient(jogador, texto)
	else
		remoteAviso:FireAllClients(texto)
	end
end

local function publicarEstado()
	ReplicatedStorage:SetAttribute("Dia", dia)
	ReplicatedStorage:SetAttribute("Noite", noite)
	ReplicatedStorage:SetAttribute("Partida", partida)
	ReplicatedStorage:SetAttribute("Combustivel", math.floor(combustivel))
	ReplicatedStorage:SetAttribute("CombustivelMax", combustivelMaximo())
	ReplicatedStorage:SetAttribute("Nivel", nivel)

	Mundo.AtualizarZona(raioZona(), combustivel / combustivelMaximo())
	if nivel >= Config.NIVEL_MAXIMO then
		mundo.promptMelhorar.ObjectText = "Nível máximo"
	else
		mundo.promptMelhorar.ObjectText = "Custa " .. custoMelhoria() .. " " .. Config.RECURSOS.Material.nome
	end
end

---------------------------------------------------------------------
-- Inventário (fica em Attributes do Player, assim o HUD lê direto)
---------------------------------------------------------------------
local function quantidade(jogador, tipo)
	return jogador:GetAttribute(tipo) or 0
end

local function adicionar(jogador, tipo, valor)
	jogador:SetAttribute(tipo, quantidade(jogador, tipo) + valor)
end

local function limparInventario(jogador)
	for _, tipo in Config.ORDEM_RECURSOS do
		jogador:SetAttribute(tipo, 0)
	end
end

---------------------------------------------------------------------
-- Ações do jogador
---------------------------------------------------------------------
local function aoColetar(jogador, tipo, valor)
	if jogador:GetAttribute("Morto") then
		return
	end
	adicionar(jogador, tipo, valor)
end

local function aoAbastecer(jogador)
	if partida ~= "Jogando" then
		return
	end
	local cristais = quantidade(jogador, "Combustivel")
	if cristais <= 0 then
		avisar(jogador, "Você não tem " .. Config.RECURSOS.Combustivel.nome .. "!")
		return
	end
	local falta = combustivelMaximo() - combustivel
	if falta < 1 then
		avisar(jogador, "O reator já está cheio!")
		return
	end
	local usar = math.min(cristais, math.ceil(falta / Config.COMBUSTIVEL_POR_CRISTAL))
	jogador:SetAttribute("Combustivel", cristais - usar)
	combustivel = math.min(combustivelMaximo(), combustivel + usar * Config.COMBUSTIVEL_POR_CRISTAL)
	publicarEstado()
end

local function aoMelhorar(jogador)
	if partida ~= "Jogando" then
		return
	end
	if nivel >= Config.NIVEL_MAXIMO then
		avisar(jogador, "O reator já está no nível máximo!")
		return
	end
	local custo = custoMelhoria()
	local sucata = quantidade(jogador, "Material")
	if sucata < custo then
		avisar(jogador, "Faltam " .. (custo - sucata) .. " " .. Config.RECURSOS.Material.nome .. "!")
		return
	end
	jogador:SetAttribute("Material", sucata - custo)
	nivel += 1
	avisar(nil, "Reator nível " .. nivel .. "! (melhorado por " .. jogador.DisplayName .. ")")
	publicarEstado()
end

local function aoComer(jogador)
	if jogador:GetAttribute("Morto") then
		return
	end
	if quantidade(jogador, "Comida") < 1 then
		avisar(jogador, "Você não tem " .. Config.RECURSOS.Comida.nome .. "!")
		return
	end
	local fome = jogador:GetAttribute("Fome") or 100
	if fome >= 100 then
		avisar(jogador, "Você está sem fome.")
		return
	end
	adicionar(jogador, "Comida", -1)
	jogador:SetAttribute("Fome", math.min(100, fome + Config.COMIDA_RECUPERA))
end

remoteAcao.OnServerEvent:Connect(function(jogador, acao)
	if acao == "Comer" then
		aoComer(jogador)
	end
end)

local function aoDerrotarInimigo(jogador)
	adicionar(jogador, "Material", 1)
	if math.random() < 0.5 then
		adicionar(jogador, "Comida", 1)
	end
end

---------------------------------------------------------------------
-- Nascer, morrer e derrota
---------------------------------------------------------------------
local function nascer(jogador)
	if not jogador.Parent then
		return
	end
	jogador:SetAttribute("Morto", false)
	jogador:SetAttribute("Fome", 100)
	jogador:SetAttribute("Oxigenio", 100)
	jogador:LoadCharacter()
end

local function verificarDerrota()
	if partida ~= "Jogando" then
		return
	end
	local jogadores = Players:GetPlayers()
	if #jogadores == 0 then
		return
	end
	for _, jogador in jogadores do
		if not jogador:GetAttribute("Morto") then
			return
		end
	end
	partida = "Derrota"
	publicarEstado()
end

local function aoMorrer(jogador)
	if jogador:GetAttribute("Morto") then
		return
	end
	jogador:SetAttribute("Morto", true)
	limparInventario(jogador)
	avisar(nil, jogador.DisplayName .. " morreu!")
	verificarDerrota()

	-- De dia renasce logo; de noite espera o amanhecer (o loop da partida cuida disso)
	if not noite and partida == "Jogando" then
		task.delay(Config.RENASCER_DE_DIA, function()
			if jogador.Parent and jogador:GetAttribute("Morto") and not noite and partida == "Jogando" then
				nascer(jogador)
			end
		end)
	end
end

local function renascerMortos()
	for _, jogador in Players:GetPlayers() do
		if jogador:GetAttribute("Morto") then
			nascer(jogador)
		end
	end
end

---------------------------------------------------------------------
-- Recordes (DataStore)
---------------------------------------------------------------------
local armazenamento
do
	local ok, resultado = pcall(function()
		return DataStoreService:GetDataStore("Sobreviva100Espaco")
	end)
	if ok then
		armazenamento = resultado
	else
		warn("DataStore indisponível: " .. tostring(resultado))
	end
end

local function estatisticas(jogador)
	local leaderstats = jogador:FindFirstChild("leaderstats")
	if not leaderstats then
		return nil, nil
	end
	return leaderstats:FindFirstChild("Recorde"), leaderstats:FindFirstChild("Vitórias")
end

local function carregarDados(jogador)
	if not armazenamento then
		return
	end
	local ok, dados = pcall(function()
		return armazenamento:GetAsync("jogador_" .. jogador.UserId)
	end)
	if not ok then
		-- Não marca como carregado, assim não salvamos zeros por cima do recorde real
		warn("Erro ao carregar dados de " .. jogador.Name .. ": " .. tostring(dados))
		return
	end
	local recorde, vitorias = estatisticas(jogador)
	if type(dados) == "table" and recorde and vitorias then
		recorde.Value = math.max(recorde.Value, dados.recorde or 0)
		vitorias.Value += dados.vitorias or 0
	end
	jogador:SetAttribute("DadosCarregados", true)
end

local function salvarDados(jogador)
	if not armazenamento or not jogador:GetAttribute("DadosCarregados") then
		return
	end
	local recorde, vitorias = estatisticas(jogador)
	if not recorde or not vitorias then
		return
	end
	local dados = { recorde = recorde.Value, vitorias = vitorias.Value }
	local ok, erro = pcall(function()
		armazenamento:SetAsync("jogador_" .. jogador.UserId, dados)
	end)
	if not ok then
		warn("Erro ao salvar dados de " .. jogador.Name .. ": " .. tostring(erro))
	end
end

local function registrarDiaSobrevivido()
	for _, jogador in Players:GetPlayers() do
		local recorde = estatisticas(jogador)
		if recorde and not jogador:GetAttribute("Morto") and dia > recorde.Value then
			recorde.Value = dia
		end
	end
end

local function registrarVitoria()
	for _, jogador in Players:GetPlayers() do
		local _, vitorias = estatisticas(jogador)
		if vitorias then
			vitorias.Value += 1
		end
		salvarDados(jogador)
	end
end

---------------------------------------------------------------------
-- Entrada e saída de jogadores
---------------------------------------------------------------------
local function aoEntrar(jogador)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	local recorde = Instance.new("IntValue")
	recorde.Name = "Recorde"
	recorde.Parent = leaderstats
	local vitorias = Instance.new("IntValue")
	vitorias.Name = "Vitórias"
	vitorias.Parent = leaderstats
	leaderstats.Parent = jogador

	limparInventario(jogador)

	jogador.CharacterAdded:Connect(function(personagem)
		local humanoide = personagem:WaitForChild("Humanoid")
		humanoide.Died:Connect(function()
			aoMorrer(jogador)
		end)
	end)

	nascer(jogador)
	carregarDados(jogador)
end

---------------------------------------------------------------------
-- Status dos jogadores (a cada segundo)
---------------------------------------------------------------------
local function atualizarJogador(jogador)
	local personagem = jogador.Character
	local humanoide = personagem and personagem:FindFirstChildOfClass("Humanoid")
	local raiz = personagem and personagem:FindFirstChild("HumanoidRootPart")
	if not humanoide or not raiz or humanoide.Health <= 0 then
		return
	end

	local fome = math.max(0, (jogador:GetAttribute("Fome") or 100) - Config.FOME_POR_SEGUNDO)
	jogador:SetAttribute("Fome", fome)
	if fome <= 0 then
		humanoide:TakeDamage(Config.DANO_FOME)
	end

	local oxigenio = jogador:GetAttribute("Oxigenio") or 100
	if naZona(raiz.Position) then
		oxigenio = math.min(100, oxigenio + Config.OXIGENIO_GANHO)
	else
		oxigenio = math.max(0, oxigenio - Config.OXIGENIO_PERDA)
	end
	jogador:SetAttribute("Oxigenio", oxigenio)
	if oxigenio <= 0 then
		humanoide:TakeDamage(Config.DANO_SEM_OXIGENIO)
	end
end

---------------------------------------------------------------------
-- Partida
---------------------------------------------------------------------
local function definirNoite(valor)
	noite = valor
	Mundo.DefinirPeriodo(valor)
	publicarEstado()
end

-- Conta os segundos; devolve false se a partida acabou no meio
local function esperar(segundos)
	for restante = segundos, 1, -1 do
		ReplicatedStorage:SetAttribute("Tempo", restante)
		task.wait(1)
		if partida ~= "Jogando" then
			return false
		end
	end
	return true
end

local function rodarPartida()
	while true do
		-- DIA
		definirNoite(false)
		renascerMortos()
		avisar(nil, "Dia " .. dia .. " — " .. Config.MENSAGENS.dia)
		if not esperar(Config.DURACAO_DIA) then
			return
		end

		-- NOITE
		definirNoite(true)
		avisar(nil, Config.MENSAGENS.noite)
		local quantidadeInimigos =
			math.min(2 + math.floor(dia / 4) + #Players:GetPlayers(), Config.MAX_INIMIGOS)
		Inimigos.Gerar(quantidadeInimigos, mundo.centro, mundo.raioMundo, dia, aoDerrotarInimigo)
		local sobreviveu = esperar(Config.DURACAO_NOITE)
		Inimigos.LimparTodos()
		if not sobreviveu then
			return
		end

		-- AMANHECEU
		registrarDiaSobrevivido()
		if dia >= Config.TOTAL_DIAS then
			partida = "Vitoria"
			return
		end
		dia += 1
	end
end

local function resetarPartida()
	Inimigos.LimparTodos()
	dia = 1
	nivel = 1
	combustivel = Config.COMBUSTIVEL_INICIAL
	noite = false
	partida = "Jogando"
	for _, jogador in Players:GetPlayers() do
		limparInventario(jogador)
		nascer(jogador)
	end
	publicarEstado()
end

---------------------------------------------------------------------
-- Início
---------------------------------------------------------------------
mundo = Mundo.Construir({
	aoColetar = aoColetar,
	aoAbastecer = aoAbastecer,
	aoMelhorar = aoMelhorar,
})
publicarEstado()

Players.PlayerAdded:Connect(aoEntrar)
for _, jogador in Players:GetPlayers() do
	task.spawn(aoEntrar, jogador)
end

Players.PlayerRemoving:Connect(function(jogador)
	salvarDados(jogador)
	task.delay(0.5, verificarDerrota)
end)

game:BindToClose(function()
	for _, jogador in Players:GetPlayers() do
		salvarDados(jogador)
	end
end)

-- Monstros se movem a cada frame durante a noite
RunService.Heartbeat:Connect(function(dt)
	if noite and partida == "Jogando" then
		Inimigos.Atualizar(dt, { centro = mundo.centro, raio = raioZona(), naZona = naZona })
	end
end)

-- Reator e status a cada segundo
task.spawn(function()
	while true do
		task.wait(1)
		if partida == "Jogando" then
			local consumo = noite and Config.CONSUMO_NOITE or Config.CONSUMO_DIA
			combustivel = math.max(0, combustivel - consumo)
			for _, jogador in Players:GetPlayers() do
				atualizarJogador(jogador)
			end
			publicarEstado()
		end
	end
end)

-- Loop das partidas: joga, mostra o resultado e recomeça
local primeiraPartida = true
while true do
	if primeiraPartida then
		primeiraPartida = false
	else
		resetarPartida()
	end

	rodarPartida()
	publicarEstado()

	if partida == "Vitoria" then
		avisar(nil, Config.MENSAGENS.vitoria)
		registrarVitoria()
	else
		avisar(nil, "Todos morreram no dia " .. dia .. ". Recomeçando em 15 segundos...")
	end
	task.wait(15)
end
