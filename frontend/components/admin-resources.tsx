import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconArrowRight } from "@tabler/icons-react"

interface AdminResourcesProps {
  resources: Array<{
    key: string
    [key: string]: any
  }>
}

export function AdminResources({ resources }: AdminResourcesProps) {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Resources</CardTitle>
          <CardDescription>
            Manage all platform data and configurations
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-4">
          <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Link key={resource.key} href={`/admin/resources/${resource.key}`}>
                <Card className="group transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="capitalize">
                        {resource.pluralName || resource.name || resource.key}
                      </span>
                      <IconArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(resource.capabilities || []).slice(0, 4).map((cap: string) => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                        {(resource.capabilities || []).length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{(resource.capabilities || []).length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

