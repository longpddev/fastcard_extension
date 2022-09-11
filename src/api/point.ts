import { appSettings, token } from "../app/AppSettings";
import { encodePassword } from "../common";
import client, { clientAuth } from "./client";

export async function fetchLogin(email: string, password: string) {
  const result = await client.POST("/auth/login", {
    body: {
      username: email,
      password: encodePassword(password),
    },
  });

  appSettings.set("userSettings", result.data.user.settings);
  token.set(result.data.token);
  return result.data;
}

export async function fetchGetGroupCard() {
  return (await clientAuth.GET("/group-card")).data;
}

export async function fetchGetCardLearnToday() {
  const groupCardIds = appSettings
    .run("groupCard")((item) => item.id)
    .get();
  const settings = appSettings.get("userSettings");
  if (groupCardIds.length === 0)
    throw new Error("Group card doesn't load yet ");
  if (Object.keys(settings).length === 0)
    throw new Error("Setting user doesn't load yet");
  const result = await Promise.all(
    groupCardIds.map(async (groupId: number) => {
      const card = await clientAuth.GET("/card/learn-today", {
        params: {
          limit: settings.maxCardInDay,
          groupId,
        },
      });

      return {
        groupId,
        card: {
          rows: card.data.rows,
          count: card.data.count,
        },
      };
    })
  );
  return result;
}
