function Pine({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-3" y="0" width="6" height="16" fill="#3b2a1a" />
      <path d="M0-78 16-48H8l14 24H12L28 2h-56l16-26h-10l14-24h-8z" />
    </g>
  )
}

export default function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <circle cx="1080" cy="150" r="70" fill="#f6d98a" />
      <path
        fill="#a9c4a4"
        d="M0 420 180 250l90 80 150-170 160 190 120-110 170 150 140-190 150 160 130-90 150 150V600H0z"
      />
      <path
        fill="#f4ecd8"
        d="m420 160-42 48 30-10 14 18 16-22 26 14zM1010 200l-36 49 28-12 12 16 14-20 24 12z"
      />
      <path
        fill="#5f9460"
        d="M0 480 160 370l140 90 190-140 170 130 150-100 190 120 170-130 270 150V600H0z"
      />
      <path
        fill="#228b22"
        d="M0 530 220 450l200 60 220-80 240 80 220-70 340 80V600H0z"
      />
      <g fill="#14532d">
        <Pine x={70} y={560} scale={1.5} />
        <Pine x={150} y={575} scale={1.1} />
        <Pine x={235} y={565} scale={1.7} />
        <Pine x={330} y={585} scale={1.0} />
        <Pine x={1090} y={585} scale={1.0} />
        <Pine x={1180} y={565} scale={1.6} />
        <Pine x={1275} y={578} scale={1.2} />
        <Pine x={1370} y={560} scale={1.8} />
      </g>
      <path fill="#14532d" d="M0 575 360 560l360 20 360-22 360 17V600H0z" />
    </svg>
  )
}
