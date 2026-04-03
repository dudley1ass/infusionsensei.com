import {
  COFFEE_TO_BUILDER_RECIPE,
  LEGACY_FRIES_RECIPE_TO_SPREADS_DIP,
  POPCORN_TO_BUILDER_RECIPE,
  WING_SAUCE_TO_BUILDER_RECIPE,
} from "./builderRecipeMaps";
import {
  DEFAULT_RECIPE_STOCK_IMAGE,
  POPCORN_STOCK_BY_ID,
  stock,
  wingStockHero,
} from "./recipeStockImageUrls";

/**
 * Hero image per canonical builder template id. Wings + popcorn lines use
 * dedicated logic so flavors get distinct photos.
 */
export const TEMPLATE_HERO_IMAGE_BY_ID: Record<string, string> = {
  // baked-goods
  brownies: stock("photo-1636743715220-d8f8dd900b87"),
  "chocolate-chip-cookies": stock("photo-1499636136210-6f4ee915583e"),
  "sugar-cookies": stock("photo-1464195085758-89f3e55e821e"),
  "peanut-butter-cookies": stock("photo-1657418830273-40c19cfff4d7"),
  "oatmeal-raisin-cookies": stock("photo-1583743089695-4b816a340f82"),
  snickerdoodles: stock("photo-1584847801423-852691e41bc7"),
  "double-chocolate-cookies": stock("photo-1625876981820-be17a6807189"),
  "white-chocolate-macadamia-cookies": stock("photo-1639678114429-a915fdb55000"),
  "shortbread-cookies": stock("photo-1485745655111-3272a37e76a5"),
  "molasses-cookies": stock("photo-1605243614624-277f48f46d52"),
  "gingerbread-cookies": stock("photo-1597733153203-a54d0fbc47de"),
  "vanilla-layer-cake": stock("photo-1624993014250-fc6877db3222"),
  "chocolate-layer-cake": stock("photo-1629980173135-9b01683515f5"),
  "red-velvet-cake": stock("photo-1627859616205-e52c0a99b38b"),
  "carrot-cake": stock("photo-1710362780207-8b0577283935"),
  "lemon-cake": stock("photo-1592962826124-56f6e78c6f18"),
  "pound-cake": stock("photo-1694224382283-05e6d8fc235f"),
  "coffee-cake": stock("photo-1536599524557-5f784dd53282"),
  "marble-cake": stock("photo-1589115582096-3650a6ed2484"),
  "funfetti-cake": stock("photo-1667506997143-955a4ff96c8b"),
  "chocolate-cupcakes": stock("photo-1578985545062-69928b1d9587"),
  "peanut-butter-bars": stock("photo-1515037893149-de7f840978e2"),
  "lemon-bars": stock("photo-1606313564573-104197cf8f91"),
  "cheesecake-bars": stock("photo-1524351199678-941a58a3df50"),
  "magic-cookie-bars": stock("photo-1548839140-29a749e1cf4d"),
  "chocolate-chip-cookie-bars": stock("photo-1631447661435-b86ae5ecd564"),
  "brownie-cheesecake-swirl-bars": stock("photo-1636743715220-d8f8dd900b87"),
  "smores-bars": stock("photo-1667506997143-955a4ff96c8b"),

  // spreads-dips
  "infused-peanut-butter-spread": stock("photo-1719956797292-21d15f9a14a4"),
  "infused-almond-butter-spread": stock("photo-1564988208558-9270de7c5848"),
  "infused-cream-cheese-whipped": stock("photo-1524351199678-941a58a3df50"),
  "sweet-honey-cream-cheese-spread-infused": stock("photo-1474979266404-7eaacbcd87c5"),
  "herb-garlic-cream-cheese-spread-infused": stock("photo-1631447661435-b86ae5ecd564"),
  "queso-dip-infused": stock("photo-1586201375761-83865001e31c"),
  "spinach-artichoke-dip-infused": stock("photo-1548839140-29a749e1cf4d"),
  "buffalo-dip-infused": stock("photo-1624153064067-566cae78993d"),
  "ranch-dip-infused": stock("photo-1485745655111-3272a37e76a5"),
  "honey-mustard-dip-infused": stock("photo-1595231583034-7bb49bb5b016"),
  "garlic-aioli-infused": stock("photo-1631447661435-b86ae5ecd564"),
  "bbq-sauce-infused-party": stock("photo-1595231583034-7bb49bb5b016"),
  "sweet-chili-sauce-infused": stock("photo-1501339847302-ac426a4a7cbb"),
  "cheese-sauce-infused": stock("photo-1547592166-23ac45744acd"),

  // snacks (popcorn canonical ids omitted — see POPCORN_STOCK_BY_ID)
  gummies: stock("photo-1617627191898-1408bf607b4d"),
  "classic-jello-shots": stock("photo-1556679343-c7306c1976bc"),
  "fruit-juice-jello-cubes": stock("photo-1544716278-ca5e3f4abd8c"),
  "layered-jello-shots": stock("photo-1710362780207-8b0577283935"),
  "sour-jello-bites": stock("photo-1682941232611-ee199377a12a"),
  "rice-krispie-treat-squares": stock("photo-1464195085758-89f3e55e821e"),
  "infused-chocolate-fudge": stock("photo-1606313564573-104197cf8f91"),
  "popcorn-balls": stock("photo-1578849278619-e73505e9610f"),
  "chocolate-dipped-pretzels": stock("photo-1606313564200-e75d5e30476c"),
  "mini-slider-sauce": stock("photo-1712746783860-94fabfbac42c"),
  "mini-brownie-bites": stock("photo-1515037893149-de7f840978e2"),
  "blondie-squares": stock("photo-1694224382283-05e6d8fc235f"),
  "marshmallow-pops": stock("photo-1720924256541-0cdbc6726e1e"),
  "mini-cupcakes-infused-frosting": stock("photo-1667506997143-955a4ff96c8b"),
  "cookie-sandwiches-infused-filling": stock("photo-1499636136210-6f4ee915583e"),
  "churro-bites": stock("photo-1509365465985-25d11c17e812"),
  "funnel-cake-bites": stock("photo-1584847801423-852691e41bc7"),
  "chex-mix-infused": stock("photo-1575932444877-5106bee2a599"),
  "infused-nuts": stock("photo-1515007917921-cad9bf0e2e87"),
  "kettle-corn-infused": stock("photo-1588196749597-9ff075ee6b5b"),
  "snack-mix-party": stock("photo-1501339847302-ac426a4a7cbb"),
  "cheese-crackers-infused-dust": stock("photo-1586201375761-83865001e31c"),
  "garlic-parmesan-pretzels": stock("photo-1643405511173-97dfe6be2cc2"),
  "chicken-tenders-infused-dip": stock("photo-1627378378938-291417b4210c"),
  "meatballs-infused-glaze": stock("photo-1547592166-23ac45744acd"),
  "sausage-bites-honey-mustard": stock("photo-1645371958635-88dd6c8e1be7"),
  "mini-hot-dogs-infused-condiments": stock("photo-1712746783860-94fabfbac42c"),
  "gummy-clusters": stock("photo-1515007917921-cad9bf0e2e87"),
  "chocolate-bark-infused": stock("photo-1629980173135-9b01683515f5"),
  "candy-coated-popcorn": stock("photo-1588196749597-9ff075ee6b5b"),
  "skewered-snack-bites-party": stock("photo-1639678114429-a915fdb55000"),
  "classic-gummies": stock("photo-1720924256541-0cdbc6726e1e"),
  "fruit-gummies": stock("photo-1682941379468-c42a219c0376"),
  "sour-gummies": stock("photo-1617627191898-1408bf607b4d"),
  "protein-bites": stock("photo-1606313564573-104197cf8f91"),

  // drinks
  "bulletproof-coffee": stock("photo-1509042239860-f550ce710b93"),
  "cannabis-smoothie": stock("photo-1515694346937-94d85e41e6f0"),
  "cannabis-tea": stock("photo-1576091160399-112ba8d25d1d"),

  // savory-meals
  alfredo: stock("photo-1544025162-d76694265947"),
  "garlic-pasta": stock("photo-1586201375761-83865001e31c"),
  steak: stock("photo-1547592166-23ac45744acd"),

  // ice-cream
  "vanilla-ice-cream": stock("photo-1578985545062-69928b1d9587"),
  "mint-ice-cream": stock("photo-1667506997143-955a4ff96c8b"),

  // breads-breakfast
  "banana-bread": stock("photo-1536599524557-5f784dd53282"),
  pancakes: stock("photo-1624993014250-fc6877db3222"),
};

