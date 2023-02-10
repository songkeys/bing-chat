import { atom } from "jotai";
import { ResponseMessage } from "./example";

export const isSendingAtom = atom<boolean>(false);
export const textAtom = atom<string | undefined>(undefined);
export const resultAtom = atom<ResponseMessage | undefined>(undefined);
export const resultsAtom = atom<
	{
		role: "user" | "bot";
		text: string;
		result?: ResponseMessage;
	}[]
>([]);
