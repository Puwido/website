// ============================================================
//  Settings
// ============================================================

// Optional background videos for the hero. Put .mp4 files in assets/hero/
// and list them here, e.g. ["assets/hero/clip1.mp4", "assets/hero/clip2.mp4"].
// Leave empty to use the animated code background instead.
const heroVideos = [];

// Lines that type out under the hero title
const typedLines = [
    "Full-Stack Roblox Scripter",
    "Luau • OOP • DataStores • UI",
    "Combat Systems & Game Frameworks",
    "Secure. Optimized. Clean."
];

// Luau snippets shown in the scrolling code panel
const luauSnippets = [
`local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TextService = game:GetService("TextService")

local BanService = require(script.Parent:WaitForChild("BanService"))

local MAX_KEYWORDS = 100
local MAX_REASON_LENGTH = 300
local MAX_BAN_DAYS = 36500

local remote = Instance.new("RemoteFunction")
remote.Name = "AdminPanelRemote"
remote.Parent = ReplicatedStorage

local function reply(ok, msg, data)
	return { ok = ok, msg = msg, data = data }
end

local function trim(s)
	return string.match(s, "^%s*(.-)%s*$")
end

-- Accepts a UserId (number or digits) or a username; returns userId, name
local function resolveUser(target)
	if type(target) == "string" then
		target = trim(target)
		local asNumber = tonumber(target)
		if not asNumber then
			local ok, userId = pcall(Players.GetUserIdFromNameAsync, Players, target)
			if not ok or not userId then
				return nil
			end
			target = userId
		else
			target = asNumber
		end
	end
	if type(target) ~= "number" or target ~= math.floor(target) or target <= 0 then
		return nil`,
`local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local MessagingService = game:GetService("MessagingService")

local CONFIG = {
	-- UserIds that can open the admin panel.
	Admins = {
		[171575142] = true, -- Puwido
	},
	-- Optional: everyone in this group at or above AdminMinRank is an admin too.
	AdminGroupId = 0,
	AdminMinRank = 255,
	-- Admins are never auto-banned for what they wear.
	AdminsAreExempt = true,

	-- Ban from every place in this experience, not just this one.
	ApplyToUniverse = true,
	-- Also ban the player's alt accounts.
	BanAltAccounts = true,
	DisplayReason = "Your avatar is wearing an item that isn't allowed in this game.",

	-- Starting values for the settings admins can change from the panel.
	DefaultSettings = {
		AutoBanEnabled = true,
		Action = "Ban", -- "Ban" or "Kick"
		BanDays = 0, -- 0 = permanent
		ExtraKeywords = {}, -- extra words to block in item names
	},
}

local STORE_NAME = "BabyAccessoryBan"
local SETTINGS_TOPIC = "BabyAccessoryBanSettings"
local MAX_LOG_ENTRIES = 500

local BanService = {}
BanService.Config = CONFIG
-- Fires when settings change, from this server or another one
BanService.SettingsChanged = Instance.new("BindableEvent")

local store
do
	local ok, result = pcall(DataStoreService.GetDataStore, DataStoreService, STORE_NAME)
	if ok then
		store = result
	else
		warn("[BanService] DataStore unavailable, bans and settings won't be saved:", result)
	end
end`,
`local Players = game:GetService("Players")
local GroupService = game:GetService("GroupService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage.Shared.Config)
local Remotes = ReplicatedStorage:WaitForChild("Remotes")

local action = Remotes:FindFirstChild("GroupAction") or Instance.new("RemoteFunction")
action.Name = "GroupAction"
action.Parent = Remotes

local lastCheck = {}

-- fresh: ask the web (Player:IsInGroup is cached for the session, so it misses someone who just joined)
local function check(player, fresh)
	local ok, member = pcall(function()
		if not fresh then return player:IsInGroup(Config.Group.Id) end
		for _, g in ipairs(GroupService:GetGroupsAsync(player.UserId)) do
			if g.Id == Config.Group.Id then return true end
		end
		return false
	end)
	if not ok then return player:GetAttribute("GroupBoost") == true end
	if player.Parent then player:SetAttribute("GroupBoost", member or nil) end
	return member
end`
];

