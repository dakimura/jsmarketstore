import fromBuffer from '../../src/fromNumpyBuffer';



function ab2ascii(buf: ArrayBuffer): string{
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function ascii2ab(chars:string): ArrayBuffer {
    var buf = new ArrayBuffer(chars.length); // 1 byte for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=chars.length; i < strLen; i++) {
        bufView[i] = chars.charCodeAt(i);
    }
    return buf;
}

function aaa(){
    console.log("yoyo")
}

function yo ()
{
    return fromBuffer(ascii2ab("hello"));
}

test('足し算テスト', () => {
    expect(fromBuffer(ascii2ab("aNUMPY"))).toBe(2);
});