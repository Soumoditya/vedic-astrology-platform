const SwissEPH = require('sweph-wasm').default;

async function test() {
  try {
    const swe = await SwissEPH.init();
    
    // Test ayanamsa setting
    // Does it have swe_set_sid_mode?
    console.log("Functions available:");
    console.log(Object.keys(swe));
    
  } catch(e) {
    console.error(e);
  }
}
test();
