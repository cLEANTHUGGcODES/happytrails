import { ButtonLink } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">A little off the trail</p>
      <h1>
        Let’s find your
        <br />
        <em>way back.</em>
      </h1>
      <p>We couldn’t find that page. There’s still plenty to explore.</p>
      <ButtonLink href="/">Back to Happy Trails</ButtonLink>
    </div>
  );
}
