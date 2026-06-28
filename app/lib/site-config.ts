export const siteConfig = {
  name: "AnanDev",
  fullName: "Ananta",
  role: "Full-Stack Developer",
  tagline: "I build modern, scalable web applications with clean code and great user experiences.",
  bio: "A passionate full-stack developer with experience building web applications using modern technologies. I love turning complex problems into simple, beautiful, and intuitive solutions.",
  avatarUrl: "/avatar-placeholder.svg",
  url: process.env.NEXT_PUBLIC_URL || "https://anan-dev.vercel.app",
  keywords: [
    "portofolio",
    "blog",
    "developer",
    "programmer",
    "react",
    "nextjs",
    "full-stack",
    "web developer",
    "Ananta",
  ],
  aboutSlides: [
    {
      title: "Full-Stack Developer",
      subtitle: "Hi, I'm a Full-Stack Developer",
      description: "I build modern, scalable web applications with clean code and great user experiences.",
    },
    {
      title: "About Me",
      subtitle: "Get to know me",
      description: "A passionate full-stack developer with experience building web applications using modern technologies. I love turning complex problems into simple, beautiful, and intuitive solutions.",
    },
    {
      title: "My Interests",
      subtitle: "What drives me",
      description: "I'm deeply interested in web technologies, open-source contributions, and building tools that make a difference. Always exploring new frontiers in software development.",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
