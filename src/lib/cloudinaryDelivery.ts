// src/lib/cloudinaryDelivery.ts
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export function cldUrl(publicId: string, transforms: string) {
  if (!CLOUD_NAME) throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME')
  // publicId kommt bei dir schon mit folder: "evocation/demo/..."
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

// Presets
export const cldCard = (publicId: string) =>
  cldUrl(publicId, 'c_fill,g_auto,w_640,h_360,dpr_auto,f_auto,q_auto')

export const cldThumb = (publicId: string) =>
  cldUrl(publicId, 'c_fill,g_auto,w_200,h_200,dpr_auto,f_auto,q_auto')

export const cldFull = (publicId: string) =>
  cldUrl(publicId, 'dpr_auto,f_auto,q_auto')
