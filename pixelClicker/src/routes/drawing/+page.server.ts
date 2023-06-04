import { createDrawing } from '$lib/db/schema';
import type { Actions } from './$types';

var pixels = [
  {
    x: 123,
    y: 121
  }
];

export const actions = {
  default: async (event) => {
    createDrawing("myass", "TEST", pixels);
  }
} as Actions;
