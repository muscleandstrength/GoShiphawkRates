// Weight = box weight + packaging weight, per Trello card OIRZenzx —
// used for cubed shipping weight when calculating rate surcharges.
export interface Container {
  name: string
  weight: number
  length: number
  width: number
  height: number
  weightLimit: number
  maxVolume: number
}

export const CONTAINERS: Container[] = [
  { name: '12x12x12', weight: 0.90 + 0.20, length: 12, width: 12, height: 12, weightLimit: 100, maxVolume: 1432 },
  { name: '24x16x12', weight: 2.85 + 0.70, length: 24, width: 16, height: 12, weightLimit: 100, maxVolume: 4500 },
  { name: 'Mailer',   weight: 0.00,        length: 3,  width: 4.16, height: 6, weightLimit: 100, maxVolume: 75 },
  { name: 'S-4124',   weight: 0.75 + 0.15, length: 12, width: 8,  height: 12, weightLimit: 100, maxVolume: 970 },
  { name: 'S-4126',   weight: 0.85 + 0.20, length: 12, width: 12, height: 10, weightLimit: 100, maxVolume: 1300 },
  { name: 'S-4130',   weight: 0.55 + 0.15, length: 12, width: 6,  height: 10, weightLimit: 100, maxVolume: 712 },
  { name: 'S-4160',   weight: 0.95 + 0.20, length: 16, width: 12, height: 10, weightLimit: 100, maxVolume: 1680 },
  { name: 'S-4163',   weight: 1.00 + 0.25, length: 16, width: 12, height: 12, weightLimit: 100, maxVolume: 2100 },
  { name: 'S-4165',   weight: 1.35 + 0.35, length: 16, width: 16, height: 12, weightLimit: 100, maxVolume: 3000 },
  { name: 'S-4183',   weight: 1.25 + 0.35, length: 18, width: 14, height: 12, weightLimit: 100, maxVolume: 2700 },
  { name: 'S-4339',   weight: 1.55 + 0.70, length: 20, width: 16, height: 12, weightLimit: 100, maxVolume: 3750 },
  { name: 'S-4814',   weight: 0.50 + 0.15, length: 8,  width: 8,  height: 12, weightLimit: 100, maxVolume: 755 },

  // Added 2025-04-14
  { name: '8x6x6',    weight: 0.30 + 0.10, length: 8,  width: 6,  height: 6,  weightLimit: 100, maxVolume: 288 },
  { name: 'S-4081',   weight: 0.45 + 0.15, length: 12, width: 6,  height: 6,  weightLimit: 100, maxVolume: 432 },
  { name: 'S-4128',   weight: 0.40 + 0.15, length: 10, width: 10, height: 6,  weightLimit: 100, maxVolume: 600 },
  { name: 'X-29',     weight: 1.40 + 0.40, length: 18, width: 16, height: 14, weightLimit: 100, maxVolume: 4032 },
  { name: 'X-74',     weight: 2.90 + 0.80, length: 24, width: 18, height: 18, weightLimit: 100, maxVolume: 7776 },
]
