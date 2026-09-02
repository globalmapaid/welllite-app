export type Locale = 'en' | 'am' | 'am-Latn' | 'om';

type Entry = Record<Locale, string>;

// Sourced from "WellLite_language_translation_18th August 2026.xlsx" (sheet
// "WellLite texts"), keyed by the screen number in the reference screenshots.
// Only strings that exist in the current app are included.
export const translations: Record<string, Entry> = {
  // Common / reused across screens
  appName: { en: 'WellLite', am: 'ዌልላይት', 'am-Latn': 'WellLayit', om: 'WellLite' },
  select: { en: 'Select', am: 'ይምረጡ', 'am-Latn': 'Yimeretu', om: 'Filadhu' },
  saveClose: { en: 'Save & Close', am: 'አስቀምጥ እና ዝጋ', 'am-Latn': 'Askemt ena Zega', om: 'Kuusii fi Cufi' },
  agreeContinue: { en: 'Agree & Continue', am: 'እስማማለሁ እና እቀጥላለሁ', 'am-Latn': 'Ismamalew ena Eqetalalehu', om: 'Walii Galee Itti Fufi' },
  confirmPassword: { en: 'Confirm password', am: 'የይለፍ ቃልን ያረጋግጡ', 'am-Latn': 'YeYilef Kalin Yaregagetu', om: 'Jecha Darbii Mirkaneessi' },
  password: { en: 'Password', am: 'የይለፍ ቃል', 'am-Latn': 'YeYilef Kal', om: 'Jecha Darbii' },
  enterPassword: { en: 'Enter password', am: 'የይለፍ ቃል ያስገቡ', 'am-Latn': 'YeYilef Kal Yasgebu', om: 'Jecha Darbii Galchi' },
  email: { en: 'Email', am: 'ኢሜይል', 'am-Latn': 'Email', om: 'Imeelii' },
  enterEmail: { en: 'Enter email', am: 'ኢሜይል ያስገቡ', 'am-Latn': 'Email Yasgebu', om: 'Imeelii Galchi' },
  gotIt: { en: 'Got it.', am: 'ገብቶኛል።', 'am-Latn': 'Gebtognal', om: 'Naaf gale.' },
  comments: { en: 'Comments', am: 'አስተያየት', 'am-Latn': 'Asteyayet', om: 'Yaada' },
  logIn: { en: 'Log in', am: 'ይግቡ', 'am-Latn': 'Yigibu', om: 'Seeni' },
  signInLink: { en: 'Sign in', am: 'ይግቡ', 'am-Latn': 'Yigbu', om: 'Seeni' },
  signUp: { en: 'Sign up', am: 'ይመዝገቡ', 'am-Latn': 'Yimezgebu', om: "Galmaa'i" },
  dontHaveAccountPrompt: { en: "Don't have account? ", am: 'መለያ የለዎትም? ', 'am-Latn': 'Meleya yelewotimi? ', om: 'Akaawuntii hin qabduu? ' },
  alreadyHaveAccountPrompt: { en: 'Already have account? ', am: 'መለያ አለዎት? ', 'am-Latn': 'Meleya Alewot? ', om: 'Akaawuntii Qabdaa? ' },
  forgotPassword: { en: 'Forgot password', am: 'የይለፍ ቃል ረሱ?', 'am-Latn': 'YeYilef Kal Resu?', om: 'Jecha Darbii Dagatte?' },
  resetPassword: { en: 'Reset Password', am: 'የይለፍ ቃል ያድሱ', 'am-Latn': 'YeYilef Kal Yadsu', om: 'Jecha Darbii Haaromsi' },
  privacyAndPolicy: { en: 'Privacy and Policy', am: 'የግላዊነት እና ፖሊሲ', 'am-Latn': 'Yegelawinet ena Polisi', om: 'Iccitii fi Imaammata' },

  // Screen 2 — landing
  createAccount: { en: 'Create Account', am: 'መለያ ይፍጠሩ', 'am-Latn': 'Meleya Yifeteru', om: 'Akaawuntii Uumaa' },
  signInWithEmail: { en: 'Sign in with Email', am: 'በኢሜይል ይግቡ', 'am-Latn': 'Be Email Yigbu', om: 'Imeeliin Seeni' },
  visionAndMethod: { en: 'Vision and method', am: 'ራዕይ እና ዘዴ', 'am-Latn': "Ra'iy ena Zede", om: "Mul'ataa fi Mala" },

  // Screen 4 — vision and method
  ourVision: { en: 'Our vision', am: 'የእኛ ራዕይ', 'am-Latn': "Ye'enya Ra'iy", om: 'Mul\'ata Keenya' },
  visionBody: {
    en: 'Together we want to research wells to improve rural water supply, and support small farmers, help crop yields, improve drinking water, increase small farm irrigation.',
    am: 'በአንድነት የውኃ ጉድጓዶችን በማጥናት የገጠር ውኃ አቅርቦትን ለማሻሻል፣ ትናንሽ ገበሬዎችን ለመደገፍ፣ የሰብል ምርትን ለማሳደግ፣ የመጠጥ ውኃን ለማሻሻል እና የአነስተኛ እርሻ መስኖን ለማስፋፋት እንፈልጋለን።',
    'am-Latn': 'Be Andinet YeWuha Gudgwadochin Bematnat YeGeter Wuha Aqerbotin Lemashashal, Tinanish Geberewochin Lemedegf, YeSebil Mirtin Lemasadeg, YeMetet Wuha Lemashashal ena YeAnesetegna Irsha Mesnon Lemasfat Enfelgalen.',
    om: "Waliin boolla bishaan qorachuun dhiyeessa bishaan baadiyyaa fooyyessuu, qonnaan bultoota xixiqqoo deeggaruu, oomisha isaanii guddisuu, bishaan dhugaatii fooyyessuu fi jallisii isaanii babal'isuu barbaanna.",
  },
  ourMethod: { en: 'Our method', am: 'የእኛ ዘዴ', 'am-Latn': "Ye'enya Zede", om: 'Mala Keenya' },
  methodBody: {
    en: 'We are building an Artificial Intelligence (AI) called "WellMapr" to better detect groundwater levels, to improve successful drills and use water sustainably. To succeed, the AI needs data on wells.',
    am: 'የከርሰ ምድር ውኃ ደረጃን በተሻለ ለመለየት፣ የጉድጓድ ቁፋሮን ለማሻሻል እና ውኃን በዘላቂነት ለመጠቀም "WellMapr" የተባለ የሰው ሠራሽ አስተዋይነት (AI) እየገነባን ነው። ለመሳካት AI የጉድጓድ መረጃ ያስፈልገዋል።',
    'am-Latn': 'YeKerse Midir Wuha Derejan Beteshale Lemeleyet, YeGudgwad Qufaron Lemashashal ena Wuhan Bezelaqinet Lemetekem "WellMapr" Yetebale YeSew Serash Astewayinet Eyegeneban New. Lemesakat AI YeGudgwad Meraja Yasfeligewal.',
    om: "AI \"WellMapr\" jedhamu ijaarraa jirra; sadarkaa bishaan lafa keessaa sirriitti adda baasuuf, qotannoo milkaa'aa fi itti fayyadama bishaan waaraa deeggaruuf. Milkaa'uuf AI'n odeeffannoo boollaa barbaada.",
  },
  canYouHelp: {
    en: 'Can you help us research wells please?',
    am: 'እባክዎ የውኃ ጉድጓዶችን በማጥናት ሊረዱን ይችላሉ?',
    'am-Latn': 'Ibakwo YeWuha Gudgwadochin Bematnat Liredun Yichilalu?',
    om: 'Mee boolla bishaan qorachuu keessatti nu gargaaruu dandeessuu?',
  },
  gpsNeeded: {
    en: 'You need a modern smartphone that is GPS enabled.',
    am: 'GPS ያለው ዘመናዊ ስማርት ስልክ ያስፈልግዎታል።',
    'am-Latn': 'GPS Yalew Zemenawi Smart Silk Yasfeligwotal',
    om: 'Bilbila ammayyaa GPS qabu si barbaachisa.',
  },
  leadingProject: {
    en: 'We are leading the WellLite project.',
    am: 'የWellLite ፕሮጀክትን እየመራን ነው።',
    'am-Latn': 'YeWellLite Project Eyemeran New',
    om: 'Pirojektii WellLite hoogganaa jirra.',
  },
  ministryOrg: {
    en: 'Ministry of Water and Energy and Water Bureau across Ethiopia',
    am: 'የኢትዮጵያ የውኃና ኢነርጂ ሚኒስቴር እና የክልል የውኃ ቢሮዎች',
    'am-Latn': 'YeItyopiya YeWuha ena Inerji Ministeer ena YeKilil YeWuha Birowoch',
    om: 'Ministeera Bishaanii fi Inarjii fi Biirolee Bishaanii naannolee Itoophiyaa',
  },
  arbaMinchOrg: {
    en: 'Arba Minch University Water Technology Institute',
    am: 'የአርባ ምንጭ ዩኒቨርሲቲ የውኃ ቴክኖሎጂ ኢንስቲትዩት',
    'am-Latn': 'YeArba Minch University YeWuha Teknoloji Institute',
    om: 'Inistiitiyuutii Teknooloojii Bishaanii Yunivarsiitii Arba Minch',
  },
  fullySupported: {
    en: 'We are fully supported by honourable technologists from these organisations.',
    am: 'ከእነዚህ ተቋማት በተከበሩ የቴክኖሎጂ ባለሙያዎች ሙሉ ድጋፍ እያገኘን ነው።',
    'am-Latn': 'KeEnezih Tekwamat Betekeberu YeTeknoloji Balemuyawoch Mulu Digaf Eyagenen New',
    om: 'Dhaabbilee kana irraa ogeeyyonni teeknooloojii kabajamoon guutummaatti nu deeggaraa jiru.',
  },

  // Screen 6 — ready to sign up
  readyToSignUp: { en: 'Ready to sign up', am: 'ለመመዝገብ ዝግጁ ነው', 'am-Latn': 'Lememezgeb Zigiju New', om: "Galmaa'uuf Qophaa'e" },
  wantUpdates: {
    en: 'I want updates, or marketing materials.',
    am: 'ዝማኔዎችን ወይም የማስታወቂያ መረጃዎችን መቀበል እፈልጋለሁ።',
    'am-Latn': 'Zemaneyochin Weyim YeMastawoqiya Merajawochin Meqebel Efelgalew',
    om: 'Odeeffannoo haaromsaa ykn beeksisa argachuu barbaada.',
  },

  // Screen 7 — privacy policy
  privacyParagraph1: {
    en: 'We work in accordance with legal code for Personal Data Protection Proclamation No. 1321/2024 under the Ethiopian Communications Authority.',
    am: 'በኢትዮጵያ ኮሙኒኬሽን ባለሥልጣን ሥር ባለው የግል መረጃ ጥበቃ አዋጅ ቁጥር 1321/2024 መሠረት እንሠራለን።',
    'am-Latn': 'BeItyopiya Communication Balesiltan Sir Balew YeGel Meraja Tibeka Awaj Quter 1321/2024 Meseret Enseralen',
    om: 'Labsii Eegumsa Odeeffannoo Dhuunfaa Lak. 1321/2024 irratti hundaa\'uun hojjenna.',
  },
  privacyParagraph2: {
    en: 'In summary, we use personal data with your permission, within lawfulness, fairness, and transparency.',
    am: 'በአጭሩ፣ በፈቃድዎ፣ በሕጋዊነት፣ በፍትሃዊነት እና በግልጽነት የግል መረጃዎን እንጠቀማለን።',
    'am-Latn': 'BeAchiru, Befeqadow, Behigawinet, Befithawinet ena Begiltsinet YeGel Merajawon Enteqemalen',
    om: 'Gabaabumatti, hayyama keetiin, seera, haqaa fi iftoomina eegnee odeeffannoo dhuunfaa fayyadamna.',
  },
  privacyParagraph3: {
    en: 'All data including personal data is used to promote development for wells, or for the benefit of other sustainable development, under the leading authority of Arba Minch University, the Ministry of Water and Energy, and the WellMapr project.',
    am: 'ሁሉም መረጃዎች፣ የግል መረጃን ጨምሮ፣ በአርባ ምንጭ ዩኒቨርሲቲ፣ በውኃና ኢነርጂ ሚኒስቴር እና በWellMapr ፕሮጀክት መሪነት ለውኃ ጉድጓድ ልማትና ለሌሎች ዘላቂ ልማቶች ጥቅም ላይ ይውላሉ።',
    'am-Latn': 'Hulum Merajawoch, YeGel Merajan Chemro...',
    om: "Odeeffannoon hundi, kan dhuunfaa dabalatee, hoggansa Yunivarsiitii Arba Minch, Ministeera Bishaanii fi Inarjii fi pirojektii WellMapr jalatti misooma boolla bishaanii fi misooma waaraa biroof oola.",
  },

  // Screen 8 — forgot password
  chooseRecovery: {
    en: "Please choose how you'd like to recover your account.",
    am: 'መለያዎን እንዴት መመለስ እንደሚፈልጉ ይምረጡ።',
    'am-Latn': 'Meleyawon Endet Memeles Endemifeligu Yimeretu',
    om: 'Akaawuntii kee akkamitti deebifachuu akka barbaaddu filadhu.',
  },
  enterEmailOrPhone: {
    en: 'Enter email or phone number',
    am: 'ኢሜይል ወይም ስልክ ቁጥር ያስገቡ',
    'am-Latn': 'Email Weyim Silk Quter Yasgebu',
    om: 'Imeelii yookaan Lakkoofsa Bilbilaa Galchi',
  },
  next: { en: 'Next', am: 'ቀጣይ', 'am-Latn': 'Qetay', om: 'Itti Aanu' },

  // Screen 9/10 — verification
  accountVerification: { en: 'Account Verification', am: 'የመለያ ማረጋገጫ', 'am-Latn': 'YeMeleya Maregaggecha', om: 'Mirkaneessa Akaawuntii' },
  verifyEmailBody: {
    en: "We've sent a 4-digit code to your registered {{email}}. Enter the code below to continue.",
    am: 'ባስመዘገቡት {{email}} ኢሜይል 4 አሃዝ ያለው ኮድ ተልኳል። ለመቀጠል ከታች ያስገቡት።',
    'am-Latn': 'Basemezgebut {{email}} Email Arat Ahaz Yalew Code Telkwal. Lemeqetel Ketach Yasgebut.',
    om: 'Koodiin lakkoofsa 4 qabu gara {{email}} tti ergameera. Itti fufuuf asitti galchi.',
  },
  verifyCode: { en: 'Verify Code', am: 'ኮድ ያረጋግጡ', 'am-Latn': 'Code Yaregagetu', om: 'Koodii Mirkaneessi' },
  codeVerifiedTitle: {
    en: 'Code Verified Successfully',
    am: 'ኮዱ በተሳካ ሁኔታ ተረጋግጧል',
    'am-Latn': 'Kodu Betesaka Huneta Teregaggtwal',
    om: "Koodiin Milkaa'inaan Mirkanaa'eera",
  },
  codeVerifiedBody: {
    en: 'Your code has been verified successfully. You can reset your password.',
    am: 'ኮድዎ በተሳካ ሁኔታ ተረጋግጧል። አዲስ የይለፍ ቃል ማስቀመጥ ይችላሉ።',
    'am-Latn': 'Kodwo Betesaka Huneta Teregaggtwal. Addis YeYilef Kal Maskemet Yichilalu.',
    om: "Koodiin kee milkaa'inaan mirkanaa'eera. Jecha darbii haaraa kaa'uu dandeessa.",
  },

  // Screen 11 — reset password
  resetPasswordDescription: {
    en: "Set a new password for your account. Make sure it's strong and easy for you to remember.",
    am: 'ለመለያዎ አዲስ የይለፍ ቃል ያዘጋጁ። ጠንካራ እና ለማስታወስ ቀላል መሆኑን ያረጋግጡ።',
    'am-Latn': 'Lemeleyawo Addis YeYilef Kal Yazegaju. Tenkara Ena Lemastawes Kelal Mehonun Yaregagetu.',
    om: "Akaawuntii keef jecha darbii haaraa qopheessi. Jabaa fi salphaatti yaadatamu haa ta'u.",
  },
  newPassword: { en: 'New password', am: 'አዲስ የይለፍ ቃል', 'am-Latn': 'Addis YeYilef Kal', om: 'Jecha Darbii Haaraa' },
  savePassword: { en: 'Save Password', am: 'የይለፍ ቃል ያስቀምጡ', 'am-Latn': 'YeYilef Kal Yaskemtu', om: "Jecha Darbii Olkaa'i" },

  // Screen 12 — sign up
  firstName: { en: 'First name', am: 'የመጀመሪያ ስም', 'am-Latn': 'Yemejemeriya Sim', om: 'Maqaa Jalqabaa' },
  enterFirstName: { en: 'Enter first name', am: 'የመጀመሪያ ስም ያስገቡ', 'am-Latn': 'Yemejemeriya Sim Yasgebu', om: 'Maqaa Jalqabaa Galchi' },
  secondName: { en: 'Second name', am: 'የአባት ስም', 'am-Latn': 'YeAbat Sim', om: 'Maqaa Lammaffaa' },
  enterSecondName: { en: 'Enter second name', am: 'የአባት ስም ያስገቡ', 'am-Latn': 'YeAbat Sim Yasgebu', om: 'Maqaa Lammaffaa Galchi' },
  phoneNumber: { en: 'Phone number', am: 'ስልክ ቁጥር', 'am-Latn': 'Silk Quter', om: 'Lakkoofsa Bilbilaa' },
  confirmPhoneNumber: { en: 'Confirm phone number', am: 'ስልክ ቁጥርን ያረጋግጡ', 'am-Latn': 'Silk Qutern Yaregagetu', om: 'Lakkoofsa Bilbilaa Mirkaneessi' },
  confirmEmail: { en: 'Confirm email', am: 'ኢሜይልን ያረጋግጡ', 'am-Latn': 'Emailin Yaregagetu', om: 'Imeelii Mirkaneessi' },
  occupation: { en: 'Occupation', am: 'ሙያ', 'am-Latn': 'Muya', om: 'Ogummaa' },
  selectOccupation: { en: 'Select occupation', am: 'ሙያ ይምረጡ', 'am-Latn': 'Muya Yimeretu', om: 'Ogummaa Filadhu' },
  jobDescription: { en: 'Job description', am: 'የሥራ መግለጫ', 'am-Latn': 'Yesira Meglecha', om: 'Ibsa Hojii' },
  enterJobDescription: { en: 'Enter job description', am: 'የሥራ መግለጫ ያስገቡ', 'am-Latn': 'Yesira Meglecha Yasgebu', om: 'Ibsa Hojii Galchi' },
  organisation: { en: 'Organisation', am: 'ድርጅት', 'am-Latn': 'Dirijit', om: 'Dhaabbata' },
  addOrganisationDetails: { en: 'Add organisation details', am: 'የድርጅቱን ዝርዝር ያስገቡ', 'am-Latn': 'Yedirijitun Zirzir Yasgebu', om: 'Odeeffannoo Dhaabbataa Galchi' },

  // Screen 13 — occupation options
  occupationWellDrilling: {
    en: 'Well drilling or digging contractor',
    am: 'የውኃ ጉድጓድ ቁፋሮ ተቋራጭ',
    'am-Latn': 'YeWuha Gudgwad Qufaro Tekuaraj',
    om: 'Kontiraaktaraa Qotannaa Boolla Bishaanii',
  },
  occupationTeacher: { en: 'Teacher', am: 'መምህር', 'am-Latn': 'Memhir', om: 'Barsiisaa' },
  occupationStudent: { en: 'Student', am: 'ተማሪ', 'am-Latn': 'Temari', om: 'Barataa' },
  occupationNgoAidWorker: { en: 'NGO aid worker', am: 'የመንግስታዊ ያልሆነ ድርጅት ሠራተኛ', 'am-Latn': 'Yemengistawi Yalho Dirijit Serategna', om: 'Hojjetaa NGO' },
  occupationGovScientist: { en: 'Government scientist', am: 'የመንግስት ሳይንቲስት', 'am-Latn': 'Yemengist Sayintist', om: 'Saayintistii Mootummaa' },
  occupationGovAidWorker: { en: 'Government aid worker', am: 'የመንግስት ድጋፍ ሠራተኛ', 'am-Latn': 'Yemengist Digaf Serategna', om: 'Hojjetaa Gargaarsa Mootummaa' },
  occupationOther: { en: 'Other', am: 'ሌላ', 'am-Latn': 'Lela', om: 'Kan Biraa' },

  // Screen 15 — map / location
  hereIsYourLocation: { en: 'Here is your location', am: 'ይህ የእርስዎ አካባቢ ነው', 'am-Latn': "Yih Ye'erswo Akababi New", om: 'Kun Bakka Kee Dha' },
  legendYourLocation: { en: 'Red Circle: Your location', am: 'ቀይ ክብ፦ የእርስዎ አካባቢ', 'am-Latn': "Qey Kib: Ye'erswo Akababi", om: 'Marsaa Diimaa: Bakka Kee' },
  legendWellsLocation: { en: 'Black Squares: Wells location', am: 'ጥቁር ካሬዎች፦ የጉድጓዶች ቦታ', 'am-Latn': 'Tikur Karewoch: YeGudgwadoch Bota', om: 'Iskuweerota Gurraachaa: Bakka Boollaa' },
  legendSurveyedWells: {
    en: 'Blue Triangles: Wells already surveyed',
    am: 'ሰማያዊ ሶስት ማዕዘኖች፦ ቀድሞ የተመረመሩ ጉድጓዶች',
    'am-Latn': 'Semayawi Sost Maezinoch: Qedmo Yetemeremeru Gudgwadoch',
    om: "Saddex Xiyyoota Cuquliisaa: Boollaawwan Qorataman",
  },
  currentLocationRedCircle: {
    en: 'Your current location at red circle',
    am: 'አሁን ያሉበት ቦታ በቀይ ክብ ተለይቷል',
    'am-Latn': 'Ahun Yalubet Bota BeQey Kib Teleyitwal',
    om: "Bakki Amma Jirtu Marsaa Diimaan Mul'ata",
  },
  latitudeLabel: { en: 'Latitude', am: 'ኬክሮስ', 'am-Latn': 'Kekros', om: 'Laatiitiyuudii' },
  longitudeLabel: { en: 'Longitude', am: 'ኬንትሮስ', 'am-Latn': 'Kentros', om: 'Loongitiyuudii' },
  projectionLabel: { en: 'Projection', am: 'ፕሮጀክሽን', 'am-Latn': 'Projection', om: 'Pirojekshinii' },
  localNameLabel: { en: 'Local name', am: 'የአካባቢ ስም', 'am-Latn': 'YeAkababi Sim', om: 'Maqaa Bakkaa' },
  dataForWellNotOnMap: {
    en: 'Data for a well not on the map',
    am: 'በካርታው ላይ የሌለ ጉድጓድ መረጃ',
    'am-Latn': 'Bekartaw Lay Yelele Gudgwad Meraja',
    om: 'Odeeffannoo Boolla Kaartaa Irra Hin Jirree',
  },

  // Screen 17 — enter well data
  enterWellData: { en: 'Enter well data', am: 'የጉድጓድ መረጃ ያስገቡ', 'am-Latn': 'YeGudgwad Meraja Yasgebu', om: 'Odeeffannoo Boollaa Galchi' },
  completeDataEntry: { en: 'Complete the data entry', am: 'መረጃውን ያጠናቅቁ', 'am-Latn': 'Merajawun Yatenakeku', om: 'Galmee Odeeffannoo Xumuri' },
  getHelpFromLocalUsers: {
    en: 'Get help from local users',
    am: 'ከአካባቢው ተጠቃሚዎች እገዛ ያግኙ',
    'am-Latn': 'KeAkababiw Tetekamiwoch Egeza Yagenyu',
    om: 'Gargaarsa Fayyadamtoota Naannoo Argadhu',
  },
  confirmWellIsHere: { en: 'Confirm a well is here', am: 'ጉድጓድ እዚህ መኖሩን ያረጋግጡ', 'am-Latn': 'Gudgwad Ezih Menorun Yaregagetu', om: 'Boolli As Jiraachuu Mirkaneessi' },
  wellName: { en: 'Well name', am: 'የጉድጓድ ስም', 'am-Latn': 'YeGudgwad Sim', om: 'Maqaa Boollaa' },
  enterWellName: { en: 'Enter well name', am: 'የጉድጓድ ስም ያስገቡ', 'am-Latn': 'YeGudgwad Sim Yasgebu', om: 'Maqaa Boollaa Galchi' },
  wellType: { en: 'Well type', am: 'የጉድጓድ አይነት', 'am-Latn': 'YeGudgwad Aynet', om: 'Gosa Boollaa' },
  wellWorkingOrBroken: {
    en: 'Well working or broken',
    am: 'ጉድጓዱ የሚሰራ ነው ወይስ ተበላሽቷል?',
    'am-Latn': 'Gudgwadu Yemisera New Weyis Tebelashitwal?',
    om: 'Boolli Hojjechaa Jira Moo Caccabeera?',
  },
  dailyUseEstimate: {
    en: 'No. people daily use estimate',
    am: 'በየቀኑ የሚጠቀሙ ሰዎች ግምት',
    'am-Latn': 'Beyeqenu Yemitekemu Sewoch Gimit',
    om: 'Tilmaama Namoota Guyyaatti Fayyadaman',
  },
  enterEstimate: { en: 'Enter estimate', am: 'ግምቱን ያስገቡ', 'am-Latn': 'Gimitun Yasgebu', om: 'Tilmaama Galchi' },
  distanceToWater: {
    en: 'Distance to other water (km)',
    am: 'ከሌላ የውኃ ምንጭ ያለው ርቀት (ኪ.ሜ.)',
    'am-Latn': 'KeLela YeWuha Minch Yalew Riket (km)',
    om: 'Fageenya Bishaan Biraa Irraa (km)',
  },
  enterDistance: { en: 'Enter distance', am: 'ርቀቱን ያስገቡ', 'am-Latn': 'Riketun Yasgebu', om: 'Fageenya Galchi' },
  commentsPlaceholder: {
    en: 'About the well, is there a story?',
    am: 'ስለ ጉድጓዱ ታሪክ አለ?',
    'am-Latn': 'Sile Gudgwadu Tarik Ale?',
    om: "Waa'ee Boollaa Seenaa Ni Jiraa?",
  },
  uploadPhotos: { en: 'Upload photos', am: 'ፎቶዎችን ይጫኑ', 'am-Latn': 'Fotowochin Yichanu', om: "Suuraawwan Ol Fe'i" },
  optional: { en: 'Optional', am: 'አማራጭ', 'am-Latn': 'Amarach', om: 'Filannoo' },
  staticWaterLevel: { en: 'Static water level', am: 'የቆመ የውኃ ደረጃ', 'am-Latn': 'YeQome YeWuha Dereja', om: 'Sadarkaa Bishaan Dhaabbataa' },
  enterStaticWaterLevel: {
    en: 'Enter static water level (meters)',
    am: 'የቆመ የውኃ ደረጃን በሜትር ያስገቡ (ሜትር)',
    'am-Latn': 'YeQome YeWuha Dereja Yasgebu (metiri)',
    om: 'Sadarkaa bishaan dhaabbataa meetiraan galchi (meetira)',
  },
  diameterOfWellOpening: {
    en: 'Diameter of well opening (cm)',
    am: 'የጉድጓዱ መክፈቻ ዲያሜትር (ሴ.ሜ.)',
    'am-Latn': 'YeGudgwadu Mekefetcha Diameter (cm)',
    om: 'Diyaameetira Afaan Boollaa (cm)',
  },
  enterWellDiameter: { en: 'Enter well diameter', am: 'የጉድጓዱን ዲያሜትር ያስገቡ', 'am-Latn': 'YeGudgwad Diameter Yasgebu', om: 'Diyaameetira Boollaa Galchi' },

  // Screen 18 — confirm well options
  confirmYes: { en: 'Yes', am: 'አዎ', 'am-Latn': 'Awo', om: 'Eeyyee' },
  confirmNo: { en: 'No', am: 'አይ', 'am-Latn': 'Ay', om: 'Lakki' },

  // Screen 19 — well type options (Oasis intentionally omitted — merged into Spring per translator note)
  wellTypeBorehole: { en: 'Borehole', am: 'ቦርሆል', 'am-Latn': 'Borhol', om: 'Boolla Qotame' },
  wellTypeHandDug: { en: 'Hand dug', am: 'በእጅ የተቆፈረ', 'am-Latn': 'BeEj Yetekofere', om: 'Harka Qotame' },
  wellTypeSpring: { en: 'Spring', am: 'ምንጭ', 'am-Latn': 'Minch', om: 'Burqaa' },

  // Screen 20 — well status options
  wellStatusWorking: { en: 'Working', am: 'የሚሰራ', 'am-Latn': 'Yemisera', om: 'Hojjechaa' },
  wellStatusBroken: { en: 'Broken', am: 'የተበላሸ', 'am-Latn': 'Yetebelashe', om: 'Caccabe' },

  // Screen 21 — distance tooltip
  distanceInfoTooltip: {
    en: 'Important to know if the well is broken, and please explain more on Comments.',
    am: 'ጉድጓዱ ተበላሽቶ መሆኑን ማወቅ አስፈላጊ ነው፤ እባክዎ በአስተያየት ላይ ተጨማሪ ማብራሪያ ይስጡ።',
    'am-Latn': 'Gudgewdu tebelashto mehonun mawok asfelagi new; ebakwo be-asterayet lay tetalemi mabariya yiset\'u',
    om: 'Boolli caccabuu isaa beekuun barbaachisaa dha; maaloo Yaada irratti ibsa dabalataa kenni.',
  },

  // Screen 22 — comments tooltip bullets
  commentsInfoStory: {
    en: 'Write the short story of the well.',
    am: 'የጉድጓዱን አጭር ታሪክ ይጻፉ።',
    'am-Latn': 'Yegudgewun achir tarik yitsafu.',
    om: "Waa'ee seenaa gabaabaa boolla bishaanii barreessi.",
  },
  commentsInfoMaintenance: {
    en: 'The well is working, how do the users manage the maintenance?',
    am: 'ጉድጓዱ እየሰራ ከሆነ፣ ተጠቃሚዎች ጥገናውን እንዴት ያስተዳድራሉ?',
    'am-Latn': 'Gudgwadu Eyesera Kehone, Tetekamiwoch Tigegnawun Endet Yastedadiralu?',
    om: 'Boolli yoo hojjetaa jiru, fayyadamtoonni suphaa isaa akkamitti bulchu?',
  },
  commentsInfoBroken: {
    en: 'If the well is broken, how do the users explain this?',
    am: 'ጉድጓዱ ከተበላሸ፣ ተጠቃሚዎች ይህን እንዴት ያብራራሉ?',
    'am-Latn': 'Gudgewdu ketebelashe, tetekamiyoch yihinin endet yabraralu?',
    om: 'Boolli bishaanii yoo bade, fayyadamtoonni kana akkamitti ibsu?',
  },
  commentsInfoVillageTaps: {
    en: 'Does it feed one or more village taps?',
    am: 'አንድ ወይም ከአንድ በላይ የመንደር ውሃ ቧንቧዎችን ያቀርባል?',
    'am-Latn': 'And woyim ke-and belay yemender wuha bonbawoch yaqerbal?',
    om: 'Inni tuuboo bishaanii gandootaa tokko ykn isaa olitti bishaan dhiheessaa?',
  },
  commentsInfoNetwork: {
    en: 'Is it piped to buildings in a network?',
    am: 'በኔትወርክ ቧንቧ በመጠቀም ወደ ሕንፃዎች ውሃ ይደርሳል?',
    'am-Latn': "Be-network bwanbwa bemetekem wede hinits'awoch wuha yidersal?",
    om: 'Neetworkii keessatti tuuboodhaan gara manneen ijaarsaa geeffamaa?',
  },
  commentsInfoAge: {
    en: 'How old is the well?',
    am: 'ጉድጓዱ ዕድሜው ስንት ነው?',
    'am-Latn': 'Gudgwadu Edmew Sint New?',
    om: 'Boolli waggaa meeqa qaba?',
  },
  commentsInfoMadeBy: {
    en: 'Who originally made it?',
    am: 'መጀመሪያ የሠራው ማን ነው?',
    'am-Latn': 'Mejemeriya yeseraw manew?',
    om: 'Jalqaba kan tolche ykn kan ijaare eenyu?',
  },
  commentsInfoOther: {
    en: 'Anything of interest, please write here.',
    am: 'ማንኛውም አስፈላጊ ነገር ካለ፣ እባክዎ እዚህ ይጻፉ።',
    'am-Latn': 'Manignawum asfelagi neger kalé, ebakwo ezih yitsafu',
    om: 'Wanti barbaachisaan kamiyyuu yoo jiraate, maaloo as irratti barreessi.',
  },

  // Screen 23 — static water level tooltip
  staticWaterLevelInfo: {
    en: 'This is a depth in meters from the ground surface to the water level in the well.',
    am: 'ይህ ከመሬት ወለል እስከ በጉድጓዱ ውስጥ ያለው የውሃ ደረጃ ያለውን ጥልቀት በሜትር ያመለክታል።',
    'am-Latn': 'Yih Kemeret Welel Eske Begudgwadu Wust Yalew YeWuha Dereja Tilket Bemeter Yameliktal.',
    om: 'Kun gadi fageenya lafa irraa hanga sadarkaa bishaan boolla keessaa jiruutti meetiraan agarsiisa.',
  },
};
