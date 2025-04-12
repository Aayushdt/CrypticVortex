// Fixes for app.js issues

// 1. Add settledContainers to APP_STATE if it doesn't exist
if (!APP_STATE.settledContainers) {
    APP_STATE.settledContainers = new Set(['cafeteria']);
}

// 2. Add container settled methods to APP_STATE if not already defined
if (!APP_STATE.setContainerSettled) {
    APP_STATE.setContainerSettled = function(containerId, isSettled) {
        if (isSettled) {
            this.settledContainers.add(containerId);
        } else {
            this.settledContainers.delete(containerId);
        }
    };
}

// 3.Fix the updateSettlementIndicators function to handle potential issues
// This will override any existing implementation
window.fixedUpdateSettlementIndicators = function() {
    const containers = document.querySelectorAll('.expense-container');
    
    containers.forEach(container => {
        const containerId = container.getAttribute('data-id');
        if (!containerId) return;
        
        const settlementIndicator = container.querySelector('.settlement-indicator');
        if (!settlementIndicator) return;
        
        // Get all items in this container
        const allExpenses = getAllExpenses();
        const containerItems = allExpenses.filter(item => item.container === containerId);
        
        // If no items, hide the indicator
        if (containerItems.length === 0) {
            toggleSettlementIndicator(containerId, false);
            updateContainerSettlementStatus(containerId, false);
            return;
        }
        
        // Get unique people in this container
        const uniquePeople = [...new Set(containerItems.map(item => item.person))];
        
        // If only one person, no settlements needed
        if (uniquePeople.length <= 1) {
            toggleSettlementIndicator(containerId, true);
            updateContainerSettlementStatus(containerId, true);
            return;
        }
        
        // Calculate settlements for this container
        const settlements = calculateSettlements(containerId);
        const isSettled = Array.isArray(settlements) && settlements.every(settlement => 
            Math.abs(settlement.amount) < 0.01  // Using a small threshold to account for floating point errors
        );
        
        // Update settled status in APP_STATE
        APP_STATE.setContainerSettled(containerId, isSettled);
        
        // Update the settlement indicator
        toggleSettlementIndicator(containerId, isSettled);
        
        // Update container appearance
        updateContainerSettlementStatus(containerId, isSettled);
    });
};

// 4. Fix the duplicate function issue by overriding updateSettlementIndicators
// This will run when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Override the updateSettlementIndicators function
    window.updateSettlementIndicators = window.fixedUpdateSettlementIndicators;
    
    console.log("Fixes applied successfully");
});

