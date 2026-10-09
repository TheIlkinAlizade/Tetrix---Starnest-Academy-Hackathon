import type { Answers, Conversation, Profile } from "./types";
import { EVAL_CASES } from "./eval-data";

// Sintetik demo biznes: yalnız nümayiş üçün.
export const DEMO_ANSWERS: Answers = {
  name: { value: "Naxış Atelyesi", source: "user" },
  product: { value: "Əl işi hədiyyə qutuları, tikmə yastıq üzləri, şamlar və keramika fincan dəstləri", source: "user" },
  problem: { value: "Xüsusi günlər üçün şablon olmayan, şəxsi hədiyyə tapmaq çətindir", source: "user" },
  why: { value: "Hər sifariş əl ilə, müştərinin istəyinə uyğun hazırlanır; ad və rəng seçimi mümkündür", source: "user" },
  audience: { value: "25–40 yaş, ad günü və ildönümü üçün hədiyyə axtaran şəhərli qadınlar və kişilər", source: "user" },
  pricing: { value: "Şam dəsti 45 AZN, fincan dəsti 55 AZN, hədiyyə qutusu 65–95 AZN", source: "user" },
  challenge: { value: "Müştərilər Instagramda qiyməti soruşur, sonra cavab yazmır", source: "user" },
  goal: { value: "Növbəti 3 ayda Instagram sorğularının satışa çevrilməsini artırmaq", source: "user" },
};

export const DEMO_PROFILE: Profile = {
  name: "Naxış Atelyesi",
  industry: "Əl işi hədiyyə və ev dekoru",
  product: DEMO_ANSWERS.product.value,
  customerProblem: DEMO_ANSWERS.problem.value,
  valueProp: DEMO_ANSWERS.why.value,
  differentiators: ["Hər sifariş əl ilə hazırlanır", "Ad və rəng seçimi mümkündür"],
  audience: DEMO_ANSWERS.audience.value,
  pricing: DEMO_ANSWERS.pricing.value,
  goals: DEMO_ANSWERS.goal.value,
  challenges: DEMO_ANSWERS.challenge.value,
  unknowns: [
    "Çatdırılma müddəti və qiyməti profildə yoxdur",
    "Rəqib qiymətləri ilə müqayisə məlumatı yoxdur",
    "Müştəri rəyləri və sosial sübut barədə məlumat yoxdur",
  ],
  status: {
    name: "confirmed", product: "confirmed", customerProblem: "confirmed", valueProp: "confirmed",
    audience: "confirmed", pricing: "confirmed", goals: "confirmed", challenges: "confirmed",
    industry: "needs_review", differentiators: "needs_review", unknowns: "needs_review",
  },
  updatedAt: new Date().toISOString(),
};

// Demo 2 və 3 üçün: qiymət + cavabsız sual, çatdırılma, çoxlu etiraz.
const DEMO_IDS = ["e08", "e02", "e10", "e12"];
export function demoConversations(): Conversation[] {
  return DEMO_IDS.map((id, i) => {
    const c = EVAL_CASES.find((x) => x.id === id)!;
    return {
      id: `demo-${id}`,
      title: c.title,
      text: c.text,
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      status: "new" as const,
      synthetic: true,
    };
  });
}
