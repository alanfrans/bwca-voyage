import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyEffect,
  applyNight,
  applyPortage,
  freshBody,
  previewPaddle,
  previewPortage,
} from "./model.ts";

describe("portage", () => {
  it("makes a fresh 40-rod carry tiring and usually safe", () => {
    const preview = previewPortage({
      rods: 40,
      footing: 1,
      mud: false,
      brush: false,
      carry: "careful",
      craft: "canoe",
      energy: 85,
      strain: 10,
      season: "july",
      headnet: true,
    });
    assert.ok(preview.energy > 12 && preview.energy < 24, `energy ${preview.energy}`);
    assert.ok(preview.minutes > 25 && preview.minutes < 50, `min ${preview.minutes}`);
    assert.ok(preview.fall < 0.08, `fall ${preview.fall}`);
    assert.ok(preview.strain > 2 && preview.strain < 8, `strain ${preview.strain}`);
  });

  it("makes a double carry on a bad trail a real gamble", () => {
    const careful = previewPortage({
      rods: 80,
      footing: 3,
      mud: true,
      brush: true,
      carry: "careful",
      craft: "canoe",
      energy: 48,
      strain: 55,
      season: "july",
      headnet: true,
    });
    const doubled = previewPortage({
      rods: 80,
      footing: 3,
      mud: true,
      brush: true,
      carry: "double",
      craft: "canoe",
      energy: 48,
      strain: 55,
      season: "july",
      headnet: true,
    });
    assert.ok(doubled.fall > careful.fall);
    assert.ok(doubled.minutes < careful.minutes);
    assert.ok(doubled.health > careful.health * 0.5);
    assert.ok(doubled.fall > 0.2);
  });

  it("charges a kayak more to carry than a yoked canoe", () => {
    const canoe = previewPortage({
      rods: 50,
      footing: 2,
      mud: false,
      brush: false,
      carry: "careful",
      craft: "canoe",
      energy: 80,
      strain: 10,
      season: "september",
      headnet: true,
    });
    const kayak = previewPortage({
      rods: 50,
      footing: 2,
      mud: false,
      brush: false,
      carry: "careful",
      craft: "kayak",
      energy: 80,
      strain: 10,
      season: "september",
      headnet: true,
    });
    assert.ok(kayak.energy > canoe.energy);
    assert.ok(kayak.fall > canoe.fall);
  });
});

describe("paddle", () => {
  it("restores energy on a calm cruise and spends it into a headwind", () => {
    const calm = previewPaddle({
      km: 6,
      wind: 0,
      exposure: "sheltered",
      pace: "cruise",
      craft: "canoe",
      energy: 70,
      fed: true,
      season: "september",
      fish: 0,
      headnet: true,
    });
    const push = previewPaddle({
      km: 6,
      wind: 3,
      exposure: "open",
      pace: "push",
      craft: "canoe",
      energy: 70,
      fed: true,
      season: "september",
      fish: 0,
      headnet: true,
    });
    assert.ok(calm.energy > 0, `calm ${calm.energy}`);
    assert.ok(push.energy < -12, `push ${push.energy}`);
    assert.ok(push.capsize > calm.capsize);
  });

  it("lets a kayak take big water with less capsize risk", () => {
    const canoe = previewPaddle({
      km: 5,
      wind: 3,
      exposure: "open",
      pace: "push",
      craft: "canoe",
      energy: 40,
      fed: true,
      season: "july",
      fish: 0,
      headnet: true,
    });
    const kayak = previewPaddle({
      km: 5,
      wind: 3,
      exposure: "open",
      pace: "push",
      craft: "kayak",
      energy: 40,
      fed: true,
      season: "july",
      fish: 0,
      headnet: true,
    });
    assert.ok(kayak.capsize < canoe.capsize);
    assert.ok(kayak.energy > canoe.energy);
  });
});

describe("night", () => {
  it("punishes food in the tent more often than a real hang", () => {
    let tentBears = 0;
    let goodBears = 0;
    for (let seed = 1; seed <= 80; seed++) {
      const body = freshBody({ foodKg: 4 });
      const tent = applyNight(
        body,
        {
          site: "bay",
          meal: "freeze-dry",
          hang: "tent",
          tickCheck: true,
          headnet: true,
          filter: true,
          storm: false,
          season: "july",
          remote: false,
          plannedAhead: false,
        },
        seed,
        0,
      );
      const good = applyNight(
        body,
        {
          site: "point",
          meal: "freeze-dry",
          hang: "good",
          tickCheck: true,
          headnet: true,
          filter: true,
          storm: false,
          season: "july",
          remote: false,
          plannedAhead: true,
        },
        seed,
        0,
      );
      if (tent.effect.bear) tentBears++;
      if (good.effect.bear) goodBears++;
    }
    assert.ok(tentBears > goodBears + 15, `tent ${tentBears} good ${goodBears}`);
  });

  it("applies a fall as health lost, not just a note", () => {
    let fellOnce = false;
    for (let seed = 1; seed < 40 && !fellOnce; seed++) {
      const result = applyPortage(
        freshBody({ energy: 30, strain: 70 }),
        {
          rods: 140,
          footing: 3,
          mud: true,
          brush: true,
          carry: "double",
          craft: "canoe",
          season: "july",
          headnet: false,
        },
        seed,
        0,
      );
      if (result.effect.fell) {
        fellOnce = true;
        const next = applyEffect(freshBody({ energy: 30, strain: 70 }), result.effect);
        assert.ok(next.health < 90);
        assert.ok(result.effect.notes.some((n) => /down|root/i.test(n)));
      }
    }
    assert.ok(fellOnce);
  });
});
