export const email = "shaikfiroz090@gmail.com";
export type Project = {
  id: number;
  title: string;
  category: "Motion design" | "3D & Animation" | "Story concepts" | "Community";
  label: string;
  description: string;
  status: string;
  art: string;
  media?: string;
  url?: string;
};
export const projects: Project[] = [
  {
    id: 1,
    title: "The Road to Mercy",
    category: "Motion design",
    label: "CINEMATIC STORYTELLING",
    description:
      "A personal creative exploration of mercy and human connection through cinematic storytelling and motion graphics.",
    status: "Personal / Creative Project · Concept",
    art: "mercy",
  },
  {
    id: 2,
    title: "Sindbad & the Giant Bird",
    category: "3D & Animation",
    label: "3D ANIMATED FANTASY",
    description:
      "A personal fantasy story concept imagining Sindbad’s encounter with a giant bird through dimensional worlds and animation.",
    status: "Personal / Creative Project · Concept",
    art: "sindbad",
  },
  {
    id: 3,
    title: "Chrono’s End",
    category: "Story concepts",
    label: "SCI-FI / CYBERPUNK",
    description:
      "A sci-fi and cyberpunk story concept exploring time, atmosphere, and a speculative future.",
    status: "Personal / Creative Project · Concept",
    art: "chrono",
  },
  {
    id: 4,
    title: "The Weak — The Forgotten",
    category: "Story concepts",
    label: "CRIME / ACTION",
    description:
      "A personal crime-action animated series concept, ready for further narrative and visual development.",
    status: "Personal / Creative Project · Concept",
    art: "forgotten",
  },
  {
    id: 5,
    title: "The Rain That Remembers",
    category: "Story concepts",
    label: "ANIMATED SHORT STORY",
    description:
      "A personal animated short story concept exploring memory through the quiet language of rain.",
    status: "Personal / Creative Project · Concept",
    art: "rain",
  },
  {
    id: 6,
    title: "Shadow Breaker — The First Clash",
    category: "3D & Animation",
    label: "ACTION ANIMATION",
    description:
      "An action animation concept built around the idea of a first clash, with space for character and motion exploration.",
    status: "Personal / Creative Project · Concept",
    art: "shadow",
  },
  {
    id: 7,
    title: "The Last Leaf",
    category: "Story concepts",
    label: "ANIMATED STORY ADAPTATION",
    description:
      "A personal concept for an animated story adaptation of The Last Leaf.",
    status: "Personal / Creative Project · Concept",
    art: "leaf",
  },
  {
    id: 8,
    title: "Cute Telugu 3D Family Comedy",
    category: "3D & Animation",
    label: "CHARACTER ANIMATION",
    description:
      "A Telugu family comedy concept exploring expressive characters and playful 3D animation.",
    status: "Personal / Creative Project · Concept",
    art: "family",
  },
  {
    id: 9,
    title: "Social Survey",
    category: "Community",
    label: "COMMUNITY SERVICE PROJECT",
    description:
      "A community-oriented social survey focused on basic government services.",
    status: "Resume-listed · Community Service Project",
    art: "survey",
  },
];
export const toolkits = [
  {
    title: "Motion & Design",
    subtitle: "Bringing ideas into the frame.",
    items: [
      [
        "Ae",
        "Adobe After Effects",
        "Motion graphics, animation, and visual content for digital media and presentations.",
      ],
      [
        "Ai",
        "Adobe Illustrator",
        "Vector illustration and graphic assets for creative visual work.",
      ],
      ["Ps", "Adobe Photoshop", "Image editing and visual composition."],
    ],
  },
  {
    title: "Programming Foundations",
    subtitle: "Curiosity, translated into code.",
    items: [
      ["C", "C", "Foundational programming knowledge."],
      ["C++", "C++", "Basic knowledge of C++ programming."],
      ["Ja", "Java", "Basic knowledge of Java programming."],
    ],
  },
  {
    title: "Everyday & Beyond",
    subtitle: "The skills behind the creative work.",
    items: [
      ["Ms", "Microsoft Office", "Word, Excel, and PowerPoint."],
      [
        "↗",
        "Creative Thinking",
        "Problem solving, creative thinking, and decision making.",
      ],
      [
        "◎",
        "Collaboration",
        "Team player, adaptability, and a willingness to keep learning.",
      ],
    ],
  },
];
