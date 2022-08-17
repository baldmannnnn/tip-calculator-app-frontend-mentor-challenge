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

  if (isNaN(Number(target.value)) || Number(target.value) === 0) {
    selectedTip = 0
  } else {
    selectedTip = parseFloat(target.value) / 100
  }
})

customInput.addEventListener('focus', function (e) {
  const target = e.target as HTMLInputElement
  for (let button of btnControls) {
    const btnEl = button as HTMLButtonElement
    btnEl.classList.remove('active')
  }

  selectedTip = parseFloat(target.value) / 100

  if (isNaN(selectedTip)) {
    selectedTip = 0
  }

  if (bill > 0 && selectedTip > 0 && numOfPeople > 0) {
    tipAmount = (bill / numOfPeople) * selectedTip
    total = Number((bill / numOfPeople + tipAmount).toFixed(2))

    renderDOMValues(tipAmount, total)
  } else {
    renderDOMValues(0, 0)
  }
})

btnControls.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const target = e.target as HTMLButtonElement
    selectedTip = parseFloat(target.outerText) / 100

    if (bill > 0 && selectedTip > 0 && numOfPeople > 0) {
      tipAmount = (bill * selectedTip) / numOfPeople
      total = Number((bill / numOfPeople + tipAmount).toFixed(2))
      renderDOMValues(tipAmount, total)
    } else {
      renderDOMValues(0, 0)
    }

    for (let button of btnControls) {
      const btnEl = button as HTMLButtonElement

      btnEl.classList.remove('active')

      if (btnEl.dataset.id === target.dataset.id) {
        target.classList.add('active')
      }
    }
  })
})

calcEl.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  if (bill > 0 && selectedTip > 0 && numOfPeople > 0) {
    tipAmount = (bill / numOfPeople) * selectedTip
    total = Number((bill / numOfPeople + tipAmount).toFixed(2))

    renderDOMValues(tipAmount, total)
  } else {
    renderDOMValues(0, 0)
  }
})

interface DOMValues {
  newTip: string
  newTotal: string
}

function renderDOMValues(tip: number, total: number) {
  const values: DOMValues = { newTip: '', newTotal: '' }

  const decimalPoint = tip.toString().indexOf('.')

  if (
    isNaN(numOfPeople) ||
    isNaN(bill) ||
    isNaN(selectedTip) ||
    selectedTip <= 0 ||
    numOfPeople <= 0 ||
    bill <= 0
  ) {
    values.newTip = '0.00'
    values.newTotal = '0.00'
  } else {
    values.newTip = tip
      .toString()
      .split('')
      .splice(0, decimalPoint + 3)
      .join('')

    values.newTotal = total.toString()
  }

  tipAmountEl.textContent = `$${values.newTip}`
  totalPerPersonEl.textContent = `$${values.newTotal}`
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
  customInput.value = ''
}

window.addEventListener('load', clearAllValues)
btnReset.addEventListener('click', clearAllValues)
