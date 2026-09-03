export interface BuildingDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export const BUILDINGS: BuildingDef[] = [
  { id: "precinct", position: [0, 3.5, -14], size: [14, 7, 10], color: "#1e2530" },
  { id: "b1", position: [-16, 3, -10], size: [8, 6, 7], color: "#25211c" },
  { id: "b2", position: [16, 4, -8], size: [7, 8, 8], color: "#2b2620" },
  { id: "b3", position: [-18, 2.5, 8], size: [6, 5, 9], color: "#1e1a15" },
  { id: "b4", position: [18, 3, 10], size: [7, 6, 6], color: "#25211c" },
  { id: "b5", position: [-10, 2, 20], size: [10, 4, 5], color: "#100d0b" },
  { id: "b6", position: [12, 2.5, 22], size: [8, 5, 6], color: "#1e1a15" },
  { id: "b7", position: [-22, 3.5, -20], size: [5, 7, 5], color: "#2b2620" },
  { id: "b8", position: [22, 2, -18], size: [6, 4, 7], color: "#25211c" },
  { id: "b9", position: [8, 1.8, -24], size: [9, 3.5, 4], color: "#1e1a15" },
  { id: "b10", position: [-8, 4, 28], size: [5, 8, 5], color: "#100d0b" },
  { id: "b11", position: [28, 3, -4], size: [6, 6, 6], color: "#25211c" },
  { id: "b12", position: [-28, 2.5, -6], size: [7, 5, 7], color: "#1e1a15" },
  { id: "b13", position: [26, 2, 28], size: [6, 4, 6], color: "#2b2620" },
  { id: "b14", position: [-26, 3, 22], size: [6, 6, 6], color: "#100d0b" },
];

/** A couple of raised plazas/steps so the ground isn't perfectly flat. */
export interface PlatformDef {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  height: number;
  color: string;
}

export const PLATFORMS: PlatformDef[] = [
  { id: "plaza-1", position: [0, 0, 6], size: [9, 0, 9], height: 0.5, color: "#2b271f" },
  { id: "plaza-2", position: [-14, 0, -2], size: [6, 0, 6], height: 0.9, color: "#26221c" },
  { id: "plaza-3", position: [14, 0, -2], size: [6, 0, 6], height: 0.9, color: "#26221c" },
];