// ============================================================
//  Navigation
// ============================================================
const nav = document.getElementById('nav');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

function toggleMenu(forceClose = false) {
    const open = forceClose ? false : !navLinks.classList.contains('nav-active');
    navLinks.classList.toggle('nav-active', open);
    burger.classList.toggle('toggle', open);
    navItems.forEach((li, i) => {
        li.style.animation = open ? `navLinkFade 0.5s ease forwards ${i / 7 + 0.3}s` : '';
    });
}

burger.addEventListener('click', () => toggleMenu());
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => toggleMenu(true)));

// Highlight the nav link for the section on screen
const sections = document.querySelectorAll('section[id]');
function onScroll() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    let current = 'home';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', onScroll, { passive: true });

// ============================================================
//  Typing effect
// ============================================================
function startTyping() {
    const el = document.getElementById('typed');
    let line = 0, char = 0, deleting = false;

    function tick() {
        const text = typedLines[line];
        char += deleting ? -1 : 1;
        el.textContent = text.slice(0, char);

        let delay = deleting ? 35 : 70;
        if (!deleting && char === text.length) { deleting = true; delay = 1800; }
        else if (deleting && char === 0) { deleting = false; line = (line + 1) % typedLines.length; delay = 400; }
        setTimeout(tick, delay);
    }
    tick();
}

// ============================================================
//  Hero background: videos (optional) or animated code rain
// ============================================================
function startHeroVideos() {
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-overlay');
    let index = 0;

    video.classList.add('has-video');
    video.src = heroVideos[0];

    video.addEventListener('timeupdate', () => {
        if (video.duration - video.currentTime < 1.6 && !overlay.classList.contains('active')) {
            overlay.classList.add('active');
            setTimeout(() => {
                index = (index + 1) % heroVideos.length;
                video.src = heroVideos[index];
                video.play();
                setTimeout(() => overlay.classList.remove('active'), 200);
            }, 1500);
        }
    });
}

