const PROOFS = [
  "Script approval before every video goes live",
  "72-hour turnaround on short video ads",
  "Full campaign report with reach and views breakdown",
];

export function CaseTicker() {
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: "#080b10",
        borderTop: "1px solid #1e2535",
        borderBottom: "1px solid #1e2535",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-center gap-0 flex-wrap md:flex-nowrap">
        {PROOFS.map((proof, i) => (
          <div key={i} className="flex items-center">
            <span
              className="text-xs font-medium text-center px-5 py-1 whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {proof}
            </span>
            {i < PROOFS.length - 1 && (
              <span
                className="hidden md:block shrink-0 w-px h-3.5 self-center"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
