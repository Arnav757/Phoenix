import { forwardRef } from "react";

// Shared architectural drafting motif — guide lines, construction circles,
// dimension brackets and coordinate crosshairs — used by both the page
// transition overlay and the homepage entry experience so the two "the site
// is preparing the next drawing" moments read as one consistent language.
//
// Purely presentational: elements are tagged `data-draft` (fades) and
// `data-draft-line` (stroke-drawn via dashoffset) for the parent to animate
// imperatively with GSAP — this component owns no animation logic itself.
export const DraftingMarks = forwardRef<SVGSVGElement, { className?: string }>(
  function DraftingMarks({ className }, ref) {
    return (
      <svg ref={ref} viewBox="0 0 480 480" className={className} fill="none">
        {/* long guide lines through center */}
        <line data-draft data-draft-line x1="240" y1="0" x2="240" y2="480" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.35" />
        <line data-draft data-draft-line x1="0" y1="240" x2="480" y2="240" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.35" />

        {/* construction circles — outer traces out, inner two fade */}
        <circle data-draft data-draft-line cx="240" cy="240" r="150" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.3" />
        <circle data-draft cx="240" cy="240" r="112" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.22" />
        <circle data-draft cx="240" cy="240" r="80" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.18" />

        {/* dimension line above and below the logo, with end + center ticks */}
        <g data-draft stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.4">
          <line x1="150" y1="90" x2="330" y2="90" />
          <line x1="150" y1="84" x2="150" y2="96" />
          <line x1="330" y1="84" x2="330" y2="96" />
          <line x1="240" y1="86" x2="240" y2="94" />
        </g>
        <g data-draft stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.4">
          <line x1="150" y1="390" x2="330" y2="390" />
          <line x1="150" y1="384" x2="150" y2="396" />
          <line x1="330" y1="384" x2="330" y2="396" />
          <line x1="240" y1="386" x2="240" y2="394" />
        </g>

        {/* coordinate crosshair markers — survey points at the corners of a bounding square */}
        {[
          [130, 130],
          [350, 130],
          [130, 350],
          [350, 350],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} data-draft stroke="var(--eng-red)" strokeWidth="1.2" strokeOpacity="0.55">
            <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} />
            <line x1={cx} y1={cy - 7} x2={cx} y2={cy + 7} />
          </g>
        ))}
      </svg>
    );
  }
);
