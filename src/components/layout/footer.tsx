export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sara7a App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
