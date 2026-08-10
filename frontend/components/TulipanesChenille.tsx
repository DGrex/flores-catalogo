interface ColorTulip {
  principal: string;
  acento: string;
}

// Un solo pétalo: base angosta (se une al centro de la flor) y punta
// redondeada arriba, como el de un tulipán real. Tres de estos, superpuestos
// y abiertos en abanico, forman la copa característica de la flor.
const PETALO =
  "M0,0 C-9,-3 -15,-11 -16,-23 C-17,-33 -11,-43 0,-49 " +
  "C11,-43 17,-33 16,-23 C15,-11 9,-3 0,0 Z";

// Pétalo interior de acento, asomando entre los pétalos delanteros.
const ACENTO =
  "M0,0 C-6,-3 -10,-9 -10,-18 C-10,-26 -6,-33 0,-37 " +
  "C6,-33 10,-26 10,-18 C10,-9 6,-3 0,0 Z";

const HOJA =
  "M0,-6 C20,-15 46,-11 62,0 C46,11 20,15 0,6 Z";

interface TulipProps {
  x: number;
  y: number;
  stem: string;
  headRotate?: number;
  scale?: number;
  colors: ColorTulip;
  delay?: string;
}

function Tulip({ x, y, stem, headRotate = 0, scale = 1, colors, delay = "0s" }: TulipProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="animate-tulip-sway"
        style={{ transformOrigin: "0px 0px", animationDelay: delay }}
      >
        <path d={stem} fill="none" stroke="#4c9a6a" strokeWidth={5.5} strokeLinecap="round" />
        <g transform={`rotate(${headRotate}) scale(${scale})`}>
          {/* pétalos laterales, abiertos hacia los costados */}
          <path d={PETALO} fill={colors.principal} transform="translate(-10,-1) rotate(-32)" />
          <path d={PETALO} fill={colors.principal} transform="translate(10,-1) rotate(32)" />
          {/* leve sombra del petalo derecho para dar volumen */}
          <path
            d={PETALO}
            fill={colors.acento}
            opacity={0.3}
            transform="translate(10,-1) rotate(32)"
          />
          {/* pétalo de acento, asomando entre los laterales */}
          <path d={ACENTO} fill={colors.acento} transform="translate(0,-16) scale(0.95)" />
          {/* pétalo frontal, más alto, al centro: queda por delante de todo */}
          <path d={PETALO} fill={colors.principal} transform="translate(0,-3) scale(1.05)" />
        </g>
      </g>
    </g>
  );
}

function Hoja({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={HOJA} fill={color} />
      <path d="M4,0 L56,0" stroke="#00000022" strokeWidth={1.2} />
    </g>
  );
}

function Puff({ x, y, r, color, delay = "0s" }: { x: number; y: number; r: number; color: string; delay?: string }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={color}
      opacity={0.45}
      className="animate-puff-float"
      style={{ animationDelay: delay }}
    />
  );
}

export default function TulipanesChenille() {
  const convergencia = { x: 190, y: 313 };

  return (
    <svg
      viewBox="0 0 380 380"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label="Ilustración de tres tulipanes"
    >
      <Puff x={60} y={100} r={5} color="#f5a8cb" delay="0.2s" />
      <Puff x={320} y={130} r={4} color="#c9a8e0" delay="0.9s" />
      <Puff x={270} y={60} r={3.5} color="#e0559f" delay="1.4s" />

      {/* hojas cruzadas en la base, detrás de los tallos */}
      <Hoja x={convergencia.x} y={convergencia.y} rotate={138} color="#3a7d53" />
      <Hoja x={convergencia.x} y={convergencia.y} rotate={42} color="#4c9a6a" />

      <Tulip
        x={105}
        y={225}
        stem={`M0,0 C10,30 40,55 ${convergencia.x - 105},${convergencia.y - 225}`}
        headRotate={-24}
        scale={1.05}
        colors={{ principal: "#f5a8cb", acento: "#e0559f" }}
        delay="0.3s"
      />
      <Tulip
        x={190}
        y={195}
        stem={`M0,0 C3,40 -3,85 0,${convergencia.y - 195}`}
        headRotate={0}
        scale={1.3}
        colors={{ principal: "#c93d85", acento: "#a52d69" }}
        delay="0s"
      />
      <Tulip
        x={275}
        y={225}
        stem={`M0,0 C-10,30 -40,55 ${convergencia.x - 275},${convergencia.y - 225}`}
        headRotate={24}
        scale={1.05}
        colors={{ principal: "#c9a8e0", acento: "#a980c4" }}
        delay="0.6s"
      />
    </svg>
  );
}
