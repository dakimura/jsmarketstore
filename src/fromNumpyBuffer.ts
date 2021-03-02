function decodeAscii(buf: ArrayBuffer): Uint8Array {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function readUint16LittleEndian(buffer: ArrayBuffer): number {
    const view: DataView = new DataView(buffer);
    let val = view.getUint8(0);
    val |= view.getUint8(1) << 8;
    return val;
}

export default function fromBuffer(buf: ArrayBuffer): string | { error?: string } {
    // Check the magic number
    const magic = decodeAscii(buf.slice(0, 6));
    if (magic.slice(1, 6).toString() != 'NUMPY') {
        return {error: 'unknown buffer type:' + magic.slice(1, 6).toString()};
    }

    const version: Uint8Array = new Uint8Array(buf.slice(6, 8))
    const headerLength: number = readUint16LittleEndian(buf.slice(8, 10))
    const headerStr: Uint8Array = decodeAscii(buf.slice(10, 10 + headerLength));
    const offsetBytes: number = 10 + headerLength;
    //rest = buf.slice(10+headerLength);  XXX -- This makes a copy!!! https://www.khronos.org/registry/typedarray/specs/latest/#5

    // Hacky conversion of dict literal string to JS Object
    eval("var info = " + headerStr.toString().toLowerCase().replace('(', '[').replace('),', ']'));

    // Intepret the bytes according to the specified dtype
    let data;

    // if (info.descr === "|u1") {
    //     data = new Uint8Array(buf, offsetBytes);
    // } else if (info.descr === "|i1") {
    //     data = new Int8Array(buf, offsetBytes);
    // } else if (info.descr === "<u2") {
    //     data = new Uint16Array(buf, offsetBytes);
    // } else if (info.descr === "<i2") {
    //     data = new Int16Array(buf, offsetBytes);
    // } else if (info.descr === "<u4") {
    //     data = new Uint32Array(buf, offsetBytes);
    // } else if (info.descr === "<i4") {
    //     data = new Int32Array(buf, offsetBytes);
    // } else if (info.descr === "<f4") {
    //     data = new Float32Array(buf, offsetBytes);
    // } else if (info.descr === "<f8") {
    //     data = new Float64Array(buf, offsetBytes);
    // } else {
    //     throw new Error('unknown numeric dtype')
    // }
    //
    // return {
    //     shape: info.shape,
    //     fortran_order: info.fortran_order,
    //     data: data
    // };
}

// class NumpyBuffer {
//     private
// }
//
// var NumpyLoader = (function () {
//
//
//     function open(file, callback) {
//         var reader = new FileReader();
//         reader.onload = function () {
//             // the file contents have been read as an array buffer
//             var buf = reader.result;
//             var ndarray = fromArrayBuffer(buf);
//             callback(ndarray);
//         };
//         reader.readAsArrayBuffer(file);
//     }
//
//     function ajax(url, callback) {
//         var xhr = new XMLHttpRequest();
//         xhr.onload = function (e) {
//             var buf = xhr.response; // not responseText
//             var ndarray = fromArrayBuffer(buf);
//             callback(ndarray);
//         };
//         xhr.open("GET", url, true);
//         xhr.responseType = "arraybuffer";
//         xhr.send(null);
//     }
//
//     return {
//         open: open,
//         ajax: ajax
//     };
// })();