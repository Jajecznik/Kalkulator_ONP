class Calculator {
    constructor(topDisplayText, display1Text, display2Text, display3Text, stack, correct, new_input, calc) {
        this.topDisplayText = topDisplayText
        this.display1Text = display1Text
        this.display2Text = display2Text
        this.display3Text = display3Text
        this.stack = stack
        this.correct = correct
        this.new_input = new_input
        this.calc = calc
        this.clear_all()
    }

    // wyświetlanie na ekranie 
    update_display() {
        this.topDisplayText.innerText = this.topDisplay
        this.display1Text.innerText = this.display1
        this.display2Text.innerText = this.display2
        this.display3Text.innerText = this.display3
    }

    // update wartości wyświetlanych wyników
    display() {
        if (this.stack[0] === undefined) this.topDisplay = ''
        else this.topDisplay = this.stack[0]

        if (this.stack[1] === undefined) this.display1 = ''
        else this.display1 = this.stack[1]

        if (this.stack[2] === undefined) this.display2 = ''
        else this.display2 = this.stack[2]

        if (this.stack[3] === undefined) this.display3 = ''
        else this.display3 = this.stack[3]
    }

    // czyszczenie całego kalkulatora
    clear_all() {
        this.topDisplay = ''
        this.display1 = ''
        this.display2 = ''
        this.display3 = ''
        this.operation = undefined
        this.stack = []
        this.correct = true
        this.new_input = false
    }

    // czyszczenie pierwszej pozycji
    clear() {
        if (this.stack.length === 0 ) return
        this.stack.shift()
        this.operation = undefined
        this.correct = true
        this.display()
    }

    // wprowadzanie cyfr
    append_number(number) {
        if (this.calc === true) {
            this.stack.unshift(this.stack[0])
            this.topDisplay = ''
        }
        else if (this.new_input === true) {
            this.topDisplay = ''         
        }

        this.topDisplay = this.topDisplay.toString() + number.toString()
        this.stack[0] = this.topDisplay
        this.new_input = false
        this.correct = true
        this.calc = false
        this.display()
    }

    // wprowadzenie liczby (ENTER)
    add_number() {
        if (this.correct === false) {
            this.topDisplay = "Wpisz liczbę lub kliknij C lub CC"
            return
        }       
        if (this.topDisplay === '') return

        this.stack.unshift(this.topDisplay)
        this.new_input = true
        this.display()
    }

    // swap button
    swap() {
        if (this.correct === false) {
            this.topDisplay = "Wpisz liczbę lub kliknij C lub CC"
            return
        }
        if (this.topDisplay === '') return
        if (this.display1 === '') return

        const z = this.stack[0]
        this.stack[0] = this.stack[1]
        this.stack[1] = z

        this.topDisplay = this.stack[0]
        this.display1 = this.stack[1]
    }

    // operation buttons
    choose_operation(operation) {
        if (this.topDisplay === '' || this.display1 === '') return
        this.operation = operation
        this.compute()
    }

    // obliczanie 
    compute() {
        if (this.correct === false) {
            this.topDisplay = "Wpisz liczbę lub kliknij C lub CC"
            return
        }
        let result
        const first = parseFloat(this.stack[0])
        const second = parseFloat(this.stack[1])
        if (isNaN(first) || isNaN(second)) return
        
        switch (this.operation) {
            case '+':
                result = second + first
                if (result > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                break

            case '-':
                result = second - first
                if (result < Number.MIN_SAFE_INTEGER){
                    this.topDisplay = 'Za mało'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                else if (result < 0) {
                    this.topDisplay = 'Liczba ujemna'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                break

            case '*':
                result = second * first
                if (result > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                break

            case '/':
                if (first == 0) {
                    this.topDisplay = 'Dzielenie przez 0'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                else if (result > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                result = second / first
                result = Math.round(result)
                break

            case '%':
                result = second % first
                if (result > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                break

            case 'xy':
                result = Math.pow(second, first)
                if (result > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                break

            case 'GCD':
                if (first > Number.MAX_SAFE_INTEGER || second > Number.MAX_SAFE_INTEGER){
                    this.topDisplay = 'Za dużo'
                    this.stack.unshift(this.topDisplay)
                    this.display()
                    this.correct = false
                    this.new_input = true
                    return
                }
                let x = Math.abs(first)
                let y = Math.abs(second)
                    while(y) {
                        let t = y
                        y = x % y
                        x = t
                    }
                result = x
                break

            default:
                return
        }

        this.stack.shift()
        this.stack.shift()
        this.stack.unshift(result)
        this.new_input = true
        this.calc = true
        this.operation = undefined
        this.display()
    }

    // rozkład liczby na liczby pierwsze
    frac() {
        if (this.topDisplay === '') return 
        let n = parseInt(this.stack[0])
        let product = []
        
        while (n % 2 == 0) {
            product.unshift(2)
            n = Math.floor(n / 2);
        }

        for (let i = 3; i <= Math.floor(Math.sqrt(n)); i = i + 2) {
            while (n % i == 0) {
                product.unshift(i)
                n = Math.floor(n / i);
            }
        }

        if (n > 2)
        product.unshift(n)
        this.topDisplay = ''
        this.topDisplay = parseInt(this.stack[0])
        this.topDisplay = this.topDisplay + ' = '
        product.forEach (p => {
            this.topDisplay = this.topDisplay + p + ' * '
        })
        this.topDisplay = this.topDisplay.toString().slice(0,this.topDisplay.length -2)
        this.new_input = true
        this.correct = true
    }

    // rozkład liczby parzystej na sumę liczb pierwszych 
    pq() {
        if (this.topDisplay === '') return 
        let n = parseInt(this.stack[0])
        if (n < 5 || n % 2 !== 0) {
            this.topDisplay = "Zła wartość (parzysta > 4)"
            this.stack.unshift(this.topDisplay)
            this.display()
            this.correct = false
            this.new_input = true
            return
        }
        let tab = []
        
        for (let i = 2; i < n; i++) {
            if (this.isPrime(i)) {
                tab.unshift(i)
            }
        }

        let l1, l2 = 0
        let z = false
        for (let i = 0; i < tab.length; i++) {  
            for (let j = 0; j < tab.length; j++) {
                if (tab[i] + tab[j] === n){
                    z = true
                    l1 = tab[i]
                    l2 = tab[j]
                    break
                }
            }
            if (z === true) break
        }
        this.topDisplay = ''
        this.topDisplay = parseInt(this.stack[0])
        this.topDisplay = this.topDisplay + ' = ' + l1 + ' + ' + l2
        this.new_input = true
        this.correct = true
    }

    // czy liczba jest liczbą pierwszą
    isPrime(val){
        for (let i = 2; i < val; i++) {
          if (val % i === 0) {
            return false;
          }
        }
        return true;
      }
}

const topDisplayText = document.querySelector('[data-top]')
const display1Text = document.querySelector('[data-display1]')
const display2Text = document.querySelector('[data-display2]')
const display3Text = document.querySelector('[data-display3]')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const pqButton = document.querySelector('[data-pq]')
const fracButton = document.querySelector('[data-frac]')
const clearAllButton = document.querySelector('[data-clear-all]')
const clearButton = document.querySelector('[data-clear]')
const enterButton = document.querySelector('[data-enter]')
const swapButton = document.querySelector('[data-swap]')

let stack = []
let correct = true
let new_input = false
let calc = false

const calculator = new Calculator(topDisplayText, display1Text, display2Text, display3Text, stack, correct, new_input, calc)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.append_number(button.innerText)
        calculator.update_display()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.choose_operation(button.innerText)
        calculator.update_display()
    })
})

enterButton.addEventListener('click', button => {
    calculator.add_number()
    calculator.update_display()
})

clearAllButton.addEventListener('click', button => {
    calculator.clear_all()
    calculator.update_display()
})

clearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.update_display()
})

swapButton.addEventListener('click', button => {
    calculator.swap()
    calculator.update_display()
})

pqButton.addEventListener('click', button => {
    calculator.pq()
    calculator.update_display()
})

fracButton.addEventListener('click', button => {
    calculator.frac()
    calculator.update_display()
})