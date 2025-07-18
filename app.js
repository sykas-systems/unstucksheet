// The Unstuck Sheet Application Logic
class UnstuckSheet {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 5;
        this.data = {
            options: [],
            selectedPriorities: [],
            scores: {},
            results: [],
            chosenOption: null,
            nextAction: '',
            category: ''
        };
        
        this.priorities = [
            {id: "time", label: "Time", description: "How much time will this take or save?"},
            {id: "effort", label: "Effort", description: "How much energy and work will this require?"},
            {id: "cost", label: "Cost", description: "What's the financial investment and potential savings?"},
            {id: "simple", label: "Simple", description: "How straightforward is this option to implement?"},
            {id: "fit", label: "Fit", description: "How well does this align with your values and goals?"},
            {id: "control", label: "Control", description: "How much control will you have over the outcome?"},
            {id: "risk", label: "Risk", description: "What could go wrong or what are the downsides?"},
            {id: "fun", label: "Fun", description: "How enjoyable or fulfilling will this be?"},
            {id: "impact", label: "Impact", description: "What difference will this make, short and long-term?"}
        ];
        
        this.ratingOptions = [
            {value: "", label: "Select rating"},
            {value: 1, label: "1 - Poor"},
            {value: 2, label: "2 - Fair"},
            {value: 3, label: "3 - Good"},
            {value: 4, label: "4 - Very Good"},
            {value: 5, label: "5 - Excellent"}
        ];
        
        this.encouragingMessages = [
            "You're doing great",
            "Almost there", 
            "Keep going",
            "This is helping",
            "You've got this"
        ];
        
