export interface ListItem {
  avatar?: string
  title: string
  datetime?: string
  description?: string
  status?: "primary" | "success" | "info" | "warning" | "danger"
  extra?: string
}

export const notifyData: ListItem[] = [
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "V3 Admin Vite 上線啦",
    datetime: "一年前",
    description:
      "一個免費開源的中後臺管理系統基礎解決方案，基於 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技術"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "V3 Admin 上線啦",
    datetime: "兩年前",
    description: "一個中後臺管理系統基礎解決方案，基於 Vue3、TypeScript、Element Plus 和 Pinia"
  }
]

export const messageData: ListItem[] = [
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "來自楚門的世界",
    description: "如果再也不能見到你，祝你早安、午安和晚安",
    datetime: "1998-06-05"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "來自大話西遊",
    description: "如果非要在這份愛上加上一個期限，我希望是一萬年",
    datetime: "1995-02-04"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "來自龍貓",
    description: "心存善意，定能途遇天使",
    datetime: "1988-04-16"
  }
]

export const todoData: ListItem[] = [
  {
    title: "任務名稱",
    description: "這傢伙很懶，什麼都沒留下",
    extra: "未開始",
    status: "info"
  },
  {
    title: "任務名稱",
    description: "這傢伙很懶，什麼都沒留下",
    extra: "進行中",
    status: "primary"
  },
  {
    title: "任務名稱",
    description: "這傢伙很懶，什麼都沒留下",
    extra: "已超時",
    status: "danger"
  }
]
