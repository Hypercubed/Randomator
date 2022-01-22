import crypto from '@trust/webcrypto';

export function cryptoRandom(): number {
  let cryptoRandoms: Uint32Array;
  const cryptoRandomSlices = [];
  let cryptoRandomString: string;
  while ((cryptoRandomString = '.' + cryptoRandomSlices.join('')).length < 30) {
    cryptoRandoms = crypto.getRandomValues(new Uint32Array(5));
    for (let i = 0; i < cryptoRandoms.length; i++) {
      const cryptoRandomSlice = cryptoRandoms[i] < 4000000000 ? cryptoRandoms[i].toString().slice(1) : '';
      if (cryptoRandomSlice.length > 0) cryptoRandomSlices[cryptoRandomSlices.length] = cryptoRandomSlice;
    }
  }
  return Number(cryptoRandomString);
}
