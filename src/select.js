export class Select {
    constructor(elementWrapper, options) {
        this.$instance = document.querySelector(elementWrapper);
        this.options = options;
        this.#render();
        this.#setup(); 
    }
    
    #render() {
       const {data, placeholder, selectedId} = this.options; // Important!
       this.$instance.innerHTML = createInstance(data, placeholder, selectedId);
    }
    
    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.buttonHandler = this.buttonHandler.bind(this);
        this.$instance.addEventListener('click', this.clickHandler);
        
        this.$input = this.$instance.querySelector('[data-element="input"]');
        this.$input.addEventListener('keydown', this.buttonHandler);
        this.$instanceCloseWrap = this.$instance.querySelector('[data-element="backdrop"]')
    }
    
    clickHandler(event) {
        const targetOblect = event.target.dataset;
        if (targetOblect.element === 'input') {
            this.toggle();
        } else if (targetOblect.type === 'item') {
            const itemId = targetOblect.id;
            this.select(itemId);
            this.close();
        } else if (targetOblect.element === 'backdrop') {
            this.close();
        }
    }
    
    buttonHandler(event) {
        if (event.keyCode === 13 || event.keyCode === 32) { // Enter
            this.toggle();
        } else if (event.keyCode === 40) { // Arrow up
            this.select(this.options.selectedId + 1);
            this.options.selectedId++;
        } else if (event.keyCode === 38) { // Arrow down
            this.select(this.options.selectedId - 1);
            this.options.selectedId--;
        } else if (event.keyCode === 27) { // Esc
            this.close();
        }
    }
    
    select(id) {
        this.selectedId = id;
        this.$input.value = this.currentSelect.value;
        this.$instance.querySelectorAll('[data-type="item"]').forEach(element => {
            element.classList.remove('selected');
        });
        this.$instance.querySelector(`[data-id="${id}"]`).classList.add('selected');
        
        this.options.onSelect ? this.options.onSelect(this.currentSelect) : null;
    }
    
    get currentSelect() {
        return this.options.data.find(item => item.id === +this.selectedId);
    }
    
    get isOpen() {
        return this.$instance.classList.contains('open');
    }
    
    open() {
        this.$instance.classList.add('open');
    }
    
    close() {
        this.$instance.classList.remove('open');
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open(); 
    }
    
    destroy() {
        this.$instance.removeEventListener('click', this.clickHandler);
        this.$input.removeEventListener('keydown', this.buttonHandler);
        this.$instance.remove();
    }
};

function createInstance(data = [], placeholder, selectedId) {
    let inputPlaceholder = placeholder ?? 'Select';
    let inputValue = '';
    let selectedClass = 'selected';
    
    const optionsList = data.map(item => {
        if (item.id === selectedId) {
            inputValue = item.value;
            return `
            <li class="select__option ${selectedClass}" data-id="${item.id}" data-type="item" aria-label="Answer option: ${item.value}">${item.value}</li>
        `
        }
        
        return `
            <li class="select__option" data-id="${item.id}" data-type="item" aria-label="Answer option: ${item.value}">${item.value}</li>
        `
    });
    
    return `
    <div class="page__select select">
        <div class="select__backdrop" data-element="backdrop"]></div>
        <label for="select-input" class="select__label">Choose from custom select</label>
        <input class="select__input" type="text" id="select-iput" data-element="input" aria-label="Your current choice is: ${inputValue}" value="${inputValue}" placeholder="${inputPlaceholder}">
        <ul class="select__dropdown">
            ${optionsList.join('')}
        </ul>
    </div> 
    `
};