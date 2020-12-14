import { MessageType } from './type.message';

export interface EntryResult {
  type: MessageType.EntryResult;
  id: string;
  row_index: number;
  column_index: number;
  result: number;
}
