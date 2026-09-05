const NORMALIZED_GUEST_ID_PREFIX = 'guest_id'

export const normalizeGuestId = (rawGuestId: string) =>
  `${NORMALIZED_GUEST_ID_PREFIX}_${rawGuestId}`
