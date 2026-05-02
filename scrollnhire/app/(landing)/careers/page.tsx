export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground flex items-center justify-center px-6 py-16 pt-32">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Careers
        </h1>

        {/* <p className="text-muted-foreground text-lg">
          Nothing to show here for now.
        </p> */}

        <p className="text-muted-foreground/70">
          {`We're not hiring yet, but exciting things are brewing.  
          Check back soon or stay tuned`}
        </p>
      </div>
    </main>
  );
}
