import { initialState } from './initialState'
import { type DOMValues } from './interfaces'
import { clearAllValues, clearActiveBtn } from './utils'

const billInput = document.getElementById('bill-input')! as HTMLInputElement
const peopleInput = document.getElementById('people-input')! as HTMLInputElement
const calcEl = document.getElementById('calc')! as HTMLDivElement
const billLabel = document.getElementById('bill-label')! as HTMLLabelElement

const tipAmountEl = document.getElementById(
  'tip-amount'
)! as HTMLParagraphElement
const totalPerPersonEl = document.getElementById(
  'total'
)! as HTMLParagraphElement
const customInput = document.getElementById('custom-input')! as HTMLInputElement
const btnReset = document.getElementById('btn-reset')! as HTMLButtonElement

const btnControls = Array.from(document.querySelectorAll('[data-id*="tip"]'))

billInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  let errorMsg: string = ''
  initialState.bill = Number(target.value)

  if (target.value.length) {
    errorMsg = createErrorMessage(initialState.bill)
    createErrorEl(billInput, errorMsg)
  }

  if (containsWhitespace(target.value)) {
    createErrorEl(billInput, 'Invalid input')
  }

  if (!target.value.length) {
    resetRenderDOM()
    errorMsg = ''
    createErrorEl(billInput, errorMsg)
  }
})

peopleInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  let errorMsg: string = ''
  initialState.numOfPeople = Number(target.value)

  if (target.value.length) {
    errorMsg = createErrorMessage(initialState.numOfPeople)
    createErrorEl(peopleInput, errorMsg)
  }

  if (target.value.includes('.') || containsWhitespace(target.value)) {
    createErrorEl(peopleInput, 'Invalid input')
  }

  if (!target.value.length) {
    resetRenderDOM()
    errorMsg = ''
    createErrorEl(peopleInput)
  }
})

customInput.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement

  let errorMsg: string = ''

  const targetInput = Number(target.value)

  initialState.selectedTip = isNaN(targetInput)
    ? targetInput
    : targetInput / 100

  if (target.value.length) {
    errorMsg = createErrorMessage(Number(target.value))
    createErrorEl(customInput, errorMsg, 'custom-error')
  }

  if (containsWhitespace(target.value)) {
    createErrorEl(customInput, 'Invalid input', 'custom-error')
  }

  if (!target.value.length) {
    resetRenderDOM()
    errorMsg = ''
    createErrorEl(customInput)
  }
})

customInput.addEventListener('focus', function (e) {
  const target = e.target as HTMLInputElement

  const targetInput = Number(target.value)
  if (isNaN(targetInput)) {
    initialState.selectedTip = targetInput
  } else {
    initialState.selectedTip = targetInput / 100
  }

  for (let button of btnControls) {
    const btnEl = button as HTMLButtonElement
    btnEl.classList.remove('active')
  }

  if (target.value.length) {
    let errorMsg: string = ''

    errorMsg = createErrorMessage(initialState.selectedTip)
    createErrorEl(customInput, errorMsg, 'custom-error')
  }

  if (target.value.includes('.') || containsWhitespace(target.value)) {
    createErrorEl(customInput, 'Invalid input', 'custom-error')
  }

  if (!target.value.length) {
    resetRenderDOM()
    createErrorEl(customInput)
  }

  validateAndGetResults()
})

btnControls.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const target = e.target as HTMLButtonElement

    initialState.hasError = false

    const errEl = btn.parentElement?.querySelector('span')! as HTMLSpanElement

    if (errEl) errEl.remove()

    initialState.selectedTip = parseFloat(target.outerText) / 100

    for (const button of btnControls) {
      const btnEl = button as HTMLButtonElement

      btnEl.classList.remove('active')

      if (btnEl.dataset.id === target.dataset.id) {
        target.classList.add('active')
      }
    }

    validateAndGetResults()
  })
})

calcEl.addEventListener('input', function (e) {
  const target = e.target as HTMLInputElement
  validateAndGetResults()
})

function validateAndGetResults() {
  if (!initialState.hasError) {
    if (
      initialState.bill > 0 &&
      initialState.selectedTip > 0 &&
      initialState.numOfPeople > 0
    ) {
      initialState.tipAmount =
        (initialState.bill / initialState.numOfPeople) *
        initialState.selectedTip
      initialState.total = Number(
        (
          initialState.bill / initialState.numOfPeople +
          initialState.tipAmount
        ).toFixed(2)
      )
      renderDOMValues(initialState.tipAmount, initialState.total)
      btnReset.classList.add('active')
      btnReset.removeAttribute('disabled')
    }
  } else {
    resetRenderDOM()
  }
}

function renderDOMValues(tip: number, total: number) {
  const values: DOMValues = { newTip: '', newTotal: '' }

  const decimalPoint = tip.toString().indexOf('.')

  if (
    isNaN(initialState.numOfPeople) ||
    isNaN(initialState.bill) ||
    isNaN(initialState.selectedTip) ||
    initialState.selectedTip <= 0 ||
    initialState.numOfPeople <= 0 ||
    initialState.bill <= 0
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
  btnReset.classList.remove('active')
  btnReset.setAttribute('disabled', '')
}

function createErrorEl(
  el: HTMLInputElement,
  message: string = '',
  className: string = 'error'
) {
  const errorEl = document.createElement('span') as HTMLSpanElement

  const errEl = el.parentElement?.querySelector('span')! as HTMLSpanElement

  if (errEl) {
    errEl.remove()
    el.classList.remove('invalid')
  }

  errorEl.classList.add(className)
  errorEl.textContent = message

  if (message.length !== 0) {
    initialState.hasError = true
    el.before(errorEl)
    el.classList.add('invalid')
  } else {
    initialState.hasError = false
  }
}

function containsWhitespace(str: string) {
  return /\s/.test(str)
}

function createErrorMessage(num: number): string {
  let err: string = ''

  if (num <= 0 || isNaN(num)) {
    if (num === 0) {
      err = "Can't be zero"
    }

    if (isNaN(num)) {
      err = 'Invalid input'
    }

    if (num < 0) {
      err = 'Invalid input'
    }
  }

  return err
}

window.addEventListener('load', () => {
  clearAllValues(
    initialState,
    billInput,
    peopleInput,
    customInput,
    tipAmountEl,
    totalPerPersonEl
  )
  btnReset.setAttribute('disabled', '')
})
btnReset.addEventListener('click', () => {
  btnReset.setAttribute('disabled', '')

  clearActiveBtn(btnReset, btnControls)

  clearAllValues(
    initialState,
    billInput,
    peopleInput,
    customInput,
    tipAmountEl,
    totalPerPersonEl
  )
})