// "Roblox hacker" live wallpaper: cycles code rain, a hex scanner and a neon grid,
// with a glitching Roblox logo and terminal readout on top
function startHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const GLYPHS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]()<>=+-*/#$%&@local end nil'.split('');
    const TERMINAL_LINES = [
        '> connecting to game server...',
        '> bypassing replication filter... DENIED',
        '> loading Luau VM ........ OK',
        '> require(BanService) ... OK',
        '> scanning workspace: 4,812 instances',
        '> RemoteEvent:FireServer() validated',
        '> exploit attempt blocked [anti-cheat]',
        '> DataStore sync ......... OK',
        '> ACCESS GRANTED: Puwido'
    ];
    const FONT_SIZE = 16;

    let w, h, columns, drops, terminal, frame = 0;

    function resize() {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        columns = Math.ceil(w / FONT_SIZE);
        drops = Array.from({ length: columns }, () => ({
            y: Math.random() * -h / FONT_SIZE,
            speed: 0.25 + Math.random() * 0.55
        }));
        terminal = terminal || { lines: [], current: 0, chars: 0, wait: 0 };
        ctx.fillStyle = '#12091a';
        ctx.fillRect(0, 0, w, h);
    }

    function drawRain() {
        // Translucent fill leaves fading trails behind each column
        ctx.fillStyle = 'rgba(18, 9, 26, 0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

        drops.forEach((d, i) => {
            const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            const x = i * FONT_SIZE;
            const y = Math.floor(d.y) * FONT_SIZE;
            // Bright head, dimmer body
            ctx.fillStyle = Math.random() < 0.08 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 77, 196, 0.55)';
            ctx.fillText(ch, x, y);
            d.y += d.speed;
            if (y > h && Math.random() > 0.975) d.y = 0;
        });
    }

    // Tilted Roblox-style logo outline that pulses and occasionally glitches
    function drawLogo() {
        const size = Math.min(w, h) * 0.32;
        const glitch = Math.random() < 0.04;
        const pulse = 0.12 + Math.sin(frame / 40) * 0.05;

        ctx.save();
        ctx.translate(w / 2 + (glitch ? (Math.random() - 0.5) * 30 : 0), h / 2);
        ctx.rotate(15 * Math.PI / 180);
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;

        const passes = glitch
            ? [['rgba(255, 46, 147, 0.6)', -6], ['rgba(0, 242, 254, 0.5)', 6]]
            : [[`rgba(255, 77, 196, ${pulse})`, 0]];
        passes.forEach(([color, offset]) => {
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.strokeRect(-size / 2 + offset, -size / 2, size, size);
            ctx.strokeRect(-size / 7 + offset, -size / 7, size * 2 / 7, size * 2 / 7);
        });
        ctx.restore();
    }

    // Lines typing out in the bottom-left corner like a terminal
    function drawTerminal() {
        const t = terminal;
        if (t.wait > 0) t.wait--;
        else {
            const line = TERMINAL_LINES[t.current];
            t.chars++;
            if (t.chars > line.length) {
                t.lines.push(line);
                if (t.lines.length > 5) t.lines.shift();
                t.current = (t.current + 1) % TERMINAL_LINES.length;
                t.chars = 0;
                t.wait = 40;
            }
        }

        const x = 24, lineH = 18;
        const shown = [...t.lines, TERMINAL_LINES[t.current].slice(0, t.chars) + (frame % 30 < 15 ? '_' : '')];
        const top = h - 110 - shown.length * lineH;
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(18, 9, 26, 0.7)';
        ctx.fillRect(x - 10, top - 18, 380, shown.length * lineH + 16);
        shown.forEach((line, i) => {
            ctx.fillStyle = line.includes('DENIED') || line.includes('blocked') ? 'rgba(255, 90, 90, 0.9)'
                : line.includes('GRANTED') ? 'rgba(181, 108, 255, 1)' : 'rgba(255, 150, 215, 0.8)';
            ctx.fillText(line, x, top + i * lineH);
        });
    }

    // Scene 2: wall of hex/Luau dump scrolling up with a scanner bar sweeping down
    const HEX_WORDS = ['0x7F3A', 'FireServer', 'Humanoid', 'UserId', 'CFrame', '0xDEAD', 'pcall', 'Remote',
                       '0xBEEF', 'DataStore', 'Players', 'ACCESS', '0x1337', 'Instance', 'require', 'nil'];
    let hexRows, hexOffset, scanY;

    function initHex() {
        const rowCount = Math.ceil(h / 18) + 2;
        hexRows = Array.from({ length: rowCount }, makeHexRow);
        hexOffset = 0;
        scanY = 0;
    }

    function makeHexRow() {
        let row = '';
        while (row.length < w / 7) {
            row += Math.random() < 0.6
                ? Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0') + ' '
                : HEX_WORDS[Math.floor(Math.random() * HEX_WORDS.length)] + ' ';
        }
        return { text: row, flagged: Math.random() < 0.06 };
    }

    function drawHex() {
        ctx.fillStyle = '#12091a';
        ctx.fillRect(0, 0, w, h);
        ctx.font = '13px "JetBrains Mono", monospace';

        hexOffset += 0.6;
        if (hexOffset >= 18) { hexOffset -= 18; hexRows.shift(); hexRows.push(makeHexRow()); }
        scanY = (scanY + 3) % (h + 120);

        hexRows.forEach((row, i) => {
            const y = i * 18 - hexOffset;
            const nearScan = Math.abs(y - scanY) < 50;
            ctx.fillStyle = row.flagged ? 'rgba(181, 108, 255, 0.55)'
                : nearScan ? 'rgba(255, 150, 215, 0.6)' : 'rgba(255, 77, 196, 0.18)';
            ctx.fillText(row.text, 8, y);
            if (row.flagged && nearScan) {
                ctx.fillStyle = 'rgba(255, 90, 90, 0.9)';
                ctx.fillText('  << PLAYER FLAGGED', w - 210, y);
            }
        });

        const bar = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 4);
        bar.addColorStop(0, 'rgba(255, 77, 196, 0)');
        bar.addColorStop(1, 'rgba(255, 77, 196, 0.25)');
        ctx.fillStyle = bar;
        ctx.fillRect(0, scanY - 60, w, 64);
        ctx.fillStyle = 'rgba(255, 77, 196, 0.8)';
        ctx.fillRect(0, scanY + 3, w, 2);
    }

    // Scene 3: neon perspective grid with Roblox logos drifting up
    let gridShift, floaters;

    function initGrid() {
        gridShift = 0;
        floaters = Array.from({ length: 14 }, () => makeFloater(true));
    }

    function makeFloater(randomY) {
        return {
            x: Math.random() * w,
            y: randomY ? Math.random() * h : h + 40,
            size: 14 + Math.random() * 36,
            speed: 0.3 + Math.random() * 0.8,
            angle: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.02
        };
    }

    function drawGrid() {
        ctx.fillStyle = '#12091a';
        ctx.fillRect(0, 0, w, h);
        const horizon = h * 0.55;

        // Glow at the horizon
        const glow = ctx.createLinearGradient(0, horizon - 120, 0, horizon);
        glow.addColorStop(0, 'rgba(181, 108, 255, 0)');
        glow.addColorStop(1, 'rgba(255, 77, 196, 0.25)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, horizon - 120, w, 120);

        ctx.strokeStyle = 'rgba(255, 77, 196, 0.35)';
        ctx.lineWidth = 1;
        // Vertical lines fanning out from the vanishing point
        for (let i = -20; i <= 20; i++) {
            ctx.beginPath();
            ctx.moveTo(w / 2 + i * 12, horizon);
            ctx.lineTo(w / 2 + i * w / 8, h);
            ctx.stroke();
        }
        // Horizontal lines moving toward the viewer
        gridShift = (gridShift + 0.01) % 1;
        for (let i = 0; i < 14; i++) {
            const t = (i + gridShift) / 14;
            const y = horizon + (h - horizon) * t * t;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        floaters.forEach((f, i) => {
            f.y -= f.speed;
            f.angle += f.spin;
            if (f.y < -60) floaters[i] = makeFloater(false);
            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            ctx.strokeStyle = 'rgba(255, 150, 215, 0.35)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-f.size / 2, -f.size / 2, f.size, f.size);
            ctx.strokeRect(-f.size / 7, -f.size / 7, f.size * 2 / 7, f.size * 2 / 7);
            ctx.restore();
        });
    }

    // Scene 4: radar sweep picking up players
    const PLAYER_NAMES = ['Builderman', 'Noob_2016', 'xXSlayerXx', 'Guest_1337', 'ExploiterBob', 'CoolKid99', 'Admin?', 'BaconHair'];
    let blips, sweep;

    function initRadar() {
        sweep = 0;
        blips = PLAYER_NAMES.map(name => ({
            name,
            angle: Math.random() * Math.PI * 2,
            dist: 0.25 + Math.random() * 0.7,
            seen: 0,
            hostile: Math.random() < 0.3
        }));
    }

    function drawRadar() {
        ctx.fillStyle = 'rgba(18, 9, 26, 0.25)';
        ctx.fillRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.45;

        ctx.strokeStyle = 'rgba(255, 77, 196, 0.25)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, r * i / 4, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
        ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
        ctx.stroke();

        // Sweeping beam
        sweep = (sweep + 0.02) % (Math.PI * 2);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweep);
        const beam = ctx.createLinearGradient(0, 0, r, 0);
        beam.addColorStop(0, 'rgba(255, 77, 196, 0.5)');
        beam.addColorStop(1, 'rgba(255, 77, 196, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, -0.25, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.font = '12px "JetBrains Mono", monospace';
        blips.forEach(b => {
            // Light the blip up when the beam passes over it
            const diff = (sweep - b.angle + Math.PI * 4) % (Math.PI * 2);
            if (diff < 0.05) b.seen = 1;
            b.seen = Math.max(0, b.seen - 0.006);
            if (b.seen <= 0) return;

            const x = cx + Math.cos(b.angle) * r * b.dist;
            const y = cy + Math.sin(b.angle) * r * b.dist;
            const color = b.hostile ? `rgba(255, 90, 90, ${b.seen})` : `rgba(255, 150, 215, ${b.seen})`;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText(b.hostile ? `${b.name} [EXPLOIT]` : b.name, x + 8, y - 6);
        });
    }

    // Scene 5: server network with data packets travelling between nodes
    let nodes, links, packets;

    function initNetwork() {
        nodes = Array.from({ length: 16 }, (_, i) => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            label: i % 4 === 0 ? `SERVER-${String(i).padStart(2, '0')}` : ''
        }));
        links = [];
        nodes.forEach((n, i) => {
            const nearest = nodes
                .map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
                .filter(o => o.j !== i)
                .sort((a, b) => a.d - b.d)
                .slice(0, 2);
            nearest.forEach(o => links.push([i, o.j]));
        });
        packets = [];
    }

    function drawNetwork() {
        ctx.fillStyle = '#12091a';
        ctx.fillRect(0, 0, w, h);

        nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        });

        ctx.strokeStyle = 'rgba(181, 108, 255, 0.3)';
        ctx.lineWidth = 1;
        links.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
        });

        if (Math.random() < 0.15) {
            packets.push({ link: links[Math.floor(Math.random() * links.length)], t: 0, bad: Math.random() < 0.15 });
        }
        packets = packets.filter(p => (p.t += 0.012) < 1);
        packets.forEach(p => {
            const [a, b] = p.link;
            const x = nodes[a].x + (nodes[b].x - nodes[a].x) * p.t;
            const y = nodes[a].y + (nodes[b].y - nodes[a].y) * p.t;
            ctx.fillStyle = p.bad ? 'rgba(255, 90, 90, 0.95)' : 'rgba(255, 150, 215, 0.95)';
            ctx.fillRect(x - 2, y - 2, 4, 4);
        });

        ctx.font = '11px "JetBrains Mono", monospace';
        nodes.forEach(n => {
            ctx.fillStyle = 'rgba(255, 77, 196, 0.8)';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.label ? 5 : 3, 0, Math.PI * 2);
            ctx.fill();
            if (n.label) {
                ctx.fillStyle = 'rgba(255, 150, 215, 0.6)';
                ctx.fillText(n.label, n.x + 9, n.y + 4);
            }
        });
    }

    // Scene 6: blocky R6 avatar made of binary, being scanned and glitching
    const AVATAR_PARTS = [
        // [x, y, width, height] in avatar units, origin at the top-centre
        [-0.6, 0, 1.2, 1.2],   // head
        [-1, 1.3, 2, 2],       // torso
        [-2.05, 1.3, 0.95, 2], // left arm
        [1.1, 1.3, 0.95, 2],   // right arm
        [-1, 3.4, 0.95, 2],    // left leg
        [0.05, 3.4, 0.95, 2]   // right leg
    ];
    let avatarScan;

    function initAvatar() { avatarScan = 0; }

    function drawAvatar() {
        ctx.fillStyle = '#12091a';
        ctx.fillRect(0, 0, w, h);

        const unit = h * 0.11;
        const ox = w > 900 ? w * 0.8 : w / 2;
        const oy = h / 2 - unit * 2.4;
        const cell = 11;
        avatarScan = (avatarScan + 2) % (unit * 5.4 + 80);
        const scanY = oy - 40 + avatarScan;

        ctx.font = '11px "JetBrains Mono", monospace';
        AVATAR_PARTS.forEach(([px, py, pw, ph]) => {
            const x0 = ox + px * unit, y0 = oy + py * unit;
            for (let y = y0; y < y0 + ph * unit; y += cell) {
                // Rows sometimes slide sideways to fake a glitch
                const shift = Math.random() < 0.02 ? (Math.random() - 0.5) * 40 : 0;
                const lit = Math.abs(y - scanY) < 30;
                ctx.fillStyle = lit ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 77, 196, 0.4)';
                for (let x = x0; x < x0 + pw * unit; x += cell * 0.8) {
                    ctx.fillText(Math.random() < 0.5 ? '0' : '1', x + shift, y);
                }
            }
            ctx.strokeStyle = 'rgba(255, 150, 215, 0.5)';
            ctx.strokeRect(x0 - 4, y0 - 12, pw * unit + 4, ph * unit + 4);
        });

        ctx.fillStyle = 'rgba(255, 77, 196, 0.7)';
        ctx.fillRect(ox - unit * 2.4, scanY, unit * 4.8, 2);

        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(181, 108, 255, 0.9)';
        ctx.fillText('SCANNING AVATAR...', ox - unit * 2.2, oy - 30);
        ctx.fillText(`USER: Puwido  ID: 171575142`, ox - unit * 2.2, oy + unit * 5.6 + 10);
    }

    // Scenes swap every SCENE_SECONDS with a quick fade
    const SCENE_SECONDS = 12;
    const scenes = [
        { init: () => {}, draw: () => { drawRain(); drawLogo(); } },
        { init: initHex, draw: () => { drawHex(); drawLogo(); } },
        { init: initGrid, draw: () => { drawGrid(); drawLogo(); } },
        { init: initRadar, draw: drawRadar },
        { init: initNetwork, draw: drawNetwork },
        { init: initAvatar, draw: drawAvatar }
    ];
    let sceneIndex = 0;

    canvas.style.transition = 'opacity 0.8s ease';

    function nextScene() {
        canvas.style.opacity = '0';
        setTimeout(() => {
            sceneIndex = (sceneIndex + 1) % scenes.length;
            ctx.fillStyle = '#12091a';
            ctx.fillRect(0, 0, w, h);
            scenes[sceneIndex].init();
            canvas.style.opacity = '1';
        }, 800);
    }

    function draw() {
        frame++;
        scenes[sceneIndex].draw();
        if (w > 700) drawTerminal();
        requestAnimationFrame(draw);
    }

    resize();
    initHex();
    initGrid();
    window.addEventListener('resize', () => { resize(); scenes[sceneIndex].init(); });
    if (reducedMotion) { drawRain(); drawLogo(); }
    else { draw(); setInterval(nextScene, SCENE_SECONDS * 1000); }
}

