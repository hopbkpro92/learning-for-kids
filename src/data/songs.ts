import type { Song } from '../audio/songPlayer'

/**
 * Nhạc điệu truyền thống thuộc công cộng — dàn lại đơn giản trên giọng C major
 * (spec mục 8: tự hòa âm, không sao chép âm thanh có bản quyền; mẹ duyệt sau).
 */
export const SONGS: Song[] = [
  {
    id: 'con-vit',
    title: 'Con vịt xòe ra hai cánh',
    tempo: 100,
    lines: [
      {
        lyric: 'Con vịt xòe ra hai cánh',
        notes: [
          { note: 'C4', beats: 1 },
          { note: 'C4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'E4', beats: 2 },
          { note: 'G4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 2 },
        ],
      },
      {
        lyric: 'Quằn queo bẹp dí xuống đìa',
        notes: [
          { note: 'A4', beats: 1 },
          { note: 'A4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'C4', beats: 2 },
        ],
      },
      {
        lyric: 'Bé ơi có thương chú vịt không',
        notes: [
          { note: 'E4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'A4', beats: 2 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'C4', beats: 2 },
        ],
      },
    ],
  },
  {
    id: 'ca-nha-thuong-nhau',
    title: 'Cả nhà thương nhau',
    tempo: 92,
    lines: [
      {
        lyric: 'Cha thương con, mẹ thương con',
        notes: [
          { note: 'G4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 2 },
          { note: 'G4', beats: 1 },
          { note: 'A4', beats: 1 },
          { note: 'G4', beats: 2 },
        ],
      },
      {
        lyric: 'Cả nhà thương nhau lấy làm vui',
        notes: [
          { note: 'E4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'A4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'C4', beats: 3 },
        ],
      },
      {
        lyric: 'Tiếng cười vang vọng ấm áp mọi bề',
        notes: [
          { note: 'C4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'G4', beats: 2 },
          { note: 'E4', beats: 2 },
          { note: 'C4', beats: 3 },
        ],
      },
    ],
  },
  {
    id: 'chi-chi-chanh-chanh',
    title: 'Chi chí chành chành',
    tempo: 108,
    lines: [
      {
        lyric: 'Chi chí chành chành',
        notes: [
          { note: 'D4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'D4', beats: 2 },
        ],
      },
      {
        lyric: 'Chồng đe ten',
        notes: [
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'D4', beats: 2 },
        ],
      },
      {
        lyric: 'Ai về thì về, ai ở thì ở',
        notes: [
          { note: 'G4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'A4', beats: 1 },
          { note: 'G4', beats: 1 },
          { note: 'E4', beats: 1 },
          { note: 'D4', beats: 1 },
          { note: 'C4', beats: 2 },
        ],
      },
    ],
  },
]
