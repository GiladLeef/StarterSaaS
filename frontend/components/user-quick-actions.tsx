import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconPlus, IconBuilding, IconFolder, IconUsers } from "@tabler/icons-react"

export function UserQuickActions() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started quickly with these common actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/organizations">
              <Card className="group transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconBuilding className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">New Organization</CardTitle>
                      <CardDescription className="text-sm">
                        Create a team workspace
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/projects">
              <Card className="group transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconFolder className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">New Project</CardTitle>
                      <CardDescription className="text-sm">
                        Start a new project
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/organizations">
              <Card className="group transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconUsers className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">View Invitations</CardTitle>
                      <CardDescription className="text-sm">
                        Check pending invites
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

