// Component to keep the 3D model visible even when marker is lost
AFRAME.registerComponent('freeze-on-lost', {
    init: function () {
        this.markerFound = false;

        this.el.addEventListener('markerFound', () => {
            this.markerFound = true;
        });

        this.el.addEventListener('markerLost', () => {
            // When marker is lost, we don't do anything here.
            // AR.js sets visible to false internally, we override it in tick().
        });
    },
    tick: function () {
        // If the marker was found at least once, force it to stay visible!
        if (this.markerFound && !this.el.object3D.visible) {
            this.el.object3D.visible = true;
        }
    }
});

// Handle dish selection UI
function selectDish(dishType) {
    // 1. Update UI (Active Button State)
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(btn => btn.classList.remove('active'));

    const clickedButton = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(dishType)
    );
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // 2. Hide all dishes
    const allDishes = ['burger', 'pizza', 'dessert'];
    allDishes.forEach(dish => {
        const entity = document.getElementById(`dish-${dish}`);
        if (entity) {
            entity.setAttribute('visible', 'false');
        }
    });

    // 3. Show the selected dish
    const selectedEntity = document.getElementById(`dish-${dishType}`);
    if (selectedEntity) {
        selectedEntity.setAttribute('visible', 'true');
        
        selectedEntity.setAttribute('animation__scale', {
            property: 'scale',
            from: '0.1 0.1 0.1',
            to: '1 1 1',
            dur: 800,
            easing: 'easeOutElastic'
        });
    }
}
