<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconCheck, IconCopy, IconMessageCode, IconPencil, IconUser } from '@tabler/icons-vue';
import type { ChatMessage } from '../types/chat';
import MarkdownRenderer from './MarkdownRenderer.vue';

const props = defineProps<{ message: ChatMessage; editingDisabled?: boolean }>();
const emit = defineEmits<{ edit: [message: ChatMessage, content: string] }>();
const { t } = useI18n();
const copied = ref(false);
const editing = ref(false);
const draft = ref('');

function beginEditing() {
  if (props.editingDisabled) return;
  draft.value = props.message.content;
  editing.value = true;
}

function cancelEditing() {
  editing.value = false;
  draft.value = '';
}

function saveEditing() {
  const content = draft.value.trim();
  if (!content || content === props.message.content) {
    cancelEditing();
    return;
  }
  emit('edit', props.message, content);
  editing.value = false;
}

async function copyMessage() {
  if (!navigator.clipboard || !props.message.content) return;
  await navigator.clipboard.writeText(props.message.content);
  copied.value = true;
  window.setTimeout(() => { copied.value = false; }, 1500);
}
</script>

<template>
  <article :class="['message-row', `message-row--${message.role}`]">
    <div class="message-avatar">
      <IconUser v-if="message.role === 'user'" :size="18" />
      <IconMessageCode v-else :size="18" />
    </div>
    <div class="message-content">
      <div v-if="message.role === 'user' && editing" class="inline-editor">
        <v-textarea v-model="draft" rows="2" max-rows="6" auto-grow hide-details autofocus variant="outlined" density="compact" @keydown.ctrl.enter="saveEditing" />
        <div class="inline-editor-actions">
          <v-btn size="small" variant="text" @click="cancelEditing">{{ t('isas.cancelEdit') }}</v-btn>
          <v-btn size="small" color="primary" variant="flat" :disabled="!draft.trim()" @click="saveEditing">{{ t('isas.saveEdit') }}</v-btn>
        </div>
      </div>
      <div v-else-if="message.role === 'user'" class="user-text">{{ message.content }}</div>
      <MarkdownRenderer v-else-if="message.content" :content="message.content" />
      <div v-else class="typing-dots" aria-label="در حال دریافت پاسخ"><span></span><span></span><span></span></div>
      <v-btn
        v-if="message.role === 'user' && !editing"
        class="edit-button"
        size="x-small"
        variant="text"
        :icon="IconPencil"
        aria-label="ویرایش پیام"
        :disabled="editingDisabled"
        @click="beginEditing"
      />
      <v-btn
        v-if="message.role === 'assistant' && message.content"
        class="copy-button mt-2"
        size="x-small"
        variant="text"
        :icon="copied ? IconCheck : IconCopy"
        :aria-label="copied ? 'کپی شد' : 'کپی پاسخ'"
        @click="copyMessage"
      />
    </div>
  </article>
</template>

<style scoped>
.message-row { direction: ltr; display: flex; gap: 0.75rem; width: fit-content; max-width: min(100%, 900px); }
.message-row--assistant { align-self: flex-start; margin-right: auto; }
.message-row--user { flex-direction: row-reverse; align-self: flex-end; margin-left: auto; }
.message-avatar { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px; color: rgb(var(--v-theme-on-primary)); background: rgb(var(--v-theme-primary)); }
.message-row--user .message-avatar { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); box-shadow: 0 5px 14px rgb(var(--v-theme-primary) / 20%); }
.message-content { direction: rtl; min-width: 0; max-width: min(760px, calc(100vw - 120px)); padding: 0.8rem 1rem; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 12px; background: rgb(var(--v-theme-surface)); text-align: right; }
.message-row--user .message-content { color: rgb(var(--v-theme-on-surface)); background: color-mix(in srgb, rgb(var(--v-theme-primary)) 16%, rgb(var(--v-theme-surface))); border-color: rgb(var(--v-theme-primary) / 38%); border-inline-end-width: 3px; box-shadow: 0 7px 20px rgb(var(--v-theme-primary) / 12%); }
.user-text { white-space: pre-wrap; line-height: 1.8; }
.inline-editor { width: min(560px, calc(100vw - 150px)); }
.inline-editor-actions { margin-top: 0.55rem; display: flex; justify-content: flex-end; gap: 0.35rem; }
.copy-button, .edit-button { opacity: 0.65; }
.edit-button { display: block; margin-inline-start: auto; margin-block: 0.25rem -0.35rem; }
.typing-dots { display: flex; gap: 5px; padding: 0.35rem 0.15rem; }
.typing-dots span { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: 0.35; animation: bounce 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: 0.15s; }
.typing-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); opacity: 0.8; } }
@media (max-width: 700px) {
  .message-row { max-width: 100%; }
  .message-content { max-width: calc(100vw - 82px); }
  .inline-editor { width: calc(100vw - 122px); }
}
</style>
