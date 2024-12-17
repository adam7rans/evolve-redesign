import { Icons } from "@/components/ui/icons"

export function PrelaunchHeader() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container flex h-10 items-center justify-center space-x-2 text-center text-sm">
        <Icons.sparkles className="h-4 w-4" />
        <p>Pre-launch phase - Join the waitlist to get early access</p>
      </div>
    </div>
  )
}
