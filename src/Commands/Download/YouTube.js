const _0x13bc14=_0x2ace;(function(_0x5e99c6,_0x19c241){const _0x412ace=_0x2ace,_0x30ea01=_0x5e99c6();while(!![]){try{const _0x574087=-parseInt(_0x412ace(0x152))/0x1+-parseInt(_0x412ace(0x17d))/0x2+parseInt(_0x412ace(0x176))/0x3*(parseInt(_0x412ace(0x14a))/0x4)+parseInt(_0x412ace(0x15e))/0x5+parseInt(_0x412ace(0x173))/0x6*(-parseInt(_0x412ace(0x13c))/0x7)+-parseInt(_0x412ace(0x162))/0x8+-parseInt(_0x412ace(0x159))/0x9*(-parseInt(_0x412ace(0x17b))/0xa);if(_0x574087===_0x19c241)break;else _0x30ea01['push'](_0x30ea01['shift']());}catch(_0x40e05f){_0x30ea01['push'](_0x30ea01['shift']());}}}(_0x174c,0x2f4c7));const yts=require(_0x13bc14(0x15d)),ytdl=require(_0x13bc14(0x144)),fs=require('fs'),path=require(_0x13bc14(0x160)),emojis={'search':'🔍','found':'🎉','noResults':'😕','error':'🤖','downloadChoice':'👇','option':'✅','processing':'⏳','done':'🚀','warning':'⚠️'};function _0x174c(){const _0x3f9514=['react','Search\x20for\x20YouTube\x20videos\x20and\x20download\x20them.','response','substr','6714ldkwTM','⏱️\x20Timed\x20out\x20waiting\x20for\x20your\x20choice.','highestvideo','publishedAt','yt-search','1180775GEnpZd','downloadChoice','path','likes','233608veitNS','warning','seconds','includes','validateURL','existsSync','contentLength','thumbnails','name','MAX_DOWNLOAD_SIZE','network','./temp','processing','reply','youtube','dislikes','changeFont','6xTrwOF','views','❌\x20Invalid\x20option.\x20Please\x20choose\x20a\x20valid\x20option\x20(a1,\x20a2,\x20v1,\x20or\x20v2).','3fvmaVJ','toLocaleDateString','status','video','toISOString','2020onggWT','pipe','144154DnaYrc','thumbnail','audio','search','done','lengthSeconds','url','mkdirSync','mp3','videoDetails','viewCount','repeat','😕\x20Oops!\x20No\x20videos\x20found\x20for\x20that\x20query.','Download','toFixed','ytsearch','toLowerCase','RED','unlinkSync','🔎\x20Please\x20provide\x20a\x20search\x20query\x20or\x20YouTube\x20link.','endsWith','\x0a├\x20\x20📆\x20*Published:*\x20','join','now','🚫🗝️\x20Uh\x20oh!\x20Seems\x20like\x20there\x27s\x20an\x20issue\x20with\x20the\x20API\x20key.\x20Please\x20double-check\x20your\x20configuration.','toLocaleString','createWriteStream','duration','chooseFormat','\x0a├\x20\x20👤\x20*Channel:*\x20','noResults','730583aMCSxd','sendAudio','finish','round','formats','exports','\x20\x0a├\x20\x20👁️‍🗨️\x20*Views:*\x20','\x0a├\x20\x20👍\x20*Likes:*\x20','ytdl-core','\x0a├\x20\x20🕘\x20*Duration:*\x20','🤖\x20Oops!\x20Something\x20unexpected\x20happened.\x20We\x27ll\x20look\x20into\x20it.','highestaudio','readFileSync','sendImage','150984LlbifM','getResponseText','mp4','title','videos','sendDocument','author','getInfo','25211fEydza','N/A','smallBoldScript'];_0x174c=function(){return _0x3f9514;};return _0x174c();}function _0x2ace(_0xa7378f,_0x439217){const _0x174cf9=_0x174c();return _0x2ace=function(_0x2aceba,_0x51f399){_0x2aceba=_0x2aceba-0x133;let _0x2f11f3=_0x174cf9[_0x2aceba];return _0x2f11f3;},_0x2ace(_0xa7378f,_0x439217);}module[_0x13bc14(0x141)]={'usage':[_0x13bc14(0x18c),_0x13bc14(0x170),'yt'],'desc':_0x13bc14(0x156),'commandType':_0x13bc14(0x18a),'isGroupOnly':![],'isAdminOnly':![],'isPrivateOnly':![],'emoji':'🔍',async 'execute'(_0xcb20fb,_0x48b4bb,_0x497b27){const _0x2d3739=_0x13bc14;try{const _0x1fe334=settings[_0x2d3739(0x16b)]*0x400*0x400,_0x288443=_0x497b27[_0x2d3739(0x133)]('\x20');await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis[_0x2d3739(0x180)]);if(!_0x288443)return await buddy['reply'](_0x48b4bb,_0x2d3739(0x190));let _0x107fd8;if(ytdl[_0x2d3739(0x166)](_0x288443)){const _0xad0099=await ytdl['getInfo'](_0x288443);_0x107fd8={'title':_0xad0099['videoDetails'][_0x2d3739(0x14d)],'url':_0xad0099[_0x2d3739(0x186)]['video_url'],'author':{'name':_0xad0099[_0x2d3739(0x186)][_0x2d3739(0x150)][_0x2d3739(0x16a)]},'duration':{'seconds':parseInt(_0xad0099['videoDetails'][_0x2d3739(0x182)])},'views':parseInt(_0xad0099[_0x2d3739(0x186)][_0x2d3739(0x187)]),'likes':parseInt(_0xad0099[_0x2d3739(0x186)]['likes']),'dislikes':parseInt(_0xad0099[_0x2d3739(0x186)][_0x2d3739(0x171)]),'publishedAt':_0xad0099[_0x2d3739(0x186)]['publishDate'],'thumbnail':_0xad0099[_0x2d3739(0x186)][_0x2d3739(0x169)][0x0][_0x2d3739(0x183)]};}else{const _0x413f7b=await yts(_0x288443);if(_0x413f7b[_0x2d3739(0x14e)]['length']===0x0)return await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis[_0x2d3739(0x13b)]),await buddy[_0x2d3739(0x16f)](_0x48b4bb,_0x2d3739(0x189));_0x107fd8=_0x413f7b['videos'][0x0];}await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis['found']);const _0x35e56c=new Date(_0x107fd8[_0x2d3739(0x138)][_0x2d3739(0x164)]*0x3e8)[_0x2d3739(0x17a)]()[_0x2d3739(0x158)](0xb,0x8),_0x5c1a83=new Date(_0x107fd8[_0x2d3739(0x15c)])[_0x2d3739(0x177)]();let _0x38410a='\x0a📽️\x20*BUDDY-MD\x20VIDEO-DOWNLOADER*\x20📽️\x0a\x0a┌───────────────────\x0a├\x20\x20ℹ️\x20*Title:*\x20'+_0x107fd8[_0x2d3739(0x14d)]+_0x2d3739(0x13a)+_0x107fd8['author']['name']+_0x2d3739(0x192)+_0x5c1a83+_0x2d3739(0x142)+_0x107fd8[_0x2d3739(0x174)]['toLocaleString']()+_0x2d3739(0x143)+(_0x107fd8[_0x2d3739(0x161)]?.[_0x2d3739(0x136)]()||_0x2d3739(0x153))+'\x20\x0a├\x20\x20👎\x20*Dislikes:*\x20'+(_0x107fd8[_0x2d3739(0x171)]?.[_0x2d3739(0x136)]()||_0x2d3739(0x153))+_0x2d3739(0x145)+_0x35e56c+'\x0a└───────────────────\x0a\x0a🔢\x20Select\x20the\x20download\x20option\x20from\x20below\x0a\x0a`[📣]\x20Audio\x20File`\x0a\x20\x20\x201\x20:\x20Audio\x20as\x20Document\x20(a1)\x20\x0a\x20\x20\x202\x20:\x20Audio\x20as\x20Normal\x20\x20(a2)\x20\x20\x20\x0a\x20\x20\x20\x0a`[📺]\x20Video\x20File`\x0a\x20\x20\x201\x20:\x20Video\x20as\x20Document\x20(v1)\x0a\x20\x20\x202\x20:\x20Video\x20as\x20Normal\x20\x20(v2)\x0a\x20\x20\x20\x0a```We\x20now\x20support\x20480P\x20video\x20quality\x20and\x20192k\x20audio\x20quality\x20for\x20better\x20stability.\x20Support\x20us\x20for\x20more\x20improvements!\x20🛠️```';const _0x72b1ba=await buddy[_0x2d3739(0x172)](_0x38410a,_0x2d3739(0x154)),_0x1e828f=await buddy[_0x2d3739(0x149)](_0x48b4bb,_0x107fd8[_0x2d3739(0x17e)],_0x72b1ba);await buddy['react'](_0x48b4bb,emojis[_0x2d3739(0x15f)]);const _0x450988=await buddy[_0x2d3739(0x14b)](_0x48b4bb,_0x1e828f);if(_0x450988){await buddy['react'](_0x48b4bb,emojis['option']);let _0x2327d4=_0x450988[_0x2d3739(0x157)][_0x2d3739(0x18d)]();await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis['processing']);let _0x356389,_0x4f009a,_0x379dd5;while(!![]){if(_0x2327d4==='1'||_0x2327d4==='2'){_0x356389=_0x2d3739(0x17f),_0x4f009a=_0x2d3739(0x147),_0x379dd5=_0x2d3739(0x185);break;}else{if(_0x2327d4==='3'||_0x2327d4==='4'){_0x356389=_0x2d3739(0x179),_0x4f009a=_0x2d3739(0x15b),_0x379dd5=_0x2d3739(0x14c);break;}else{await buddy[_0x2d3739(0x16f)](_0x48b4bb,_0x2d3739(0x175));const _0x2ad232=await buddy['getResponseText'](_0x48b4bb,_0x1e828f);_0x2327d4=_0x2ad232['response'][_0x2d3739(0x18d)]();}}}await buddy['react'](_0x48b4bb,emojis['success']);try{const _0x59e344=await ytdl[_0x2d3739(0x151)](_0x107fd8[_0x2d3739(0x183)]),_0x4d7f39=ytdl[_0x2d3739(0x139)](_0x59e344[_0x2d3739(0x140)],{'quality':_0x4f009a});if(_0x4d7f39[_0x2d3739(0x168)]>_0x1fe334)return await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis[_0x2d3739(0x163)]),await buddy[_0x2d3739(0x16f)](_0x48b4bb,emojis['warning']+'\x20The\x20file\x20size\x20('+(_0x4d7f39[_0x2d3739(0x168)]/0x400/0x400)[_0x2d3739(0x18b)](0x2)+'\x20MB)\x20exceeds\x20the\x20maximum\x20allowed\x20size\x20('+settings['MAX_DOWNLOAD_SIZE']+'\x20MB).');const _0x3548cf=path['join'](_0x2d3739(0x16d));!fs[_0x2d3739(0x167)](_0x3548cf)&&fs[_0x2d3739(0x184)](_0x3548cf);const _0x5a68c3=path['join'](_0x3548cf,'temp_'+Date[_0x2d3739(0x134)]()+'.'+_0x379dd5);let _0x35ff89=0x0;const _0x478f08=await buddy['reply'](_0x48b4bb,emojis[_0x2d3739(0x16e)]+'\x20Downloading...\x200%');ytdl(_0x107fd8['url'],{'quality':_0x4f009a})['on']('progress',(_0x2d7ab1,_0x4cc2d9,_0x27ae15)=>{const _0x1abc39=_0x2d3739;_0x35ff89=_0x4cc2d9;const _0xf61514=Math[_0x1abc39(0x13f)](_0x4cc2d9/_0x27ae15*0x64),_0x1ffc49=Math[_0x1abc39(0x13f)](_0xf61514/0xa),_0x4fac95=0xa-_0x1ffc49,_0x47ed08='🟩'[_0x1abc39(0x188)](_0x1ffc49)+'🟥'[_0x1abc39(0x188)](_0x4fac95);})[_0x2d3739(0x17c)](fs[_0x2d3739(0x137)](_0x5a68c3))['on'](_0x2d3739(0x13e),async()=>{const _0x3a2db9=_0x2d3739,_0x8a5e00=fs['statSync'](_0x5a68c3)['size'];let _0xb6667b=_0x356389==='audio'?buddy[_0x3a2db9(0x13d)]:buddy['sendVideo'];(_0x2327d4[_0x3a2db9(0x191)]('1')||_0x8a5e00>0xf*0x400*0x400)&&(_0xb6667b=buddy[_0x3a2db9(0x14f)]),await _0xb6667b(_0x48b4bb,fs[_0x3a2db9(0x148)](_0x5a68c3),_0x356389===_0x3a2db9(0x17f)?'audio/mpeg':'video/mp4',_0x107fd8[_0x3a2db9(0x14d)]+'.'+_0x379dd5),fs[_0x3a2db9(0x18f)](_0x5a68c3),await buddy[_0x3a2db9(0x155)](_0x48b4bb,emojis[_0x3a2db9(0x181)]);});}catch(_0x32ccaa){logger[_0x2d3739(0x18e)](_0x32ccaa),await buddy[_0x2d3739(0x16f)](_0x48b4bb,'❌\x20An\x20error\x20occurred\x20while\x20downloading.\x20Please\x20try\x20again\x20later.');}}else await buddy[_0x2d3739(0x16f)](_0x48b4bb,_0x2d3739(0x15a));}catch(_0x41267c){await buddy[_0x2d3739(0x155)](_0x48b4bb,emojis['error']);if(_0x41267c[_0x2d3739(0x157)]&&_0x41267c[_0x2d3739(0x157)][_0x2d3739(0x178)]===0x193)await buddy[_0x2d3739(0x16f)](_0x48b4bb,_0x2d3739(0x135));else _0x41267c['message'][_0x2d3739(0x165)](_0x2d3739(0x16c))?await buddy[_0x2d3739(0x16f)](_0x48b4bb,'🌐\x20Hmm,\x20having\x20trouble\x20connecting\x20to\x20the\x20internet.\x20Please\x20try\x20again\x20later.'):(await buddy[_0x2d3739(0x16f)](_0x48b4bb,_0x2d3739(0x146)),logger[_0x2d3739(0x18e)](_0x41267c));}}};
