<script lang="ts">
	import { onMount } from 'svelte';
	import Counter from '../Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let colorPicker: HTMLInputElement;
	let gridSizePicker: HTMLSelectElement;
	let drawing = false;

    export let drawnPixels: {x: number, y: number, color: string}[] = [];


    onMount(() => {
    ctx = canvas.getContext('2d');
    
    // Retrieve drawn pixels from local storage
    const storedPixels = localStorage.getItem('drawnPixels');
    if (storedPixels) {
        drawnPixels = JSON.parse(storedPixels);
        // Re-draw stored pixels
        drawnPixels.forEach(pixel => {
            drawPixel(pixel.x, pixel.y, pixel.color);
        });
    }
});


	function getClientCoordinates(e: MouseEvent | TouchEvent): { x: number, y: number } {
		if ('touches' in (e as any)) {
			return { x: (e as TouchEvent).touches[0].clientX, y: (e as TouchEvent).touches[0].clientY };
		} else {
			return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
		}
	}

    function drawPixel(x: number, y: number, color: string) {
    const gridSize = parseInt(gridSizePicker.value);
    const gridX = Math.floor(x / gridSize) * gridSize;
    const gridY = Math.floor(y / gridSize) * gridSize;
    if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(gridX, gridY, gridSize, gridSize);
    }
    
    // Record pixel data
    drawnPixels.push({ x: gridX, y: gridY, color: color });

    // Check if in a browser context
    if (typeof window !== 'undefined') {
        // Store drawn pixels in local storage
        localStorage.setItem('drawnPixels', JSON.stringify(drawnPixels));
    }
}

	function startDrawing(e: MouseEvent | TouchEvent) {
		drawing = true;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		let { x, y } = getClientCoordinates(e);
		const canvasX = (x - rect.left) * scaleX;
		const canvasY = (y - rect.top) * scaleY;
		drawPixel(Math.floor(canvasX), Math.floor(canvasY), colorPicker.value);
	}

    function draw(e: MouseEvent | TouchEvent) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let { x, y } = getClientCoordinates(e);
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;
    drawPixel(Math.floor(canvasX), Math.floor(canvasY), colorPicker.value);
}

function stopDrawing() {
    drawing = false;
    
    // Check if in a browser context
    if (typeof window !== 'undefined') {
        // Store drawn pixels in local storage
        localStorage.setItem('drawnPixels', JSON.stringify(drawnPixels));
    }
}


	function deleteCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function captureScreenshot() {
		const link = document.createElement('a');
		link.href = canvas.toDataURL();
		link.download = 'screenshot.png';
		link.click();
	}
</script>

<svelte:head>
	<title>Drawing</title>
	<meta name="drawing" content="Start drawing here" />
</svelte:head>

<section>
	<div class="container">
		<canvas id="canvas" width="1080" height="1080" bind:this={canvas} on:mousedown={startDrawing} on:mousemove={draw} on:mouseup={stopDrawing} on:touchstart={startDrawing} on:touchmove={draw} on:touchend={stopDrawing}></canvas>
		<div class="controls">
            <button class="delete-button" on:click={deleteCanvas}>Delete canvas</button>
            <button class="delete-button" on:click={captureScreenshot}>Save drawing</button>

			<input type="color" id="color-picker" bind:this={colorPicker}>
			<select id="grid-size-picker" bind:this={gridSizePicker}>
				<option value="108">Big</option>
				<option value="54">Medium</option>
				<option value="27">Small</option>
            </select>
        <from method="POST">
            <button>Save Drawing</button>
        </from>
    </section>

<style>
    section {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-radius: 10px;
      background-color: white;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      max-width: 600px;
      width: 100%;
    }

    #canvas {
      border: 1px solid #e0e0e0;
      margin-bottom: 20px;
      max-width: 100%;
      height: auto;
    }

    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    input[type="color"] {
      border: none;
      padding: 5px;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    }

    .delete-button,
    .screenshot-button {
      margin-left: 10px;
      padding: 10px 20px;
      background-color: #e0e0e0;
      color: #333;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    }

    .delete-button:hover,
    .screenshot-button:hover {
      background-color: #d0d0d0;
    }
    #grid-size-picker {
  border: none;
  padding: 5px;
  width: 100px;
  height: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  background: #fff; 
  color: #333; 
  font-size: 16px; 
  margin-left: 10px; 
}



    @media (max-width: 600px) {
      .container {
        padding: 10px;
      }

      #canvas {
        margin-bottom: 10px;
      }
    }

</style>