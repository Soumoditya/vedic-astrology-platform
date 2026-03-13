async function test() {
  const mod = await import('sweph-wasm');
  console.log(Object.keys(mod));
  if (mod.default) {
    console.log("default:", Object.keys(mod.default));
    try {
      const swe = await mod.default.init();
      console.log("init successful");
    } catch(e) {
      console.error(e);
    }
  }
}
test();
