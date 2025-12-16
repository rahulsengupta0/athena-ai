export const CanvasManager = {
  canvas: null,
  ctx: null,

  init(canvasElement) {
    console.log("Initializing canvas with element:", canvasElement);
    
    if (!canvasElement) {
      console.error("Canvas element is null or undefined");
      return;
    }

    this.canvas = canvasElement;
    
    // Check if getContext is available
    if (typeof this.canvas.getContext !== 'function') {
      console.error("Canvas 2D context is not supported in this browser");
      return;
    }

    try {
      this.ctx = this.canvas.getContext('2d');
      console.log("2D context acquired successfully");
    } catch (error) {
      console.error("Error getting 2D context:", error);
      return;
    }

    // Set canvas dimensions
    this.canvas.width = 900;
    this.canvas.height = 500;

    // Set initial background
    if (this.ctx) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Add basic event listeners
      this.setupEventListeners();
      console.log("Canvas initialized successfully");
    } else {
      console.error("Cannot draw on canvas - context not available");
    }
  },

  setupEventListeners() {
    if (!this.canvas) {
      console.error("Cannot setup event listeners - canvas not initialized");
      return;
    }
    
    // Add basic drawing functionality
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e) => {
      if (!isDrawing || !this.ctx) return;
      
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(lastX, lastY);
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();

      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    this.canvas.addEventListener('mousedown', startDrawing);
    this.canvas.addEventListener('mousemove', draw);
    this.canvas.addEventListener('mouseup', stopDrawing);
    this.canvas.addEventListener('mouseout', stopDrawing);
    
    console.log("Event listeners attached to canvas");
  }
};