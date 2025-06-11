import { Book, Bookmark, Home, Mail, Mic, Package, User } from "lucide-react";

export const heroSlides = [
  {
    id: 1,
    image: "https://m.media-amazon.com/images/I/61yGXDAF6JL._SY466_.jpg",
    title: "Towers at War: Holding the Line in a Kingdom Under Siege",
    description:
      "This is a field manual for men who refuse to abandon the gate. Inspired by the clash of light and darkness in Tolkien’s world, this book calls Christian men to build, guard, repent, and stand. It is gritty. It is hopeful. And it is grounded in Scripture and sweat. For husbands, fathers, builders, and stewards—this manual is your call to resist the rot and raise up strongholds of righteousness.",
    link: "/checkout",
    buttonText: "Buy Now",
  },
  {
    id: 2,
    image: "https://m.media-amazon.com/images/I/61pO4Q0Z84L._SY385_.jpg",
    title:
      "Zones of Dominion: How to Build Christian Power in an Age of Apostasy",
    description:
      "This is not a retreat. It’s a counterattack. Christendom didn’t collapse by accident. It was sabotaged—by cowardice in the church, compromise in the household, and a coordinated assault on truth. But Christ is not pacing nervously in heaven. He is seated, ruling, and calling His people to rebuild—stone by stone, home by home, church by church. Zones of Dominion is a field manual for Christians who are done with passivity and ready to plant flags. Drawing on the spirit of Geneva, the grit of the Reformers, and the unshakable promises of Christ, this book outlines how to build resilient Christian power in an age of apostasy.",
    link: "/checkout",
    buttonText: "Buy Now",
  },
  {
    id: 3,
    image: "https://m.media-amazon.com/images/I/719iETIoVZL._SY385_.jpg",
    title: "Vivere Militare Est: A Field Manual for Christian Resistance",
    description:
      "'To live is to war.' Seneca wrote it. But Christ defines it. The Stoics understood that life is a battle. But where their discipline ended in fate, ours begins in faith. This is not a book of Roman virtue. It is a Christian field manual-for men enlisted under the banner of the risen King. Vivere Militare Est is for those who feel the conflict in their bones: the war against sin, the pressures of a passive age, the daily grind of leading a household in enemy territory. This manual arms you with timeless truths, forged from Scripture, shaped by the Church, and sharpened through suffering.",
    link: "/checkout",
    buttonText: "Buy Now",
  },
  {
    id: 4,
    image: "https://m.media-amazon.com/images/I/61hdKt1Oo2L._SY385_.jpg",
    title: "The Kingdom Has Come: A Study in Matthew 8:1-17",
    description:
      "This is not a story about kindness. It’s a declaration of authority. When Jesus came down from the mountain, He didn’t offer suggestions—He gave commands. He didn’t negotiate with demons—He cast them out. He didn’t flinch at leprosy, disease, or death—He touched them, and they fled. Matthew 8:1–17 is not soft theology. It’s the thunder of the Kingdom. This field manual walks through every word and wonder in those verses, showing how Christ's healing was never random—it was royal. He fulfilled the Law, shattered cultural barriers, rebuked unbelief, and bore our griefs. With clarity, pastoral urgency, and bold biblical fidelity, this book calls the Church to see Christ not just as a Savior—but as a sovereign. There is no second track. No neutral ground. No other hope. He touched. He spoke. He healed. And He still reigns.",
    link: "/checkout",
    buttonText: "Buy Now",
  },
];

export const navLinks = [
  { name: "Books", href: "/books" },
  { name: "Podcasts", href: "/podcasts" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "https://bryandfurlong.substack.com/" },
];

export const footerDiscoverLinks = [
  { name: "All Books", href: "/books" },
  { name: "Bestsellers", href: "/bestsellers" },
  { name: "New Releases", href: "/new-releases" },
  { name: "Authors", href: "/authors" },
];
export const footerSupportLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "FAQs", href: "/faqs" },
  { name: "Shipping Information", href: "/shipping" },
  { name: "Returns & Exchanges", href: "/returns" },
  { name: "Refund Policy", href: "/refund" },
  { name: "Help Center", href: "/help" },
];

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Orders",
    href: "/admin/dashboard/orders",
    icon: Package,
  },
  {
    label: "Books",
    href: "/admin/dashboard/books",
    icon: Book,
  },
  {
    label: "Podcasts",
    href: "/admin/dashboard/podcasts",
    icon: Mic,
  },
  {
    label: "Genres",
    href: "/admin/dashboard/genres",
    icon: Bookmark,
  },
  {
    label: "Users",
    href: "/admin/dashboard/users",
    icon: User,
  },
  {
    label: "Messages",
    href: "/admin/dashboard/messages",
    icon: Mail,
  },
];
