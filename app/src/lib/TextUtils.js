export function rightJustify(text, amount, filler = " ") {
    let msg = "";
    for (let i = msg.length; i < amount; i++)
        msg += filler;

    msg += text.toString();
    return msg;
}

export function leftJustify(text, amount, filler = " ") {
    let msg = text.toString();
    for (let i = msg.length; i < amount; i++)
        msg += filler;

    return msg;
}