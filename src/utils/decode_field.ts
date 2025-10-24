import { gunzipSync } from "zlib";

/**
 * YouTrack notifications field are base64 encoded and gzipped.
 * This function decodes and unzipps the content of response.
 * @param field Content that will be decoded.
 * @returns Decoded content
 */
export function decodeField(field: string) {
    const buf = Buffer.from(field, 'base64');
    return gunzipSync(buf).toString("utf-8");
}
