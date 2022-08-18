import { type Calc } from './interfaces'

export const initialState: Calc = {
  bill: 0,
  selectedTip: 0,
  numOfPeople: 0,
  tipAmount: 0,
  total: 0,
  hasError: false,
}
