import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Complete Platform Solution
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Manage your organizations, projects, and subscriptions all in one place.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="h-11 px-8" asChild>
                <a href="/dashboard">Get Started</a>
              </Button>
              <Button variant="outline" className="h-11 px-8" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform offers everything you need to manage your business efficiently.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>Manage multiple organizations with ease.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Create and manage organizations, invite team members, and control access permissions.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <a href="/organizations">Learn More</a>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Organize your work efficiently.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Create projects, assign team members, track progress, and meet deadlines.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <a href="/projects">Learn More</a>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Flexible billing options for your needs.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Choose from different subscription plans, manage billing, and track usage.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <a href="/pricing">Learn More</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up today and start managing your business more efficiently.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button className="w-full" size="lg" asChild>
                <a href="/register">Sign Up Now</a>
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/login" className="underline underline-offset-2">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
