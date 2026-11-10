import { createApp } from './ui/app';

const app = createApp();
const root = document.getElementById('app');
if (root) {
  app.mount(root);
}
