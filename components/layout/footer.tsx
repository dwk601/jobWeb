export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6">
        <span>CareerFlow</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
