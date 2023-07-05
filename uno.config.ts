import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()]
});
