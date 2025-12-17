export default function WheelsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer wheel circle */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" />
      
      {/* Inner hub circle */}
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
      
      {/* Spokes */}
      <line x1="50" y1="5" x2="50" y2="35" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="65" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
      <line x1="5" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
      
      {/* Diagonal spokes */}
      <line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="20" x2="65" y2="35" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="80" x2="35" y2="65" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="80" x2="65" y2="65" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

