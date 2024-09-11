import { Icons } from "@/components/icons";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Vector",
  description: "Build fintech products in 3 days or less",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "Fintech",
    "Developer Platform",
    "Financial Institutions",
    "Rapid Development",
    "Cost-Effective",
  ],
  links: {
    email: "support@vector.ai",
    twitter: "https://twitter.com/magicuidesign",
    discord: "https://discord.gg/87p2vpsat5",
    github: "https://github.com/magicuidesign/magicui",
    instagram: "https://instagram.com/magicuidesign/",
  },
  header: [
    {
      trigger: "Products",
      content: {
        main: {
          icon: <Icons.logo className="h-6 w-6" />,
          title: "Fintech Solutions",
          description: "Build and launch financial products rapidly.",
          href: "#",
        },
        items: [
          {
            href: "#",
            title: "Digital Banking Platform",
            description: "Launch a full-featured digital bank in days.",
          },
          {
            href: "#",
            title: "Embedded Financial Analytics",
            description:
              "Integrate powerful analytics directly into your fintech apps.",
          },
          {
            href: "#",
            title: "Secure Storage API",
            description:
              "Store and manage financial files with bank-level security.",
          },
        ],
      },
    },
    {
      trigger: "Solutions",
      content: {
        items: [
          {
            title: "Neobanks",
            href: "#",
            description: "Launch fully digital banking services in days.",
          },
          {
            title: "Payment Platforms",
            href: "#",
            description:
              "Build secure and scalable payment processing systems.",
          },
          {
            title: "Lending & Credit",
            href: "#",
            description:
              "Develop automated lending and credit scoring solutions.",
          },
          {
            title: "Investment & Trading",
            href: "#",
            description: "Create robo-advisors and trading platforms quickly.",
          },
          {
            title: "Regtech & Compliance",
            href: "#",
            description: "Implement robust compliance and reporting systems.",
          },
          {
            title: "Open Banking",
            href: "#",
            description: "Build APIs for secure data sharing and integration.",
          },
        ],
      },
    },
    {
      href: "/blog",
      label: "Blog",
    },
  ],
  pricing: [
    {
      name: "STARTER",
      href: "#",
      price: "$999",
      period: "month",
      yearlyPrice: "$899",
      features: [
        "1 Fintech Product",
        "Up to 10,000 Users",
        "Basic Compliance Tools",
        "Standard API Access",
        "Email Support",
      ],
      description: "Perfect for fintech startups and small projects",
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "GROWTH",
      href: "#",
      price: "$2,999",
      period: "month",
      yearlyPrice: "$2,699",
      features: [
        "3 Fintech Products",
        "Up to 100,000 Users",
        "Advanced Compliance Suite",
        "Full API Access",
        "Priority Support",
        "Custom Integrations",
      ],
      description: "Ideal for growing fintech companies",
      buttonText: "Scale Up",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      href: "#",
      price: "Custom",
      period: "month",
      yearlyPrice: "Custom",
      features: [
        "Unlimited Fintech Products",
        "Unlimited Users",
        "Enterprise-grade Compliance",
        "Dedicated API Support",
        "24/7 Premium Support",
        "Custom Development",
        "On-premises Deployment Option",
      ],
      description: "For large financial institutions and enterprises",
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ],
  faqs: [
    {
      question: "What is Vector?",
      answer: (
        <span>
          Vector is a developer platform that helps financial institutions build
          fintech products in 3 days or less at a fraction of the cost. It
          provides tools, APIs, and templates to accelerate fintech development.
        </span>
      ),
    },
    {
      question: "How can Vector help my financial institution?",
      answer: (
        <span>
          Vector accelerates your fintech product development by providing
          pre-built components, easy API integrations, and compliance tools.
          This allows you to launch new financial products quickly and
          cost-effectively.
        </span>
      ),
    },
    {
      question: "What types of fintech products can I build with Vector?",
      answer: (
        <span>
          With Vector, you can build a wide range of fintech products including
          digital banking platforms, payment processing systems, lending
          solutions, wealth management tools, and more. Our platform is flexible
          to accommodate various financial service needs.
        </span>
      ),
    },
    {
      question:
        "Is Vector suitable for both startups and established financial institutions?",
      answer: (
        <span>
          Yes, Vector is designed to cater to both fintech startups and
          established financial institutions. Our platform scales to meet the
          needs of small teams and large enterprises alike, providing the tools
          necessary for rapid fintech innovation.
        </span>
      ),
    },
    {
      question: "How does Vector ensure compliance and security?",
      answer: (
        <span>
          Vector incorporates built-in compliance tools and security features
          that adhere to financial industry standards. We regularly update our
          platform to meet changing regulations and provide robust security
          measures to protect sensitive financial data.
        </span>
      ),
    },
  ],
  footer: [
    {
      title: "Product",
      links: [
        { href: "#", text: "Features", icon: null },
        { href: "#", text: "Pricing", icon: null },
        { href: "#", text: "Documentation", icon: null },
        { href: "#", text: "API", icon: null },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", text: "About Us", icon: null },
        { href: "#", text: "Careers", icon: null },
        { href: "#", text: "Blog", icon: null },
        { href: "#", text: "Press", icon: null },
        { href: "#", text: "Partners", icon: null },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "#", text: "Community", icon: null },
        { href: "#", text: "Contact", icon: null },
        { href: "#", text: "Support", icon: null },
        { href: "#", text: "Status", icon: null },
      ],
    },
    {
      title: "Social",
      links: [
        {
          href: "#",
          text: "Twitter",
          icon: <FaTwitter />,
        },
        {
          href: "#",
          text: "Instagram",
          icon: <RiInstagramFill />,
        },
        {
          href: "#",
          text: "Youtube",
          icon: <FaYoutube />,
        },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;

export const featureFlags = {
  showTestimonials: true,
};
