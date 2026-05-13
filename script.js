// Component to make the 3D model draggable (rotate on touch/mouse drag)
AFRAME.registerComponent('drag-rotate', {
    schema: { speed: { default: 1 } },
    init: function () {
        this.ifMouseDown = false;
        this.x_cord = 0;
        this.y_cord = 0;
        
        // Listen to scene for mouse/touch events
        document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this));
        document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this));
        document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this));
        
        // Touch support for mobile
        document.addEventListener('touchstart', this.OnDocumentTouchStart.bind(this));
        document.addEventListener('touchend', this.OnDocumentTouchEnd.bind(this));
        document.addEventListener('touchmove', this.OnDocumentTouchMove.bind(this));
    },
    OnDocumentMouseDown: function (event) {
        this.ifMouseDown = true;
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
        
        // Pause auto-rotation when user interacts
        this.el.removeAttribute('animation');
    },
    OnDocumentMouseUp: function () {
        this.ifMouseDown = false;
    },
    OnDocumentMouseMove: function (event) {
        if (this.ifMouseDown) {
            let temp_x = event.clientX - this.x_cord;
            let temp_y = event.clientY - this.y_cord;
            
            // Only rotate around Y axis (left/right) for dishes
            this.el.object3D.rotation.y += temp_x * this.data.speed * 0.01;
            // Optionally allow X axis rotation (up/down tilting)
            this.el.object3D.rotation.x += temp_y * this.data.speed * 0.01;
            
            this.x_cord = event.clientX;
            this.y_cord = event.clientY;
        }
    },
    OnDocumentTouchStart: function (event) {
        this.ifMouseDown = true;
        this.x_cord = event.touches[0].clientX;
        this.y_cord = event.touches[0].clientY;
        this.el.removeAttribute('animation');
    },
    OnDocumentTouchEnd: function () {
        this.ifMouseDown = false;
    },
    OnDocumentTouchMove: function (event) {
        if (this.ifMouseDown) {
            let temp_x = event.touches[0].clientX - this.x_cord;
            let temp_y = event.touches[0].clientY - this.y_cord;
            
            this.el.object3D.rotation.y += temp_x * this.data.speed * 0.01;
            this.el.object3D.rotation.x += temp_y * this.data.speed * 0.01;
            
            this.x_cord = event.touches[0].clientX;
            this.y_cord = event.touches[0].clientY;
        }
    }
});

// Component to keep the 3D model visible even when marker is lost
AFRAME.registerComponent('freeze-on-lost', {
    init: function () {
        this.markerFound = false;

        this.el.addEventListener('markerFound', () => {
            this.markerFound = true;
        });
    },
    tick: function () {
        if (this.markerFound && !this.el.object3D.visible) {
            this.el.object3D.visible = true;
        }
    }
});

// Handle dish selection UI
function selectDish(dishType) {
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(btn => btn.classList.remove('active'));

    const clickedButton = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(dishType)
    );
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    const allDishes = ['burger', 'pizza', 'dessert'];
    allDishes.forEach(dish => {
        const entity = document.getElementById(`dish-${dish}`);
        if (entity) {
            entity.setAttribute('visible', 'false');
        }
    });

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
