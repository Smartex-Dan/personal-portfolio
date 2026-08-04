import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Mail, Phone, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Dark Tech Elegance Portfolio
 * Design: Deep navy backgrounds with electric cyan accents
 * Typography: Sora (display) + Inter (body) + Fira Code (technical)
 */

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  image: string;
}

interface Skill {
  category: string;
  items: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Membership Monarch",
    description: "A Flask membership platform with role-based access control and automated onboarding/notification emails via Flask-Mail.",
    tech: ["Python", "Flask", "Flask-Mail", "SQL"],
    link: "https://membershipmonarch.com",
    github: "https://github.com/Smartex-Dan/membership-monarch001",
    image: "/projects/membership-monarch.png",
  },
  {
    id: 2,
    title: "Habit Tracker",
    description: "A near-production habit-tracking SaaS with streak calculation and a 0–100 Consistency Score computed server-side and rendered as an animated SVG ring on the frontend.",
    tech: ["Django REST", "React", "TypeScript", "Supabase", "Tailwind"],
    link: "https://habit-tracker-gold-pi-43.vercel.app",
    github: "https://github.com/Smartex-Dan/habit-tracker",
    image: "/projects/habit-tracker.png",
  },
  {
    id: 3,
    title: "Football Pulse",
    description: "A SofaScore-style live football stats app — live scores, standings, match timelines, and AI-powered match analysis, with a Django + Celery backend polling API-Football and pushing updates over WebSockets.",
    tech: ["Django", "React", "TypeScript", "Supabase", "WebSockets"],
    // TODO: not deployed yet (blocked on Railway hosting) — add the live URL once it's up
    link: "Not deployed yet",
    github: "https://github.com/Smartex-Dan/football-pulse",
    image: "/projects/football-pulse.png",
  },
  {
    id: 4,
    title: "Snip — URL Shortener",
    description: "A fully functional URL shortener with custom slug support and click tracking. Built with Flask and SQLite, deployed on Railway with zero-downtime updates.",
    tech: ["Python", "Flask", "SQLite", "Railway"],
    link: "https://snip-link-shortener-production.up.railway.app/",
    github: "https://github.com/Smartex-Dan/snip-link-shortener",
    image: "/projects/snip.png",
  },
  {
    id: 5,
    title: "CryptoVerse",
    description: "A live cryptocurrency dashboard tracking prices, market caps, and crypto news, with interactive charts for coin history.",
    tech: ["React", "Redux Toolkit", "Ant Design", "Chart.js", "RapidAPI"],
    // TODO: paste the live URL here
    link: "",
    github: "https://github.com/Smartex-Dan/cryptoverse",
    image: "/projects/crypto-verse.png",
  },
  {
    id: 6,
    title: "Lily — E-Commerce",
    description: "A complete Nigerian jewelry and accessories shop with 36+ products, Naira pricing, and WhatsApp integration. Features live search, category filters, and a flash sale banner.",
    tech: ["HTML", "CSS", "JavaScript", "E-Commerce"],
    // TODO: add the live URL once it's deployed
    link: "",
    github: "https://github.com/Smartex-Dan/lily",
    image: "/projects/lily.png",
  },
  {
    id: 7,
    title: "Weather App",
    description: "A real-time weather app with an editorial dark UI, warm ambient tones, and Lagos as the default city.",
    tech: ["Django", "Open-Meteo API", "JavaScript"],
    link: "https://weather-app-python-version.onrender.com",
    github: "https://github.com/Smartex-Dan/weather-app-python-version",
    image: "/projects/weather.png",
  },
  {
    id: 8,
    title: "Clock Widget",
    description: "A minimalist digital clock built with Tkinker, designed as a lightweight, embeddable widget.",
    tech: ["Tkinker"],
    // No live URL for this one — GitHub only
    link: "",
    github: "https://github.com/Smartex-Dan/clock-widget",
    image: "/projects/clock.jfif",
  },
];

