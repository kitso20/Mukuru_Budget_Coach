// Translations. To add a language: add a block below + an <option> in the language picker.
// Any key missing from a language falls back to English, so partial translations still work.
// REVIEW NEEDED: have native speakers check "sn" and "ny" before the demo.
// "to" (Chitonga, Malawi) is EMPTY on purpose: it needs a real speaker. See translations.csv.
const STRINGS = {
  en: {
    overview: "My money", add: "I spent", split: "My plan",
    title: "Add what I spent", lead: "Write down what you spent.",
    amountLabel: "How much did you spend?", merchantLabel: "What did you buy?", merchantPh: "Food, taxi, airtime",
    category: "Which money box?", auto: "Choose for me", date: "Day",
    recipient: "Who got the money?", optional: "(you can skip)", recipientPh: "Name",
    submit: "Save", saving: "Saving...",
    errAmount: "Write how much you spent.", errMerchant: "Write what you bought.",
    saved: "Saved.", savedTo: "Saved in {cat}.", flagged: "Saved. But look: {reason}",
    flagBig: "This is a lot of money for {cat}.", flagDup: "You saved this one already.",
    errSave: "Not saved. Please try again.", errCats: "Could not load the money boxes.",
    balanceNote: "Money left: {balance}. Most you can spend at one time: {limit}",
    capTitle: "Wait! That is a lot of money",
    capText: "You want to spend {amount}. You only have {balance}. This is more than half of your money. Do you want to go on?",
    capTextHard: "You cannot spend more than half of your money at one time. Write {limit} or less.",
    capChange: "No, change it", capAnyway: "Yes, save it",
    dashTitle: "My money this month",
    incomeLbl: "Money I got", spentLbl: "Money gone out", balanceLbl: "Money left", perDayLbl: "To spend each day",
    envTitle: "My money boxes", adviceTitle: "Tips", recentTitle: "What I spent lately", noTx: "Nothing spent yet.",
    ofBudget: "{spent} used of {budget}", left: "{left} left", over: "{over} too much",
    statusOk: "Good", statusWarn: "Getting low", statusRisk: "Almost finished",
    lvlRisk: "Careful!", lvlWarn: "Watch", lvlGood: "Good", lvlInfo: "Tip",
    advOver: "You spent too much on {name}. You are {over} over. Spend less here.",
    advNear: "{name} is almost finished. Only {left} left.",
    advPace: "You are using {name} money too fast.",
    advPaceAll: "You are spending too fast this month.",
    advTotal: "You spent more than you have. Stop buying things that can wait.",
    advDaily: "You can spend about {perDay} each day.",
    advGood: "You are doing well.",
    loadErr: "Could not load your money. Please try again.",
    setupHint: "No money boxes yet. Make your plan first.", setupLink: "Go to My plan",
    splitTitle: "My plan", splitLead: "Write the money you get each month. Then share it into boxes.",
    incomeInput: "Money I get each month (R)", totalLbl: "Total",
    pctNeed: "Add {d}% more to reach 100%.", pctOver: "Take away {d}% to reach 100%.",
    saveSplit: "Save my plan", splitSaved: "Plan saved. Go to My money to see it.",
    autoLbl: "Take out now",
    autoHint: "Tick Take out now and that money leaves your balance right away. Good for money you send home.",
    sentOf: "{spent} sent of {budget}", toSend: "{left} still to send", allSent: "All sent", takenOut: "Taken out",
    popOverT: "Careful!", popOverX: "{name}: you spent {over} too much.",
    popNearT: "Almost finished", popNearX: "{name}: only {left} left.",
    popNegT: "No money left", popNegX: "You spent more than you have.", popOk: "OK",
  },
  sn: {
    overview: "Mari yangu", add: "Ndashandisa", split: "Hurongwa hwangu",
    title: "Nyora mari yawashandisa", lead: "Nyora zvawashandisa.",
    amountLabel: "Washandisa marii?", merchantLabel: "Wakatenga chii?", merchantPh: "Chikafu, tekisi, airtime",
    category: "Bhokisi ripi remari?", auto: "Sarudza ini", date: "Zuva",
    recipient: "Akagamuchira", optional: "(unogona kusiya)", recipientPh: "Zita",
    submit: "Chengetedza", saving: "Ndiri kuchengetedza...",
    errAmount: "Nyora mari yawashandisa.", errMerchant: "Nyora zvawatenga.",
    saved: "Zvachengetedzwa.", savedTo: "Zvachengetedzwa mu{cat}.", flagged: "Zvachengetedzwa. Asi tarisa: {reason}",
    flagBig: "Iyi mari yakawanda ye{cat}.", flagDup: "Wakachengeta izvi kare.",
    errSave: "Hazvina kuchengetedzwa. Edza zvakare.", errCats: "Hatina kukwanisa kutora mabhokisi.",
    balanceNote: "Mari yasara: {balance}. Yakawanda yaunogona kushandisa kamwe: {limit}",
    capTitle: "Mira! Iyi mari yakawanda",
    capText: "Unoda kushandisa {amount}. Une {balance} chete. Iyi inodarika hafu yemari yaunayo. Unoda kuenderera here?",
    capTextHard: "Hauzogoni kushandisa mari inodarika hafu. Isa {limit} kana pasi.",
    capChange: "Kwete, ndichashandura", capAnyway: "Hongu, chengetedza",
    dashTitle: "Mari yangu mwedzi uno",
    incomeLbl: "Mari yandakawana", spentLbl: "Mari yabuda", balanceLbl: "Mari yasara", perDayLbl: "Yekushandisa pazuva",
    envTitle: "Mabhokisi emari yangu", adviceTitle: "Mazano", recentTitle: "Zvandashandisa nguva pfupi yapfuura", noTx: "Hapana zvawashandisa nezvino.",
    ofBudget: "{spent} yashandiswa kubva ku{budget}", left: "Yasara {left}", over: "Wadarika {over}",
    statusOk: "Zvakanaka", statusWarn: "Iri kuderera", statusRisk: "Yava kupera",
    lvlRisk: "Chenjera!", lvlWarn: "Tarisa", lvlGood: "Zvakanaka", lvlInfo: "Zano",
    advOver: "Washandisa mari yakawanda pa{name}. Wadarika {over}. Shandisa zvishoma pano.",
    advNear: "{name} yava kuda kupera. Yasara {left} chete.",
    advPace: "Uri kushandisa mari ye{name} nekukurumidza.",
    advPaceAll: "Uri kushandisa mari nekukurumidza mwedzi uno.",
    advTotal: "Washandisa mari inodarika yaunayo. Rega kutenga zvinogona kumirira.",
    advDaily: "Unogona kushandisa inenge {perDay} pazuva.",
    advGood: "Uri kuita zvakanaka.",
    loadErr: "Hatina kukwanisa kutora mari yako. Edza zvakare.",
    setupHint: "Hapana mabhokisi. Tanga wanyora hurongwa hwako.", setupLink: "Enda ku Hurongwa hwangu",
    splitTitle: "Hurongwa hwangu", splitLead: "Nyora mari yaunowana mwedzi. Wobva wagovera mumabhokisi.",
    incomeInput: "Mari yandinowana pamwedzi (R)", totalLbl: "Zvese",
    pctNeed: "Wedzera {d}% kuti ifike 100%.", pctOver: "Bvisa {d}% kuti ive 100%.",
    saveSplit: "Chengetedza hurongwa", splitSaved: "Hurongwa hwachengetedzwa. Enda ku Mari yangu kuti uone.",
    autoLbl: "Bvisa zvino",
    autoHint: "Tinya Bvisa zvino uye mari inobva pamari yako pakarepo. Zvakanaka pamari yekutumira kumba.",
    sentOf: "{spent} yatumirwa kubva ku{budget}", toSend: "{left} yasara kutumira", allSent: "Yese yatumirwa", takenOut: "Yabviswa",
    popOverT: "Chenjera!", popOverX: "{name}: wadarika {over}.",
    popNearT: "Yava kupera", popNearX: "{name}: yasara {left} chete.",
    popNegT: "Mari yapera", popNegX: "Washandisa mari inodarika yaunayo.", popOk: "Zvakanaka",
  },
  ny: {
    overview: "Ndalama zanga", add: "Zomwe ndagwiritsa", split: "Ndondomeko yanga",
    title: "Lembani ndalama zomwe mwagwiritsa", lead: "Lembani zomwe mwagwiritsa ntchito.",
    amountLabel: "Mwagwiritsa ndalama zingati?", merchantLabel: "Mwagula chiyani?", merchantPh: "Chakudya, taxi, airtime",
    category: "Bokosi liti la ndalama?", auto: "Sankhani m'malo mwanga", date: "Tsiku",
    recipient: "Wolandira", optional: "(mungadumphe)", recipientPh: "Dzina",
    submit: "Sungani", saving: "Tikusunga...",
    errAmount: "Lembani ndalama zomwe mwagwiritsa.", errMerchant: "Lembani zomwe mwagula.",
    saved: "Zasungidwa.", savedTo: "Zasungidwa mu {cat}.", flagged: "Zasungidwa. Koma onani: {reason}",
    flagBig: "Iyi ndi ndalama zambiri za {cat}.", flagDup: "Mwasunga kale izi.",
    errSave: "Sizinasungidwe. Yesaninso.", errCats: "Sitinathe kutenga mabokosi.",
    balanceNote: "Ndalama zotsala: {balance}. Zochuluka kwambiri nthawi imodzi: {limit}",
    capTitle: "Dikirani! Ndi ndalama zambiri",
    capText: "Mukufuna kugwiritsa {amount}. Muli ndi {balance} yokha. Ndi ndalama zoposa theka la zomwe muli nazo. Mukufuna kupitiriza?",
    capTextHard: "Simungathe kugwiritsa ndalama zoposa theka. Lembani {limit} kapena kuchepera.",
    capChange: "Ayi, ndisintha", capAnyway: "Inde, sungani",
    dashTitle: "Ndalama zanga mwezi uno",
    incomeLbl: "Ndalama zomwe ndalandira", spentLbl: "Ndalama zomwe zachoka", balanceLbl: "Ndalama zotsala", perDayLbl: "Zogwiritsa tsiku lililonse",
    envTitle: "Mabokosi a ndalama zanga", adviceTitle: "Malangizo", recentTitle: "Zomwe ndagwiritsa posachedwapa", noTx: "Palibe zomwe mwagwiritsa.",
    ofBudget: "{spent} mwa {budget} zagwiritsidwa", left: "Zatsala {left}", over: "Mwapitirira {over}",
    statusOk: "Zili bwino", statusWarn: "Zikuchepa", statusRisk: "Zatsala pang'ono kutha",
    lvlRisk: "Samalani!", lvlWarn: "Yang'anani", lvlGood: "Zili bwino", lvlInfo: "Upangiri",
    advOver: "Mwagwiritsa ndalama zambiri pa {name}. Mwapitirira {over}. Gwiritsani pang'ono pano.",
    advNear: "{name} yatsala pang'ono kutha. Zatsala {left} zokha.",
    advPace: "Mukugwiritsa ndalama za {name} mofulumira.",
    advPaceAll: "Mukugwiritsa ndalama mofulumira mwezi uno.",
    advTotal: "Mwagwiritsa ndalama zoposa zomwe muli nazo. Siyani kugula zinthu zomwe zingadikire.",
    advDaily: "Mungagwiritse pafupifupi {perDay} tsiku lililonse.",
    advGood: "Mukuchita bwino.",
    loadErr: "Sitinathe kutenga ndalama zanu. Yesaninso.",
    setupHint: "Mulibe mabokosi. Choyamba lembani ndondomeko yanu.", setupLink: "Pitani ku Ndondomeko yanga",
    splitTitle: "Ndondomeko yanga", splitLead: "Lembani ndalama zomwe mumalandira mwezi. Kenako zigawireni m'mabokosi.",
    incomeInput: "Ndalama zomwe ndimalandira pamwezi (R)", totalLbl: "Zonse",
    pctNeed: "Onjezani {d}% kuti ifike 100%.", pctOver: "Chotsani {d}% kuti ikhale 100%.",
    saveSplit: "Sungani ndondomeko", splitSaved: "Ndondomeko yasungidwa. Pitani ku Ndalama zanga kuti muone.",
    autoLbl: "Chotsa tsopano",
    autoHint: "Sankhani Chotsa tsopano ndipo ndalamazo zichoka pa ndalama zanu nthawi yomweyo. Zabwino pa ndalama zotumiza kunyumba.",
    sentOf: "{spent} zatumizidwa mwa {budget}", toSend: "{left} zotsala kutumiza", allSent: "Zonse zatumizidwa", takenOut: "Zachotsedwa",
    popOverT: "Samalani!", popOverX: "{name}: mwagwiritsa {over} yoposa.",
    popNearT: "Zatsala pang'ono kutha", popNearX: "{name}: zatsala {left} zokha.",
    popNegT: "Ndalama zatha", popNegX: "Mwagwiritsa ndalama zoposa zomwe muli nazo.", popOk: "Chabwino",
  },
  to: {
    // Chitonga (Malawi): waiting for a native speaker. Fill in from translations.csv.
    // Until then every missing line shows in English.
  },
};

let lang = "en";
try { lang = localStorage.getItem("lang") || "en"; } catch (e) {}
if (!STRINGS[lang]) lang = "en";

export const getLang = () => lang;

export function t(key, vars = {}) {
  let s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}

export function applyTranslations() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}

export function setLang(next) {
  if (!STRINGS[next]) return;
  lang = next;
  try { localStorage.setItem("lang", next); } catch (e) {}
  applyTranslations();
  document.dispatchEvent(new Event("langchange"));
}
