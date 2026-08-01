import playerSrc from '@/assets/game/player.svg'
import enemySrc from '@/assets/game/enemy.svg'
import healthSrc from '@/assets/game/health.svg'
import shotgunSrc from '@/assets/game/shotgun.svg'
import machineGunSrc from '@/assets/game/machine-gun.svg'

type AssetKey = 'player' | 'enemy' | 'health' | 'shotgun' | 'machineGun'
type GameAssetsState = Record<AssetKey, HTMLImageElement | null>

export const gameAssets: GameAssetsState = {
  player: null,
  enemy: null,
  health: null,
  shotgun: null,
  machineGun: null,
}

function createImage(src: string) {
  const image = new Image()
  image.src = src
  return image
}

export function loadGameAssets() {
  if (gameAssets.player) {
    return
  }

  gameAssets.player = createImage(playerSrc)
  gameAssets.enemy = createImage(enemySrc)
  gameAssets.health = createImage(healthSrc)
  gameAssets.shotgun = createImage(shotgunSrc)
  gameAssets.machineGun = createImage(machineGunSrc)
}
