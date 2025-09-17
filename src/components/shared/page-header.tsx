export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight font-headline">{title}</h2>
      <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
        {description}
      </p>
    </div>
  );
}
