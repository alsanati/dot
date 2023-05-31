window.onload = function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var colorPicker = document.getElementById('color-picker');
  var gridSize = 10;

  var zoom = 1;
  var panX = 0;
  var panY = 0;

  // Set the canvas size
  canvas.width = 5000;
  canvas.height = 5000;

  // Create a new Hammer instance for the canvas
  var hammer = new Hammer.Manager(canvas, {
    recognizers: [
      [Hammer.Pinch, {}],
      [Hammer.Pan, { direction: Hammer.DIRECTION_ALL }],
    ],
    touchAction: 'none', // Important to let the native touch events go through
  });

  function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
  }

  // Load pixel data from localStorage
  var pixelDataString = localStorage.getItem('pixelData');
  if (pixelDataString) {
    var pixelData = JSON.parse(pixelDataString);
    pixelData.forEach(pixel => {
      drawPixel(pixel.x, pixel.y, pixel.color);
    });
  } else {
    pixelData = [];
  }

  function update() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0, 0, zoom, panX, panY);
    // redraw stored pixels
    pixelData.forEach(pixel => {
      drawPixel(pixel.x, pixel.y, pixel.color);
    });
  }

  // Handle pinch
  hammer.on('pinch', function(e) {
    zoom = e.scale;
    update();
  });

  // Handle pan
  hammer.on('pan', function(e) {
    panX = e.deltaX;
    panY = e.deltaY;
    update();
  });

  // Handle drawing
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();

    // Adjust click coordinates for zoom and pan
    var rect = canvas.getBoundingClientRect();
    var x = (e.touches[0].clientX - rect.left - panX) / zoom;
    var y = (e.touches[0].clientY - rect.top - panY) / zoom;

    var gridX = Math.floor(x / gridSize) * gridSize;
    var gridY = Math.floor(y / gridSize) * gridSize;

    // Draw pixel on canvas
    drawPixel(gridX, gridY, colorPicker.value);

    // Store pixel in array
    pixelData.push({
      x: gridX,
      y: gridY,
      color: colorPicker.value
    });

    // Save pixel data in localStorage
    localStorage.setItem('pixelData', JSON.stringify(pixelData));
  });

  update();
};
