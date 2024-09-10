![hero](image.png)


<p align="center">
	<h1 align="center"><b>Typescript SaaS Template</b></h1>
<p align="center">
    An open-source starter kit based on <a href="https://midday.ai">Midday & V1</a>.
    <br />
    <br />
    <a href="https://v1.run"><strong>Website</strong></a> · 
    <a href="https://github.com/midday-ai/v1/issues"><strong>Issues</strong></a> · 
    <a href="#whats-included"><strong>What's included</strong></a> ·
    <a href="#prerequisites"><strong>Prerequisites</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#how-to-use"><strong>How to use</strong></a>
  </p>
</p>

## Overview

Create v1 is a comprehensive, production-ready SaaS starter kit based on learnings from building Midday. It leverages the latest Next.js framework in a monorepo structure, focusing on code reuse and best practices that will scale with your business.

## Key Features

- **Monorepo Structure**: Optimized for scalability and code sharing
- **Full-Stack TypeScript**: End-to-end type safety
- **Modern Tech Stack**: Utilizes cutting-edge technologies and frameworks
- **Authentication & Database**: Integrated with Supabase for robust backend services
- **UI Components**: Pre-built, customizable components with Shadcn and TailwindCSS
- **Internationalization**: Built-in i18n support for global reach
- **Email Integration**: Ready-to-use email templates and delivery system
- **Analytics & Monitoring**: Integrated error tracking and user analytics
- **Background Jobs**: Efficient handling of asynchronous tasks
- **Type-Safe Actions**: Validated server actions for enhanced security

## What's included

| Category | Technology | Description |
|----------|------------|-------------|
| Framework | [Next.js](https://nextjs.org/) | React framework for production |
| Build System | [Turborepo](https://turbo.build) | High-performance build system for JavaScript and TypeScript codebases |
| Code Quality | [Biome](https://biomejs.dev) | Toolchain for web projects |
| Styling | [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS framework |
| UI Components | [Shadcn](https://ui.shadcn.com/) | Re-usable components built with Radix UI and Tailwind CSS |
| Language | [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript |
| Backend | [Supabase](https://supabase.com/) | Open source Firebase alternative |
| Caching | [Upstash](https://upstash.com/) | Redis-compatible serverless data platform |
| Emails | [React Email](https://react.email/) & [Resend](https://resend.com/) | Tools for building and sending emails |
| Localization | [i18n](https://next-international.vercel.app/) | Internationalization library |
| Monitoring | [Sentry](https://sentry.io/) | Error tracking and performance monitoring |
| Link Management | [Dub](https://dub.sh/) | Open-source link management tool |
| Job Scheduling | [Trigger.dev](https://trigger.dev/) | Workflow automation platform |
| Analytics | [OpenPanel](https://openpanel.dev/) | Open source analytics platform |
| Billing | [Polar](https://polar.sh) | Billing solution (coming soon) |
| Form Handling | [react-safe-action](https://next-safe-action.dev) | Type-safe server actions |
| URL State | [nuqs](https://nuqs.47ng.com/) | Type-safe search params state manager |
| Theming | [next-themes](https://next-themes-example.vercel.app/) | Theme management for Next.js |

## Project Structure

```bash
.
├── apps # Application workspace
│ ├── api # Supabase API, Auth, Storage, and Edge Functions
│ ├── app # Main application (your product)
│ └── web # Marketing website
├── packages # Shared packages and libraries
│ ├── analytics # Analytics integration (OpenPanel)
│ ├── auth # Authentication utilities
│ ├── email # Email templates and sending logic
│ ├── jobs # Background job definitions (Trigger.dev)
│ ├── kv # Key-value storage utilities (Upstash)
│ ├── logger # Logging utilities
│ ├── stripe # Stripe integration for payments
│ ├── supabase # Supabase client and utilities
│ ├── tinybird # Tinybird analytics integration
│ └── ui # Shared UI components (Shadcn)
├── services # Microservices
│ ├── account-service # User account management service
│ ├── authentication-service # Authentication and authorization service
│ └── gateway # API gateway for microservices
├── tooling # Development and build tools
│ └── typescript # TypeScript configuration
└── turbo # Turborepo configuration
└── generator # Code generation tools
```

## Prerequisites

| Tool | Description |
|------|-------------|
| [Bun](https://bun.sh/) | A fast all-in-one JavaScript runtime and toolkit. Used for running and managing the project. |
| [Docker](https://www.docker.com/) | Platform for developing, shipping, and running applications in containers. Used for consistent development environments. |
| [Upstash](https://upstash.com/) | Serverless database service for Redis. Used for caching and rate limiting. |
| [Dub](https://dub.sh/) | Open-source link management tool. Used for creating and managing short links. |
| [Trigger.dev](https://trigger.dev/) | Workflow automation platform. Used for scheduling and running background jobs. |
| [Resend](https://resend.com/) | Email API service. Used for sending transactional emails. |
| [Supabase](https://supabase.com/) | Open-source Firebase alternative. Provides authentication, database, and storage services. |
| [Sentry](https://sentry.io/) | Error tracking and performance monitoring platform. Used for real-time error reporting and debugging. |
| [OpenPanel](https://openpanel.dev/) | Open-source analytics platform. Used for tracking user behavior and application performance. |
| [Stripe](https://stripe.com/) | Payment processing platform. Used for handling subscriptions and payments. |

Ensure you have accounts set up for these services and their respective API keys or configuration details ready before starting the project setup.

## Getting Started

Clone this repo locally with the following command:

```bash
bunx degit SolomonAIEngineering/typescript-saas-template v1
```

1. Install dependencies using bun:

```sh
bun i
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
# Copy .env.example to .env for each app
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env
cp apps/web/.env.example apps/web/.env
```

4. Start the development server from either bun or turbo:

```ts
bun dev // starts everything in development mode (web, app, api, email)
bun dev:web // starts the web app in development mode
bun dev:app // starts the app in development mode
bun dev:api // starts the api in development mode
bun dev:email // starts the email app in development mode

// Database
bun migrate // run migrations
bun seed // run seed
```

## How to use
This boilerplate is inspired by our work on Midday, and it's designed to serve as a reference for real-world apps. Feel free to dive into the code and see how we've tackled various features. Whether you're looking to understand authentication flows, database interactions, or UI components, you'll find practical, battle-tested implementations throughout the codebase. It's not just a starting point; it's a learning resource that can help you build your own applications.

With this, you have a great starting point for your own project.

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmidday-ai%2Fv1&env=RESEND_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,SENTRY_AUTH_TOKEN,NEXT_PUBLIC_SENTRY_DSN,SENTRY_ORG,SENTRY_PROJECT,DUB_API_KEY,NEXT_PUBLIC_OPENPANEL_CLIENT_ID,OPENPANEL_SECRET_KEY&project-name=create-v1&repository-name=create-v1&redirect-url=https%3A%2F%2Fv1.run&demo-title=Create%20v1&demo-description=An%20open-source%20starter%20kit%20based%20on%20Midday.&demo-url=https%3A%2F%2Fv1.run&demo-image=https%3A%2F%2Fv1.run%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6)
