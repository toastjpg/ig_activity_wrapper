const SHORT_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function mediaIdToShortCode(mediaId) {
  let id = BigInt(mediaId);
  let shortcode = "";

  while (id > 0n) {
    shortcode = SHORT_CODE_ALPHABET[Number(id % 64n)] + shortcode;
    id /= 64n;
  }

  return shortcode;
}

// posts -> <mediaID>, entire decoded string is 19 digits and uniquely identifies a post
// reels -> <mediaID><userID>, only need the mediaID part
function getShortCode(decoded) {
  const max = Math.min(decoded.length, 19);
  for (let len = max; len >= 17; len--) {
    const code = mediaIdToShortCode(decoded.slice(0, len));

    // ig shortcode urls are always 11 digits long
    if (code?.length === 11) {
      return code;
    }
  }

  return null;
}

function getPostURL(srcUrl) {
  try {
    const raw = new URL(srcUrl).searchParams.get("ig_cache_key");
    const decoded = atob(raw?.split(".")[0] ?? "");

    if (!/^\d+$/.test(decoded)) return null; // assert only digits 0-9

    const shortcode = getShortCode(decoded);
    if (!shortcode) return null;

    return `https://www.instagram.com/${decoded.length > 19 ? "reels" : "p"}/${shortcode}/`;
  } catch {
    return null;
  }
}
