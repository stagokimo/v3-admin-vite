import { type Ref, onBeforeUnmount, ref } from "vue"
import { debounce } from "lodash-es"

type Observer = {
  watermarkElMutationObserver?: MutationObserver
  parentElMutationObserver?: MutationObserver
  parentElResizeObserver?: ResizeObserver
}

type DefaultConfig = typeof defaultConfig

/** 預設配置 */
const defaultConfig = {
  /** 防禦（預設開啟，能防禦水印被刪除或隱藏，但可能會有效能損耗） */
  defense: true,
  /** 文字顏色 */
  color: "#c0c4cc",
  /** 文字透明度 */
  opacity: 0.5,
  /** 文字字型大小 */
  size: 16,
  /** 文字字型 */
  family: "serif",
  /** 文字傾斜角度 */
  angle: -20,
  /** 一處水印所佔寬度（數值越大水印密度越低） */
  width: 300,
  /** 一處水印所佔高度（數值越大水印密度越低） */
  height: 200
}

/** body 元素 */
const bodyEl = ref<HTMLElement>(document.body)

/**
 * 建立水印
 * 1. 可以選擇傳入掛載水印的容器元素，預設是 body
 * 2. 做了水印防禦，能有效防禦別人打開控制檯刪除或隱藏水印
 */
