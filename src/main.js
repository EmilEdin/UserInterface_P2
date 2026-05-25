import { Model } from './mvc/Model.js';
import { View } from './mvc/View.js';
import { Controller } from './mvc/Controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = new Model();
  const view = new View();
  const controller = new Controller(model, view);
});