        this.init();
    }
    
    init() {
        this.setupPriorities();
        this.bindEvents();
        this.updateProgress();
    }
    
    bindEvents() {
        // Welcome screen
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(1);
            });
        }
        
        // Step 1 - Options
        const addOptionBtn = document.getElementById('addOptionBtn');
        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addOptionInput();
            });
        }
        
        const step1Next = document.getElementById('step1Next');
        if (step1Next) {
            step1Next.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveOptions();
            });
        }
        
        // Step 2 - Priorities
        const step2Back = document.getElementById('step2Back');
        if (step2Back) {
            step2Back.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(1);
            });
        }
        
        const step2Next = document.getElementById('step2Next');
        if (step2Next) {
            step2Next.addEventListener('click', (e) => {
                e.preventDefault();
                this.savePriorities();
            });
        }
        
        // Step 3 - Scoring
        const step3Back = document.getElementById('step3Back');
        if (step3Back) {
            step3Back.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(2);
            });
        }
        
        const step3Next = document.getElementById('step3Next');
        if (step3Next) {
            step3Next.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculateResults();
            });
        }
        
        // Step 4 - Results
        const step4Back = document.getElementById('step4Back');
        if (step4Back) {
            step4Back.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(3);
            });
        }
        
        const step4Next = document.getElementById('step4Next');
        if (step4Next) {
            step4Next.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveChoice();
            });
        }
        
        // Step 5 - Next Action
        const step5Back = document.getElementById('step5Back');
        if (step5Back) {
            step5Back.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(4);
            });
        }
        
        const step5Next = document.getElementById('step5Next');
        if (step5Next) {
            step5Next.addEventListener('click', (e) => {
                e.preventDefault();
                this.complete();
            });
        }
        
        const nextActionInput = document.getElementById('nextActionInput');
        if (nextActionInput) {
            nextActionInput.addEventListener('input', (e) => {
                this.validateNextAction(e.target.value);
            });
        }
        
        // Completion
        const startOverBtn = document.getElementById('startOverBtn');
        if (startOverBtn) {
            startOverBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.restart();
            });
        }
        
        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.close();
            });
        }
    }
    
    setupPriorities() {
        const grid = document.getElementById('prioritiesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.priorities.forEach(priority => {
            const item = document.createElement('div');
            item.className = 'priority-item';
            item.dataset.priority = priority.id;
            item.innerHTML = `
                <div class="priority-label">
                    ${priority.label}
                    <span class="priority-info" data-description="${priority.description}">?</span>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePriority(priority.id);
            });
            
            // Add hover tooltip functionality
            const infoIcon = item.querySelector('.priority-info');
            if (infoIcon) {
                infoIcon.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    this.showTooltip(e.target, priority.description);
                });
                
                infoIcon.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                    this.hideTooltip();
                });
            }
            
            grid.appendChild(item);
        });
    }
    
    showTooltip(element, text) {
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;
        
        const tooltipContent = tooltip.querySelector('.tooltip-content');
        if (tooltipContent) {
            tooltipContent.textContent = text;
            
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            tooltip.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
            tooltip.style.top = `${rect.top + scrollTop - 10}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            
            tooltip.classList.add('show');
        }
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }
    
    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.step-container').forEach(container => {
            container.classList.remove('active');
        });
        
        // Show current step
        if (step === 0) {
            document.getElementById('welcome').classList.add('active');
            this.currentStep = 0;
        } else if (step <= this.totalSteps) {
            document.getElementById(`step${step}`).classList.add('active');
            this.currentStep = step;
        } else {
            document.getElementById('completion').classList.add('active');
            this.currentStep = this.totalSteps + 1;
        }
        
        this.updateProgress();
        this.showEncouragingMessage();
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!progressFill || !progressText) return;
        
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        
        if (this.currentStep === 0) {
            progressText.textContent = 'Getting Started';
        } else if (this.currentStep <= this.totalSteps) {
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        } else {
            progressText.textContent = 'Complete!';
        }
    }
    
    addOptionInput() {
        const container = document.getElementById('optionsContainer');
        if (!container) return;
        
        const currentInputs = container.querySelectorAll('.option-input');
        
        if (currentInputs.length >= 3) return; // Max 3 options
        
        const group = document.createElement('div');
        group.className = 'form-group';
        group.innerHTML = `
            <input type="text" class="form-control option-input" placeholder="Option ${currentInputs.length + 1}" maxlength="50">
        `;
        
        container.appendChild(group);
        
        // Hide add button if at max
        if (currentInputs.length >= 2) {
            const addBtn = document.getElementById('addOptionBtn');
            if (addBtn) {
                addBtn.style.display = 'none';
            }
        }
    }
    
    saveOptions() {
        const inputs = document.querySelectorAll('.option-input');
        this.data.options = [];
        
        inputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                this.data.options.push(value);
            }
        });
        
        if (this.data.options.length < 2) {
            alert('Please enter at least 2 options');
            return;
        }
        
        this.goToStep(2);
    }
    
    togglePriority(priorityId) {
        const item = document.querySelector(`[data-priority="${priorityId}"]`);
        if (!item) return;
        
        const isSelected = this.data.selectedPriorities.includes(priorityId);
        
        if (isSelected) {
            // Remove from selection
            item.classList.remove('selected');
            this.data.selectedPriorities = this.data.selectedPriorities.filter(p => p !== priorityId);
        } else {
            // Add to selection if under limit
            if (this.data.selectedPriorities.length >= 3) {
                return; // Max 3 priorities
            }
            item.classList.add('selected');
            this.data.selectedPriorities.push(priorityId);
        }
        
        this.updatePriorityCounter();
    }
    
    updatePriorityCounter() {
        const count = this.data.selectedPriorities.length;
        const counterEl = document.getElementById('priorityCount');
        if (counterEl) {
            counterEl.textContent = count;
        }
        
        const nextBtn = document.getElementById('step2Next');
        if (nextBtn) {
            nextBtn.disabled = count === 0;
        }
    }
    
    savePriorities() {
        if (this.data.selectedPriorities.length === 0) {
            alert('Please select at least 1 priority');
            return;
        }
        
        this.setupScoringTable();
        this.goToStep(3);
    }
    
    setupScoringTable() {
        const table = document.getElementById('scoringTable');
        if (!table) return;
        
        table.innerHTML = '';
        
        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'scoring-row header';
        
        let headerHTML = '<div class="scoring-cell option-name">Option</div>';
        this.data.selectedPriorities.forEach(pid => {
            const priority = this.priorities.find(p => p.id === pid);
            headerHTML += `<div class="scoring-cell">${priority.label}</div>`;
        });
        
        headerRow.innerHTML = headerHTML;
        table.appendChild(headerRow);
        
        // Option rows
        this.data.options.forEach((option, optionIndex) => {
            const row = document.createElement('div');
            row.className = 'scoring-row';
            
            let rowHTML = `<div class="scoring-cell option-name">${option}</div>`;
            this.data.selectedPriorities.forEach(pid => {
                const selectId = `rating-${optionIndex}-${pid}`;
                rowHTML += `
                    <div class="scoring-cell">
                        <select class="form-control rating-dropdown" id="${selectId}" data-option="${optionIndex}" data-priority="${pid}">
                            ${this.ratingOptions.map(rating => 
                                `<option value="${rating.value}">${rating.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            });
            
            row.innerHTML = rowHTML;
            table.appendChild(row);
        });
        
        // Bind rating events after elements are added to DOM
        setTimeout(() => {
            document.querySelectorAll('.rating-dropdown').forEach(dropdown => {
                dropdown.addEventListener('change', (e) => {
                    const option = e.target.dataset.option;
                    const priority = e.target.dataset.priority;
                    const rating = parseInt(e.target.value);
                    
                    if (rating) {
                        this.setRating(option, priority, rating);
                    }
                });
            });
        }, 100);
    }
    
    setRating(optionIndex, priorityId, rating) {
        if (!this.data.scores[optionIndex]) {
            this.data.scores[optionIndex] = {};
        }
        
        this.data.scores[optionIndex][priorityId] = rating;
        this.checkScoringComplete();
    }
    
    checkScoringComplete() {
        const totalRequired = this.data.options.length * this.data.selectedPriorities.length;
        let totalScored = 0;
        
        Object.values(this.data.scores).forEach(optionScores => {
            totalScored += Object.keys(optionScores).length;
        });
        
        const nextBtn = document.getElementById('step3Next');
        if (nextBtn) {
            nextBtn.disabled = totalScored < totalRequired;
        }
    }
    
    calculateResults() {
        this.data.results = [];
        
        this.data.options.forEach((option, index) => {
            const scores = this.data.scores[index] || {};
            const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
            
            this.data.results.push({
                option: option,
                total: total,
                index: index
            });
        });
        
        // Sort by total score (descending)
        this.data.results.sort((a, b) => b.total - a.total);
        
        this.displayResults();
        this.goToStep(4);
    }
    
    displayResults() {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.data.results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = `result-item ${index === 0 ? 'winner' : ''}`;
            item.innerHTML = `
                <div class="result-name">${result.option}</div>
                <div class="result-score">${result.total}</div>
            `;
            container.appendChild(item);
        });
        
        // Set default choice to highest scored option
        this.data.chosenOption = this.data.results[0].option;
        
        // Setup gut check override
        const gutCheck = document.getElementById('gutCheckOverride');
        if (gutCheck) {
            gutCheck.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleGutCheckOverride();
                } else {
                    this.data.chosenOption = this.data.results[0].option;
                    this.updateResultsDisplay();
                }
            });
        }
    }
    
    handleGutCheckOverride() {
        // Create a simple selection interface
        const options = this.data.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
        const userChoice = prompt(`The numbers suggest "${this.data.results[0].option}" but your gut might know better. Which option feels right?\n\nOptions:\n${options}\n\nEnter the number of your choice (1-${this.data.options.length}):`);
        
        if (userChoice) {
            const choiceIndex = parseInt(userChoice) - 1;
            if (choiceIndex >= 0 && choiceIndex < this.data.options.length) {
                this.data.chosenOption = this.data.options[choiceIndex];
                this.updateResultsDisplay();
            }
        }
    }
    
    updateResultsDisplay() {
        document.querySelectorAll('.result-item').forEach(item => {
            item.classList.remove('winner');
            if (item.querySelector('.result-name').textContent === this.data.chosenOption) {
                item.classList.add('winner');
            }
        });
    }
    
    saveChoice() {
        this.displayChosenOption();
        this.goToStep(5);
    }
    
    displayChosenOption() {
        const container = document.getElementById('chosenOption');
        if (!container) return;
        
        container.innerHTML = `
            <div>You chose: <strong>${this.data.chosenOption}</strong></div>
        `;
    }
    
    validateNextAction(value) {
        const nextBtn = document.getElementById('step5Next');
        if (nextBtn) {
            nextBtn.disabled = value.trim().length < 5;
        }
    }
    
    complete() {
        const nextActionInput = document.getElementById('nextActionInput');
        const categorySelect = document.getElementById('categorySelect');
        
        if (nextActionInput) {
            this.data.nextAction = nextActionInput.value.trim();
        }
        
        if (categorySelect) {
            this.data.category = categorySelect.value;
        }
        
        this.displayCompletionSummary();
        this.goToStep(6);
    }
    
    displayCompletionSummary() {
        const container = document.getElementById('completionSummary');
        if (!container) return;
        
        container.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Your Decision:</span>
                <div class="summary-value">${this.data.chosenOption}</div>
            </div>
            <div class="summary-item">
                <span class="summary-label">Next Action:</span>
                <div class="summary-value">${this.data.nextAction}</div>
            </div>
            ${this.data.category ? `
                <div class="summary-item">
                    <span class="summary-label">Category:</span>
                    <div class="summary-value">${this.data.category}</div>
                </div>
            ` : ''}
        `;
    }
    
    restart() {
        // Reset all data
        this.data = {
            options: [],
            selectedPriorities: [],
            scores: {},
            results: [],
            chosenOption: null,
            nextAction: '',
            category: ''
        };
        
        // Reset UI
        const optionsContainer = document.getElementById('optionsContainer');
        if (optionsContainer) {
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <input type="text" class="form-control option-input" placeholder="Option 1" maxlength="50">
                </div>
                <div class="form-group">
                    <input type="text" class="form-control option-input" placeholder="Option 2" maxlength="50">
                </div>
            `;
        }
        
        const addOptionBtn = document.getElementById('addOptionBtn');
        if (addOptionBtn) {
            addOptionBtn.style.display = 'block';
        }
        
        const nextActionInput = document.getElementById('nextActionInput');
        if (nextActionInput) {
            nextActionInput.value = '';
        }
        
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.value = '';
        }
        
        const gutCheck = document.getElementById('gutCheckOverride');
        if (gutCheck) {
            gutCheck.checked = false;
        }
        
        // Reset priorities
        document.querySelectorAll('.priority-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.updatePriorityCounter();
        this.goToStep(0);
    }
    
    showEncouragingMessage() {
        const messageEl = document.getElementById('encouragingMessage');
        if (!messageEl || this.currentStep === 0) return;
        
        const messages = this.encouragingMessages;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        messageEl.textContent = randomMessage;
        messageEl.classList.add('show');
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 2000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnstuckSheet();
});