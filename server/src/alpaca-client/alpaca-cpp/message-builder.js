const ERROR_CODE_CHAR = 65533;

/**
 * Replace all occurrences of find in buffer with replace
 * @param buffer {Buffer}
 * @param find {string | Uint8Array}
 * @param replace {string | Uint8Array}
 * @return {*}
 */
function replaceInBuffer(buffer, find, replace = '') {
    let index = 0;
    do {
        index = buffer.indexOf(find);
        if (index === -1) return buffer;

        buffer = Buffer.concat(
            [
                buffer.subarray(0, index),
                Buffer.from(replace),
                buffer.subarray(index + find.length)
            ]
        );
    } while (index !== -1);

    return buffer;
}

export default class MessageBuilder {
    #sliceLast = Buffer.alloc(0);
    #sliceLength = 0;

    static #replaceStrings(text) {
        text = replaceInBuffer(text, '[1m[32m[0m');
        text = replaceInBuffer(text, '[0m');
        text = replaceInBuffer(text, '[33m');
        text = replaceInBuffer(text, '');
        return text;
    }

    #fullText(text) {
        return MessageBuilder.#replaceStrings(
            Buffer.concat([this.#sliceLast, text])
        );
    }

    #findNewText(text) {
        return text.toString().slice(this.#sliceLength);
    }

    /**
     *
     * @param text {Buffer}
     * @return {string}
     */
    extractMessage(text) {
        const connected = this.#fullText(text);

        const newText = this.#findNewText(connected);
        const errorsCount = this.#countErrors(newText);

        this.#sliceLast = connected;
        this.#sliceLength += newText.length - errorsCount;

        return errorsCount ? newText.slice(0, -errorsCount) : newText;
    }

    #countErrors(text) {
        let counter = 0;
        while (text.charCodeAt(text.length - 1) === ERROR_CODE_CHAR) {
            counter++;
            text = text.slice(0, -1);
        }

        return counter;
    }
}