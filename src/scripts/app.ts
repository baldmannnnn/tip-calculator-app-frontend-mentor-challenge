const billInput = document.getElementById('bill-input')! as HTMLInputElement
const peopleInput = document.getElementById('people-input')! as HTMLInputElement
const calcEl = document.getElementById('calc')! as HTMLDivElement

const tipAmountEl = document.getElementById(
  'tip-amount'
)! as HTMLParagraphElement
const totalPerPersonEl = document.getElementById(
  'total'
)! as HTMLParagraphElement
const customInput = document.getElementById('custom-input')! as HTMLInputElement
const btnReset = document.getElementById('btn-reset')! as HTMLButtonElement

const btnControls = Array.from(document.querySelectorAll('[data-id*="tip"]'))

let bill: number = 0
let selectedTip: number = 0
let numOfPeople: number = 0
let tipAmount: number = 0
let total: number = 0

billInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement
  bill = parseFloat(target.value)

  if (target.value.length === 0) resetRenderDOM()
})

peopleInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement
  numOfPeople = parseFloat(target.value)

  if (target.value.length === 0) resetRenderDOM()
})

customInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  if (!isNaN(Number(target.value))) {
    selectedTip = parseFloat(target.value) / 100
  } else {
    console.error('error')
  }
})

btnControls.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const target = e.target as HTMLButtonElement
    selectedTip = parseFloat(target.outerText) / 100

    if (bill !== 0 && selectedTip !== 0 && numOfPeople !== 0) {
      tipAmount = (bill * selectedTip) / numOfPeople
      total = Number((bill / numOfPeople + tipAmount).toFixed(2))

      const { newTip, newTotal } = renderDOMValues(tipAmount, total)

      tipAmountEl.textContent = newTip
      totalPerPersonEl.textContent = newTotal
    }
  })
})

calcEl.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  if (bill > 0 && selectedTip > 0 && numOfPeople > 0) {
    tipAmount = (bill / numOfPeople) * selectedTip
    total = Number((bill / numOfPeople + tipAmount).toFixed(2))

    const { newTip, newTotal } = renderDOMValues(tipAmount, total)

    tipAmountEl.textContent = newTip
    totalPerPersonEl.textContent = newTotal
  }
})

function renderDOMValues(
  tip: number,
  total: number
): { newTip: string; newTotal: string } {
  let newTip: string
  let newTotal: string

  const decimalPoint = tip.toString().indexOf('.')

  if (isNaN(numOfPeople) || isNaN(bill) || isNaN(selectedTip))
    return { newTip: '$0.00', newTotal: '$0.00' }

  newTip = tip
    .toString()
    .split('')
    .splice(0, decimalPoint + 3)
    .join('')

  newTotal = total.toString()

  return { newTip, newTotal }
}

function resetRenderDOM() {
  tipAmountEl.textContent = '$0.00'
  totalPerPersonEl.textContent = '$0.00'
}

function clearAllValues() {
  bill = 0
  selectedTip = 0
  numOfPeople = 0
  tipAmount = 0
  total = 0
  billInput.value = ''
  peopleInput.value = ''
}

window.addEventListener('load', clearAllValues)
btnReset.addEventListener('click', clearAllValues)
