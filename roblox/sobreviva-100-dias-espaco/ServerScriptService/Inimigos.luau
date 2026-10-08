-- Alienígenas que aparecem à noite, perseguem quem está fora da base e somem ao amanhecer.
-- ModuleScript chamado "Inimigos" dentro de ServerScriptService.

local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))

local Inimigos = {}

local INTERVALO_ATAQUE = 1
local RAIO_CORPO = 2
local ALTURA_CORPO = 2.5 -- centro do corpo acima do chão

local ativos = {}

local pasta = Instance.new("Folder")
pasta.Name = "Inimigos"
pasta.Parent = Workspace

local function parteSolta(props, pai)
	local parte = Instance.new("Part")
	parte.Anchored = true
	parte.CanCollide = false
	parte.CastShadow = false
	parte.TopSurface = Enum.SurfaceType.Smooth
	parte.BottomSurface = Enum.SurfaceType.Smooth
	for chave, valor in props do
		parte[chave] = valor
	end
	parte.Parent = pai
	return parte
end

local function criarModelo(origem)
	local modelo = Instance.new("Model")
	modelo.Name = "Alienigena"
	local cor = Config.CORES.alien
	local corOlhos = Config.CORES.olhosAlien

	local corpo = parteSolta({
		Name = "Corpo",
		Size = Vector3.new(3, 4, 2),
		Color = cor,
		Material = Enum.Material.SmoothPlastic,
		CFrame = origem,
	}, modelo)
	parteSolta({
		Name = "Cabeca",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(3.2, 3.2, 3.2),
		Color = cor,
		Material = Enum.Material.SmoothPlastic,
		CFrame = origem * CFrame.new(0, 3.4, 0),
	}, modelo)
	-- A frente do modelo é o lado -Z (é para onde CFrame.lookAt aponta)
	for _, lado in { -1, 1 } do
		parteSolta({
			Name = "Olho",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(0.9, 0.9, 0.9),
			Color = corOlhos,
			Material = Enum.Material.Neon,
			CFrame = origem * CFrame.new(lado * 0.65, 3.6, -1.35),
		}, modelo)
		parteSolta({
			Name = "Antena",
			Size = Vector3.new(0.2, 1.6, 0.2),
			Color = cor,
			Material = Enum.Material.SmoothPlastic,
			CFrame = origem * CFrame.new(lado * 0.7, 5.5, 0) * CFrame.Angles(0, 0, math.rad(-lado * 20)),
		}, modelo)
		parteSolta({
			Name = "PontaAntena",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(0.5, 0.5, 0.5),
			Color = corOlhos,
			Material = Enum.Material.Neon,
			CFrame = origem * CFrame.new(lado * 1, 6.3, 0),
		}, modelo)
	end

	modelo.PrimaryPart = corpo
	modelo.Parent = pasta
	return modelo, corpo
end

local function criarInimigo(x, z, dia, aoDerrotar)
	local origem = CFrame.new(x, ALTURA_CORPO, z)
	local modelo, corpo = criarModelo(origem)

	local inimigo = {
		modelo = modelo,
		corpo = corpo,
		vida = Config.INIMIGO_VIDA + math.floor(dia / 25),
		dano = Config.INIMIGO_DANO + math.floor(dia / 10) * 2,
		velocidade = math.min(Config.INIMIGO_VELOCIDADE + dia * 0.03, Config.INIMIGO_VELOCIDADE_MAX),
		fase = math.random() * math.pi * 2, -- para flutuar fora de sincronia
		ultimoAtaque = 0,
		morto = false,
	}

	local prompt = Instance.new("ProximityPrompt")
	prompt.ActionText = "Atacar"
	prompt.ObjectText = "Alienígena"
	prompt.KeyboardKeyCode = Enum.KeyCode.Q
	prompt.HoldDuration = 0
	prompt.MaxActivationDistance = 10
	prompt.RequiresLineOfSight = false
	prompt.Parent = corpo

	prompt.Triggered:Connect(function(jogador)
		if inimigo.morto then
			return
		end
		inimigo.vida -= 1
		corpo.Color = Color3.new(1, 1, 1)
		task.delay(0.12, function()
			if corpo.Parent then
				corpo.Color = Config.CORES.alien
			end
		end)
		if inimigo.vida <= 0 then
			inimigo.morto = true
			modelo:Destroy()
			aoDerrotar(jogador)
		end
	end)

	table.insert(ativos, inimigo)
