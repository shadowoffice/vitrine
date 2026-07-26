import {
  availabilityLabels,
  type AvailabilityCode,
} from "@/lib/site-content";

type AvailabilityBadgeProps = {
  availability: AvailabilityCode;
  note?: string;
};

export function AvailabilityBadge({
  availability,
  note,
}: AvailabilityBadgeProps) {
  return (
    <span
      className={`availability-badge availability-${availability}`}
      title={note}
    >
      <span aria-hidden="true" />
      {availabilityLabels[availability]}
    </span>
  );
}
