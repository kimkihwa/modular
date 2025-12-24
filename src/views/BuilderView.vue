<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import draggable from 'vuedraggable'

const router = useRouter()
const moduleStore = useModuleStore()

const drag = ref(false)

// 사용 가능한 모든 모듈 (팔레트용)
const availableModules = computed(() => 
  Object.values(moduleStore.modules).sort((a, b) => a.order - b.order)
)

// 캔버스에 추가된 모듈들
const canvasModules = ref<any[]>([])

const selectedModule = ref<string | null>(null)

const selectModule = (moduleId: string) => {
  selectedModule.value = selectedModule.value === moduleId ? null : moduleId
}

const getSelectedModuleOptions = computed(() => {
  if (!selectedModule.value) return []
  const module = canvasModules.value.find(m => m.id === selectedModule.value)
  return module?.options || []
})

const toggleOption = (optionId: string) => {
  if (!selectedModule.value) return
  const module = canvasModules.value.find(m => m.id === selectedModule.value)
  if (!module) return
  
  const option = module.options.find((o: any) => o.id === optionId)
  if (option) {
    option.enabled = !option.enabled
  }
}

// 팔레트에서 캔버스로 모듈 추가
const addModuleToCanvas = (module: any) => {
  // QR 모듈은 중복 허용 (시연용), 다른 모듈은 중복 체크
  if (module.id !== 'dynamicQr') {
    if (canvasModules.value.find(m => m.id === module.id)) {
      return
    }
  }
  
  // 깊은 복사로 모듈 추가
  canvasModules.value.push(JSON.parse(JSON.stringify(module)))
}

// 캔버스에서 모듈 제거
const removeModuleFromCanvas = (moduleId: string) => {
  canvasModules.value = canvasModules.value.filter(m => m.id !== moduleId)
  if (selectedModule.value === moduleId) {
    selectedModule.value = null
  }
}

const goToPreview = () => {
  // 캔버스 모듈 정보를 스토어에 저장
  moduleStore.applyCanvasModules(canvasModules.value)
  router.push('/preview')
}

const goBack = () => {
  router.push('/')
}

const resetConfig = () => {
  canvasModules.value = []
  selectedModule.value = null
}
</script>

<template>
  <div class="builder-view">
    <!-- 헤더 툴바 -->
    <div class="builder-toolbar">
      <div class="toolbar-left">
        <q-btn flat round icon="arrow_back" @click="goBack" />
        <div class="toolbar-title">
          <q-icon name="widgets" size="20px" class="q-mr-sm" />
          <span>서비스 빌더</span>
        </div>
      </div>
      
      <div class="toolbar-center">
        <q-chip outline color="primary" size="sm">
          <q-icon name="layers" size="16px" class="q-mr-xs" />
          {{ canvasModules.length }}개 모듈
        </q-chip>
      </div>

      <div class="toolbar-right">
        <q-btn 
          outline 
          color="grey-7" 
          icon="refresh" 
          label="초기화" 
          @click="resetConfig"
          size="sm"
        />
        <q-btn 
          color="orange" 
          icon="visibility" 
          label="미리보기" 
          @click="goToPreview"
          :disable="canvasModules.length === 0"
          size="sm"
          unelevated
        />
      </div>
    </div>

    <div class="builder-workspace">
      <!-- 좌측: 모듈 팔레트 -->
      <div class="palette-panel">
        <div class="section-header">
          <h2>사용 가능한 모듈</h2>
          <span class="hint">아래로 드래그하여 추가</span>
        </div>

        <div class="module-palette">
          <draggable 
            :list="availableModules"
            :group="{ name: 'modules', pull: 'clone', put: false }"
            :clone="(original: any) => ({ ...original })"
            item-key="id"
            :sort="false"
            class="palette-list"
          >
            <template #item="{ element }">
              <div class="palette-module">
                <div 
                  class="module-icon" 
                  :style="{ backgroundColor: element.color }"
                >
                  <q-icon :name="element.icon" color="white" size="28px" />
                </div>
                <div class="module-name">{{ element.name }}</div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- 중앙: 캔버스 영역 -->
      <div class="canvas-panel">
        <div class="panel-header">
          <q-icon name="grid_on" size="18px" class="q-mr-xs" />
          <span>서비스 구성 캔버스</span>
        </div>

        <div class="canvas-area">
          <draggable 
            v-model="canvasModules"
            :group="{ name: 'modules' }"
            item-key="id"
            @start="drag = true"
            @end="drag = false"
            class="canvas-list"
            :class="{ 'drag-active': drag }"
          >
            <template #item="{ element, index }">
              <div 
                class="canvas-module"
                :class="{ 'selected': selectedModule === element.id }"
                @click="selectModule(element.id)"
              >
                <div class="module-order">{{ index + 1 }}</div>
                <div 
                  class="module-icon" 
                  :style="{ backgroundColor: element.color }"
                >
                  <q-icon :name="element.icon" color="white" size="32px" />
                </div>
                <div class="module-info">
                  <div class="module-name">{{ element.name }}</div>
                  <div class="module-options-count">
                    {{ element.options.filter((o: any) => o.enabled).length }} / {{ element.options.length }} 옵션 활성
                  </div>
                </div>
                <q-btn 
                  flat 
                  round 
                  icon="close" 
                  size="sm" 
                  @click.stop="removeModuleFromCanvas(element.id)"
                />
              </div>
            </template>
          </draggable>

          <!-- 빈 캔버스 안내 -->
          <div v-if="canvasModules.length === 0" class="empty-canvas">
            <q-icon name="widgets" size="64px" color="grey-5" />
            <p>왼쪽에서 모듈을 드래그하여 서비스를 구성하세요</p>
          </div>
        </div>
      </div>

      <!-- 우측: 속성 패널 -->
      <div class="properties-panel">
        <div class="panel-header">
          <q-icon name="tune" size="18px" class="q-mr-xs" />
          <span>속성</span>
        </div>

        <!-- 모듈 선택되지 않은 상태 -->
        <div v-if="!selectedModule" class="properties-empty">
          <q-icon name="info_outline" size="48px" color="grey-5" />
          <p>모듈을 선택하여 옵션을 설정하세요</p>
        </div>

        <!-- 모듈 옵션 설정 -->
        <div v-else class="properties-content">
          <div class="selected-module-info">
            <div 
              class="module-icon-small" 
              :style="{ backgroundColor: canvasModules.find(m => m.id === selectedModule)?.color }"
            >
              <q-icon 
                :name="canvasModules.find(m => m.id === selectedModule)?.icon" 
                color="white" 
                size="20px" 
              />
            </div>
            <span class="module-name-small">
              {{ canvasModules.find(m => m.id === selectedModule)?.name }}
            </span>
          </div>

          <q-separator class="q-my-md" />

          <div class="options-list">
            <div 
              v-for="option in getSelectedModuleOptions" 
              :key="option.id"
              class="option-item"
            >
              <div class="option-info">
                <div class="option-label">{{ option.label }}</div>
                <div class="option-desc">{{ option.description }}</div>
              </div>
              <q-toggle 
                :model-value="option.enabled"
                @update:model-value="toggleOption(option.id)"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

