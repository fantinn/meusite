-- Interface do "Sobreviva 100 Dias no Espaço".
-- LocalScript chamado "HUD" dentro de StarterPlayer > StarterPlayerScripts.
-- Só mostra informações; quem decide tudo é o servidor.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")

local Config = require(ReplicatedStorage:WaitForChild("Config"))
local remotes = ReplicatedStorage:WaitForChild("Remotes")
local remoteAcao = remotes:WaitForChild("Acao")
local remoteAviso = remotes:WaitForChild("Aviso")
local jogador = Players.LocalPlayer

local BRANCO = Color3.new(1, 1, 1)
local FUNDO = Color3.fromRGB(12, 14, 24)
local FONTE = Enum.Font.GothamBold

local function criar(classe, props, pai)
	local objeto = Instance.new(classe)
	for chave, valor in props do
		objeto[chave] = valor
	end
	objeto.Parent = pai
	return objeto
end

local function painel(props, pai)
	local quadro = criar("Frame", props, pai)
	quadro.BackgroundColor3 = FUNDO
	quadro.BackgroundTransparency = 0.25
	quadro.BorderSizePixel = 0
	quadro.AutomaticSize = Enum.AutomaticSize.Y
	criar("UICorner", { CornerRadius = UDim.new(0, 10) }, quadro)
	criar("UIStroke", { Color = Config.CORES.reator, Transparency = 0.6, Thickness = 1 }, quadro)
	criar("UIPadding", {
		PaddingTop = UDim.new(0, 8),
		PaddingBottom = UDim.new(0, 8),
		PaddingLeft = UDim.new(0, 10),
		PaddingRight = UDim.new(0, 10),
	}, quadro)
	criar("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder }, quadro)
	return quadro
end

local function texto(pai, ordem, tamanho, alinhamento)
	return criar("TextLabel", {
		LayoutOrder = ordem,
		Size = UDim2.new(1, 0, 0, tamanho + 4),
		BackgroundTransparency = 1,
		Font = FONTE,
		TextSize = tamanho,
		TextColor3 = BRANCO,
		TextXAlignment = alinhamento or Enum.TextXAlignment.Left,
		Text = "",
	}, pai)
end

-- Cria uma barra e devolve uma função para atualizá-la
local function barra(pai, ordem, titulo, cor)
	local quadro = criar("Frame", {
		LayoutOrder = ordem,
		Size = UDim2.new(1, 0, 0, 32),
		BackgroundTransparency = 1,
	}, pai)
	local rotulo = criar("TextLabel", {
		Size = UDim2.new(1, 0, 0, 14),
		BackgroundTransparency = 1,
		Font = FONTE,
		TextSize = 13,
		TextColor3 = BRANCO,
		TextXAlignment = Enum.TextXAlignment.Left,
		Text = titulo,
	}, quadro)
	local fundo = criar("Frame", {
		Position = UDim2.new(0, 0, 0, 17),
		Size = UDim2.new(1, 0, 0, 12),
		BackgroundColor3 = Color3.fromRGB(35, 35, 45),
		BorderSizePixel = 0,
	}, quadro)
	criar("UICorner", { CornerRadius = UDim.new(0, 6) }, fundo)
	local preenchimento = criar("Frame", {
		Size = UDim2.new(1, 0, 1, 0),
		BackgroundColor3 = cor,
		BorderSizePixel = 0,
	}, fundo)
	criar("UICorner", { CornerRadius = UDim.new(0, 6) }, preenchimento)

	return function(valor, maximo)
		local fracao = maximo > 0 and math.clamp(valor / maximo, 0, 1) or 0
		preenchimento.Size = UDim2.new(fracao, 0, 1, 0)
		rotulo.Text = titulo .. "  " .. math.floor(valor) .. "/" .. math.floor(maximo)
	end
end

---------------------------------------------------------------------
-- Montagem da tela
---------------------------------------------------------------------
local gui = criar("ScreenGui", {
	Name = "HUD",
	ResetOnSpawn = false,
	ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
}, jogador:WaitForChild("PlayerGui"))

-- Topo: dia, tempo e reator
local topo = painel({
	AnchorPoint = Vector2.new(0.5, 0),
	Position = UDim2.new(0.5, 0, 0, 8),
	Size = UDim2.new(0, 280, 0, 0),
}, gui)
local textoDia = texto(topo, 1, 24, Enum.TextXAlignment.Center)
local textoTempo = texto(topo, 2, 15, Enum.TextXAlignment.Center)
local textoReator = texto(topo, 3, 13)
local barraReator = barra(topo, 4, "Combustível", Config.CORES.reator)

-- Esquerda: status do jogador
local status = painel({
	Position = UDim2.new(0, 8, 0, 8),
	Size = UDim2.new(0, 200, 0, 0),
}, gui)
local barraVida = barra(status, 1, "Vida", Color3.fromRGB(230, 70, 70))
local barraFome = barra(status, 2, "Fome", Color3.fromRGB(240, 160, 50))
local barraOxigenio = barra(status, 3, "Oxigênio", Config.CORES.oxigenio)

-- Direita: inventário e dicas
local inventario = painel({
	AnchorPoint = Vector2.new(1, 0),
	Position = UDim2.new(1, -8, 0, 8),
	Size = UDim2.new(0, 220, 0, 0),
}, gui)
local tituloInventario = texto(inventario, 0, 14)
tituloInventario.Text = "Mochila"
tituloInventario.TextColor3 = Config.CORES.reator
local rotulosInventario = {}
for ordem, tipo in Config.ORDEM_RECURSOS do
	local rotulo = texto(inventario, ordem, 14)
	rotulo.TextColor3 = Config.RECURSOS[tipo].cor
	rotulosInventario[tipo] = rotulo
end
local dica = texto(inventario, 10, 11)
dica.Size = UDim2.new(1, 0, 0, 30)
dica.TextWrapped = true
dica.TextColor3 = Color3.fromRGB(170, 175, 190)
dica.Text = "E coletar/abastecer · R melhorar reator · Q atacar · F comer"

-- Botão de comer (funciona no celular também)
local botaoComer = criar("TextButton", {
	AnchorPoint = Vector2.new(1, 0.5),
	Position = UDim2.new(1, -8, 0.5, 0),
	Size = UDim2.new(0, 130, 0, 46),
	BackgroundColor3 = Color3.fromRGB(240, 160, 50),
	Font = FONTE,
	TextSize = 18,
	TextColor3 = Color3.fromRGB(30, 20, 5),
	Text = "Comer (F)",
	AutoButtonColor = true,
}, gui)
criar("UICorner", { CornerRadius = UDim.new(0, 10) }, botaoComer)

-- Avisos grandes no centro
local aviso = criar("TextLabel", {
	AnchorPoint = Vector2.new(0.5, 0.5),
	Position = UDim2.new(0.5, 0, 0.3, 0),
	Size = UDim2.new(0.8, 0, 0, 60),
	BackgroundTransparency = 1,
	Font = FONTE,
	TextSize = 28,
	TextWrapped = true,
	TextColor3 = BRANCO,
	TextStrokeColor3 = Color3.new(0, 0, 0),
	TextStrokeTransparency = 1,
	TextTransparency = 1,
	Text = "",
}, gui)

-- Mensagem de morte
local textoMorte = criar("TextLabel", {
	AnchorPoint = Vector2.new(0.5, 0.5),
	Position = UDim2.new(0.5, 0, 0.55, 0),
	Size = UDim2.new(0.8, 0, 0, 40),
	BackgroundTransparency = 1,
	Font = FONTE,
	TextSize = 22,
	TextWrapped = true,
	TextColor3 = Color3.fromRGB(255, 90, 90),
	TextStrokeTransparency = 0.4,
	Visible = false,
	Text = "",
}, gui)

---------------------------------------------------------------------
-- Eventos
---------------------------------------------------------------------
local versaoAviso = 0
remoteAviso.OnClientEvent:Connect(function(mensagem)
	versaoAviso += 1
	local minhaVersao = versaoAviso
	aviso.Text = mensagem
	aviso.TextTransparency = 0
	aviso.TextStrokeTransparency = 0.4
	task.delay(3.5, function()
		if minhaVersao == versaoAviso then
			TweenService:Create(aviso, TweenInfo.new(1), { TextTransparency = 1, TextStrokeTransparency = 1 }):Play()
		end
	end)
end)

local function comer()
	remoteAcao:FireServer("Comer")
end

botaoComer.Activated:Connect(comer)
UserInputService.InputBegan:Connect(function(entrada, processado)
	if not processado and entrada.KeyCode == Enum.KeyCode.F then
		comer()
	end
end)

---------------------------------------------------------------------
-- Atualização da tela
---------------------------------------------------------------------
local function formatarTempo(segundos)
	return string.format("%d:%02d", segundos // 60, segundos % 60)
end

while true do
	local dia = ReplicatedStorage:GetAttribute("Dia") or 1
	local noite = ReplicatedStorage:GetAttribute("Noite") == true
	local tempo = ReplicatedStorage:GetAttribute("Tempo") or 0
	local partida = ReplicatedStorage:GetAttribute("Partida") or "Jogando"

	textoDia.Text = "DIA " .. dia .. " / " .. Config.TOTAL_DIAS
	if partida == "Vitoria" then
		textoTempo.Text = "VITÓRIA!"
		textoTempo.TextColor3 = Color3.fromRGB(120, 255, 140)
	elseif partida == "Derrota" then
		textoTempo.Text = "Fim de jogo"
		textoTempo.TextColor3 = Color3.fromRGB(255, 90, 90)
	else
		textoTempo.Text = (noite and "Noite" or "Dia") .. " · " .. formatarTempo(tempo)
		textoTempo.TextColor3 = noite and Color3.fromRGB(160, 170, 255) or Color3.fromRGB(255, 220, 120)
	end

	textoReator.Text = "Reator · Nível " .. (ReplicatedStorage:GetAttribute("Nivel") or 1)
	barraReator(ReplicatedStorage:GetAttribute("Combustivel") or 0, ReplicatedStorage:GetAttribute("CombustivelMax") or 100)

	local personagem = jogador.Character
	local humanoide = personagem and personagem:FindFirstChildOfClass("Humanoid")
	barraVida(humanoide and humanoide.Health or 0, humanoide and humanoide.MaxHealth or 100)
	barraFome(jogador:GetAttribute("Fome") or 100, 100)
	barraOxigenio(jogador:GetAttribute("Oxigenio") or 100, 100)

	for tipo, rotulo in rotulosInventario do
		rotulo.Text = Config.RECURSOS[tipo].nome .. ": " .. (jogador:GetAttribute(tipo) or 0)
	end

	local morto = jogador:GetAttribute("Morto") == true
	textoMorte.Visible = morto and partida == "Jogando"
	if morto then
		textoMorte.Text = noite and "Você morreu! Vai renascer ao amanhecer." or "Você morreu! Renascendo em instantes..."
	end

	task.wait(0.15)
end
