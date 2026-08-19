<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconCheck, IconChevronDown, IconDatabase, IconFileText, IconMessageCode, IconPhoto, IconSend, IconTableShare, IconX } from '@tabler/icons-vue';
import { normalizeAppError } from '@/errors/appError';
import ChatMessage from '../components/ChatMessage.vue';
import { isasApi } from '../services/isasApi';
import { useIsasChatStore } from '../stores/chat.store';
import type { ChatMessage as IsasChatMessage, MentionCategory } from '../types/chat';

const { t } = useI18n();
const store = useIsasChatStore();
const input = ref('');
const messageViewport = ref<HTMLElement | null>(null);
const mentionCategory = ref<MentionCategory | null>(null);
const mentionOptions = ref<{ value: string; title: string }[]>([]);
const mentionLoading = ref(false);
const showMentionMenu = ref(false);
const showJumpToBottom = ref(false);
type PatternId = 'circuit' | 'nodes' | 'waves' | 'mesh';
const savedPattern = localStorage.getItem('isas-chat-pattern');
const patternIds: PatternId[] = ['circuit', 'nodes', 'waves', 'mesh'];
const selectedPattern = ref<PatternId>(patternIds.includes(savedPattern as PatternId) ? savedPattern as PatternId : 'circuit');
let activeRequest: AbortController | null = null;
let mentionTimer: number | null = null;

const canSubmit = computed(() => Boolean(input.value.trim()) && store.canSend);
const mentionQuery = computed(() => {
  const at = input.value.lastIndexOf('@');
  if (at < 0) return '';
  const query = input.value.slice(at + 1);
  return query.includes(' ') || query.includes('\n') ? '' : query;
});

const mentionCategories = computed(() => [
  { category: 'tables' as const, title: t('isas.mentions.tables'), icon: IconTableShare },
  { category: 'entities' as const, title: t('isas.mentions.entities'), icon: IconDatabase },
  { category: 'sourceFiles' as const, title: t('isas.mentions.files'), icon: IconFileText }
]);

const patterns = computed<Array<{ id: PatternId; title: string }>>(() => [
  { id: 'circuit', title: t('isas.patterns.circuit') },
  { id: 'nodes', title: t('isas.patterns.nodes') },
  { id: 'waves', title: t('isas.patterns.waves') },
  { id: 'mesh', title: t('isas.patterns.mesh') }
]);


async function scrollToBottom(behavior: 'auto' | 'smooth' = 'auto') {
  await nextTick();
  messageViewport.value?.scrollTo({ top: messageViewport.value.scrollHeight, behavior });
  showJumpToBottom.value = false;
}

function handleViewportScroll() {
  const viewport = messageViewport.value;
  if (!viewport) return;
  showJumpToBottom.value = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight > 140;
}

async function sendMessage() {
  const query = input.value.trim();
  if (!query || !store.canSend) return;

  input.value = '';
  store.appendUserMessage(query);
  await requestAssistantResponse(query);
}

async function editMessage(message: IsasChatMessage, content: string) {
  if (store.streaming || message.role !== 'user') return;
  const messageIndex = store.messages.findIndex((item) => item.id === message.id);
  if (messageIndex < 0) return;
  store.messages[messageIndex].content = content;
  store.messages.splice(messageIndex + 1);
  await requestAssistantResponse(content);
}

async function requestAssistantResponse(query: string) {
  const assistantId = store.beginAssistantMessage();
  activeRequest = new AbortController();
  await scrollToBottom();

  try {
    await isasApi.streamChat(
      { sessionId: store.currentSessionId, model: store.selectedModel, mode: store.mode, query, entity: store.selectedEntity },
      {
        onDelta: (content) => {
          store.appendDelta(assistantId, content);
          if (!showJumpToBottom.value) void scrollToBottom();
        },
        onStatus: (message) => { store.statusMessage = message; }
      },
      activeRequest.signal
    );
    store.completeMessage(assistantId);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      store.completeMessage(assistantId);
    } else {
      store.failMessage(assistantId, normalizeAppError(error).message);
    }
  } finally {
    activeRequest = null;
  }
}

function stopStreaming() {
  activeRequest?.abort();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    void sendMessage();
  }
}

