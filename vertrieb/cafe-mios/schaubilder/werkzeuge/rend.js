const {chromium}=require('playwright');
module.exports=async(file,ids,vw,vh,prefix)=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:vw,height:vh},deviceScaleFactor:2});
await p.goto('file://'+file);await p.evaluate(()=>document.fonts.ready);
await p.evaluate(async()=>{await Promise.all(['600 40px "Cormorant Garamond"','italic 500 40px "Cormorant Garamond"','500 20px Jost','400 20px Jost','600 20px Jost'].map(f=>document.fonts.load(f)))});
await p.waitForTimeout(800);
for(const id of ids)await p.locator('#'+id).screenshot({path:`${prefix}${id}.png`});await b.close()}
