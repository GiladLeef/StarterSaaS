"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedLines from '../components/animated/lines';
import AnimatedLine from '../components/animated/line';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('auth');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: "🔐",
      title: 'Authentication System',
      description: 'Complete JWT-based auth with password reset, email verification, and secure token management',
    },
    {
      icon: "🏢",
      title: 'Multi-Tenant Organizations',
      description: 'Team management with invitations, member roles, and organization-level resource isolation',
    },
    {
      icon: "📊",
      title: 'Project Management',
      description: 'Full project lifecycle with status tracking, organization linkage, and automated workflows',
    },
    {
      icon: "🛡️",
      title: 'Admin Dashboard',
      description: 'Auto-generated admin panel with CRUD operations, search, and real-time data management',
    },
  ];

  const techStack = [
    { name: 'Go', desc: 'Backend' },
    { name: 'PostgreSQL', desc: 'Database' },
    { name: 'Next.js', desc: 'Frontend' },
    { name: 'React', desc: 'UI' },
    { name: 'Docker', desc: 'Containers' },
    { name: 'GORM', desc: 'ORM' },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedLines />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 mb-8 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-sm font-medium">
              Fully Automated SaaS Platform
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block">
              Build Your SaaS Platform
            </span>
            <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl">
              With 100% Automation Built In
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Production-ready platform with authentication, organizations, projects, subscriptions, and admin panel. DRY principles and generic code throughout.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/register">
              <Button size="lg" className="group hover:shadow-lg transition-all duration-300">
                Get Started Free
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="hover:shadow-md transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-15 h-0.5 bg-foreground/20 mx-auto"></div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Automated</div>
            </div>
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-15 h-0.5 bg-foreground/20 mx-auto"></div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">DRY</div>
              <div className="text-xs md:text-sm text-muted-foreground">Code Principles</div>
            </div>
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-15 h-0.5 bg-foreground/20 mx-auto"></div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">REST</div>
              <div className="text-xs md:text-sm text-muted-foreground">API Backend</div>
            </div>
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-15 h-0.5 bg-foreground/20 mx-auto"></div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">Open</div>
              <div className="text-xs md:text-sm text-muted-foreground">Source Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Workflow Style) */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Complete SaaS Foundation
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to build and scale your SaaS product
            </p>
            <div className="mt-8 flex justify-center">
              <AnimatedLine 
                direction="horizontal" 
                length={120} 
                thickness={3} 
                color="hsl(var(--primary))" 
                delay={400}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="relative group">
                <Card className="p-8 h-full bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:border-primary/30">
                  <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  
                  {/* Animated line on hover */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <AnimatedLine 
                      direction="horizontal" 
                      length={40} 
                      thickness={2} 
                      color="hsl(var(--primary))" 
                      delay={0}
                    />
                  </div>
                </Card>
                {index < features.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-9 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6 text-foreground/20"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Tabs Section (Automated Actions Style) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Built-in functionality to accelerate your development
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="orgs">Organizations</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="auth" className="mt-0">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Complete Authentication</h3>
                    <p className="text-muted-foreground mb-6">
                      JWT-based authentication with password reset, email verification, and role-based access control built in.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Secure JWT tokens</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Password reset flow</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Role-based permissions</span>
                      </div>
                    </div>
                  </div>
                  <Card className="p-4 bg-muted/30 font-mono text-sm">
                    <div className="text-primary mb-2">POST /api/v1/auth/register</div>
                    <div className="text-muted-foreground">Creating user account...</div>
                    <div className="text-foreground">• User created successfully</div>
                    <div className="text-muted-foreground">• JWT token generated</div>
                    <div className="text-muted-foreground">• Welcome email sent</div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="orgs" className="mt-0">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Multi-Tenant Organizations</h3>
                    <p className="text-muted-foreground mb-6">
                      Create organizations, invite team members, and manage projects with full isolation and access control.
                    </p>
                    <Link href="/register">
                      <Button>Create Organization</Button>
                    </Link>
                  </div>
                  <Card className="p-4 bg-muted/30">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-foreground/10 pb-2">
                        <span>Member Invitations</span>
                        <span>✓</span>
                      </div>
                      <div className="flex justify-between border-b border-foreground/10 pb-2">
                        <span>Role Management</span>
                        <span>✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resource Isolation</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-0">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Automated Admin Panel</h3>
                    <p className="text-muted-foreground mb-6">
                      Fully auto-generated admin dashboard with CRUD operations, search, and data management for all resources.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-2 border-l-foreground">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">Users Management</div>
                          <div className="text-sm text-muted-foreground">View, edit, delete users</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 border-l-2 border-l-foreground/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">Organizations & Projects</div>
                          <div className="text-sm text-muted-foreground">Manage all resources</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-0">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">RESTful API</h3>
                    <p className="text-muted-foreground mb-6">
                      Complete REST API with automatic route generation, validation, and error handling.
                    </p>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                  <Card className="p-4 bg-muted/30 font-mono text-sm overflow-x-auto">
                    <pre className="text-xs">
{`GET /api/v1/organizations
{
  "success": true,
  "data": {
    "organizations": [...]
  }
}`}
                    </pre>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Tech Stack Section (Integrations Style) */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground">
              Built with industry-leading technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech) => (
              <Card
                key={tech.name}
                className="p-6 flex flex-col items-center justify-center gap-3 hover:border-foreground/30 transition-all duration-300 border-foreground/10"
              >
                <span className="text-xl font-bold">{tech.name}</span>
                <span className="text-sm font-medium text-muted-foreground">{tech.desc}</span>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-flex items-center gap-2 px-6 py-3 border-foreground/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
              <span className="text-sm">
                Docker-ready with PostgreSQL and automated migrations
              </span>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your project with the most automated SaaS platform
          </p>
          <Link href="/register">
            <Button size="lg" className="group hover:shadow-lg transition-all duration-300">
              Create Your Account
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
