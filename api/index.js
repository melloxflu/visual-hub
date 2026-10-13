export default function handler(req, res) {
    const ua = (req.headers["user-agent"] || "").toLowerCase();
    const isBrowser = /mozilla|chrome|firefox|safari|edge/i.test(ua)
        && !/roblox|synapse|krnl|delta|script-ware|fluxus|codex|wave/i.test(ua);

    if (isBrowser) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VISUAL HUB</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;font-family:Arial,sans-serif;background:#0a0a0f;color:#fff;overflow:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(circle at 20% 20%,rgba(0,170,255,.15),transparent 50%),radial-gradient(circle at 80% 80%,rgba(120,92,255,.1),transparent 50%);z-index:-1}
.center{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px}
h1{font-size:clamp(2.5rem,10vw,6rem);font-weight:900;letter-spacing:-4px;background:linear-gradient(135deg,#00aaff,#7c5cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.sub{color:#888;font-size:.85rem;letter-spacing:4px;text-transform:uppercase;margin-bottom:40px}
.btn{padding:16px 48px;background:linear-gradient(135deg,#00aaff,#7c5cff);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:bold;cursor:pointer;letter-spacing:1px}
.btn:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(0,170,255,.6)}
.steps{margin-top:40px;color:#666;font-size:.8rem;line-height:1.9;max-width:380px}
.steps b{color:#00aaff}
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:linear-gradient(135deg,#00aaff,#7c5cff);color:#fff;padding:14px 28px;border-radius:10px;font-weight:bold;font-size:.85rem;transition:.4s}
.toast.show{transform:translateX(-50%) translateY(0)}
</style></head><body>
<div class="center">
<h1>VISUAL HUB</h1>
<div class="sub">Premium Visual Script</div>
<button class="btn" onclick="copyLoader()">🚀 COPY LOADER</button>
<div class="steps">
<b>1.</b> Klik COPY LOADER<br>
<b>2.</b> Buka executor<br>
<b>3.</b> Paste → Execute<br>
<b>4.</b> UI muncul
</div></div>
<div class="toast" id="toast">✅ Loader dicopy!</div>
<script>
function copyLoader(){
var u=window.location.origin;
var l='loadstring(game:HttpGet("'+u+'"))()';
navigator.clipboard.writeText(l).then(showToast).catch(function(){
var t=document.createElement('textarea');t.value=l;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);showToast();
});}
function showToast(){var t=document.getElementById('toast');t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2500);}
</script></body></html>`);
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(LUA_SCRIPT);
}

const LUA_SCRIPT = `-- ═══════════════════════════════════════════════════════════════════
--  VISUAL HUB — Simpel Float Toggle
--  Fitur: Headless · Horns · Sharingan · Amaterasu Glove
-- ═══════════════════════════════════════════════════════════════════

local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local LocalPlayer = Players.LocalPlayer

local CONFIG = {
    HORNS_ID = 1744060292,
    HORNS_OFFSET = CFrame.new(0, 1.2, -0.3) * CFrame.Angles(math.rad(-15), 0, 0),
    UI_ACCENT   = Color3.fromRGB(0, 170, 255),
    UI_BG       = Color3.fromRGB(8, 14, 26),
    UI_CARD     = Color3.fromRGB(16, 24, 42),
    UI_TEXT     = Color3.fromRGB(200, 230, 255),
    UI_TEXT_DIM = Color3.fromRGB(110, 140, 180),
}

local Visual = {
    horns = false, headless = false, sharingan = false, amaterasu = false,
    hornsObj = nil, headStash = {}, eyeParts = {}, faceObjs = {},
    amaterasuObjs = {}, amaterasuConn = nil,
}

function Visual:buildHorns()
    local char = LocalPlayer.Character
    if not char then return nil end
    local attach = char:FindFirstChild("Head") or char:FindFirstChild("UpperTorso")
    if not attach then return nil end
    local ok, objs = pcall(function()
        return game:GetObjects("rbxassetid://" .. CONFIG.HORNS_ID)
    end)
    if not ok or not objs or #objs == 0 then return nil end
    local model = objs[1]
    local handle = model:FindFirstChild("Handle")
    if not handle then
        for _, v in ipairs(model:GetDescendants()) do
            if v.Name == "Handle" and v:IsA("BasePart") then handle = v; break end
        end
    end
    if not handle then model:Destroy(); return nil end
    local clone = handle:Clone()
    clone.Name = "VisualHorns"
    clone.CanCollide = false
    clone.Massless = true
    clone.Parent = char
    clone.CFrame = attach.CFrame
    local weld = Instance.new("Weld")
    weld.Part0 = attach; weld.Part1 = clone
    weld.C0 = CONFIG.HORNS_OFFSET; weld.Parent = clone
    model:Destroy()
    return clone
end

function Visual:toggleHorns()
    self.horns = not self.horns
    if self.horns then
        local a = self:buildHorns()
        if a then self.hornsObj = a else self.horns = false end
    else
        if self.hornsObj and self.hornsObj.Parent then self.hornsObj:Destroy() end
        self.hornsObj = nil
    end
    return self.horns
end

function Visual:setHeadless(enable)
    local char = LocalPlayer.Character
    if not char then return end
    local head = char:FindFirstChild("Head")
    if not head then return end
    if enable then
        self.headStash = {}
        local function stash(o, prop)
            if o and o[prop] ~= nil then
                table.insert(self.headStash, {obj = o, prop = prop, val = o[prop]})
            end
        end
        stash(head, "Transparency"); head.Transparency = 1
        for _, v in ipairs(head:GetDescendants()) do
            if v:IsA("Decal") or v:IsA("Texture") or v:IsA("MeshPart") then
                stash(v, "Transparency"); v.Transparency = 1
            end
        end
        local face = head:FindFirstChild("face")
        if face then stash(face, "Transparency"); face.Transparency = 1 end
        for _, acc in ipairs(char:GetChildren()) do
            if acc:IsA("Accessory") or acc:IsA("Accoutrement") then
                local h = acc:FindFirstChild("Handle")
                if h then
                    local w = h:FindFirstChildOfClass("Weld") or h:FindFirstChildOfClass("Motor6D")
                    if w and w.Part0 == head then
                        stash(h, "Transparency"); h.Transparency = 1
                        for _, v in ipairs(h:GetDescendants()) do
                            if v:IsA("Decal") or v:IsA("Texture") then
                                stash(v, "Transparency"); v.Transparency = 1
                            end
                        end
                    end
                end
            end
        end
    else
        for _, e in ipairs(self.headStash) do
            if e.obj and e.obj.Parent then e.obj[e.prop] = e.val end
        end
        self.headStash = {}
    end
end

function Visual:toggleHeadless()
    self.headless = not self.headless
    self:setHeadless(self.headless)
    return self.headless
end

function Visual:activateSharingan()
    local char = LocalPlayer.Character
    if not char then return false end
    local head = char:FindFirstChild("Head")
    if not head then return false end
    self.faceObjs = {}; self.eyeParts = {}
    local face = head:FindFirstChild("face")
    if face then
        table.insert(self.faceObjs, {obj = face, prop = "Transparency", val = face.Transparency})
        face.Transparency = 1
    end
    for _, v in ipairs(head:GetChildren()) do
        if v:IsA("Decal") or v:IsA("Texture") then
            table.insert(self.faceObjs, {obj = v, prop = "Transparency", val = v.Transparency})
            v.Transparency = 1
        end
    end
    local zOff = -head.Size.Z / 2 - 0.05
    for _, xOff in ipairs({-0.32, 0.32}) do
        local base = Instance.new("Part")
        base.Name = "SharinganEye"
        base.Shape = Enum.PartType.Ball
        base.Size = Vector3.new(0.28, 0.28, 0.28)
        base.Color = Color3.fromRGB(245, 245, 245)
        base.Material = Enum.Material.SmoothPlastic
        base.CanCollide = false; base.Massless = true
        base.Parent = char
        local weld = Instance.new("Weld")
        weld.Part0 = head; weld.Part1 = base
        weld.C0 = CFrame.new(xOff, 0, zOff); weld.Parent = base
        local iris = Instance.new("Part")
        iris.Name = "SharinganIris"
        iris.Shape = Enum.PartType.Ball
        iris.Size = Vector3.new(0.22, 0.22, 0.22)
        iris.Color = Color3.fromRGB(190, 20, 30)
        iris.Material = Enum.Material.Neon
        iris.CanCollide = false; iris.Massless = true
        iris.Parent = char
        local iw = Instance.new("Weld")
        iw.Part0 = base; iw.Part1 = iris
        iw.C0 = CFrame.new(0, 0, -0.04); iw.Parent = iris
        local pupil = Instance.new("Part")
        pupil.Name = "SharinganPupil"
        pupil.Shape = Enum.PartType.Ball
        pupil.Size = Vector3.new(0.09, 0.09, 0.09)
        pupil.Color = Color3.fromRGB(15, 15, 15)
        pupil.Material = Enum.Material.Plastic
        pupil.CanCollide = false; pupil.Massless = true
        pupil.Parent = char
        local pw = Instance.new("Weld")
        pw.Part0 = iris; pw.Part1 = pupil
        pw.C0 = CFrame.new(0, 0, -0.08); pw.Parent = pupil
        local tomoes = {}
        for i = 1, 3 do
            local a = (i - 1) * (2 * math.pi / 3) + math.rad(90)
            local t = Instance.new("Part")
            t.Name = "Tomoe"
            t.Shape = Enum.PartType.Ball
            t.Size = Vector3.new(0.055, 0.055, 0.055)
            t.Color = Color3.fromRGB(15, 15, 15)
            t.Material = Enum.Material.Plastic
            t.CanCollide = false; t.Massless = true
            t.Parent = char
            local tw = Instance.new("Weld")
            tw.Part0 = iris; tw.Part1 = t
            tw.C0 = CFrame.new(math.cos(a) * 0.07, math.sin(a) * 0.07, -0.07)
            tw.Parent = t
            table.insert(tomoes, t)
        end
        local light = Instance.new("PointLight")
        light.Color = Color3.fromRGB(255, 40, 40)
        light.Range = 5; light.Brightness = 1.5
        light.Parent = iris
        table.insert(self.eyeParts, {base = base, iris = iris, pupil = pupil, tomoes = tomoes})
    end
    return true
end

function Visual:deactivateSharingan()
    for _, e in ipairs(self.faceObjs) do
        if e.obj and e.obj.Parent then e.obj[e.prop] = e.val end
    end
    self.faceObjs = {}
    for _, eye in ipairs(self.eyeParts) do
        if eye.base then eye.base:Destroy() end
        if eye.iris then eye.iris:Destroy() end
        if eye.pupil then eye.pupil:Destroy() end
        for _, t in ipairs(eye.tomoes) do if t then t:Destroy() end end
    end
    self.eyeParts = {}
end

function Visual:toggleSharingan()
    self.sharingan = not self.sharingan
    if self.sharingan then self:activateSharingan()
    else self:deactivateSharingan() end
    return self.sharingan
end

local function findHands(char)
    local h = {}
    local r = char:FindFirstChild("RightHand")
    local l = char:FindFirstChild("LeftHand")
    if r then table.insert(h, r) end
    if l then table.insert(h, l) end
    if #h == 0 then
        local ra = char:FindFirstChild("Right Arm")
        local la = char:FindFirstChild("Left Arm")
        if ra then table.insert(h, ra) end
        if la then table.insert(h, la) end
    end
    return h
end

local function buildGlove(hand)
    local isR15 = (hand.Name == "RightHand" or hand.Name == "LeftHand")
    local hs = hand.Size
    local gs = Vector3.new(hs.X * 1.3, hs.Y * 1.3, hs.Z * 1.3)
    local shell = Instance.new("Part")
    shell.Name = "AmaterasuShell"
    shell.Size = gs
    shell.Color = Color3.fromRGB(4, 12, 30)
    shell.Material = Enum.Material.Neon
    shell.Transparency = 0.15
    shell.CanCollide = false; shell.Massless = true
    shell.Parent = LocalPlayer.Character
    local w1 = Instance.new("Weld")
    w1.Part0 = hand; w1.Part1 = shell; w1.Parent = shell
    local rim = Instance.new("Part")
    rim.Name = "AmaterasuRim"
    rim.Size = Vector3.new(gs.X*1.08, gs.Y*1.08, gs.Z*1.08)
    rim.Color = Color3.fromRGB(0, 170, 255)
    rim.Material = Enum.Material.ForceField
    rim.Transparency = 0.5
    rim.CanCollide = false; rim.Massless = true
    rim.Parent = LocalPlayer.Character
    local w2 = Instance.new("Weld")
    w2.Part0 = hand; w2.Part1 = rim; w2.Parent = rim
    local knuckle = Instance.new("Part")
    knuckle.Name = "AmaterasuKnuckle"
    knuckle.Size = Vector3.new(gs.X * 0.9, gs.Y * 0.5, gs.Z * 0.5)
    knuckle.Color = Color3.fromRGB(0, 0, 5)
    knuckle.Material = Enum.Material.Neon
    knuckle.CanCollide = false; knuckle.Massless = true
    knuckle.Parent = LocalPlayer.Character
    local w3 = Instance.new("Weld")
    w3.Part0 = hand; w3.Part1 = knuckle
    w3.C0 = isR15 and CFrame.new(0, 0, -hs.Z * 0.7) or CFrame.new(0, -hs.Y * 0.7, 0)
    w3.Parent = knuckle
    local atts = {}
    local offs = {
        Vector3.new(0, 0, 0),
        Vector3.new(0.3, 0.3, 0),
        Vector3.new(-0.3, 0.3, 0),
        Vector3.new(0, -0.3, 0),
    }
    for i, off in ipairs(offs) do
        local att = Instance.new("Attachment")
        att.Name = "FlameAtt" .. i
        att.Position = off
        att.Parent = shell
        local em = Instance.new("ParticleEmitter")
        em.Texture = "rbxassetid://243660364"
        em.Color = ColorSequence.new({
            ColorSequenceKeypoint.new(0, Color3.fromRGB(80, 200, 255)),
            ColorSequenceKeypoint.new(0.5, Color3.fromRGB(20, 130, 220)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(0, 40, 100))
        })
        em.Size = NumberSequence.new({
            NumberSequenceKeypoint.new(0, 0.1),
            NumberSequenceKeypoint.new(0.5, 0.25),
            NumberSequenceKeypoint.new(1, 0.05)
        })
        em.Transparency = NumberSequence.new({
            NumberSequenceKeypoint.new(0, 0.15),
            NumberSequenceKeypoint.new(0.7, 0.5),
            NumberSequenceKeypoint.new(1, 1)
        })
        em.Lifetime = NumberRange.new(0.3, 0.7)
        em.Rate = 30
        em.Speed = NumberRange.new(0.3, 1)
        em.Drag = 3
        em.Acceleration = Vector3.new(0, 1, 0)
        em.Rotation = NumberRange.new(0, 360)
        em.RotSpeed = NumberRange.new(-180, 180)
        em.SpreadAngle = Vector3.new(180, 180, 180)
        em.LightEmission = 1
        em.LightInfluence = 0
        em.ZOffset = 1
        em.Parent = att
        table.insert(atts, att)
    end
    local light = Instance.new("PointLight")
    light.Color = Color3.fromRGB(0, 170, 255)
    light.Range = 8
    light.Brightness = 2.2
    light.Parent = shell
    return {hand = hand, shell = shell, rim = rim, knuckle = knuckle, attachments = atts, light = light}
end

function Visual:activateAmaterasu()
    local char = LocalPlayer.Character
    if not char then return false end
    local hands = findHands(char)
    if #hands == 0 then return false end
    self.amaterasuObjs = {}
    for _, hand in ipairs(hands) do
        table.insert(self.amaterasuObjs, buildGlove(hand))
    end
    if self.amaterasuConn then self.amaterasuConn:Disconnect() end
    self.amaterasuConn = RunService.Heartbeat:Connect(function()
        if not self.amaterasu then return end
        local pulse = 1.5 + math.sin(tick() * 4) * 0.6
        for _, g in ipairs(self.amaterasuObjs) do
            if g.light and g.light.Parent then g.light.Brightness = pulse end
            if g.rim and g.rim.Parent then
                g.rim.CFrame = g.rim.CFrame * CFrame.Angles(0, math.rad(2.5), 0)
            end
        end
    end)
    return true
end

function Visual:deactivateAmaterasu()
    if self.amaterasuConn then
        self.amaterasuConn:Disconnect()
        self.amaterasuConn = nil
    end
    for _, g in ipairs(self.amaterasuObjs) do
        if g.shell then g.shell:Destroy() end
        if g.rim then g.rim:Destroy() end
        if g.knuckle then g.knuckle:Destroy() end
        for _, att in ipairs(g.attachments or {}) do
            if att and att.Parent then att:Destroy() end
        end
    end
    self.amaterasuObjs = {}
end

function Visual:toggleAmaterasu()
    self.amaterasu = not self.amaterasu
    if self.amaterasu then self:activateAmaterasu()
    else self:deactivateAmaterasu() end
    return self.amaterasu
end

LocalPlayer.CharacterAdded:Connect(function()
    Visual.hornsObj = nil
    Visual.headStash = {}
    Visual.faceObjs = {}
    Visual.eyeParts = {}
    Visual.amaterasuObjs = {}
    task.wait(1.5)
    if Visual.headless then Visual:setHeadless(true) end
    if Visual.horns then Visual.horns = false; Visual:toggleHorns() end
    if Visual.sharingan then Visual.sharingan = false; Visual:toggleSharingan() end
    if Visual.amaterasu then Visual.amaterasu = false; Visual:toggleAmaterasu() end
end)

local function make(class, props)
    local o = Instance.new(class)
    for k, v in pairs(props or {}) do o[k] = v end
    return o
end
local function corner(p, r)
    return make("UICorner", {CornerRadius = UDim.new(0, r or 8), Parent = p})
end
local function stroke(p, c, th, tr)
    return make("UIStroke", {
        Color = c or CONFIG.UI_ACCENT, Thickness = th or 1,
        Transparency = tr or 0.3, Parent = p
    })
end
local function tw(o, time, props, style, dir)
    TweenService:Create(o, TweenInfo.new(
        time, style or Enum.EasingStyle.Quart, dir or Enum.EasingDirection.Out
    ), props):Play()
end

local gui = make("ScreenGui", {
    Name = "VisualHubUI",
    ResetOnSpawn = false,
    ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
    IgnoreGuiInset = true,
    Parent = LocalPlayer:WaitForChild("PlayerGui")
})

local floatBtn = make("TextButton", {
    Size = UDim2.fromOffset(52, 52),
    Position = UDim2.fromOffset(15, 120),
    BackgroundColor3 = CONFIG.UI_BG,
    BorderSizePixel = 0,
    Text = "✦",
    TextColor3 = CONFIG.UI_ACCENT,
    TextSize = 24,
    Font = Enum.Font.GothamBold,
    AutoButtonColor = false,
    Parent = gui
})
corner(floatBtn, 26)
stroke(floatBtn, CONFIG.UI_ACCENT, 1.5, 0.2)

local PANEL_W, PANEL_H = 240, 280

local panel = make("Frame", {
    Size = UDim2.fromOffset(0, 0),
    Position = UDim2.new(0.5, -PANEL_W/2, 0.5, -PANEL_H/2),
    BackgroundColor3 = CONFIG.UI_BG,
    BorderSizePixel = 0,
    ClipsDescendants = true,
    Visible = false,
    Parent = gui
})
corner(panel, 14)
stroke(panel, CONFIG.UI_ACCENT, 1, 0.2)

local header = make("Frame", {
    Size = UDim2.new(1, 0, 0, 44),
    BackgroundColor3 = CONFIG.UI_CARD,
    BorderSizePixel = 0,
    Parent = panel
})
corner(header, 14)
make("Frame", {
    Size = UDim2.new(1, 0, 0, 14),
    Position = UDim2.new(0, 0, 1, -14),
    BackgroundColor3 = CONFIG.UI_CARD,
    BorderSizePixel = 0,
    Parent = header
})

make("TextLabel", {
    Size = UDim2.new(1, -16, 1, 0),
    Position = UDim2.new(0, 16, 0, 0),
    BackgroundTransparency = 1,
    Text = "VISUAL HUB",
    TextColor3 = CONFIG.UI_ACCENT,
    TextSize = 14,
    Font = Enum.Font.GothamBold,
    TextXAlignment = Enum.TextXAlignment.Left,
    Parent = header
})

local closeBtn = make("TextButton", {
    Size = UDim2.fromOffset(28, 28),
    Position = UDim2.new(1, -34, 0.5, -14),
    BackgroundColor3 = CONFIG.UI_CARD,
    BorderSizePixel = 0,
    Text = "X",
    TextColor3 = CONFIG.UI_TEXT_DIM,
    TextSize = 18,
    Font = Enum.Font.GothamBold,
    AutoButtonColor = false,
    Parent = header
})
corner(closeBtn, 7)

local content = make("ScrollingFrame", {
    Size = UDim2.new(1, -20, 1, -56),
    Position = UDim2.new(0, 10, 0, 48),
    BackgroundTransparency = 1,
    BorderSizePixel = 0,
    ScrollBarThickness = 3,
    ScrollBarImageColor3 = CONFIG.UI_ACCENT,
    CanvasSize = UDim2.new(0, 0, 0, 0),
    Parent = panel
})
make("UIListLayout", {
    Padding = UDim.new(0, 8),
    SortOrder = Enum.SortOrder.LayoutOrder,
    Parent = content
})

local function makeToggle(text, default, callback)
    local value = default or false
    local row = make("Frame", {
        Size = UDim2.new(1, 0, 0, 42),
        BackgroundColor3 = CONFIG.UI_CARD,
        BorderSizePixel = 0,
        Parent = content
    })
    corner(row, 10)
    stroke(row, CONFIG.UI_ACCENT, 1, 0.6)
    make("TextLabel", {
        Size = UDim2.new(1, -70, 1, 0),
        Position = UDim2.new(0, 14, 0, 0),
        BackgroundTransparency = 1,
        Text = text,
        TextColor3 = CONFIG.UI_TEXT,
        TextSize = 12,
        Font = Enum.Font.Gotham,
        TextXAlignment = Enum.TextXAlignment.Left,
        Parent = row
    })
    local sw = make("Frame", {
        Size = UDim2.fromOffset(42, 22),
        Position = UDim2.new(1, -54, 0.5, -11),
        BackgroundColor3 = value and CONFIG.UI_ACCENT or Color3.fromRGB(40, 50, 70),
        BorderSizePixel = 0,
        Parent = row
    })
    corner(sw, 11)
    local knob = make("Frame", {
        Size = UDim2.fromOffset(16, 16),
        Position = value and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8),
        BackgroundColor3 = Color3.fromRGB(235, 240, 250),
        BorderSizePixel = 0,
        Parent = sw
    })
    corner(knob, 8)
    local btn = make("TextButton", {
        Size = UDim2.new(1, 0, 1, 0),
        BackgroundTransparency = 1,
        Text = "",
        Parent = row
    })
    local function set(v)
        value = v
        tw(sw, 0.22, {BackgroundColor3 = v and CONFIG.UI_ACCENT or Color3.fromRGB(40, 50, 70)})
        tw(knob, 0.22, {
            Position = v and UDim2.new(1, -19, 0.5, -8) or UDim2.new(0, 3, 0.5, -8)
        }, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
        if callback then callback(v) end
    end
    btn.MouseButton1Click:Connect(function() set(not value) end)
    return {Set = set, Get = function() return value end}
end

makeToggle("Headless", false, function(v) Visual:toggleHeadless() end)
makeToggle("Poisoned Horns", false, function(v) Visual:toggleHorns() end)
makeToggle("Sharingan", false, function(v) Visual:toggleSharingan() end)
makeToggle("Amaterasu Glove", false, function(v) Visual:toggleAmaterasu() end)

local isOpen = false
local function setOpen(v)
    isOpen = v
    if v then
        panel.Visible = true
        panel.Size = UDim2.fromOffset(0, 0)
        tw(panel, 0.35, {Size = UDim2.fromOffset(PANEL_W, PANEL_H)}, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
        tw(floatBtn, 0.25, {TextColor3 = Color3.fromRGB(255, 255, 255), Rotation = 90})
    else
        tw(panel, 0.22, {Size = UDim2.fromOffset(0, 0)}, Enum.EasingStyle.Quart, Enum.EasingDirection.In)
        task.delay(0.22, function() if not isOpen then panel.Visible = false end end)
        tw(floatBtn, 0.25, {TextColor3 = CONFIG.UI_ACCENT, Rotation = 0})
    end
end

floatBtn.MouseButton1Click:Connect(function() setOpen(not isOpen) end)
closeBtn.MouseButton1Click:Connect(function() setOpen(false) end)

local drag = false
local dragStart, startPos
header.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then
        drag = true; dragStart = input.Position; startPos = panel.Position
    end
end)
UserInputService.InputChanged:Connect(function(input)
    if drag and (input.UserInputType == Enum.UserInputType.MouseMovement
        or input.UserInputType == Enum.UserInputType.Touch) then
        local d = input.Position - dragStart
        panel.Position = UDim2.new(
            startPos.X.Scale, startPos.X.Offset + d.X,
            startPos.Y.Scale, startPos.Y.Offset + d.Y
        )
    end
end)
UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then drag = false end
end)

local dragF = false
local dragStartF, startPosF
floatBtn.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then
        dragF = true; dragStartF = input.Position; startPosF = floatBtn.Position
    end
end)
UserInputService.InputChanged:Connect(function(input)
    if dragF and (input.UserInputType == Enum.UserInputType.MouseMovement
        or input.UserInputType == Enum.UserInputType.Touch) then
        local d = input.Position - dragStartF
        if d.Magnitude > 5 then
            floatBtn.Position = UDim2.new(
                startPosF.X.Scale, startPosF.X.Offset + d.X,
                startPosF.Y.Scale, startPosF.Y.Offset + d.Y
            )
        end
    end
end)
UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then dragF = false end
end)

UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end
    if input.KeyCode == Enum.KeyCode.RightShift then Visual:toggleHeadless()
    elseif input.KeyCode == Enum.KeyCode.RightControl then Visual:toggleHorns()
    elseif input.KeyCode == Enum.KeyCode.RightAlt then Visual:toggleSharingan()
    elseif input.KeyCode == Enum.KeyCode.Insert then Visual:toggleAmaterasu()
    end
end)

print("[Visual Hub] Loaded. Klik tombol buat buka menu.")`;