// ============================================================
//  Luau syntax highlighting for the code panel
// ============================================================
const LUAU_KEYWORDS = new Set(['local', 'function', 'end', 'return', 'if', 'then', 'else', 'elseif',
    'for', 'in', 'do', 'while', 'repeat', 'until', 'not', 'and', 'or', 'nil', 'true', 'false', 'break', 'continue']);

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightLuau(code) {
    const pattern = /(--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/gm;
    let out = '', last = 0, m;
    while ((m = pattern.exec(code))) {
        out += escapeHtml(code.slice(last, m.index));
        const text = escapeHtml(m[0]);
        if (m[1]) out += `<span class="tok-com">${text}</span>`;
        else if (m[2]) out += `<span class="tok-str">${text}</span>`;
        else if (m[3]) out += `<span class="tok-num">${text}</span>`;
        else if (m[4]) out += LUAU_KEYWORDS.has(m[4]) ? `<span class="tok-kw">${text}</span>` : `<span class="tok-fn">${text}</span>`;
        else if (LUAU_KEYWORDS.has(m[5])) out += `<span class="tok-kw">${text}</span>`;
        else if (/Service$|^game$|^workspace$/.test(m[5])) out += `<span class="tok-svc">${text}</span>`;
        else out += text;
        last = pattern.lastIndex;
    }
    return out + escapeHtml(code.slice(last));
}

function renderCodePanel() {
    const box = document.getElementById('codeContent');
    const html = luauSnippets.map(s => `<div class="code-snippet">${highlightLuau(s)}</div>`).join('');
    // Rendered twice so the -50% scroll animation loops seamlessly
    box.innerHTML = html + html;
}

// ============================================================
//  Skills & projects
// ============================================================
function renderSkills() {
    document.getElementById('skillsGrid').innerHTML = skills.map(s => `
        <div class="skill-card reveal">
            <div class="skill-icon"><i class="fas ${s.icon}"></i></div>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
        </div>`).join('');
}

const PLACEHOLDER_GRADIENTS = [
    'linear-gradient(135deg, #ff4dc4, #b56cff)',
    'linear-gradient(135deg, #ff4466, #a855f7)',
    'linear-gradient(135deg, #22c55e, #0ea5e9)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)'
];

// Shows the video if it exists, else the image, else a gradient placeholder
function buildMedia(container, project, index) {
    const showPlaceholder = () => {
        const initials = project.title.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
        container.innerHTML = `<div class="placeholder-art" style="background:${PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]}">${initials}</div>`;
    };
    const showImage = () => {
        if (!project.image) return showPlaceholder();
        const img = new Image();
        img.alt = project.title;
        img.onload = () => { container.innerHTML = ''; container.appendChild(img); };
        img.onerror = showPlaceholder;
        img.src = project.image;
    };

    if (!project.video) return showImage();
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.loop = true;
    video.onloadeddata = () => {
        container.innerHTML = '';
        container.appendChild(video);
        container.closest('.project-card').classList.add('has-video');
    };
    video.onerror = showImage;
    video.src = `${project.video}#t=0.1`;
    // Preview plays on hover
    const card = container.closest('.project-card');
    card.addEventListener('mouseenter', () => video.isConnected && video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => video.isConnected && video.pause());
}

function renderProjects() {
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = '';

    projects.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'project-card reveal';
        card.dataset.genre = p.genre;
        card.innerHTML = `
            <div class="project-image">
                <div class="media"></div>
                ${p.video ? `<div class="overlay"><button class="play-btn">Watch Showcase <i class="fas fa-play"></i></button></div>` : ''}
            </div>
            <div class="project-info">
                <div class="project-title-row">
                    <h3>${p.title}</h3>
                    ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="roblox-link-btn" title="Play on Roblox">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.44 0L0 19.56 19.56 24 24 4.44 4.44 0zm8.57 8.57l6.42 1.72-1.72 6.42-6.42-1.72 1.72-6.42z"/></svg>
                    </a>` : ''}
                </div>
                <p>${p.description}</p>
                <div class="project-details">
                    <div class="detail-item"><span class="detail-label">Genre</span><span class="detail-value">${p.genre}</span></div>
                    <div class="detail-item"><span class="detail-label">Subgenre</span><span class="detail-value">${p.subgenre}</span></div>
                </div>
                <div class="project-tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
            </div>`;
        grid.appendChild(card);

        buildMedia(card.querySelector('.media'), p, i);
        const playBtn = card.querySelector('.play-btn');
        if (playBtn) playBtn.addEventListener('click', () => {
            if (card.classList.contains('has-video')) openVideo(p.video);
            else showToast('Showcase video coming soon!');
        });
    });

    const soon = document.createElement('div');
    soon.className = 'project-card coming-soon-card reveal';
    soon.innerHTML = `
        <div class="coming-soon-icon"><i class="fas fa-plus"></i></div>
        <h3>More Coming Soon</h3>
        <p>New projects are in the works. Stay tuned!</p>`;
    grid.appendChild(soon);

    renderFilters();
}

function renderFilters() {
    const genres = ['All', ...new Set(projects.map(p => p.genre))];
    const bar = document.getElementById('filterBar');
    bar.innerHTML = genres.map((g, i) => `<button class="filter-btn${i === 0 ? ' active' : ''}" data-genre="${g}">${g}</button>`).join('');

    bar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.project-card[data-genre]').forEach(card => {
            card.classList.toggle('hidden', btn.dataset.genre !== 'All' && card.dataset.genre !== btn.dataset.genre);
        });
    });
}

// ============================================================
//  Video modal
// ============================================================
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');

function openVideo(src) {
    modalVideo.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
}

function closeVideo() {
    modal.classList.remove('open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    document.body.style.overflow = '';
}

modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
document.querySelector('.close-modal').addEventListener('click', closeVideo);
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

// ============================================================
//  Misc: toast, discord copy, reveal on scroll
// ============================================================
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

document.getElementById('discordBtn').addEventListener('click', e => {
    const name = e.currentTarget.dataset.discord;
    navigator.clipboard?.writeText(name)
        .then(() => showToast(`Copied "${name}" to clipboard!`))
        .catch(() => showToast(`Discord: ${name}`));
});

function setupReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ============================================================
//  Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    if (heroVideos.length) startHeroVideos(); else startHeroCanvas();
    startTyping();
    renderCodePanel();
    renderSkills();
    renderProjects();
    setupReveal();
    onScroll();
});
