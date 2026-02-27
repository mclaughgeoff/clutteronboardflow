import { createContext, useContext } from "react";

export type Branch = 'A' | 'B1' | 'B2' | 'B3' | 'B4'
export type Situation = 'moving' | 'relocating' | 'declutter' | 'lifechange' | 'renovation' | 'other'
export type Tier = 'whiteglove' | 'prepacked' | 'youload'
export type Plan = 'committed' | 'longhaul' | 'flexible'
export type ArrivalType = 'flexible' | 'scheduled'
export type SizeMethod = 'quick' | 'advisor'
export type MovingRoute = 'clutter' | 'flex'
export type Timeline = 'under3mo' | '3to6mo' | '6moplus' | 'unsure'

export interface FlowState {
  zip: string
  intent: 'storage' | 'moving' | 'moveonly' | null
  needsStorage: boolean | null
  moveDistance: 'local' | 'longdistance' | null
  branch: Branch | null
  situation: Situation | null
  timeline: Timeline | null
  sizeMethod: SizeMethod | null
  selectedBedrooms: string | null
  selectedItems: { name: string; count: number }[]
  totalCuft: number
  sizeIdx: number
  sizeName: string
  plan: Plan
  tier: Tier
  pickupDate: Date | null
  deliveryDate: Date | null
  storageUnknown: boolean
  movingRoute: MovingRoute | null
  arrivalType: ArrivalType
  arrivalWindow: string
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupAddress: string
  deliveryAddress: string
  addons: {
    packing: null | '1-10' | '15-25' | 'unlimited'
    disposal: boolean
    protection: null | 'standard' | 'premium'
  }
  bedrooms: string | null
  moveDate: Date | null
}

export const defaultState: FlowState = {
  zip: '',
  intent: null,
  needsStorage: null,
  moveDistance: null,
  branch: null,
  situation: null,
  timeline: null,
  sizeMethod: null,
  selectedBedrooms: null,
  selectedItems: [],
  totalCuft: 0,
  sizeIdx: 4,
  sizeName: '10×20 One Bedroom',
  plan: 'committed',
  tier: 'whiteglove',
  pickupDate: null,
  deliveryDate: null,
  storageUnknown: false,
  movingRoute: null,
  arrivalType: 'flexible',
  arrivalWindow: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  pickupAddress: '',
  deliveryAddress: '',
  addons: { packing: null, disposal: false, protection: null },
  bedrooms: null,
  moveDate: null,
}

interface FlowContextType {
  state: FlowState
  setState: (updater: Partial<FlowState> | ((prev: FlowState) => Partial<FlowState>)) => void
}

export const FlowContext = createContext<FlowContextType>({
  state: defaultState,
  setState: () => {},
})

export function useFlowState() {
  return useContext(FlowContext)
}
