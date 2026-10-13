import type { SceneImageId } from '../../components/ShapeSprite'

export type SortRule = 'color' | 'shape' | 'kind'

export interface SortBasket {
  id: string
  label: string
  color: string
}

export interface SortItem {
  id: string
  targetBasketId: string
  sprite: SceneImageId
}

export interface SetSpec {
  rule: SortRule
  baskets: SortBasket[]
  items: SortItem[]
}

const BASKETS: SortBasket[] = [
  { id: 'b0', label: 'Giỏ trái cây', color: '#FF9F45' },
  { id: 'b1', label: 'Giỏ nước', color: '#3BA6D9' },
  { id: 'b2', label: 'Giỏ rau', color: '#93D9A3' },
]

const ITEM_SPRITES: SceneImageId[] = ['apple', 'banana', 'milk', 'fish', 'leaf', 'star']

function randInt(n: number): number {
  return Math.floor(Math.random() * n)
}

export function genSet(level: 1 | 2 | 3): SetSpec {
  const basketCount = level === 1 ? 2 : 3
  const itemCount = level === 1 ? 4 : 6
  const rule: SortRule = level === 1 ? 'kind' : level === 2 ? 'color' : 'shape'
  const baskets = BASKETS.slice(0, basketCount)
  const items: SortItem[] = []
  const usedSprites = new Set<SceneImageId>()
  for (let i = 0; i < itemCount; i++) {
    let sprite = ITEM_SPRITES[randInt(ITEM_SPRITES.length)]
    while (usedSprites.has(sprite)) {
      sprite = ITEM_SPRITES[randInt(ITEM_SPRITES.length)]
    }
    usedSprites.add(sprite)
    items.push({
      id: `item-${i}`,
      targetBasketId: baskets[i % baskets.length].id,
      sprite,
    })
  }
  return { rule, baskets, items }
}
