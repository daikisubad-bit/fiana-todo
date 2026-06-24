export type Status = 'urgent' | 'progress' | 'todo' | 'done'

export interface Task {
  id: string
  title: string
  owner: string
  due: string
  status: Status
  note: string
}

export interface Section {
  cat: string
  tasks: Task[]
}

export const STATUS_LABELS: Record<Status, string> = {
  urgent: '急ぎ',
  progress: '進行中',
  todo: '未着手',
  done: '完了',
}

export const STATUS_NEXT: Record<Status, Status> = {
  urgent: 'progress',
  progress: 'todo',
  todo: 'done',
  done: 'urgent',
}

export const INITIAL_DATA: Section[] = [
  {
    cat: '① チャンネル設立',
    tasks: [
      { id: 't1', title: 'チャンネル名の決定', owner: '荒井・千葉', due: '〜6/25', status: 'progress', note: '' },
      { id: 't2', title: 'チャンネル作成', owner: 'TOMI', due: '〜6/27', status: 'todo', note: 'TOMIさんが担当' },
      { id: 't3', title: 'チャンネルアイコン作成', owner: '荒井', due: '〜6/27', status: 'todo', note: 'フィアナさんの顔写真素材を使用' },
      { id: 't4', title: 'チャンネルアート作成', owner: '荒井', due: '〜6/27', status: 'todo', note: '暖色系トンマナに合わせたデザイン' },
      { id: 't5', title: 'チャンネル説明文（about欄）', owner: '荒井', due: '〜6/27', status: 'todo', note: '' },
      { id: 't6', title: '概要欄フォーマット作成', owner: '荒井', due: '〜6/27', status: 'todo', note: 'LINEリンク・CTA定型文含む' },
    ],
  },
  {
    cat: '② 動画制作',
    tasks: [
      { id: 't7', title: 'No.5 台本 初稿（鴨崎）', owner: '鴨崎', due: '〜6/25', status: 'urgent', note: '27日撮影に間に合わせる必須タスク' },
      { id: 't8', title: 'No.5 台本FIX・AIチェック', owner: '荒井・千葉', due: '〜6/26', status: 'todo', note: 'AIで矛盾点チェック実施' },
      { id: 't9', title: 'No.5 撮影', owner: 'フィアナ・荒井', due: '6/27', status: 'todo', note: '撮影前にデモ検証必須' },
      { id: 't10', title: 'No.2 編集（kunihime）', owner: 'kunihime', due: '〜6/29 初稿', status: 'progress', note: '画面収録素材：格納中' },
      { id: 't11', title: 'No.2 編集チェック・修正', owner: '荒井', due: '〜7/2', status: 'todo', note: '' },
      { id: 't12', title: 'ダミーツール修正・デプロイ', owner: '荒井', due: '〜6/27', status: 'progress', note: 'Gmail宛に編集権限共有済み' },
      { id: 't13', title: 'ダミーツール画面収録', owner: '荒井', due: '〜6/28', status: 'todo', note: '' },
    ],
  },
  {
    cat: '③ ナレッジ・設定',
    tasks: [
      { id: 't14', title: 'CLAUDE.md / memory.md 確認', owner: '荒井', due: '〜6/27', status: 'todo', note: '' },
      { id: 't15', title: 'AI診断CTA方向性フィックス', owner: '千葉・荒井・宮さん', due: '来週火曜MTG', status: 'progress', note: '「AI活用ロードマップ」軸で進行中' },
      { id: 't16', title: 'LINEリンク確認（LP番号）', owner: '荒井', due: '〜6/27', status: 'todo', note: '440/446ミス再発防止' },
    ],
  },
  {
    cat: '④ トンマナ・編集設定',
    tasks: [
      { id: 't17', title: '動画トンマナFIX', owner: 'TOMI・千葉', due: '〜6/27', status: 'progress', note: '暖色系照明・背景の追加検討' },
      { id: 't18', title: 'LINEテロップ・エンドカード確認', owner: '荒井', due: '〜6/28', status: 'todo', note: '' },
      { id: 't19', title: 'BGM選定・ライセンス確認', owner: '荒井', due: '〜6/28', status: 'todo', note: '' },
    ],
  },
  {
    cat: '⑤ 管理・運用体制',
    tasks: [
      { id: 't20', title: 'YT管理シート更新（No.5を1本目に）', owner: '荒井', due: '本日中', status: 'urgent', note: '' },
      { id: 't21', title: 'チェッカー（金子さん）招待', owner: '荒井', due: '〜6/25', status: 'progress', note: '5,000円／本。台本チェック・機能検証担当' },
      { id: 't22', title: '新規ライター候補 トライアル依頼', owner: '荒井', due: '〜6/25', status: 'progress', note: 'CW外部申請通り次第招待' },
      { id: 't23', title: '田中さんとのMTG', owner: '荒井・千葉・田中', due: '〜6/25', status: 'urgent', note: 'フィアナAI方向性の確認' },
      { id: 't24', title: '集計・オプト管理のシステム移行検討', owner: 'TOMI・千葉', due: '来週火曜MTG', status: 'todo', note: '' },
    ],
  },
]
