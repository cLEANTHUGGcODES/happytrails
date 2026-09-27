/**
 * Original vector construction informed by the walking studies in Eadweard
 * Muybridge's public-domain Descriptive Zoopraxography (1893), plate on p. 46.
 * See docs/inquiries.md for the reference. Coordinates describe complete leg
 * poses: grounded hooves travel back while lifted legs flex and recover.
 */
type Point = readonly [number, number];
type Step = { joint: Point; foot: Point };

const frontSteps: Step[] = [
  { joint: [236, 148], foot: [250, 195] },
  { joint: [232, 148], foot: [240, 195] },
  { joint: [227, 148], foot: [230, 195] },
  { joint: [222, 148], foot: [220, 195] },
  { joint: [217, 148], foot: [210, 195] },
  { joint: [212, 148], foot: [200, 195] },
  { joint: [208, 146], foot: [192, 193] },
  { joint: [217, 139], foot: [197, 178] },
  { joint: [238, 132], foot: [220, 162] },
  { joint: [248, 137], foot: [244, 168] },
  { joint: [247, 142], foot: [257, 180] },
  { joint: [241, 147], foot: [260, 190] },
];

const hindSteps: Step[] = [
  { joint: [106, 157], foot: [123, 195] },
  { joint: [97, 157], foot: [112, 195] },
  { joint: [89, 157], foot: [101, 195] },
  { joint: [82, 157], foot: [90, 195] },
  { joint: [76, 157], foot: [79, 195] },
  { joint: [69, 157], foot: [68, 195] },
  { joint: [62, 157], foot: [57, 195] },
  { joint: [57, 153], foot: [48, 190] },
  { joint: [66, 146], foot: [62, 173] },
  { joint: [83, 142], foot: [86, 164] },
  { joint: [106, 148], foot: [112, 174] },
  { joint: [113, 153], foot: [129, 187] },
];

function interpolate(steps: Step[], phase: number): Step {
  const index = Math.floor(phase) % steps.length;
  const next = (index + 1) % steps.length;
  const fraction = phase - Math.floor(phase);
  const point = (key: keyof Step): Point => [
    steps[index][key][0] + (steps[next][key][0] - steps[index][key][0]) * fraction,
    steps[index][key][1] + (steps[next][key][1] - steps[index][key][1]) * fraction,
  ];
  return { joint: point("joint"), foot: point("foot") };
}

function frontLeg(phase: number) {
  const { joint: [x, y], foot: [fx, fy] } = interpolate(frontSteps, phase);
  return `M205 91 C208 111 ${x - 10} ${y - 14} ${x - 4} ${y}
    L${fx - 4} ${fy - 9} Q${fx - 4} ${fy - 4} ${fx - 6} ${fy - 1}
    L${fx - 4} ${fy + 4} L${fx + 10} ${fy + 4}
    Q${fx + 10} ${fy} ${fx + 3} ${fy - 5}
    L${x + 4} ${y} C${x + 3} ${y - 19} 237 114 232 92 Z`;
}

function hindLeg(phase: number) {
  const { joint: [x, y], foot: [fx, fy] } = interpolate(hindSteps, phase);
  return `M65 76 C61 100 82 116 97 125
    Q${x + 12} ${y - 12} ${x + 4} ${y}
    L${fx + 3} ${fy - 8} Q${fx + 2} ${fy - 4} ${fx + 6} ${fy - 2}
    L${fx + 12} ${fy + 4} L${fx - 3} ${fy + 4}
    L${fx - 6} ${fy - 2} L${x - 4} ${y}
    Q${x - 6} ${y - 3} ${x - 4} ${y - 8}
    L80 126 C68 119 47 106 49 83 Z`;
}

export const horsePoses = Array.from({ length: 25 }, (_, frame) => {
  const phase = frame * 12 / 25;
  // Each opposite leg is half a stride apart; fore/hind pairs are offset
  // by a quarter stride, giving the walk its four distinct footfalls.
  return {
    farHind: hindLeg((phase + 9) % 12),
    farFront: frontLeg((phase + 6) % 12),
    nearHind: hindLeg((phase + 3) % 12),
    nearFront: frontLeg(phase),
  };
});
