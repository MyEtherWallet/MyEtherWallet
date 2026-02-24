<template>
  <div
    class="flex items-center justify-center min-h-[80vh] px-4 py-10 bg-appBackground"
  >
    <div class="max-w-[640px] w-full flex flex-col gap-5">
      <!-- Header -->
      <div class="flex flex-col items-center gap-1 text-center mb-2">
        <div
          class="w-14 h-14 rounded-20 bg-primary flex items-center justify-center mb-3 shadow-button"
        >
          <!-- Sparkles / AI icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.75"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
            />
          </svg>
        </div>
        <h1 class="text-s-32 font-bold leading-p-120">Agentic Wallet</h1>
        <p class="text-s-16 text-grey-50 leading-p-150 max-w-[420px]">
          Connect an AI agent to manage and execute blockchain transactions on
          your behalf
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-20 shadow-button overflow-hidden">
        <!-- Feature pills -->
        <div
          class="flex flex-wrap items-center gap-2 px-6 pt-5 pb-4 border-b border-grey-10"
        >
          <span
            v-for="feature in features"
            :key="feature"
            class="flex items-center gap-1.5 text-s-12 font-medium text-grey-70 bg-grey-5 rounded-20 px-3 py-1"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            {{ feature }}
          </span>
        </div>

        <div class="px-6 py-5">
          <!-- Loading -->
          <div v-if="isLoading" class="flex flex-col items-center gap-3 py-6">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-primary animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 50.5908 9.08144 50.5908Z"
                fill="currentColor"
                opacity="0.25"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <p class="text-s-14 text-grey-50 font-medium">
              Starting secure AI session…
            </p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="flex flex-col items-center gap-3 py-4">
            <div
              class="w-full flex items-start gap-3 bg-error-7 border border-error-10 rounded-16 px-4 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-error mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <p class="text-s-14 text-error break-all">{{ error }}</p>
            </div>
            <button
              class="text-s-14 font-semibold text-primary hover:text-primaryActive transition-colors"
              @click="connect"
            >
              Try again
            </button>
          </div>

          <!-- Connected -->
          <div v-else class="flex flex-col gap-4">
            <!-- Status -->
            <div class="flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span
                  :class="agentConnected ? 'bg-success' : 'bg-warning'"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                />
                <span
                  :class="agentConnected ? 'bg-success' : 'bg-warning'"
                  class="relative inline-flex rounded-full h-2.5 w-2.5"
                />
              </span>
              <span
                :class="agentConnected ? 'text-success' : 'text-warning'"
                class="text-s-14 font-semibold"
              >
                {{
                  agentConnected
                    ? 'AI agent connected'
                    : 'Connected to server — waiting for agent to connect'
                }}
              </span>
            </div>

            <!-- Session ID row -->
            <div
              class="flex items-center justify-between gap-3 bg-grey-5 rounded-16 px-4 py-3"
            >
              <div class="flex flex-col gap-0.5 min-w-0">
                <span
                  class="text-s-11 font-bold uppercase tracking-sp-06 text-grey-30"
                >
                  Session ID
                </span>
                <span class="text-s-14 font-mono text-black break-all">
                  {{ sessionId }}
                </span>
              </div>
              <app-btn-copy
                :copy-value="sessionId"
                label="Copy session ID"
                class="shrink-0"
              />
            </div>

            <!-- Info note -->
            <p class="text-s-12 text-grey-50 leading-p-150">
              Share this session ID with your AI agent to authorize transaction
              requests. Each session is unique and encrypted end-to-end.
            </p>
          </div>
        </div>
      </div>

      <!-- Disclaimer -->
      <p class="text-s-12 text-grey-30 text-center leading-p-150">
        Always review transactions before confirming. MyEtherWallet never
        auto-approves any action on your behalf.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import configs from '@/configs'
import AppBtnCopy from '@/components/AppBtnCopy.vue'

const sessionId = ref<string>('')
const isLoading = ref(false)
const error = ref<string>('')
const agentConnected = ref(false)

const features = [
  'AI-powered transactions',
  'End-to-end encrypted',
  'You approve every action',
]

let pollTimer: ReturnType<typeof setInterval> | null = null

function stopPolling() {
  if (pollTimer !== null) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function pollAgentStatus(uuid: string) {
  try {
    const res = await fetch(
      `${configs.MEW_MPC_RPC_URL}/api/agent-connected/${uuid}`,
    )
    if (res.ok) {
      const data: { isAgentConnected: boolean } = await res.json()
      if (data.isAgentConnected) {
        agentConnected.value = true
        stopPolling()
      }
    }
  } catch {
    // silently ignore — keep polling
  }
}

async function connect() {
  isLoading.value = true
  error.value = ''
  sessionId.value = ''
  agentConnected.value = false
  stopPolling()

  const uuid = crypto.randomUUID()

  try {
    const res = await fetch(`${configs.MEW_MPC_RPC_URL}/api/connect/${uuid}`)
    if (!res.ok) throw new Error(`Server responded with ${res.status}`)
    sessionId.value = uuid
    pollTimer = setInterval(() => pollAgentStatus(uuid), 1000)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Connection failed'
  } finally {
    isLoading.value = false
  }
}

onMounted(connect)
onUnmounted(stopPolling)
</script>
