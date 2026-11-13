import Svg, { Defs, LinearGradient, Stop, Rect, Line, Path, Circle, Polyline, G } from 'react-native-svg';

const WHITE = '#FFFFFF';
const stroke = {
  fill: 'none',
  stroke: WHITE,
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Base({ id, size, children }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7CC04A" />
          <Stop offset="1" stopColor="#58C6CB" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="48" height="48" rx="14" fill={`url(#${id})`} />
      <G {...stroke}>{children}</G>
    </Svg>
  );
}

function CalendarFrame() {
  return (
    <>
      <Rect x="10" y="13" width="28" height="24" rx="2.5" />
      <Line x1="10" y1="19.5" x2="38" y2="19.5" />
      <Line x1="17" y1="9.5" x2="17" y2="15.5" />
      <Line x1="31" y1="9.5" x2="31" y2="15.5" />
    </>
  );
}

const ICONS = {
  mes: (id, size) => (
    <Base id={id} size={size}>
      <CalendarFrame />
      <Line x1="17" y1="32" x2="17" y2="28" />
      <Line x1="24" y1="32" x2="24" y2="24" />
      <Line x1="31" y1="32" x2="31" y2="26" />
    </Base>
  ),
  tarefas: (id, size) => (
    <Base id={id} size={size}>
      <Rect x="12" y="11" width="24" height="28" rx="3" />
      <Rect x="19" y="8" width="10" height="6" rx="2" fill={`url(#${id})`} />
      <Path d="M16.5 20.5 l2 2 l3.5 -3.5" />
      <Line x1="25" y1="21" x2="32" y2="21" />
      <Path d="M16.5 27.5 l2 2 l3.5 -3.5" />
      <Line x1="25" y1="28" x2="32" y2="28" />
      <Rect x="17" y="33" width="4" height="3.5" rx="1" />
      <Line x1="25" y1="35" x2="32" y2="35" />
    </Base>
  ),
  calendario: (id, size) => (
    <Base id={id} size={size}>
      <CalendarFrame />
      <Rect x="20" y="23.5" width="4" height="3.5" rx="0.8" />
      <Rect x="28" y="23.5" width="4" height="3.5" rx="0.8" />
      <Rect x="28" y="30" width="4" height="3.5" rx="0.8" fill={WHITE} />
      <Circle cx="14.5" cy="35" r="7" fill={`url(#${id})`} />
      <Polyline points="14.5,31.5 14.5,35 17,36.5" />
    </Base>
  ),
  relatorio: (id, size) => (
    <Base id={id} size={size}>
      <Path d="M15 9 H28 L35 16 V37 A2 2 0 0 1 33 39 H15 A2 2 0 0 1 13 37 V11 A2 2 0 0 1 15 9 Z" />
      <Path d="M28 9 V16 H35" />
      <Line x1="17.5" y1="21" x2="26" y2="21" />
      <Line x1="17.5" y1="26" x2="30" y2="26" />
      <Line x1="17.5" y1="31" x2="23" y2="31" />
      <Circle cx="33.5" cy="34.5" r="7" fill={`url(#${id})`} />
      <G transform="rotate(-45 33.5 34.5)">
        <Rect x="28.8" y="32.6" width="9.4" height="3.8" rx="1.9" />
        <Line x1="33.5" y1="32.6" x2="33.5" y2="36.4" />
      </G>
    </Base>
  ),
};

export default function VitaIcon({ name, size = 40 }) {
  const draw = ICONS[name];
  return draw ? draw(`vf-${name}`, size) : null;
}