<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{ content: string }>();
const { t } = useI18n();

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);

const escapeHtml = new MarkdownIt().utils.escapeHtml;
const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code: string, language: string): string {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
    return escapeHtml(code);
  }
});

markdown.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = token.info.trim().split(/\s+/g)[0];
  const highlighted = language && hljs.getLanguage(language)
    ? hljs.highlight(token.content, { language, ignoreIllegals: true }).value
    : escapeHtml(token.content);
  const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
  const languageLabel = language ? escapeHtml(language.toUpperCase()) : 'CODE';

  return `<div class="code-block"><div class="code-toolbar"><span>${languageLabel}</span><button type="button" data-copy-code>${escapeHtml(t('isas.copyCode'))}</button></div><pre><code${languageClass}>${highlighted}</code></pre></div>`;
};

const renderedContent = computed(() => markdown.render(props.content || ''));

async function handleMarkdownClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-copy-code]') : null;
  if (!target || !navigator.clipboard) return;
  const code = target.closest('.code-block')?.querySelector('code')?.textContent;
  if (!code) return;
  await navigator.clipboard.writeText(code);
  const originalLabel = target.textContent;
  target.textContent = t('isas.codeCopied');
  target.classList.add('copied');
  window.setTimeout(() => {
    target.textContent = originalLabel;
    target.classList.remove('copied');
  }, 1500);
}
</script>

<template>
  <div class="isas-markdown" @click="handleMarkdownClick" v-html="renderedContent"></div>
</template>

<style scoped>
.isas-markdown :deep(p:last-child) { margin-bottom: 0; }
.isas-markdown :deep(p) { margin: 0 0 0.75rem; line-height: 1.9; }
.isas-markdown :deep(ul), .isas-markdown :deep(ol) { padding-inline-start: 1.5rem; margin: 0.5rem 0; }
.isas-markdown :deep(.code-block) { direction: ltr; overflow: hidden; margin: 0.75rem 0; border: 1px solid rgb(255 255 255 / 10%); border-radius: 12px; background: #0d1117; }
.isas-markdown :deep(.code-toolbar) { min-height: 34px; padding: 0.35rem 0.55rem 0.35rem 0.8rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgb(255 255 255 / 10%); color: #9ca3af; background: #161b22; font-family: Consolas, Monaco, monospace; font-size: 0.68rem; }
.isas-markdown :deep(.code-toolbar button) { padding: 0.25rem 0.55rem; border: 0; border-radius: 6px; color: #c9d1d9; background: transparent; font-family: inherit; font-size: 0.7rem; cursor: pointer; transition: background 150ms ease, color 150ms ease; }
.isas-markdown :deep(.code-toolbar button:hover) { color: white; background: rgb(255 255 255 / 9%); }
.isas-markdown :deep(.code-toolbar button.copied) { color: #7ee787; }
.isas-markdown :deep(pre) { direction: ltr; text-align: left; overflow-x: auto; padding: 1rem; background: transparent; color: #e6edf3; margin: 0; }
.isas-markdown :deep(code) { direction: ltr; font-family: Consolas, Monaco, monospace; font-size: 0.875em; }
.isas-markdown :deep(:not(pre) > code) { display: inline-block; direction: ltr; unicode-bidi: isolate; vertical-align: baseline; padding: 0.12rem 0.4rem; border: 1px solid rgba(var(--v-theme-primary), 0.2); border-radius: 6px; color: rgb(var(--v-theme-primary)); background: color-mix(in srgb, rgb(var(--v-theme-lightprimary)) 76%, rgb(var(--v-theme-surface))); font-weight: 700; line-height: 1.45; letter-spacing: 0.015em; }
.isas-markdown :deep(table) { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; margin: 0.75rem 0; }
.isas-markdown :deep(th), .isas-markdown :deep(td) { border: 1px solid rgb(var(--v-theme-borderColor)); padding: 0.55rem 0.75rem; white-space: nowrap; }
.isas-markdown :deep(th) { background: rgb(var(--v-theme-surface-variant)); }
.isas-markdown :deep(a) { color: rgb(var(--v-theme-primary)); }
</style>