function removeMention(index: number) {
  store.mentions.splice(index, 1);
}

function selectMentionCategory(category: MentionCategory) {
  mentionCategory.value = category;
  mentionOptions.value = [];
}

function selectMention(option: { value: string; title: string }) {
  if (!mentionCategory.value) return;
  const at = input.value.lastIndexOf('@');
  if (at < 0) return;
  const prefix = mentionCategory.value === 'tables' ? 'T' : mentionCategory.value === 'entities' ? 'E' : 'F';
  input.value = `${input.value.slice(0, at)}${prefix}@${option.title} `;
  store.mentions.push({ id: option.value, label: option.title, category: mentionCategory.value });
  showMentionMenu.value = false;
  mentionCategory.value = null;
}

watch(() => store.messages.length, () => { void scrollToBottom(); });
watch(selectedPattern, (value) => localStorage.setItem('isas-chat-pattern', value));
watch(input, () => {
  const at = input.value.lastIndexOf('@');
  const fragment = at >= 0 ? input.value.slice(at + 1) : '';
  showMentionMenu.value = at >= 0 && !fragment.includes(' ') && !fragment.includes('\n');
  if (!showMentionMenu.value) mentionCategory.value = null;
});
watch([mentionQuery, mentionCategory], () => {
  if (mentionTimer) window.clearTimeout(mentionTimer);
  if (!mentionCategory.value || !mentionQuery.value) return;
  mentionTimer = window.setTimeout(async () => {
    mentionLoading.value = true;
    try {
      mentionOptions.value = await isasApi.searchMentions(mentionCategory.value!, mentionQuery.value);
    } finally {
      mentionLoading.value = false;
    }
  }, 250);
});

onMounted(() => {
  store.initialize();
  void scrollToBottom();
});

onBeforeUnmount(() => {
  activeRequest?.abort();
  if (mentionTimer) window.clearTimeout(mentionTimer);
});
</script>

