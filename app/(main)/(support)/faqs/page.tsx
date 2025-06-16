"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  Heart,
  Shield,
  Users,
  Crown,
  Search,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function FAQS() {
  const [openItems, setOpenItems] = React.useState<number[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Books & Writing",
      color: "from-accent-2 to-accent-3",
      questions: [
        {
          question:
            "What inspired you to start writing about Christian household building?",
          answer:
            "After years of watching Christian families struggle to live distinctively in a secular culture, I felt called to write about the biblical principles that have sustained faithful households for generations. Too many Christian homes look exactly like their secular neighbors—same priorities, same entertainments, same anxieties. I write to challenge that and offer a better way.",
        },
        {
          question:
            "Are your books suitable for new Christians or only mature believers?",
          answer:
            "My books are written for Christians at all stages of their journey, but they do assume a basic understanding of biblical principles. New believers will find solid foundations, while mature Christians will be challenged to go deeper in their application of faith to family life. Each book includes practical steps that can be implemented regardless of where you are in your faith journey.",
        },
        {
          question: "Do you plan to write books specifically for women?",
          answer:
            "While my current books address both husbands and wives, I am considering a book specifically focused on the unique calling of Christian wives and mothers. The principles I teach apply to the whole household, but I recognize there are specific challenges and opportunities that Christian women face in building kingdom-centered homes.",
        },
        {
          question:
            "How do your books differ from other Christian family books?",
          answer:
            "Most Christian family books focus on personal happiness and individual fulfillment within a Christian framework. My books focus on building households that serve God's kingdom purposes across generations. It's not about having a 'blessed' family—it's about building a family that's a blessing to the world and advances Christ's kingdom.",
        },
      ],
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Faith & Family",
      color: "from-accent-3 to-accent-1",
      questions: [
        {
          question:
            "What does 'building households, not monuments to comfort' mean?",
          answer:
            "Too many Christian families build their lives around personal peace, affluence, and comfort—essentially monuments to themselves. Instead, we should build households that serve as training grounds for the next generation, centers of hospitality and discipleship, and launching pads for kingdom work. Our homes should be tools for God's purposes, not shrines to our own comfort.",
        },
        {
          question:
            "How do you balance Reformed theology with practical family life?",
          answer:
            "Reformed theology isn't abstract doctrine—it's the most practical worldview there is. When you understand God's sovereignty, human nature, and the purpose of families in His plan, it transforms how you approach everything from discipline to education to entertainment choices. Theology should shape every aspect of family life, not be compartmentalized to Sunday mornings.",
        },
        {
          question: "What role should children play in household building?",
          answer:
            "Children aren't just the recipients of our household building—they're participants in it. From early ages, they should understand they're part of something bigger than themselves. They should have real responsibilities, contribute to family mission, and be trained to see themselves as covenant children with kingdom purposes. We're not raising kids—we're raising future kingdom builders.",
        },
        {
          question:
            "How do you handle cultural pressures that conflict with biblical values?",
          answer:
            "We don't retreat from culture—we create alternative culture. When the world offers toxic entertainment, we create better entertainment. When schools teach harmful ideologies, we provide better education. When society promotes destructive values, we model and teach life-giving ones. Christians should be culture creators, not culture consumers.",
        },
      ],
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Reformed Faith",
      color: "from-accent-1 to-accent-2",
      questions: [
        {
          question: "What does it mean to be a Reformed Baptist?",
          answer:
            "Reformed Baptists hold to the doctrines of grace (often called the five points of Calvinism) while maintaining believer's baptism by immersion and congregational church government. We believe in the sovereignty of God in salvation, the authority of Scripture, and the importance of covenant theology in understanding God's relationship with His people throughout history.",
        },
        {
          question:
            "How does Reformed theology impact your approach to family life?",
          answer:
            "Reformed theology teaches us that God is sovereign over all of life, including our families. This means we approach parenting with confidence in God's promises to covenant families, discipline our children understanding their sinful nature and need for grace, and build our households with an eternal perspective knowing God is working through faithful families across generations.",
        },
        {
          question: "Do you believe in infant baptism or believer's baptism?",
          answer:
            "As a Reformed Baptist, I believe in believer's baptism by immersion. While I deeply respect my Presbyterian brothers who practice infant baptism, I believe Scripture teaches that baptism should follow faith and be a symbol of the believer's union with Christ in His death and resurrection.",
        },
        {
          question: "How important is church membership to household building?",
          answer:
            "Absolutely essential. No household can be built in isolation from the broader church community. We need pastoral oversight, fellowship with other covenant families, and the accountability that comes from committed church membership. The household and the church work together in raising the next generation of faithful Christians.",
        },
      ],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Practical Application",
      color: "from-accent-2 to-accent-1",
      questions: [
        {
          question:
            "Where should someone start if they want to build a more intentional Christian household?",
          answer:
            "Start with family worship—even 10 minutes of Bible reading and prayer together daily will transform your household culture. Then examine your entertainment choices, educational decisions, and use of time through a biblical lens. Small, consistent changes in the direction of faithfulness compound over time into radical transformation.",
        },
        {
          question: "How do you balance work demands with household building?",
          answer:
            "Work should serve the household, not vice versa. This might mean choosing a job that allows for family dinner every night over one that pays more but keeps you away from home. It definitely means being intentional about not letting career ambitions undermine your primary calling as a husband and father.",
        },
        {
          question: "What does biblical education look like in practice?",
          answer:
            "Biblical education means all learning is done in the context of a Christian worldview. Whether through homeschooling, Christian schools, or careful supplementation of public education, we must ensure our children are learning to think biblically about every subject—history, science, literature, mathematics—all of it belongs to God and should be taught as such.",
        },
        {
          question:
            "How do you maintain these standards when extended family doesn't share your values?",
          answer:
            "This requires wisdom, grace, and sometimes difficult conversations. We love our extended family while maintaining clear boundaries about what we will and won't participate in. We model biblical family life without being preachy about it, and we're always ready to explain our choices when asked. Sometimes faithfulness requires standing alone, even within your own extended family.",
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 md:px-6 pb-6 pt-0 bg-background space-y-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20 rounded-3xl">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-accent-3/20 to-accent-1/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-2/10 rounded-full blur-lg animate-bounce delay-500"></div>

        <div className="relative z-10 container mx-auto p-8 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <HelpCircle className="w-5 h-5 text-accent-1" />
              <span className="text-accent-1 text-sm font-medium tracking-wide uppercase">
                Frequently Asked Questions
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold font-title mb-8 text-background leading-tight">
              Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Questions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-accent-1 max-w-3xl mx-auto leading-relaxed font-light mb-12">
              Clear answers to help you build a household that honors God and
              strengthens His kingdom.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-1" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg bg-background/10 border-accent-3/30 text-background placeholder:text-accent-1 focus:border-accent-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section>
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl`}
                  >
                    <div className="text-white">{category.icon}</div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-title font-bold">
                    {category.title}
                  </h2>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const itemIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(itemIndex);

                    return (
                      <Card
                        key={faqIndex}
                        className="bg-background border-accent-2/10 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-accent-2/10 transition-all duration-300 p-0"
                      >
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleItem(itemIndex)}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-accent-2/5 transition-colors"
                          >
                            <h3 className="text-lg md:text-xl font-semibold text-foreground pr-4 leading-relaxed">
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="w-6 h-6 text-accent-2" />
                              ) : (
                                <ChevronDown className="w-6 h-6 text-accent-2" />
                              )}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-6">
                              <div className="border-t border-accent-2/10 pt-6">
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchTerm && filteredFAQs.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-accent-2/50 mx-auto mb-6" />
              <h3 className="text-2xl font-title font-bold mb-4">
                No Questions Found
              </h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search or browse all categories above.
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="rounded-3xl bg-gradient-to-r from-accent-3/5 to-accent-2/5">
        <div className="container mx-auto p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-background/10 to-accent-3/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent-3/20 mb-8">
              <MessageCircle className="w-5 h-5 text-accent-2" />
              <span className="text-accent-3 text-sm font-medium tracking-wide uppercase">
                Still Have Questions?
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-title font-bold mb-6">
              Let&apos;s
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                {" "}
                Connect
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Can&apos;t find what you&apos;re looking for? I&apos;d love to
              hear from you and help answer your questions about building a
              faithful household.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Email Me
                </h4>
                <p className="text-muted-foreground mb-6">
                  Send me your questions directly and I&apos;ll get back to you
                  personally.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Get In Touch
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <BookOpen className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Read My Books
                </h4>
                <p className="text-muted-foreground mb-6">
                  Dive deeper into these topics with comprehensive guides and
                  practical wisdom.
                </p>
                <Link href="/books">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Explore Books
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-sm border-accent-2/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-2/20 to-accent-3/20 rounded-2xl mb-6">
                  <Crown className="w-8 h-8 text-accent-2" />
                </div>
                <h4 className="text-xl font-title font-semibold mb-4">
                  Join the Mission
                </h4>
                <p className="text-muted-foreground mb-6">
                  Connect with other families building kingdom-centered
                  households.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-3xl py-16 bg-gradient-to-br from-foreground/95 via-foreground/90 to-accent-2/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-5xl md:text-6xl font-title font-bold text-background mb-8">
              Ready to Build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-2 to-accent-3">
                Your Legacy?
              </span>
            </h3>
            <p className="text-xl text-background/90 max-w-2xl mx-auto mb-12">
              Stop waiting for the perfect moment. Start building a household
              that honors God and strengthens His kingdom today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/books">
                <Button
                  className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 text-white px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start With a Book
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="bg-background/10 border-background/30 text-background hover:bg-background hover:text-foreground px-10 py-4 font-semibold transition-all duration-300 text-lg"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