const BUILDER_KEY_FALLBACK: Record<string, string> = {
  "baked-goods": stock("photo-1636743715220-d8f8dd900b87"),
  wings: wingStockHero("fallback-wings"),
  "spreads-dips": stock("photo-1631447661435-b86ae5ecd564"),
  snacks: stock("photo-1578849278619-e73505e9610f"),
  drinks: stock("photo-1515694346937-94d85e41e6f0"),
  "savory-meals": stock("photo-1547592166-23ac45744acd"),
  "ice-cream": stock("photo-1578985545062-69928b1d9587"),
  "breads-breakfast": stock("photo-1624993014250-fc6877db3222"),
};

function heroFor(id: string): string | undefined {
  return TEMPLATE_HERO_IMAGE_BY_ID[id];
}

export function resolveTemplateHeroImage(builderKey: string, id: string): string {
  const popcornDirect = POPCORN_STOCK_BY_ID[id];
  if (popcornDirect) return popcornDirect;
  const popcornMappedBase = POPCORN_TO_BUILDER_RECIPE[id];
  if (popcornMappedBase) {
    const p = POPCORN_STOCK_BY_ID[popcornMappedBase];
    if (p) return p;
  }

  if (builderKey === "wings" || WING_SAUCE_TO_BUILDER_RECIPE[id] || id.endsWith("-wings")) {
    const canonical = WING_SAUCE_TO_BUILDER_RECIPE[id] ?? id;
    return wingStockHero(canonical);
  }

  const direct = heroFor(id);
  if (direct) return direct;

  const coffeeBase = COFFEE_TO_BUILDER_RECIPE[id];
  if (coffeeBase) {
    const h = heroFor(coffeeBase);
    if (h) return h;
  }

  const friesDip = LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[id];
  if (friesDip) {
    const h = heroFor(friesDip);
    if (h) return h;
  }

  return BUILDER_KEY_FALLBACK[builderKey] ?? DEFAULT_RECIPE_STOCK_IMAGE;
}
