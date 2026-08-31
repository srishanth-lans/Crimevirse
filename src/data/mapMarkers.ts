export interface CaseMarker {
  caseId: string;
  label: string;
  x: number;
  z: number;
}

export const CASE_MARKERS: CaseMarker[] = [
  { caseId: "midnight-courier", label: "Riverfront Scene", x: -12, z: 14 },
  { caseId: "cold-storage", label: "Pier 7 Warehouse", x: 14, z: -20 },
  { caseId: "silent-caller", label: "Silent Caller Leads", x: 0, z: 26 },
];

export interface District {
  name: string;
  x: number;
  z: number;
}

export const DISTRICTS: District[] = [
  { name: "Precinct Row", x: 0, z: -14 },
  { name: "Old Quarter", x: -18, z: 8 },
  { name: "Docks District", x: 16, z: -18 },
  { name: "Uptown", x: -8, z: 24 },
  { name: "East End", x: 20, z: 20 },
];

export const MAP_BOUNDS = 38;
