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
const showcase = [
];

const skills = [
  { icon: "fa-code",          title: "Game Systems",   text: "Combat, rounds, inventories, shops, quests — built modular and reusable." },
  { icon: "fa-database",      title: "Data Saving",    text: "Safe DataStore handling with session locking, retries and versioning." },
  { icon: "fa-shield-halved", title: "Security",       text: "Server-authoritative logic and remote validation to stop exploiters." },
  { icon: "fa-window-maximize", title: "UI Scripting", text: "Smooth tweened menus, HUDs and shops that work on PC, mobile and console." },
  { icon: "fa-robot",         title: "NPC / AI",       text: "Pathfinding enemies, state machines and boss fights." }
];
