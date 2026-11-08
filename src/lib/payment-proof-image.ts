import sharp from "sharp";

export const PAYMENT_PROOF_MAX_BYTES = 5 * 1024 * 1024;
export const PAYMENT_PROOF_MAX_PIXELS = 20_000_000;

const FORMAT_BY_MIME = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const INVALID_IMAGE_MESSAGE = "Please upload a valid JPG, PNG or WebP image.";

export type NormalizedPaymentProofImage =
  | {
      ok: true;
      data: Uint8Array;
      contentType: "image/webp";
      extension: "webp";
      width: number;
      height: number;
    }
  | { ok: false; error: string };

/**
 * Fully decodes an untrusted payment screenshot and stores a metadata-free,
 * lossless WebP copy. The source MIME is only accepted when it matches the
 * decoder's detected container format.
 */
export async function normalizePaymentProofImage(
  input: Uint8Array,
  declaredMime: string,
): Promise<NormalizedPaymentProofImage> {
  if (input.byteLength === 0) return { ok: false, error: INVALID_IMAGE_MESSAGE };
  if (input.byteLength > PAYMENT_PROOF_MAX_BYTES) {
    return { ok: false, error: "The screenshot must be 5 MB or smaller." };
  }

  const expectedFormat = FORMAT_BY_MIME[declaredMime as keyof typeof FORMAT_BY_MIME];
  if (!expectedFormat) return { ok: false, error: INVALID_IMAGE_MESSAGE };

  const decoderOptions = {
    failOn: "warning" as const,
    limitInputPixels: PAYMENT_PROOF_MAX_PIXELS,
    limitInputChannels: 4,
    sequentialRead: true,
  };

  try {
    const metadata = await sharp(input, { ...decoderOptions, animated: true }).metadata();
    if (
      metadata.format !== expectedFormat ||
      !metadata.width ||
      !metadata.height ||
      metadata.width * metadata.height > PAYMENT_PROOF_MAX_PIXELS ||
      (metadata.pages ?? 1) > 1
    ) {
      return { ok: false, error: INVALID_IMAGE_MESSAGE };
    }

    const { data, info } = await sharp(input, decoderOptions)
      .rotate()
      .webp({ lossless: true, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    if (data.byteLength === 0 || data.byteLength > PAYMENT_PROOF_MAX_BYTES) {
      return {
        ok: false,
        error: "The processed screenshot must be 5 MB or smaller. Please use a smaller image.",
      };
    }

    return {
      ok: true,
      data: new Uint8Array(data),
      contentType: "image/webp",
      extension: "webp",
      width: info.width,
      height: info.height,
    };
  } catch {
    return { ok: false, error: INVALID_IMAGE_MESSAGE };
  }
}