const skills: Skill[] = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "HTML5", "CSS3", "SQL"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["Flask", "Django", "Django REST Framework", "React", "Celery", "WebSockets", "Tkinter", "Bootstrap", "GSAP"],
  },
  {
    category: "Databases",
    items: ["SQLite", "PostgreSQL", "Supabase"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "GitHub", "VS Code", "Railway", "Vercel", "Netlify", "Docker", "Render"],
  },
  {
    category: "Design",
    items: ["Figma", "Adobe Illustrator", "Canva", "CorelDraw", "UI/UX"],
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setIsSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully! I'll get back to you soon.");
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      setFormStatus("error");
      toast.error("Failed to send message. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663657137097/J2cRfKNrEczxAP9mvPRzDf/portfolio-logo-EH464cCqhjoRsjURTyVp4C.webp"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-bold text-lg">Daniel Adeoye</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#projects" className="link-underline text-sm hover:text-accent">
              Projects
            </a>
            <a href="#skills" className="link-underline text-sm hover:text-accent">
              Skills
            </a>
            <a href="#contact" className="link-underline text-sm hover:text-accent">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663657137097/J2cRfKNrEczxAP9mvPRzDf/hero-background-oRxBKa2rnk52eGhoVvDsQJ.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-accent text-sm font-semibold tracking-widest uppercase">
                  Full-Stack Developer
                </p>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Building Elegant <span className="text-accent">Solutions</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                I craft scalable web applications with clean code and beautiful interfaces. Specializing in Python, JavaScript, and modern frontend technologies.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#projects">
                  <Button className="glow-accent bg-accent hover:bg-accent/90 text-accent-foreground">
                    View My Work
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    Get In Touch
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:block relative h-96">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663657137097/J2cRfKNrEczxAP9mvPRzDf/projects-showcase-euZwwwmCCs838ykEYf4aRA.webp"
                alt="Projects showcase"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-accent/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              Featured Work
            </p>
            <h2 className="text-4xl font-bold">Recent Projects</h2>
          </div>

          <div className="space-y-12">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  idx % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Project Image */}
                <div className={idx % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative rounded-lg overflow-hidden h-64 lg:h-80">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </div>

                {/* Project Info */}
                <div className={idx % 2 === 1 ? "lg:col-start-1" : ""}>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-card text-accent text-xs font-mono rounded border border-accent/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent text-accent hover:bg-accent/10 glow-accent"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                      </a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-accent text-accent hover:bg-accent/10"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              Expertise
            </p>
            <h2 className="text-4xl font-bold">Technical Skills</h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-cover bg-center rounded-lg p-8 relative"
            style={{
              backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663657137097/J2cRfKNrEczxAP9mvPRzDf/skills-pattern-2QV6tkW9rVMMhPskwkkNNe.webp')`,
            }}
          >
            <div className="absolute inset-0 bg-background/80 rounded-lg" />
            {skills.map((skillGroup) => (
              <Card
                key={skillGroup.category}
                className="relative z-10 bg-card/50 border-accent/30 backdrop-blur-sm"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-accent mb-4">
                    {skillGroup.category}
                  </h3>
                  <ul className="space-y-2">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
                Get In Touch
              </p>
              <h2 className="text-4xl font-bold mb-6">Let's Build Something Great</h2>
              <p className="text-lg text-muted-foreground">
                Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Info Cards */}
              <Card className="bg-card border-accent/30 p-6">
                <Mail className="w-8 h-8 text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2 text-center">Email</p>
                
                  href="mailto:adeoyedan100@gmail.com"
                  className="text-accent font-semibold hover:underline text-center block"
                >
                  adeoyedan100@gmail.com
                </a>
              </Card>

              <Card className="bg-card border-accent/30 p-6">
                <Phone className="w-8 h-8 text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2 text-center">Phone</p>
                <a href="tel:+2347061247283" className="text-accent font-semibold hover:underline text-center block">
                  +234 706 1247 283
                </a>
              </Card>

              <Card className="bg-card border-accent/30 p-6">
                <Github className="w-8 h-8 text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2 text-center">GitHub</p>
                
                  href="https://github.com/Smartex-Dan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold hover:underline text-center block"
                >
                  Smartex-Dan
                </a>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-card border-accent/30 p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                      disabled={isSending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                      disabled={isSending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="What's this about?"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell me about your project or inquiry..."
                    rows={5}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                    disabled={isSending}
                  />
                </div>

                {/* Status Messages */}
                {formStatus === "success" && (
                  <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-500 text-sm">Message sent successfully!</p>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">Failed to send message. Please try again.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full glow-accent bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Card>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-12">
              
                href="https://github.com/Smartex-Dan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              
                href="https://www.linkedin.com/in/daniel-adeoye-b48b59401/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              
                href="mailto:adoyedan100@gmail.com"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Daniel Adeoye. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}