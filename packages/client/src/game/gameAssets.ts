import playerSrc from '@/assets/game/player.svg'
import enemySrc from '@/assets/game/enemy.svg'
import healthSrc from '@/assets/game/health.svg'
import shotgunSrc from '@/assets/game/shotgun.svg'
import machineGunSrc from '@/assets/game/machine-gun.svg'

export const gameAssets = {
  player: null as HTMLImageElement | null,
  enemy: null as HTMLImageElement | null,
  health: null as HTMLImageElement | null,
  shotgun: null as HTMLImageElement | null,
  machineGun: null as HTMLImageElement | null,
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
