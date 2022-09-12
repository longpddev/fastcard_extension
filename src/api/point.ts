import { appSettings, token } from "../app/AppSettings";
import { encodePassword } from "../common";
import { CARD_TYPE } from "../constant";
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
  appSettings.emitter.emit("fetchLoginDone");
  return result.data;
}

export async function fetGetUserInfo() {
  const result = await clientAuth.GET("/auth/user-info");

  appSettings.set("userSettings", result.data.settings);
  appSettings.emitter.emit("fetGetUserInfoDone");
  return result.data;
}

export async function fetchGetGroupCard() {
  const result = (await clientAuth.GET("/group-card")).data;

  appSettings.set("groupCard", {
    ids: result.rows.map((item: any) => item.id),
    entities: result.rows.reduce((acc: any, item: any) => {
      acc[item.id] = item;
      return acc;
    }, {}),
  });
  return result;
}

export async function fetchGetCardLearnToday() {
  const groupCardIds = appSettings
    .map("groupCard")((item) => item.ids)
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
  console.log(result);
  appSettings.set("cardLearnToday", result);
  return result;
}

export async function fetchMainDataWhenLogin() {
  await fetchGetGroupCard();
  await fetchGetCardLearnToday();

  appSettings.emitter.emit("fetchMainDataWhenLoginDone");
}

interface IFetchCreateCard {
  groupId: number;
  question_detail: string;
  answer_detail: string;
  explain_detail: string;
}
export async function fetchCreateCard({
  groupId,
  question_detail,
  answer_detail,
  explain_detail,
}: IFetchCreateCard) {
  const result = await clientAuth.POST("/card", {
    body: {
      info: {
        cardGroupId: groupId,
      },
      cardQuestion: {
        imageId: null,
        content: question_detail,
        type: CARD_TYPE.question,
        cardGroupId: groupId,
      },
      cardAnswer: {
        imageId: null,
        content: answer_detail,
        type: CARD_TYPE.answer,
        cardGroupId: groupId,
      },
      cardExplain: {
        imageId: null,
        content: explain_detail,
        type: CARD_TYPE.explain,
        cardGroupId: groupId,
      },
    },
  });

  appSettings.emitter.emit("fetchCreateCardDone");
  return result;
}
