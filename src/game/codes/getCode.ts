import { Code } from "../../../client/src/types/gameState";
import { getRandomInt } from "../../random/getRandomInt";

export const getCode = (): Code => {
    const possible = [1, 2, 3, 4];
    const code = [];

    while (code.length < 3) {
        const index = getRandomInt(possible.length);
        const num = possible[index];
        code.push(num);
        possible.splice(index, 1);
    }

    // TODO Better types
    if (code.length !== 3) {
        throw new Error("Code doesn't have the correct length");
    }
    return code as Code;
};
