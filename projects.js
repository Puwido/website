// ============================================================
//  EDIT THIS FILE to change your projects and skills.
//
//  Project media (all optional):
//    video  -> path to an .mp4 (e.g. "assets/videos/plastering.mp4")
//    image  -> path to a thumbnail (e.g. "assets/games/plastering.png")
//  If neither file exists the card shows a colored placeholder.
//  "genre" is also used for the filter buttons above the projects.
// ============================================================

const projects = [
  {
    title: "Plastering Simulator",
    description: "Start as an apprentice with a putty knife and work your way up to Drywall God — patch holes, hang sheets and grow your crew.",
    genre: "Simulator",
    subgenre: "Job Simulator",
    tags: ["Progression", "Tools", "Economy"],
    image: "assets/games/plastering.png",
    link: "https://www.roblox.com/games/113888195336749/Plastering-Simulator"
  },
  {
    title: "+1 Balloon Simulator",
    description: "Float higher with every balloon, explore sky islands from Storm to Space and collect stickers along the way.",
    genre: "Simulator",
    subgenre: "Incremental",
    tags: ["Pets", "Worlds", "Collectibles"],
    image: "assets/games/balloon.png",
    link: "https://www.roblox.com/games/116529813860519/1-Balloon-Simulator"
  },
  {
    title: "Steal a Robloxian",
    description: "Collect Robloxians, protect your base and steal from other players to build the best collection.",
    genre: "Simulator",
    subgenre: "Tycoon",
    tags: ["Bases", "Stealing", "Collection"],
    image: "assets/games/steal-a-robloxian.png",
    link: "https://www.roblox.com/games/73306289955564/Steal-a-Robloxian"
  },
  {
    title: "Podcast Studio",
    description: "A fully built podcast set showcase — lighting, props and seating ready for recording sessions.",
    genre: "Showcase",
    subgenre: "Environment",
    tags: ["Building", "Lighting", "Animations"],
    image: "assets/games/podcast.png",
    link: "https://www.roblox.com/games/93881809161246/Podcast-Studio"
  },
  {
    title: "Australian Defence Force Academy",
    description: "Military training and roleplay experience with combat systems for cadets and officers.",
    genre: "Combat",
    subgenre: "Military",
    tags: ["Weapons", "Ranks", "Roleplay"],
    image: "",
    link: "https://www.roblox.com/games/13077047498/Australian-Defence-Force-Academy"
  },
  {
    title: "Mike's Kingdom: The Game",
    description: "Open world action in Mike's Kingdom — border guards, crabs and plenty of chaos.",
    genre: "Combat",
    subgenre: "Open World Action",
    tags: ["Combat", "Roleplay", "Open World"],
    image: "assets/games/mikes-kingdom.png",
    link: "https://www.roblox.com/games/18318005154/mikes-kingdom-the-game"
  }
];

// Script/system videos for the Showcase section. Put the .mp4 in assets/showcase/
// and add an entry like this:
//   { title: "Combat System", bio: "What it does and how it works.", video: "assets/showcase/combat.mp4" },
// Wrap words in **double stars** in a bio to make them bold.
const showcase = [
  {
    title: "Anti Gooner/NSFW System",
    bio: `This system detects and prevents inappropriate behavior in your experience. It stops exploiters from using the jerk tool and the bang script/command, and prevents players from robanging.
It uses a three-strike enforcement policy:

1. First offense: Warning
2. Second offense: Kick from the server
3. Third offense: Ban

All bans go through the Roblox Ban API. You can view and manage them on your experience’s Moderation page in the Creator Hub.`,
    video: "assets/showcase/anti-nsfw-system.mp4"
  },
  {
    title: "Anti Ageplayer System",
    bio: "This system detects players wearing baby-style avatars and permanently bans them from your game. Every ban is issued through the Roblox Ban API, so you can review and manage them from your experience’s Moderation page in the Creator Hub.",
    video: "assets/showcase/anti-ageplayer-system.mp4"
  },
  {
    title: "Anti-Injection System",
    bio: `Detects unauthorized UIs added to a player’s PlayerGui and punishes offenders automatically with a three-strike system. Each player’s game client scans their PlayerGui 40 seconds after they join, then every 10 minutes, and flags any UI that the game didn’t create.

**Strikes**
• First offense: kick
• Second offense: 3 day ban
• Third offense: permanent ban

Strikes are saved per account and carry across servers. Bans use Roblox’s official ban API. Detection applies to everyone and only the player who triggered it is punished.

**Admin Panel**
A compact, draggable panel that only admins receive, with every action checked on the server.

• Logs: see each detection’s time, player, UI name and punishment
• Players: view or teleport to anyone in the server
• Bans: ban or unban by username or UserId, with lengths from 1 day to permanent. Unbanning also clears the player’s strikes.

**Limitations**
This system only sees PlayerGui, so it won’t detect UIs placed in CoreGui or hidden containers, and it won’t catch a UI added and removed between scans.`,
    video: "assets/showcase/anti-injection-system.mp4"
  }
];

const skills = [
  { icon: "fa-code",          title: "Game Systems",   text: "Combat, rounds, inventories, shops, quests — built modular and reusable." },
  { icon: "fa-database",      title: "Data Saving",    text: "Safe DataStore handling with session locking, retries and versioning." },
  { icon: "fa-shield-halved", title: "Security",       text: "Server-authoritative logic and remote validation to stop exploiters." },
  { icon: "fa-window-maximize", title: "UI Scripting", text: "Smooth tweened menus, HUDs and shops that work on PC, mobile and console." },
  { icon: "fa-robot",         title: "NPC / AI",       text: "Pathfinding enemies, state machines and boss fights." }
];
