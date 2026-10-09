// Adı dəyişmək üçün yalnız bu faylı redaktə edin.
export const APP_NAME = "Prodvisor";
export const APP_TAGLINE = "Your AI Product & Growth Advisor. Understand your product. Know your customers. Grow smarter.";

export type FieldKey =
  | "name" | "industry" | "product" | "customerProblem" | "valueProp"
  | "differentiators" | "audience" | "pricing" | "goals" | "challenges" | "unknowns";

export const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Biznesin adı",
  industry: "Sahə",
  product: "Məhsul / xidmət",
  customerProblem: "Müştərinin problemi",
  valueProp: "Dəyər təklifi",
  differentiators: "Əsas fərqləndiricilər",
  audience: "Hədəf auditoriya",
  pricing: "Qiymət",
  goals: "Biznes məqsədləri",
  challenges: "Hazırkı çətinliklər",
  unknowns: "Məlum olmayanlar / fərziyyələr",
};

export interface Question {
  id: string;
  field: FieldKey;
  text: string;
  hint: string;
  placeholder: string;
}

export const QUESTIONS: Question[] = [
  { id: "name", field: "name", text: "Biznesinizin adı nədir?", hint: "Qısa və aydın yazın.", placeholder: "Məsələn: Naxış Atelyesi" },
  { id: "product", field: "product", text: "Hansı məhsulu və ya xidməti satırsınız?", hint: "Nə satdığınızı bir-iki cümləyə sığdırın.", placeholder: "Məsələn: Əl işi hədiyyə qutuları, şamlar və keramika" },
  { id: "problem", field: "customerProblem", text: "Məhsulunuz müştərinin hansı problemini həll edir?", hint: "Müştəri sizə gəlməzdən əvvəl nə ilə çətinlik çəkir?", placeholder: "Məsələn: Xüsusi gün üçün fərqli hədiyyə tapa bilmir" },
  { id: "why", field: "valueProp", text: "Müştəri niyə məhz sizdən almalıdır?", hint: "Bilmirsinizsə, AI-dan istiqamət istəyin.", placeholder: "Məsələn: Hər sifariş əl ilə, müştərinin istəyinə uyğun hazırlanır" },
  { id: "audience", field: "audience", text: "Hazırda əsas müştəriləriniz kimlərdir?", hint: "Yaş, ehtiyac, alış səbəbi kimi real müşahidələrinizi yazın.", placeholder: "Məsələn: 25–40 yaş, ad günü və ildönümü üçün hədiyyə axtaranlar" },
  { id: "pricing", field: "pricing", text: "Məhsulunuzun qiyməti və qiymətləndirmə modeli necədir?", hint: "Real qiymətləri yazın. AI qiymət uydurmayacaq.", placeholder: "Məsələn: Şam dəsti 45 AZN, hədiyyə qutusu 60–120 AZN" },
  { id: "challenge", field: "challenges", text: "Hazırda biznesinizin ən böyük çətinliyi nədir?", hint: "Ən çox vaxt və ya pul itirdiyiniz yer.", placeholder: "Məsələn: Müştərilər qiyməti soruşur, sonra yazmır" },
  { id: "goal", field: "goals", text: "Növbəti 3 ay üçün əsas məqsədiniz nədir?", hint: "Mümkünsə ölçülə bilən yazın.", placeholder: "Məsələn: Instagram sorğularından satışa çevrilməni artırmaq" },
];
