export type InboxChannel="instagram"|"messenger"|"whatsapp"|"web";
export type InboxMessage={id:string;from:"customer"|"business";text:string;at:string};
export type InboxThread={id:string;customer:string;channel:InboxChannel;unread:boolean;status:"open"|"closed";tag:string;messages:InboxMessage[];synthetic?:boolean};
export const EXAMPLE_THREADS:InboxThread[]=[
 {id:"sample-1",customer:"Aylin M.",channel:"instagram",unread:true,status:"open",tag:"Yeni müştəri",synthetic:true,messages:[{id:"1",from:"customer",text:"Salam, hədiyyə qutunuzun qiyməti neçədir?",at:"14:10"},{id:"2",from:"business",text:"Salam! Qutular 65 AZN-dən başlayır.",at:"14:11"},{id:"3",from:"customer",text:"Çatdırılma neçə günədir? Ad əlavə edə bilirsiniz?",at:"14:12"}]},
 {id:"sample-2",customer:"Orxan R.",channel:"messenger",unread:true,status:"open",tag:"Qiymət",synthetic:true,messages:[{id:"1",from:"customer",text:"Əl işi fincan dəsti nə qədərdir?",at:"13:20"},{id:"2",from:"business",text:"55 AZN-dir, fərdi rəng seçimi mümkündür.",at:"13:22"},{id:"3",from:"customer",text:"Başqa yerdə daha ucuz gördüm. Niyə sizdən alım?",at:"13:28"}]},
 {id:"sample-3",customer:"Ləman Ə.",channel:"web",unread:false,status:"open",tag:"Çatdırılma",synthetic:true,messages:[{id:"1",from:"customer",text:"Sabaha hədiyyə hazırlamaq olar?",at:"Dünən"},{id:"2",from:"business",text:"Hazırlama müddəti modeldən asılıdır. Hansı məhsula baxırsınız?",at:"Dünən"},{id:"3",from:"customer",text:"Şam dəsti istəyirəm, Bakı daxilinə göndəriləcək.",at:"Dünən"}]},
];
export function inboxText(t:InboxThread){return t.messages.map(m=>`${m.from==='customer'?'Müştəri':'Satıcı'}: ${m.text}`).join("\n");}
export function parseInboxFile(json:unknown):InboxThread[]{
 if(!Array.isArray(json)||json.length>100)throw new Error("JSON faylda ən çox 100 yazışma olmalıdır.");
 return json.map((item,i)=>{
  if(!item||typeof item!=="object")throw new Error(`${i+1}-ci yazışma düzgün deyil.`);
  const x=item as Record<string,unknown>;
  if(typeof x.customer!=="string"||x.customer.length>120||!Array.isArray(x.messages)||x.messages.length>100)throw new Error(`${i+1}-ci yazışmada müştəri adı və ya mesajlar düzgün deyil.`);
  const messages:InboxMessage[]=x.messages.map((m,j)=>{
   if(!m||typeof m!=="object")throw new Error("Mesaj formatı düzgün deyil.");
   const v=m as Record<string,unknown>;
   if(!["business","customer"].includes(String(v.from))||typeof v.text!=="string"||v.text.length>10000)throw new Error(`${i+1}-ci yazışmada ${j+1}-ci mesaj düzgün deyil.`);
   return{id:crypto.randomUUID(),from:v.from as "business"|"customer",text:v.text,at:typeof v.at==="string"?v.at:"Import"};
  });
  const allowed=["instagram","messenger","whatsapp","web"];
  return {id:crypto.randomUUID(),customer:x.customer,channel:allowed.includes(String(x.channel))?x.channel as InboxChannel:"web",unread:true,status:"open",tag:"Import",messages};
 });
}