end

-- Cria "quantidade" alienígenas longe do centro.
function Inimigos.Gerar(quantidade, centro, raioMundo, dia, aoDerrotar)
	for _ = 1, quantidade do
		local angulo = math.random() * math.pi * 2
		local distancia = raioMundo * (0.5 + math.random() * 0.5)
		criarInimigo(centro.X + math.cos(angulo) * distancia, centro.Z + math.sin(angulo) * distancia, dia, aoDerrotar)
	end
end

function Inimigos.LimparTodos()
	for _, inimigo in ativos do
		inimigo.morto = true
		inimigo.modelo:Destroy()
	end
	table.clear(ativos)
end

local function distanciaPlana(a, b)
	local dx, dz = a.X - b.X, a.Z - b.Z
	return math.sqrt(dx * dx + dz * dz)
end

local function alvosVivos()
	local lista = {}
	for _, jogador in Players:GetPlayers() do
		local personagem = jogador.Character
		local humanoide = personagem and personagem:FindFirstChildOfClass("Humanoid")
		local raiz = personagem and personagem:FindFirstChild("HumanoidRootPart")
		if humanoide and raiz and humanoide.Health > 0 then
			table.insert(lista, { humanoide = humanoide, raiz = raiz })
		end
	end
	return lista
end

-- Chamado a cada frame durante a noite.
-- contexto = { centro = Vector3, raio = raio atual da zona segura, naZona = function(posicao) }
function Inimigos.Atualizar(dt, contexto)
	local alvos = alvosVivos()
	local agora = os.clock()
	local centro = contexto.centro

	for i = #ativos, 1, -1 do
		local inimigo = ativos[i]
		if inimigo.morto then
			table.remove(ativos, i)
			continue
		end

		local posicao = inimigo.corpo.Position

		-- Persegue o jogador mais próximo que esteja FORA da zona segura
		local alvo, menorDistancia = nil, Config.INIMIGO_ALCANCE_VISAO
		for _, candidato in alvos do
			if not contexto.naZona(candidato.raiz.Position) then
				local distancia = distanciaPlana(candidato.raiz.Position, posicao)
				if distancia < menorDistancia then
					alvo, menorDistancia = candidato, distancia
				end
			end
		end

		-- Sem alvo, ronda a base
		local destino = alvo and alvo.raiz.Position or centro
		local altura = ALTURA_CORPO + math.sin(agora * 3 + inimigo.fase) * 0.3
		local direcao = Vector3.new(destino.X - posicao.X, 0, destino.Z - posicao.Z)
		local novaPosicao = Vector3.new(posicao.X, altura, posicao.Z)
		if direcao.Magnitude > 1 then
			novaPosicao += direcao.Unit * math.min(direcao.Magnitude, inimigo.velocidade * dt)
		end

		-- Não deixa entrar na zona segura
		if contexto.raio > 0 then
			local relativo = Vector3.new(novaPosicao.X - centro.X, 0, novaPosicao.Z - centro.Z)
			local limite = contexto.raio + RAIO_CORPO
			if relativo.Magnitude < limite then
				local saida = relativo.Magnitude > 0.01 and relativo.Unit or Vector3.xAxis
				novaPosicao = Vector3.new(centro.X + saida.X * limite, altura, centro.Z + saida.Z * limite)
			end
		end

		local olharPara = Vector3.new(destino.X, altura, destino.Z)
		if (olharPara - novaPosicao).Magnitude > 0.5 then
			inimigo.modelo:PivotTo(CFrame.lookAt(novaPosicao, olharPara))
		else
			inimigo.modelo:PivotTo(CFrame.new(novaPosicao) * inimigo.corpo.CFrame.Rotation)
		end

		-- Ataque
		if alvo and agora - inimigo.ultimoAtaque >= INTERVALO_ATAQUE then
			local posicaoAlvo = alvo.raiz.Position
			local perto = distanciaPlana(posicaoAlvo, novaPosicao) <= Config.INIMIGO_ALCANCE_ATAQUE + RAIO_CORPO
			if perto and math.abs(posicaoAlvo.Y - novaPosicao.Y) < 8 then
				inimigo.ultimoAtaque = agora
				alvo.humanoide:TakeDamage(inimigo.dano)
			end
		end
	end
end

return Inimigos
