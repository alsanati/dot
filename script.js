window.onload = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var colorPicker = document.getElementById('color-picker');
    var gridSize = 10; // size of one grid cell

    canvas.width = 5000;
    canvas.height = 5000;
  
    canvas.addEventListener('click', function(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
  
      // Round click coordinates to nearest grid cell
      var gridX = Math.floor(x / gridSize) * gridSize;
      var gridY = Math.floor(y / gridSize) * gridSize;
  
      // update the color to be used for drawing
      ctx.fillStyle = colorPicker.value;
  
      drawPixel(gridX, gridY);
    });
  
    function drawPixel(x, y) {
      ctx.fillRect(x, y, gridSize, gridSize);
    }
  };
  