<template>
  <section :class="['isas-chat-page', `chat-pattern--${selectedPattern}`]">
    <header class="isas-toolbar">
      <div>
        <h1>{{ t('isas.title') }}</h1>
        <p>{{ t('isas.subtitle') }}</p>
      </div>
      <div class="toolbar-actions">
        <v-select v-if="store.models.length" v-model="store.selectedModel" :items="store.models" item-title="name" item-value="model" density="compact" hide-details class="model-select" :label="t('isas.model')" />
        <v-menu location="bottom end" :close-on-content-click="false">
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" :icon="IconPhoto" variant="tonal" color="primary" :aria-label="t('isas.changePattern')" />
          </template>
          <v-card class="pattern-gallery" elevation="10">
            <v-card-title>{{ t('isas.choosePattern') }}</v-card-title>
            <div class="pattern-grid">
              <button v-for="pattern in patterns" :key="pattern.id" type="button" :class="{ active: selectedPattern === pattern.id }" @click="selectedPattern = pattern.id">
                <span :class="['pattern-preview', `pattern-preview--${pattern.id}`]" aria-hidden="true" />
                <span class="pattern-title">{{ pattern.title }}</span>
                <IconCheck v-if="selectedPattern === pattern.id" :size="17" />
              </button>
            </div>
          </v-card>
        </v-menu>
      </div>
    </header>

    <div class="conversation-shell">
      <div ref="messageViewport" class="message-viewport" aria-live="polite" @scroll="handleViewportScroll">
        <div v-if="!store.messages.length" class="landing-state">
          <v-avatar color="primary" variant="tonal" rounded="lg" size="64"><IconMessageCode :size="30" /></v-avatar>
          <div class="hero-copy">
            <h2>{{ t('isas.greeting') }}</h2>
            <p>{{ t('isas.greetingSub') }}</p>
          </div>
        </div>
        <div v-else class="message-stack">
          <ChatMessage v-for="message in store.messages" :key="message.id" :message="message" :editing-disabled="store.streaming" @edit="editMessage" />
        </div>
      </div>
      <v-btn
        v-show="showJumpToBottom"
        class="jump-to-bottom"
        :icon="IconChevronDown"
        size="small"
        color="primary"
        :aria-label="t('isas.jumpToBottom')"
        @click="scrollToBottom('smooth')"
      />
    </div>

    <div class="composer-shell">
      <v-alert v-if="store.errorMessage" class="mb-3" type="error" variant="tonal" closable @click:close="store.errorMessage = ''">
        {{ store.errorMessage }}
      </v-alert>

      <div v-if="store.mentions.length" class="reference-row">
        <span class="reference-label">{{ t('isas.references') }}</span>
        <v-chip v-for="(mention, index) in store.mentions" :key="`${mention.category}-${mention.id}-${index}`" size="small" color="primary" variant="tonal" closable @click:close="removeMention(index)">
          {{ mention.label }}
        </v-chip>
      </div>

      <div class="composer">
        <div v-if="showMentionMenu" class="mention-menu">
          <template v-if="!mentionCategory">
            <button v-for="item in mentionCategories" :key="item.category" type="button" @click="selectMentionCategory(item.category)">
              <component :is="item.icon" :size="17" />{{ item.title }}
            </button>
          </template>
          <template v-else>
            <div class="mention-menu-title">{{ t('isas.mentions.search') }}: {{ mentionQuery }}</div>
            <v-progress-linear v-if="mentionLoading" indeterminate />
            <button v-for="option in mentionOptions" :key="option.value" type="button" @click="selectMention(option)">{{ option.title }}</button>
            <div v-if="!mentionLoading && !mentionOptions.length" class="mention-empty">{{ t('isas.mentions.noResult') }}</div>
          </template>
        </div>
        <span class="composer-leading" aria-hidden="true"><IconMessageCode :size="19" /></span>
        <v-textarea
          v-model="input"
          :placeholder="t('isas.placeholder')"
          rows="1"
          max-rows="7"
          auto-grow
          hide-details
          variant="plain"
          :disabled="store.streaming"
          @keydown="handleKeydown"
        />
        <v-btn
          v-if="store.streaming"
          :icon="IconX"
          color="error"
          variant="tonal"
          :aria-label="t('isas.stop')"
          @click="stopStreaming"
        />
        <v-btn
          v-else
          :icon="IconSend"
          color="primary"
          :disabled="!canSubmit"
          :aria-label="t('isas.send')"
          @click="sendMessage"
        />
      </div>
      <div class="composer-footer">
        <span>{{ store.statusMessage || t('isas.disclaimer') }}</span>
        <span>{{ t('isas.enterHint') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.isas-chat-page { position: relative; isolation: isolate; height: calc(100vh - 128px); min-height: 560px; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; overflow: hidden; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 12px; background: color-mix(in srgb, rgb(var(--v-theme-lightprimary)) 44%, rgb(var(--v-theme-background))); box-shadow: 0 12px 32px rgb(var(--v-theme-on-surface) / 5%); }
.chat-pattern--circuit { background-image: linear-gradient(rgba(var(--v-theme-primary), 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--v-theme-primary), 0.12) 1px, transparent 1px), radial-gradient(circle, rgba(var(--v-theme-secondary), 0.34) 2px, transparent 3px); background-size: 42px 42px, 42px 42px, 84px 84px; background-position: center, center, calc(50% + 20px) 20px; }
.chat-pattern--nodes { background-image: radial-gradient(circle, rgba(var(--v-theme-primary), 0.3) 2px, transparent 3px), linear-gradient(35deg, transparent 48%, rgba(var(--v-theme-secondary), 0.13) 49%, rgba(var(--v-theme-secondary), 0.13) 51%, transparent 52%); background-size: 48px 48px, 96px 96px; background-position: center, center; }
.chat-pattern--waves { background-image: repeating-radial-gradient(ellipse at 0 100%, transparent 0 24px, rgba(var(--v-theme-primary), 0.16) 25px 27px, transparent 28px 52px), repeating-radial-gradient(ellipse at 100% 0, transparent 0 34px, rgba(var(--v-theme-secondary), 0.12) 35px 37px, transparent 38px 68px); background-size: 180px 120px, 220px 150px; background-position: center, center; }
.chat-pattern--mesh { background-image: linear-gradient(30deg, rgba(var(--v-theme-primary), 0.13) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-primary), 0.13) 87.5%), linear-gradient(150deg, rgba(var(--v-theme-secondary), 0.13) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-secondary), 0.13) 87.5%), linear-gradient(30deg, rgba(var(--v-theme-primary), 0.09) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-primary), 0.09) 87.5%); background-size: 72px 126px; background-position: center, center, calc(50% + 36px) 63px; }
.isas-toolbar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1.1rem; border-bottom: 1px solid rgb(var(--v-theme-borderColor)); background: rgba(var(--v-theme-surface), 0.92); backdrop-filter: blur(14px); }
.isas-toolbar h1 { font-size: 1.2rem; margin: 0; }
.isas-toolbar p { margin: 0.3rem 0 0; color: rgb(var(--v-theme-on-surface)); font-size: 0.875rem; font-weight: 500; line-height: 1.6; opacity: 0.72; }
.toolbar-actions { display: flex; align-items: center; gap: 0.65rem; }
.model-select { min-width: 190px; }
.pattern-gallery { width: min(480px, calc(100vw - 24px)); padding: 0.45rem; }
.pattern-gallery :deep(.v-card-title) { font-size: 0.95rem; font-weight: 700; }
.pattern-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; padding: 0 0.75rem 0.75rem; }
.pattern-grid button { position: relative; overflow: hidden; padding: 0; border: 2px solid transparent; border-radius: 12px; color: inherit; background: rgb(var(--v-theme-surface)); text-align: start; cursor: pointer; transition: border-color 150ms ease, transform 150ms ease; }
.pattern-grid button:hover { transform: translateY(-2px); }
.pattern-grid button.active { border-color: rgb(var(--v-theme-primary)); }
.pattern-preview { display: block; width: 100%; aspect-ratio: 16 / 8; border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1); background-color: color-mix(in srgb, rgb(var(--v-theme-lightprimary)) 44%, rgb(var(--v-theme-background))); background-repeat: repeat; }
.pattern-preview--circuit { background-image: linear-gradient(rgba(var(--v-theme-primary), 0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--v-theme-primary), 0.24) 1px, transparent 1px), radial-gradient(circle, rgba(var(--v-theme-secondary), 0.58) 2px, transparent 3px); background-size: 28px 28px, 28px 28px, 56px 56px; background-position: center, center, calc(50% + 14px) 14px; }
.pattern-preview--nodes { background-image: radial-gradient(circle, rgba(var(--v-theme-primary), 0.52) 2px, transparent 3px), linear-gradient(35deg, transparent 48%, rgba(var(--v-theme-secondary), 0.25) 49%, rgba(var(--v-theme-secondary), 0.25) 51%, transparent 52%); background-size: 32px 32px, 64px 64px; background-position: center, center; }
.pattern-preview--waves { background-image: repeating-radial-gradient(ellipse at 0 100%, transparent 0 15px, rgba(var(--v-theme-primary), 0.3) 16px 18px, transparent 19px 32px), repeating-radial-gradient(ellipse at 100% 0, transparent 0 21px, rgba(var(--v-theme-secondary), 0.22) 22px 24px, transparent 25px 42px); background-size: 108px 72px, 132px 90px; background-position: center, center; }
.pattern-preview--mesh { background-image: linear-gradient(30deg, rgba(var(--v-theme-primary), 0.24) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-primary), 0.24) 87.5%), linear-gradient(150deg, rgba(var(--v-theme-secondary), 0.24) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-secondary), 0.24) 87.5%), linear-gradient(30deg, rgba(var(--v-theme-primary), 0.17) 12%, transparent 12.5%, transparent 87%, rgba(var(--v-theme-primary), 0.17) 87.5%); background-size: 48px 84px; background-position: center, center, calc(50% + 24px) 42px; }
.pattern-title { display: block; padding: 0.5rem 0.6rem; font-size: 0.75rem; }
.pattern-grid svg { position: absolute; inset-block-start: 0.4rem; inset-inline-end: 0.4rem; padding: 3px; border-radius: 50%; color: rgb(var(--v-theme-on-primary)); background: rgb(var(--v-theme-primary)); box-sizing: content-box; }
.conversation-shell { position: relative; z-index: 1; min-height: 0; overflow: hidden; }
.message-viewport { position: relative; z-index: 1; width: 100%; height: 100%; overflow-y: auto; scroll-behavior: smooth; background: transparent; }
.message-stack { position: relative; z-index: 1; width: min(100%, 1080px); margin: 0 auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.1rem; }
.jump-to-bottom { position: absolute; z-index: 4; left: 50%; bottom: 0.9rem; transform: translateX(-50%); border: 2px solid rgb(var(--v-theme-surface)); box-shadow: 0 8px 22px rgb(var(--v-theme-on-surface) / 20%); }
.landing-state { position: relative; z-index: 1; width: min(100%, 980px); min-height: 100%; margin: 0 auto; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.landing-state :deep(.v-avatar) { box-shadow: 0 0 0 10px rgb(var(--v-theme-primary) / 6%), 0 14px 34px rgb(var(--v-theme-primary) / 16%); }
.hero-copy { max-width: 680px; margin: 1.35rem auto 1.6rem; text-align: center; }
.hero-copy h2 { margin: 0.55rem 0; font-size: clamp(1.45rem, 3vw, 2.15rem); }
.hero-copy p { margin: 0; opacity: 0.62; }
.composer-shell { position: relative; z-index: 2; padding: 0.9rem 1.25rem 0.7rem; background: transparent; }
.reference-row { width: min(100%, 900px); margin: 0 auto 0.5rem; display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem; }
.reference-label { margin-inline-end: 0.2rem; font-size: 0.7rem; opacity: 0.55; }
.composer { position: relative; width: min(100%, 900px); margin: 0 auto; display: flex; align-items: center; gap: 0.55rem; padding: 0.5rem 0.55rem 0.5rem 0.65rem; border: 1px solid rgba(var(--v-theme-primary), 0.22); border-radius: 20px; background: rgba(var(--v-theme-surface), 0.96); box-shadow: 0 2px 6px rgba(var(--v-theme-on-surface), 0.1), 0 12px 32px rgba(var(--v-theme-on-surface), 0.16), 0 0 0 1px rgba(var(--v-theme-surface), 0.72); transition: border-color 160ms ease, box-shadow 160ms ease; }
.composer-leading { flex: 0 0 34px; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: rgb(var(--v-theme-primary)); background: rgb(var(--v-theme-primary) / 10%); }
.composer:focus-within { border-color: rgba(var(--v-theme-primary), 0.58); box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.1), 0 4px 10px rgba(var(--v-theme-on-surface), 0.1), 0 16px 38px rgba(var(--v-theme-on-surface), 0.18); }
.mention-menu { position: absolute; inset-inline-start: 0; bottom: calc(100% + 8px); z-index: 20; width: min(430px, 90vw); max-height: 300px; overflow-y: auto; padding: 0.45rem; border: 1px solid rgb(var(--v-theme-borderColor)); border-radius: 12px; background: rgb(var(--v-theme-surface)); box-shadow: 0 16px 40px rgb(0 0 0 / 20%); }
.mention-menu button { width: 100%; display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.75rem; border: 0; border-radius: 8px; color: inherit; background: transparent; text-align: start; cursor: pointer; }
.mention-menu button:hover { background: rgb(var(--v-theme-primary) / 12%); }
.mention-menu-title, .mention-empty { padding: 0.6rem 0.75rem; font-size: 0.78rem; opacity: 0.7; }
.composer-footer { width: min(100%, 900px); margin: 0.45rem auto 0; display: flex; justify-content: space-between; gap: 1rem; font-size: 0.7rem; color: rgb(var(--v-theme-on-surface)); opacity: 0.72; text-shadow: 0 1px 2px rgb(var(--v-theme-surface)); }
@media (max-width: 700px) {
  .isas-chat-page { height: calc(100vh - 112px); border-radius: 0; border-inline: 0; }
  .isas-toolbar, .composer-shell { padding-inline: 0.75rem; }
  .isas-toolbar p, .composer-footer span:last-child { display: none; }
  .message-stack { padding: 1rem 0.75rem; }
  .landing-state { padding: 1.2rem 0.75rem; }
  .toolbar-actions .model-select { display: none; }
  .pattern-grid { grid-template-columns: 1fr; max-height: 64vh; overflow-y: auto; }
  .composer-leading { display: none; }
}
</style>
