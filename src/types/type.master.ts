interface IdentifiableEntry {
  id: string;
}

export interface MasterTrigger {
  multiplicand: IdentifiableEntry;
  multiplier: IdentifiableEntry;
}
