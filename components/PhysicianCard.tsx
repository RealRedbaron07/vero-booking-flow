import type { Physician } from "@/lib/types";

type PhysicianCardProps = {
  physician: Physician;
  isSelected: boolean;
  onSelect: (physicianId: string) => void;
};

export function PhysicianCard({
  physician,
  isSelected,
  onSelect,
}: PhysicianCardProps) {
  return (
    <button
      type="button"
      className={`physician-card ${isSelected ? "physician-card--selected" : ""}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(physician.id)}
    >
      <span className="physician-card__header">
        <span>
          <span className="physician-card__name">{physician.name}</span>
          <span className="physician-card__specialty">
            {physician.specialty}
          </span>
        </span>
        <span className="physician-card__check" aria-hidden="true">
          {isSelected ? "Selected" : "Choose"}
        </span>
      </span>
      <span className="physician-card__meta">{physician.location}</span>
      <span className="physician-card__description">
        {physician.description}
      </span>
    </button>
  );
}
