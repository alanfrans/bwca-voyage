import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="font-display text-4xl">That page is not on the map</h1>
      <p className="text-muted-foreground">
        The permit list is the five routes from Moose Lake. Anything else is a bushwhack.
      </p>
      <Link href="/journeys" className="text-primary underline-offset-4 hover:underline">
        Back to the journeys
      </Link>
    </div>
  );
}
