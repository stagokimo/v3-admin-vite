import SvgIcon from "@/components/SvgIcon/index.vue"

/** 由 app.component 全域性註冊的元件需要在這裡聲明 TS 型別才能獲得 Volar 外掛提供的型別提示） */
declare module "vue" {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}

export {}
