const crypto = window['crypto'] || window['msCrypto'];

export function cryptoRandom() {
  let cryptoRandoms: string | any[];
  let cryptoRandomSlices = [];
  let cryptoRandom: string;
  while((cryptoRandom = '.' + cryptoRandomSlices.join('')).length < 30){
    cryptoRandoms = crypto.getRandomValues(new Uint32Array(5));
    for(var i = 0; i < cryptoRandoms.length; i++){
      var cryptoRandomSlice = cryptoRandoms[i] < 4000000000 ? cryptoRandoms[i].toString().slice(1) : '';
      if(cryptoRandomSlice.length > 0) cryptoRandomSlices[cryptoRandomSlices.length] = cryptoRandomSlice;
    }
  }
  return Number(cryptoRandom);
};