class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const title = document.createElement('h1');
        title.textContent = 'Lotto Number Generator';

        const numbersContainer = document.createElement('div');
        numbersContainer.setAttribute('class', 'numbers');

        const button = document.createElement('button');
        // Add SVG icon and text to the button
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 7.54 5.24l-4.48 4.48"></path>
                <path d="M3.51 15A9 9 0 0 0 16.46 18.76l4.48-4.48"></path>
            </svg>
            <span>Generate Numbers</span>
        `;
        button.addEventListener('click', () => {
            this.generateNumbers(numbersContainer);
        });

        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            h1 {
                color: #fff;
                font-size: 2.5em;
                margin-bottom: 30px;
            }
            .numbers {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            .number {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                color: white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: transform 0.3s ease, background-color 0.3s ease;
            }
            .number:hover {
                transform: translateY(-5px);
            }
            button {
                margin-top: 30px;
                padding: 15px 30px;
                font-size: 18px;
                cursor: pointer;
                border: none;
                border-radius: 50px;
                background: linear-gradient(45deg, #4CAF50, #81C784);
                color: white;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            }
            button:active {
                transform: scale(1);
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            button svg {
                transition: transform 0.5s ease;
            }
            button:hover svg {
                transform: rotate(180deg);
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(title);
        wrapper.appendChild(button); // Button before numbers
        wrapper.appendChild(numbersContainer);
    }

    generateNumbers(container) {
        container.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        
        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const numberDiv = document.createElement('div');
                numberDiv.setAttribute('class', 'number');
                numberDiv.textContent = number;
                numberDiv.style.backgroundColor = this.getNumberColor(number);
                container.appendChild(numberDiv);
            }, index * 100); // Staggered animation
        });
    }

    getNumberColor(number) {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';    // Gray
        return '#b0d840'; // Green
    }
}

customElements.define('lotto-generator', LottoGenerator);
