import { type Calc } from './interfaces'

export const clearAllValues = (
  initialState: Calc,
  billInput: HTMLInputElement,
  peopleInput: HTMLInputElement,
  customInput: HTMLInputElement,
  tipAmountEl: HTMLParagraphElement,
  totalPerPersonEl: HTMLParagraphElement
) => {
  initialState.bill = 0
  initialState.selectedTip = 0
  initialState.numOfPeople = 0
  initialState.tipAmount = 0
  initialState.total = 0
  billInput.value = ''
  peopleInput.value = ''
  customInput.value = ''
  tipAmountEl.textContent = '$0.00'
  totalPerPersonEl.textContent = '$0.00'
}

export const clearActiveBtn = (
  button: HTMLButtonElement,
  collection: Element[]
) => {
  for (const el of collection) {
    el.classList.remove('active')
  }

  button.classList.remove('active')
}
