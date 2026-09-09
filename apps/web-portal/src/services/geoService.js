/**
 * Reverse geocodes latitude & longitude into structured administrative divisions
 * using OpenStreetMap Nominatim API (Free, open-access, no key required).
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const resp = await fetch(url, {
      headers: {
        'Accept-Language': 'en,hi',
        'User-Agent': 'Setu-Citizen-Platform/1.0'
      }
    });
    if (!resp.ok) throw new Error(`Geocoding HTTP error: ${resp.status}`);
    const data = await resp.json();
    const addr = data.address || {};

    const villageCity =
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.town ||
      addr.city ||
      addr.residential ||
      'Local Area';

    const subdistrict =
      addr.county ||
      addr.subdistrict ||
      addr.tehsil ||
      addr.taluk ||
      addr.block ||
      '';

    const district = addr.state_district || addr.district || 'Ranchi';
    const state = addr.state || 'Jharkhand';
    const pincode = addr.postcode || '';

    // Build human-readable formatted address
    const parts = [villageCity];
    if (subdistrict && subdistrict !== villageCity) parts.push(subdistrict);
    if (district) parts.push(district);
    if (pincode) parts.push(`PIN: ${pincode}`);

    return {
      formatted: parts.join(', '),
      villageCity,
      subdistrict,
      district,
      state,
      pincode,
      displayName: data.display_name || parts.join(', ')
    };
  } catch (err) {
    console.warn('Reverse geocode failed, using fallback:', err);
    return {
      formatted: 'Morabadi, Ranchi, Jharkhand',
      villageCity: 'Morabadi',
      subdistrict: 'Ranchi Sadar',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834008',
      displayName: 'Morabadi, Ranchi, Jharkhand'
    };
  }
}

/**
 * Extracts the first frame of a video blob or URL as a base64 JPEG thumbnail.
 */
export function extractVideoThumbnail(videoSrcOrBlob) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      const url =
        typeof videoSrcOrBlob === 'string'
          ? videoSrcOrBlob
          : URL.createObjectURL(videoSrcOrBlob);
      video.src = url;

      let resolved = false;

      const finish = (dataUrl) => {
        if (!resolved) {
          resolved = true;
          if (typeof videoSrcOrBlob !== 'string') {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
          }
          resolve(dataUrl);
        }
      };

      video.onloadeddata = () => {
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 240;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          finish(dataUrl);
        } catch (e) {
          finish(null);
        }
      };

      video.onerror = () => finish(null);

      // Fallback timeout after 2.5s
      setTimeout(() => finish(null), 2500);
    } catch (e) {
      resolve(null);
    }
  });
}