// 핸드오더 색상 변수
$black: #1C1917;
$primary: #44403C;
$gray: #878787;
$gray-light: #F5F5F4;
$gray-lighter: #FAFAFA;
$border: #E7E5E4;
$border-light: #F0F0F0;
$white: #FFF;
$orange: #F3610B;
$orange-light: #FFEDE3;
$toolbar-height: 56px;

// ===== 레이아웃 =====
.builder-view {
  height: 100vh;
  background: $gray-lighter;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 상단 툴바 (포토샵/피그마 스타일)
.builder-toolbar {
  height: $toolbar-height;
  background: $white;
  border-bottom: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .toolbar-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: $black;
    }
  }

  .toolbar-center {
    flex: 0 0 auto;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
  }
}

// 워크스페이스 (3단 레이아웃)
.builder-workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  overflow: hidden;
  height: calc(100vh - #{$toolbar-height});
}

// ===== 좌측 패널: 모듈 팔레트 =====
.palette-panel {
  background: $white;
  border-right: 1px solid $border;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .section-header {
    padding: 16px;
    border-bottom: 1px solid $border-light;

    h2 {
      font-size: 13px;
      font-weight: 600;
      color: $black;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }

    .hint {
      font-size: 11px;
      color: $gray;
    }
  }

  .module-palette {
    flex: 1;
    overflow-y: auto;
    padding: 12px;

    .palette-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }
}

.palette-module {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px;
  background: $gray-lighter;
  border: 1px solid $border-light;
  border-radius: 8px;
  cursor: move;
  transition: all 0.15s ease;

  &:hover {
    border-color: $primary;
    background: $white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .module-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .module-name {
    font-size: 12px;
    font-weight: 600;
    color: $black;
    text-align: center;
  }
}

// ===== 중앙 패널: 캔버스 =====
.canvas-panel {
  background: $gray-light;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    height: 44px;
    background: $white;
    border-bottom: 1px solid $border;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 600;
    color: $primary;
    flex-shrink: 0;
  }
}

.canvas-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  .canvas-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 100%;

    &.drag-active {
      .canvas-module {
        border-color: color.adjust($orange, $lightness: 20%);
      }
    }
  }
}

.canvas-module {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: $white;
  border: 2px solid $border;
  border-radius: 10px;
  cursor: move;
  transition: all 0.15s ease;
  gap: 12px;

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }

  &.selected {
    border-color: $orange;
    box-shadow: 0 0 0 3px rgba(243, 97, 11, 0.1);
    background: color.adjust($orange, $lightness: 47%);
  }

  .module-order {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: $primary;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
  }

  .module-icon {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .module-info {
    flex: 1;
    min-width: 0;

    .module-name {
      font-size: 15px;
      font-weight: 600;
      color: $black;
      margin-bottom: 4px;
    }

    .module-options-count {
      font-size: 12px;
      color: $gray;
    }
  }
}

.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  text-align: center;

  p {
    margin-top: 16px;
    color: $gray;
    font-size: 13px;
  }
}

// ===== 우측 패널: 속성 =====
.properties-panel {
  background: $white;
  border-left: 1px solid $border;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    height: 44px;
    background: $white;
    border-bottom: 1px solid $border;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 600;
    color: $primary;
    flex-shrink: 0;
  }
}

.properties-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;

  p {
    margin-top: 16px;
    color: $gray;
    font-size: 13px;
    line-height: 1.5;
  }
}

.properties-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  .selected-module-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: $gray-lighter;
    border-radius: 8px;

    .module-icon-small {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .module-name-small {
      font-size: 14px;
      font-weight: 600;
      color: $black;
    }
  }
}

.options-list {
  .option-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px;
    background: $gray-lighter;
    border-radius: 8px;
    margin-bottom: 8px;
    gap: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .option-info {
      flex: 1;
      min-width: 0;

      .option-label {
        font-size: 13px;
        font-weight: 600;
        color: $black;
        margin-bottom: 4px;
      }

      .option-desc {
        font-size: 11px;
        color: $gray;
        line-height: 1.4;
      }
    }
  }
}
</style>
