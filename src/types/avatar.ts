/**
 * Avatar poses. Only idle art exists today; the parameter exists so that
 * adding walk or attack frames later is an asset drop plus one line in the
 * sprite map, not a refactor of every call site.
 */
export type AvatarPose = 'idle' | 'walk' | 'attack'