export function useWatermark(parentEl: Ref<HTMLElement | null> = bodyEl) {
  /** 備份文字 */
  let backupText: string
  /** 最終配置 */
  let mergeConfig: DefaultConfig
  /** 水印元素 */
  let watermarkEl: HTMLElement | null = null
  /** 觀察器 */
  const observer: Observer = {
    watermarkElMutationObserver: undefined,
    parentElMutationObserver: undefined,
    parentElResizeObserver: undefined
  }

  /** 設定水印 */
  const setWatermark = (text: string, config: Partial<DefaultConfig> = {}) => {
    if (!parentEl.value) {
      console.warn("請在 DOM 掛載完成後再呼叫 setWatermark 方法設定水印")
      return
    }
    // 備份文字
    backupText = text
    // 合併配置
    mergeConfig = { ...defaultConfig, ...config }
    // 建立或更新水印元素
    watermarkEl ? updateWatermarkEl() : createWatermarkEl()
    // 監聽水印元素和容器元素的變化
    addElListener(parentEl.value)
  }

  /** 建立水印元素 */
  const createWatermarkEl = () => {
    const isBody = parentEl.value!.tagName.toLowerCase() === bodyEl.value.tagName.toLowerCase()
    const watermarkElPosition = isBody ? "fixed" : "absolute"
    const parentElPosition = isBody ? "" : "relative"
    watermarkEl = document.createElement("div")
    watermarkEl.style.pointerEvents = "none"
    watermarkEl.style.top = "0"
    watermarkEl.style.left = "0"
    watermarkEl.style.position = watermarkElPosition
    watermarkEl.style.zIndex = "99999"
    const { clientWidth, clientHeight } = parentEl.value!
    updateWatermarkEl({ width: clientWidth, height: clientHeight })
    // 設定水印容器為相對定位
    parentEl.value!.style.position = parentElPosition
    // 將水印元素新增到水印容器中
    parentEl.value!.appendChild(watermarkEl)
  }

  /** 更新水印元素 */
  const updateWatermarkEl = (
    options: Partial<{
      width: number
      height: number
    }> = {}
  ) => {
    if (!watermarkEl) return
    backupText && (watermarkEl.style.background = `url(${createBase64()}) left top repeat`)
    options.width && (watermarkEl.style.width = `${options.width}px`)
    options.height && (watermarkEl.style.height = `${options.height}px`)
  }

  /** 建立 base64 圖片 */
  const createBase64 = () => {
    const { color, opacity, size, family, angle, width, height } = mergeConfig
    const canvasEl = document.createElement("canvas")
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext("2d")
    if (ctx) {
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.font = `${size}px ${family}`
      ctx.rotate((Math.PI / 180) * angle)
      ctx.fillText(backupText, 0, height / 2)
    }
    return canvasEl.toDataURL()
  }

  /** 清除水印 */
  const clearWatermark = () => {
    if (!parentEl.value || !watermarkEl) return
    // 移除對水印元素和容器元素的監聽
    removeListener()
    // 移除水印元素
    try {
      parentEl.value.removeChild(watermarkEl)
    } catch {
      // 比如在無防禦情況下，使用者打開控制檯刪除了這個元素
      console.warn("水印元素已不存在，請重新建立")
    } finally {
      watermarkEl = null
    }
  }

  /** 重新整理水印（防禦時呼叫） */
  const updateWatermark = debounce(() => {
    clearWatermark()
    createWatermarkEl()
    addElListener(parentEl.value!)
  }, 100)

  /** 監聽水印元素和容器元素的變化（DOM 變化 & DOM 大小變化） */
  const addElListener = (targetNode: HTMLElement) => {
    // 判斷是否開啟防禦
    if (mergeConfig.defense) {
      // 防止重複新增監聽
      if (!observer.watermarkElMutationObserver && !observer.parentElMutationObserver) {
        // 監聽 DOM 變化
        addMutationListener(targetNode)
      }
    } else {
      // 無防禦時不需要 mutation 監聽
      removeListener("mutation")
    }
    // 防止重複新增監聽
    if (!observer.parentElResizeObserver) {
      // 監聽 DOM 大小變化
      addResizeListener(targetNode)
    }
  }

  /** 移除對水印元素和容器元素的監聽，傳參可指定要移除哪個監聽，不傳預設移除全部監聽 */
  const removeListener = (kind: "mutation" | "resize" | "all" = "all") => {
    // 移除 mutation 監聽
    if (kind === "mutation" || kind === "all") {
      observer.watermarkElMutationObserver?.disconnect()
      observer.watermarkElMutationObserver = undefined
      observer.parentElMutationObserver?.disconnect()
      observer.parentElMutationObserver = undefined
    }
    // 移除 resize 監聽
    if (kind === "resize" || kind === "all") {
      observer.parentElResizeObserver?.disconnect()
      observer.parentElResizeObserver = undefined
    }
  }

  /** 監聽 DOM 變化 */
  const addMutationListener = (targetNode: HTMLElement) => {
    // 當觀察到變動時執行的回撥
    const mutationCallback = debounce((mutationList: MutationRecord[]) => {
      // 水印的防禦（防止使用者手動刪除水印元素或通過 CSS 隱藏水印）
      mutationList.forEach(
        debounce((mutation: MutationRecord) => {
          switch (mutation.type) {
            case "attributes":
              mutation.target === watermarkEl && updateWatermark()
              break
            case "childList":
              mutation.removedNodes.forEach((item) => {
                item === watermarkEl && targetNode.appendChild(watermarkEl)
              })
              break
          }
        }, 100)
      )
    }, 100)
    // 建立觀察器實例並傳入回撥
    observer.watermarkElMutationObserver = new MutationObserver(mutationCallback)
    observer.parentElMutationObserver = new MutationObserver(mutationCallback)
    // 以上述配置開始觀察目標節點
    observer.watermarkElMutationObserver.observe(watermarkEl!, {
      // 觀察目標節點屬性是否變動，預設為 true
      attributes: true,
      // 觀察目標子節點是否有新增或者刪除，預設為 false
      childList: false,
      // 是否拓展到觀察所有後代節點，預設為 false
      subtree: false
    })
    observer.parentElMutationObserver.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false
    })
  }

  /** 監聽 DOM 大小變化 */
  const addResizeListener = (targetNode: HTMLElement) => {
    // 當 targetNode 元素大小變化時去更新整個水印的大小
    const resizeCallback = debounce(() => {
      const { clientWidth, clientHeight } = targetNode
      updateWatermarkEl({ width: clientWidth, height: clientHeight })
    }, 500)
    // 建立一個觀察器實例並傳入回撥
    observer.parentElResizeObserver = new ResizeObserver(resizeCallback)
    // 開始觀察目標節點
    observer.parentElResizeObserver.observe(targetNode)
  }

  /** 在元件解除安裝前移除水印以及各種監聽 */
  onBeforeUnmount(() => {
    clearWatermark()
  })

  return { setWatermark, clearWatermark }
}
